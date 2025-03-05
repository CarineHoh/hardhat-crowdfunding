// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CrowdfundingCampaign {
    address public owner;
    uint256 public goal;
    uint256 public deadline;
    uint256 public totalFunds;
    mapping(address => uint256) public contributions;
    bool public fundsClaimed;

    event ContributionReceived(address indexed contributor, uint256 amount);
    event FundsClaimed(uint256 totalAmount);
    event RefundIssued(address indexed contributor, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier campaignActive() {
        require(block.timestamp < deadline, "Campaign has ended");
        _;
    }

    modifier campaignEnded() {
        require(block.timestamp >= deadline, "Campaign is still active");
        _;
    }

    constructor(uint256 _goal, uint256 _duration) {
        require(_goal > 0, "Goal must be greater than zero");
        require(_duration > 0, "Duration must be greater than zero");

        owner = msg.sender;
        goal = _goal;
        deadline = block.timestamp + _duration;
    }

    function contribute() external payable campaignActive {
        require(msg.value > 0, "Contribution must be greater than zero");

        contributions[msg.sender] += msg.value;
        totalFunds += msg.value;

        emit ContributionReceived(msg.sender, msg.value);
    }

    function claimFunds() external onlyOwner campaignEnded {
        require(totalFunds >= goal, "Goal not reached");
        require(!fundsClaimed, "Funds already claimed");

        fundsClaimed = true;
        payable(owner).transfer(totalFunds);

        emit FundsClaimed(totalFunds);
    }

    function refund() external campaignEnded {
        require(totalFunds < goal, "Goal was reached, no refunds available");
        uint256 contributedAmount = contributions[msg.sender];
        require(contributedAmount > 0, "No contribution to refund");

        contributions[msg.sender] = 0;
        payable(msg.sender).transfer(contributedAmount);

        emit RefundIssued(msg.sender, contributedAmount);
    }
}
