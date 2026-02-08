// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title AgentPayStaking
 * @dev 集成批量支付与TRX质押理财功能的综合合约
 */

// 防止重入攻击的安全模块
abstract contract ReentrancyGuard {
    uint256 private constant _NOT_ENTERED = 1;
    uint256 private constant _ENTERED = 2;
    uint256 private _status;

    constructor() {
        _status = _NOT_ENTERED;
    }

    modifier nonReentrant() {
        require(_status != _ENTERED, "ReentrancyGuard: reentrant call");
        _status = _ENTERED;
        _;
        _status = _NOT_ENTERED;
    }
}

interface ITRC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AgentPayStaking is ReentrancyGuard {
    address public owner;
    ITRC20 public usdtToken;

    // --- 质押相关状态变量 ---
    mapping(address => uint256) public shares; // 用户持有的股份
    mapping(address => uint256) public stakedPrincipal; // 用户累计质押本金
    uint256 public totalShares;                // 总股份
    uint256 public totalInvested;              // 已经被管理员提取去质押的 TRX 数量
    
    // 最小质押金额 (防止粉尘攻击)
    uint256 public constant MIN_STAKE = 10 trx;

    // --- 事件定义 ---
    event PaymentExecuted(address indexed payer, address indexed recipient, uint256 amount, string orderId);
    event Staked(address indexed user, uint256 amount, uint256 sharesMinted);
    event Unstaked(address indexed user, uint256 amount, uint256 sharesBurned);
    event InvestedToStake(uint256 amount); // 管理员提取资金去质押
    event DivestedFromStake(uint256 amount); // 资金赎回存入合约
    event RewardInjected(uint256 amount, uint256 newExchangeRate);    // 注入收益
    event CapitalRepaid(uint256 amount); // 记录还本

    constructor(address _usdtAddress) {
        owner = msg.sender;
        usdtToken = ITRC20(_usdtAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Owner can perform this action");
        _;
    }

    // ==========================================
    // 模块 1: TRX 质押理财 (Staking Logic)
    // ==========================================

    /**
     * @dev 用户质押 TRX
     * 逻辑：根据当前汇率计算股份 (Shares)
     */
    function stake() external payable nonReentrant {
        require(msg.value >= MIN_STAKE, "Stake amount too small");

        uint256 amount = msg.value;
        uint256 _totalAssets = totalAssets() - amount; // 排除本次存入的金额，计算存入前的总资产
        uint256 sharesToMint = 0;

        // 如果是第一个用户，1 TRX = 1 Share
        if (totalShares == 0 || _totalAssets == 0) {
            sharesToMint = amount;
        } else {
            // 计算公式: (存款金额 * 总股份) / 存入前总资产
            sharesToMint = (amount * totalShares) / _totalAssets;
        }

        require(sharesToMint > 0, "No shares minted");

        shares[msg.sender] += sharesToMint;
        totalShares += sharesToMint;
        stakedPrincipal[msg.sender] += amount;

        emit Staked(msg.sender, amount, sharesToMint);
    }

    /**
     * @dev 用户赎回 TRX
     * @param _shares 要销毁的股份数量
     * 注意：合约内必须有足够的流动性 TRX 才能成功，否则需要管理员先赎回资金
     */
    function unstake(uint256 _shares) external nonReentrant {
        require(_shares > 0, "Cannot unstake 0");
        require(shares[msg.sender] >= _shares, "Insufficient shares");

        uint256 userShares = shares[msg.sender];
        uint256 principalReduction = 0;
        if (userShares > 0) {
            principalReduction = (stakedPrincipal[msg.sender] * _shares) / userShares;
        }

        // 计算用户应得的 TRX: (股份 / 总股份) * 当前总资产
        uint256 amountToSend = (_shares * totalAssets()) / totalShares;

        // 更新状态
        shares[msg.sender] -= _shares;
        totalShares -= _shares;
        if (principalReduction > 0) {
            stakedPrincipal[msg.sender] -= principalReduction;
        }

        // 检查合约流动性
        uint256 contractBalance = address(this).balance;
        require(contractBalance >= amountToSend, "Insufficient liquidity in vault, wait for admin to divest");

        // 转账
        (bool success, ) = payable(msg.sender).call{value: amountToSend}("");
        require(success, "TRX transfer failed");

        emit Unstaked(msg.sender, amountToSend, _shares);
    }

    /**
     * @dev 计算总资产价值 (合约余额 + 借出/质押的金额)
     */
    function totalAssets() public view returns (uint256) {
        return address(this).balance + totalInvested;
    }

    /**
     * @dev 查询用户当前的 TRX 资产价值 (估算值)
     */
    function getAssetValue(address user) external view returns (uint256) {
        if (totalShares == 0) return 0;
        return (shares[user] * totalAssets()) / totalShares;
    }

    function getStakePrincipal(address user) external view returns (uint256) {
        return stakedPrincipal[user];
    }

    // ==========================================
    // 模块 2: 资金管理 (管理员用)
    // ==========================================

    /**
     * @dev 管理员提取 TRX 去进行 Stake 2.0 (获取能量)
     * 资金流向: Contract -> Owner Wallet -> Freeze
     */
    function investToStaking(uint256 amount) external onlyOwner {
        require(totalShares == 0, "Active stakes exist");
        require(address(this).balance >= amount, "Insufficient balance");
        
        totalInvested += amount; // 记账：这笔钱算作投资出去了，仍属于总资产的一部分
        
        (bool success, ) = payable(owner).call{value: amount}("");
        require(success, "Transfer to owner failed");
        
        emit InvestedToStake(amount);
    }

    /**
     * @dev 管理员将解质押的资金打回合约 (或注入收益)
     * 使用方法: 管理员直接往合约转账 TRX 即可，或者调用此函数
     * 如果是偿还本金，需要调用此函数减少 totalInvested
     */
    function repayCapital() external payable onlyOwner {
        require(msg.value > 0, "Amount must be greater than 0");
        require(totalInvested >= msg.value, "Repaying more than invested");
        totalInvested -= msg.value;
        emit CapitalRepaid(msg.value);
    }

    /**
     * @dev 注入收益 (分红)
     * 管理员调用此接口打入 TRX，这部分 TRX 会直接增加 totalAssets，
     * 但不增加 totalShares，从而提高汇率，让用户受益。
     */
    function injectReward() external payable onlyOwner {
        require(msg.value > 0, "Reward must be greater than 0");

        uint256 currentRate = 0;
        if (totalShares > 0) {
            currentRate = (totalAssets() * 1e6) / totalShares;
        }

        emit RewardInjected(msg.value, currentRate);
    }

    // 支持接收 TRX (当使用 simple transfer 时)
    receive() external payable {}

    // ==========================================
    // 模块 3: 批量支付 (原 AgentPayBatch 逻辑)
    // ==========================================

    function executeBatchPayments(
        address[] calldata _payers,
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string[] calldata _orderIds
    ) external onlyOwner {
        uint256 len = _payers.length;
        require(len == _recipients.length && len == _amounts.length && len == _orderIds.length, "Array lengths mismatch");

        for (uint256 i = 0; i < len; i++) {
            // 优化：直接在内存中读取，减少栈深度
            _executeSinglePayment(_payers[i], _recipients[i], _amounts[i], _orderIds[i]);
        }
    }

    // 拆分出单个支付逻辑以解决 Stack too deep 问题 (如果有)
    function _executeSinglePayment(address payer, address recipient, uint256 amount, string calldata orderId) internal {
        // 1. 检查授权
        uint256 allowance = usdtToken.allowance(payer, address(this));
        // 这里使用 require 可能会中断整个批量，如果希望部分成功，需要改逻辑
        // 既然原合约是 require，这里保持一致
        require(allowance >= amount, "Insufficient allowance");

        // 2. 执行转账
        bool success = usdtToken.transferFrom(payer, recipient, amount);
        require(success, "Transfer failed");

        emit PaymentExecuted(payer, recipient, amount, orderId);
    }

    // --- 辅助与模拟验证功能 (保持原样) ---

    function simulateBatchValidation(
        address[] calldata _payers,
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string[] calldata _orderIds
    ) external view returns (bool success, uint256[] memory failedIndexes, string[] memory reasons) {
        uint256 len = _payers.length;
        if (len != _recipients.length || len != _amounts.length || len != _orderIds.length) {
            uint256[] memory idx = new uint256[](1);
            string[] memory rsn = new string[](1);
            idx[0] = type(uint256).max;
            rsn[0] = "Array lengths mismatch";
            return (false, idx, rsn);
        }

        uint256[] memory tempIndexes = new uint256[](len);
        string[] memory tempReasons = new string[](len);
        uint256 failCount = 0;

        for (uint256 i = 0; i < len; i++) {
            string memory reason = _validateEntry(i, _payers, _recipients, _amounts);
            if (bytes(reason).length != 0) {
                tempIndexes[failCount] = i;
                tempReasons[failCount] = reason;
                failCount++;
            }
        }

        if (failCount == 0) return (true, new uint256[](0), new string[](0));

        // 调整数组大小
        uint256[] memory finalIndexes = new uint256[](failCount);
        string[] memory finalReasons = new string[](failCount);
        for(uint256 i=0; i<failCount; i++){
            finalIndexes[i] = tempIndexes[i];
            finalReasons[i] = tempReasons[i];
        }

        return (false, finalIndexes, finalReasons);
    }

    function _validateEntry(
        uint256 index,
        address[] calldata _payers,
        address[] calldata _recipients,
        uint256[] calldata _amounts
    ) internal view returns (string memory) {
        if (_payers[index] == address(0) || _recipients[index] == address(0)) return "Zero address";
        if (_amounts[index] == 0) return "Amount zero";
        if (usdtToken.allowance(_payers[index], address(this)) < _amounts[index]) {
            return string(abi.encodePacked("Insufficient allowance index ", uintToString(index)));
        }
        return "";
    }

    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) { digits++; temp /= 10; }
        bytes memory buffer = new bytes(digits);
        while (value != 0) { digits--; buffer[digits] = bytes1(uint8(48 + (value % 10))); value /= 10; }
        return string(buffer);
    }

}