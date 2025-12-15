// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ConfluxPaymentSplitter (Dynamic Version)
 * @notice Very simple ETH-only payment splitter WITHOUT constructor.
 *         Admin manually adds payees + shares after deployment.
 */
contract ConfluxPaymentSplitter {

    address public owner;

    event PayeeAdded(address account, uint256 shares);
    event PaymentReleased(address to, uint256 amount);
    event PaymentReceived(address from, uint256 amount);

    uint256 private _totalShares;
    uint256 private _totalReleased;

    mapping(address => uint256) private _shares;
    mapping(address => uint256) private _released;
    address[] private _payees;

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

   // Accept CFX from wallets
    receive() external payable {
        emit PaymentReceived(msg.sender, msg.value);
    }

    // Accept CFX by calling this function
    function deposit() external payable {
        require(msg.value > 0, "No CFX sent");
        emit PaymentReceived(msg.sender, msg.value);
    }


    /* ----------------------------- VIEW FUNCTIONS ---------------------------- */

    function totalShares() public view returns (uint256) {
        return _totalShares;
    }

    function totalReleased() public view returns (uint256) {
        return _totalReleased;
    }

    function shares(address account) public view returns (uint256) {
        return _shares[account];
    }

    function released(address account) public view returns (uint256) {
        return _released[account];
    }

    function payee(uint256 index) public view returns (address) {
        return _payees[index];
    }

    function pending(address account) public view returns (uint256) {
        uint256 totalReceived = address(this).balance + _totalReleased;
        return _pendingPayment(account, totalReceived, _released[account]);
    }

    /* ----------------------------- ADMIN FUNCTIONS ---------------------------- */

    /// @notice Add a payee and assign shares (for dynamic list)
    function addPayee(address account, uint256 shares_) external onlyOwner {
        require(account != address(0), "zero address");
        require(shares_ > 0, "shares = 0");
        require(_shares[account] == 0, "already added");

        _payees.push(account);
        _shares[account] = shares_;
        _totalShares += shares_;

        emit PayeeAdded(account, shares_);
    }

    /* ------------------------------ PAYMENT LOGIC ----------------------------- */

    function release(address payable account) public {
        require(_shares[account] > 0, "no shares");

        uint256 totalReceived = address(this).balance + _totalReleased;
        uint256 payment = _pendingPayment(account, totalReceived, _released[account]);
        require(payment > 0, "nothing to release");

        _released[account] += payment;
        _totalReleased += payment;

        (bool ok, ) = account.call{value: payment}("");
        require(ok, "ETH transfer failed");

        emit PaymentReleased(account, payment);
    }

    /* ----------------------------- INTERNAL LOGIC ----------------------------- */

    function _pendingPayment(
        address account,
        uint256 totalReceived,
        uint256 alreadyReleased
    ) private view returns (uint256) {
        return (totalReceived * _shares[account]) / _totalShares - alreadyReleased;
    }
}

