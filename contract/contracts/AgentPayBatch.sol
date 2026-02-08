// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITRC20 {
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AgentPayBatch {
    address public owner;
    ITRC20 public usdtToken;

    event PaymentExecuted(address indexed payer, address indexed recipient, uint256 amount, string orderId);

    constructor(address _usdtAddress) {
        owner = msg.sender;
        usdtToken = ITRC20(_usdtAddress);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only Agent can trigger payment");
        _;
    }

    /**
     * @dev 批量执行支付
     * @param _payers 用户地址数组
     * @param _recipients 收款地址数组
     * @param _amounts 金额数组
     * @param _orderIds 订单号数组
     */
    function executeBatchPayments(
        address[] calldata _payers,
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string[] calldata _orderIds
    ) external onlyOwner {
        uint256 len = _payers.length;
        
        // 基础检查：确保所有数组长度一致
        require(len == _recipients.length && len == _amounts.length && len == _orderIds.length, "Array lengths mismatch");

        for (uint256 i = 0; i < len; i++) {
            address payer = _payers[i];
            address recipient = _recipients[i];
            uint256 amount = _amounts[i];
            string calldata orderId = _orderIds[i];

            // 1. 检查授权额度
            uint256 allowance = usdtToken.allowance(payer, address(this));
            require(allowance >= amount, "Insufficient allowance for a specific payer");

            // 2. 执行转账
            bool success = usdtToken.transferFrom(payer, recipient, amount);
            require(success, "Transfer failed in batch");

            // 3. 抛出事件
            emit PaymentExecuted(payer, recipient, amount, orderId);
        }
    }

    function simulateBatchValidation(
        address[] calldata _payers,
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string[] calldata _orderIds
    ) external view returns (
        bool success,
        uint256[] memory failedIndexes,
        string[] memory reasons
    ) {
        uint256 len = _payers.length;

        if (
            len != _recipients.length ||
            len != _amounts.length ||
            len != _orderIds.length
        ) {
            uint256[] memory mismatchIndexes = new uint256[](1);
            string[] memory mismatchReasons = new string[](1);
            mismatchIndexes[0] = type(uint256).max;
            mismatchReasons[0] = "Array lengths mismatch";
            return (false, mismatchIndexes, mismatchReasons);
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

        if (failCount == 0) {
            return (true, new uint256[](0), new string[](0));
        }

        assembly {
            mstore(tempIndexes, failCount)
            mstore(tempReasons, failCount)
        }

        return (false, tempIndexes, tempReasons);
    }

    function _validateEntry(
        uint256 index,
        address[] calldata _payers,
        address[] calldata _recipients,
        uint256[] calldata _amounts
    ) internal view returns (string memory) {
        if (_payers[index] == address(0) || _recipients[index] == address(0)) {
            return "Zero address not allowed";
        }

        uint256 amount = _amounts[index];
        if (amount == 0) {
            return "Amount cannot be zero";
        }

        uint256 allowanceValue = usdtToken.allowance(_payers[index], address(this));
        if (allowanceValue < amount) {
            return string(
                abi.encodePacked(
                    "Insufficient allowance for payer at index ",
                    uintToString(index),
                    ". Required: ",
                    uintToString(amount),
                    ", Actual: ",
                    uintToString(allowanceValue)
                )
            );
        }

        return "";
    }

    function uintToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits--;
            buffer[digits] = bytes1(uint8(48 + (value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}