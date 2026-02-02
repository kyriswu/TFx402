// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// 定义 USDT (TRC20) 接口
interface ITRC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AgentPay {
    address public owner;
    ITRC20 public usdtToken;

    // 事件：方便你的 MCP 监听日志
    event PaymentExecuted(address indexed payer, address indexed recipient, uint256 amount, string orderId);

    constructor(address _usdtAddress) {
        owner = msg.sender;
        usdtToken = ITRC20(_usdtAddress);
    }

    // 只有你的 Agent（Owner）能触发扣款，防止路人恶意调用消耗用户的额度
    modifier onlyOwner() {
        require(msg.sender == owner, "Only Agent can trigger payment");
        _;
    }

    /**
     * @dev 执行支付
     * @param _payer 用户地址 (钱从谁那里出)
     * @param _recipient 收款地址 (钱给谁)
     * @param _amount 金额 (注意 USDT 是 6 位小数，1 USDT = 1000000)
     * @param _orderId 业务订单号 (方便对账)
     */
    function executePayment(address _payer, address _recipient, uint256 _amount, string memory _orderId) external onlyOwner {
        // 1. 检查授权额度是否足够
        uint256 allowance = usdtToken.allowance(_payer, address(this));
        require(allowance >= _amount, "Insufficient allowance");

        // 2. 调用 USDT 的 transferFrom
        // 注意：这里是 合约 尝试从 用户 钱包划转资金
        bool success = usdtToken.transferFrom(_payer, _recipient, _amount);
        require(success, "Transfer failed");

        // 3. 抛出事件，返回给 MCP
        emit PaymentExecuted(_payer, _recipient, _amount, _orderId);
    }
    
}