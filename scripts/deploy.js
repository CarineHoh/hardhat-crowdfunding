const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();

    console.log("Deploying contract with the account:", deployer.address);

    const goal = hre.ethers.utils.parseEther("10"); // Zielbetrag 10 ETH
    const duration = 86400; // Kampagnenlaufzeit: 1 Tag (86400 Sekunden)

    const CrowdfundingCampaign = await hre.ethers.getContractFactory("CrowdfundingCampaign");
    const crowdfunding = await CrowdfundingCampaign.deploy(goal, duration);

    await crowdfunding.deployed();

    console.log(`CrowdfundingCampaign deployed to: ${crowdfunding.address}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
