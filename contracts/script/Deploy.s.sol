// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {ETH_USDT_FLASH} from "../src/ETH_USDT_Flash.sol";

//   Deployed on base sepolia
//   ETH Flash Token deployed at: 0xfD49f5225eEee29fCd3f829D0F96e53F9eC4B486
//   USDT Flash Token deployed at: 0xAf1C67c5c1C4B662C809df67c0071C22def31502

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        vm.startBroadcast(deployerPrivateKey);

        // Deploy ETH Flash Token
        ETH_USDT_FLASH ethFlash = new ETH_USDT_FLASH(
            "FlashETH",
            "FETH",
            18, // ETH decimals
            20 // 20 seconds disappear time
        );

        // Deploy USDT Flash Token
        ETH_USDT_FLASH usdtFlash = new ETH_USDT_FLASH(
            "FlashUSDT",
            "FUSDT",
            6, // USDT decimals
            20 // 20 seconds disappear time
        );

        vm.stopBroadcast();

        console.log("ETH Flash Token deployed at:", address(ethFlash));
        console.log("USDT Flash Token deployed at:", address(usdtFlash));
    }
}
