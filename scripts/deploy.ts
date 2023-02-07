import { getL2Network, L1ToL2MessageStatus } from "@arbitrum/sdk";
import { AdminErc20Bridger } from "@arbitrum/sdk/dist/lib/assetBridger/erc20Bridger";
import { ethers } from "hardhat";

// Customizable constants
const l1Provider = new ethers.providers.JsonRpcProvider(process.env.L1_GOERLI_RPC);
const l2Provider = new ethers.providers.JsonRpcProvider(process.env.L2_GOERLI_RPC);
const l1Wallet = new ethers.Wallet(process.env.L1_GOERLI_PRIVATE_KEY as string, l1Provider);
const l2Wallet = new ethers.Wallet(process.env.L2_GOERLI_PRIVATE_KEY as string, l2Provider);

async function main() {
    // Initialization
    const l2Network = await getL2Network(l2Provider);

    // Deploy token on L1
    const l1contractFactory = await ethers.getContractFactory("L1Token");
    const l1token = await l1contractFactory.deploy(
        l2Network.tokenBridge.l1CustomGateway,
        l2Network.tokenBridge.l1GatewayRouter,
        "L1CustomToken",
        "L1CTK"
    );
    await l1token.deployed();
    console.log(`Custom ERC20 Token deployed to ${l1token.address} on L1`);

    // Deploy token on L2
    const l2contractFactoryRaw = await ethers.getContractFactory("L2Token");
    const l2contractFactory = await l2contractFactoryRaw.connect(l2Wallet);
    const l2token = await l2contractFactory.deploy(
        l2Network.tokenBridge.l2CustomGateway,
        l1token.address,
        "L2CustomToken",
        "L2CTK"
    );
    await l2token.deployed();
    console.log(`Custom ERC20 Token deployed to ${l2token.address} on L2`);

    // Register token on the Custom Gateway
    const adminTokenBridger = new AdminErc20Bridger(l2Network);
    const registerTx = await adminTokenBridger.registerCustomToken(
        l1token.address,
        l2token.address,
        l1Wallet,
        l2Provider
    );
    const registerTxReceipt = await registerTx.wait();
    console.log(`Token has been registered on the Custom Gateway: ${registerTxReceipt.transactionHash}`);

    // Waiting on the L2 side
    const l1ToL2Msgs = await registerTxReceipt.getL1ToL2Messages(l2Provider);

    if (l1ToL2Msgs.length !== 2) {
        console.log(`Wrong number of messages => ${l1ToL2Msgs.length}`);
    }

    // We check both messages emitted by the transaction
    const setTokenTx = await l1ToL2Msgs[0].waitForStatus();
    if (setTokenTx.status !== L1ToL2MessageStatus.REDEEMED) {
        console.log(`Wrong status for Set Token transaction => ${setTokenTx.status}`);
    }

    const setGatewayTx = await l1ToL2Msgs[1].waitForStatus();
    if (setGatewayTx.status !== L1ToL2MessageStatus.REDEEMED) {
        console.log(`Wrong status for Set Gateway transaction => ${setGatewayTx.status}`);
    }
    
    console.log(`Everything is OK`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
