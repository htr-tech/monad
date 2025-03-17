// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract BulkSend {
    event NativeTokensSent(address indexed sender, address[] recipients, uint256 amount);

    /// @notice Sends native tokens (e.g., MON) to multiple recipients in a single transaction.
    /// @param recipients The list of recipient addresses.
    /// @param amount The amount of native tokens to send to each recipient.
    function batchSendNative(address[] calldata recipients, uint256 amount) public payable {
        require(recipients.length > 0, "ERR: No recipients provided");
        require(msg.value == amount * recipients.length, "ERR: Incorrect token amount sent");

        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "ERR: Invalid recipient address");
            payable(recipients[i]).transfer(amount);
        }

        emit NativeTokensSent(msg.sender, recipients, amount);
    }
}