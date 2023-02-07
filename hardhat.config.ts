import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

// Load dotenv configuration
import * as dotenv from 'dotenv'
dotenv.config();

const config: HardhatUserConfig = {
    // Nodes
    defaultNetwork: "l1goerli",
    networks: {
        hardhat: {
        },
        l1goerli: {
            url: process.env.L1_GOERLI_RPC,
            accounts: [process.env.L1_GOERLI_PRIVATE_KEY as string],

            // Use these if network is volatile and want to make sure your txn goes through
            // https://hardhat.org/config/
            // gas, gasPrice, ... are measured in "wei" (without 'g')
            gasPrice: 5000000000, // 5 gwei
        },
        l2goerli: {
            url: process.env.L2_GOERLI_RPC,
            accounts: [process.env.L2_GOERLI_PRIVATE_KEY as string],

            // Use these if network is volatile and want to make sure your txn goes through
            // https://hardhat.org/config/
            // gas, gasPrice, ... are measured in "wei" (without 'g')
            gasPrice: 5000000000, // 5 gwei
        }
    },

    // Compiler options
    solidity: {
        version: "0.8.17",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
};

export default config;
