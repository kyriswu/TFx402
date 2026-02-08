// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface ITRC20 {
    function allowance(address owner, address spender) external view returns (uint256);
}

contract AgentPayBatchSimulator {
    ITRC20 public immutable usdtToken;

    constructor(address _usdtAddress) {
        usdtToken = ITRC20(_usdtAddress);
    }

    /**
     * @dev 模拟批量支付的验证阶段
     * 只检查参数有效性和授权额度，不执行任何转账
     * @return success 是否全部通过验证
     * @return failedIndex 如果失败，是哪个索引（从0开始），-1 表示全部成功
     * @return reason 失败原因（如果有）
     */
    function simulateBatchValidation(
        address[] calldata _payers,
        address[] calldata _recipients,
        uint256[] calldata _amounts,
        string[] calldata _orderIds
    ) external view returns (
        bool success,
        int256 failedIndex,
        string memory reason
    ) {
        uint256 len = _payers.length;

        // 检查数组长度一致
        if (
            len != _recipients.length ||
            len != _amounts.length ||
            len != _orderIds.length
        ) {
            return (false, -1, "Array lengths mismatch");
        }

        // 检查每个订单的授权额度
        for (uint256 i = 0; i < len; i++) {
            address payer = _payers[i];
            uint256 amount = _amounts[i];

            // 防止零地址（可选，根据需求）
            if (payer == address(0) || _recipients[i] == address(0)) {
                return (false, int256(i), "Zero address not allowed");
            }

            // 检查金额是否合理（可选，防止溢出或0金额）
            if (amount == 0) {
                return (false, int256(i), "Amount cannot be zero");
            }

            // 核心检查：授权额度
            uint256 currentAllowance = usdtToken.allowance(payer, address(this));
            if (currentAllowance < amount) {
                return (
                    false,
                    int256(i),
                    string(abi.encodePacked(
                        "Insufficient allowance for payer at index ",
                        uintToString(i),
                        ". Required: ",
                        uintToString(amount),
                        ", Actual: ",
                        uintToString(currentAllowance)
                    ))
                );
            }
        }

        // 全部通过
        return (true, -1, "");
    }

    // 辅助函数：uint256 转 string（简单实现）
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