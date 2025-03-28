// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Test} from "forge-std/Test.sol";
import {ETH_USDT_FLASH} from "../src/ETH_USDT_Flash.sol";

contract ETH_USDT_FLASH_TEST is Test {
    ETH_USDT_FLASH public ethFlash;
    ETH_USDT_FLASH public usdtFlash;
    address public user;
    uint256 public constant ETH_DECIMALS = 18;
    uint256 public constant USDT_DECIMALS = 6;
    uint256 public constant DISAPPEAR_TIME = 3600; // 1 hour

    function setUp() public {
        user = makeAddr("user");
        ethFlash = new ETH_USDT_FLASH(
            "FlashETH",
            "FETH",
            uint8(ETH_DECIMALS),
            DISAPPEAR_TIME
        );
        usdtFlash = new ETH_USDT_FLASH(
            "FlashUSDT",
            "FUSDT",
            uint8(USDT_DECIMALS),
            DISAPPEAR_TIME
        );
    }

    function testETHConstructor() public {
        assertEq(ethFlash.name(), "FlashETH");
        assertEq(ethFlash.symbol(), "FETH");
        assertEq(ethFlash.decimals(), ETH_DECIMALS);
        assertEq(ethFlash.TOKEN_DISAPPEAR_TIME(), DISAPPEAR_TIME);
    }

    function testUSDTConstructor() public {
        assertEq(usdtFlash.name(), "FlashUSDT");
        assertEq(usdtFlash.symbol(), "FUSDT");
        assertEq(usdtFlash.decimals(), USDT_DECIMALS);
        assertEq(usdtFlash.TOKEN_DISAPPEAR_TIME(), DISAPPEAR_TIME);
    }

    function testETHMinting() public {
        uint256 amount = 1 ether; // 1 ETH = 1e18
        ethFlash.mint(user, amount);
        assertEq(ethFlash.balanceOf(user), amount);
        assertEq(ethFlash.userAddressToBalances(user), amount);
    }

    function testUSDTMinting() public {
        uint256 amount = 1_000_000; // 1 USDT = 1e6
        usdtFlash.mint(user, amount);
        assertEq(usdtFlash.balanceOf(user), amount);
        assertEq(usdtFlash.userAddressToBalances(user), amount);
    }

    function testETHTokenDisappearance() public {
        uint256 amount = 1 ether;
        ethFlash.mint(user, amount);

        // Token should be visible before disappear time
        assertEq(ethFlash.balanceOf(user), amount);

        // Move time forward past disappear time
        vm.warp(block.timestamp + DISAPPEAR_TIME + 1);

        // Token should have disappeared
        vm.expectRevert(ETH_USDT_FLASH.TokenDissapeared.selector);
        ethFlash.balanceOf(user);
    }

    function testUSDTTokenDisappearance() public {
        uint256 amount = 1_000_000;
        usdtFlash.mint(user, amount);

        // Token should be visible before disappear time
        assertEq(usdtFlash.balanceOf(user), amount);

        // Move time forward past disappear time
        vm.warp(block.timestamp + DISAPPEAR_TIME + 1);

        // Token should have disappeared
        vm.expectRevert(ETH_USDT_FLASH.TokenDissapeared.selector);
        usdtFlash.balanceOf(user);
    }

    function testMultipleETHMinting() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;

        ethFlash.mint(user, amount1);
        assertEq(ethFlash.balanceOf(user), amount1);

        ethFlash.mint(user, amount2);
        assertEq(ethFlash.balanceOf(user), amount1 + amount2);
    }

    function testMultipleUSDTMinting() public {
        uint256 amount1 = 1_000_000;
        uint256 amount2 = 2_000_000;

        usdtFlash.mint(user, amount1);
        assertEq(usdtFlash.balanceOf(user), amount1);

        usdtFlash.mint(user, amount2);
        assertEq(usdtFlash.balanceOf(user), amount1 + amount2);
    }
}
