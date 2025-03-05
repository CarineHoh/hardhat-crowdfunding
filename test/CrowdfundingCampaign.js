const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CrowdfundingCampaign", function () {
  let Crowdfunding, crowdfunding, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    Crowdfunding = await ethers.getContractFactory("CrowdfundingCampaign");
    crowdfunding = await Crowdfunding.deploy(ethers.utils.parseEther("10"), 86400);
    await crowdfunding.deployed();
  });

  it("Should accept contributions", async function () {
    await crowdfunding.connect(addr1).contribute({ value: ethers.utils.parseEther("1") });
    expect(await crowdfunding.contributions(addr1.address)).to.equal(ethers.utils.parseEther("1"));
  });

  it("Should allow refunds if goal is not met", async function () {
    await crowdfunding.connect(addr1).contribute({ value: ethers.utils.parseEther("1") });

    // Fast-forward time
    await network.provider.send("evm_increaseTime", [86500]);
    await network.provider.send("evm_mine");

    await expect(crowdfunding.connect(addr1).refund())
      .to.changeEtherBalance(addr1, ethers.utils.parseEther("1"));
  });

  it("Should allow owner to claim funds if goal is met", async function () {
    await crowdfunding.connect(addr1).contribute({ value: ethers.utils.parseEther("5") });
    await crowdfunding.connect(addr2).contribute({ value: ethers.utils.parseEther("5") });

    // Fast-forward time
    await network.provider.send("evm_increaseTime", [86500]);
    await network.provider.send("evm_mine");

    await expect(crowdfunding.connect(owner).claimFunds())
      .to.changeEtherBalance(owner, ethers.utils.parseEther("10"));
  });
});
