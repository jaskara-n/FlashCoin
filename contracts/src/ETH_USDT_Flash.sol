// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;
import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @title FlashCoin
 * @author Jaskaran Singh
 * @notice This contract is an implementation of a ETH or USDT flashcoin, which is an ERC20 token
 * that appear in the wallet after minting shortly(time defined in the constructor) and then
 * disappears.
 * @notice Uses ERC20 standard from OpenZeppelin and overrides the main functions.
 */

contract ETH_USDT_FLASH is ERC20 {
    /// @notice Decimals of the token, 18 for ETH and 6 for USDT.
    uint8 public DECIMALS;

    /// @notice Time after which the token disappears from wallet, in seconds.
    uint256 public TOKEN_DISAPPEAR_TIME;

    /// @notice Mapping of user address to balances and timestamps.
    mapping(address => uint256) public userAddressToBalances;
    mapping(address => uint256) public userAddressToTimestamps;

    error TokenDissapeared();

    constructor(
        string memory _tokenName,
        string memory _tokenSymbol,
        uint8 _decimals,
        uint256 _tokenDissapearTIme
    ) ERC20(_tokenName, _tokenSymbol) {
        DECIMALS = _decimals;
        TOKEN_DISAPPEAR_TIME = _tokenDissapearTIme;
    }

    /**
     * @return Returns the decimals of the token, 18 for ETH and 6 for USDT.
     */
    function decimals() public view override returns (uint8) {
        return DECIMALS;
    }

    /**
     * @notice Mints the token to the given address.
     * @param to Address to which the token is minted.
     * @param amount Amount of token to be minted, in decimals for example 1 USDT is 1000000.
     */
    function mint(address to, uint256 amount) external {
        userAddressToBalances[to] += amount;
        userAddressToTimestamps[to] = block.timestamp;
    }

    /**
     * @notice Returns the balance of the given address, only show the balance till a specific time, defined
     * in the constructor by the contract deployer.
     * @param account Address of the user.
     */
    function balanceOf(address account) public view override returns (uint256) {
        if (
            block.timestamp - userAddressToTimestamps[account] >
            TOKEN_DISAPPEAR_TIME
        ) {
            revert TokenDissapeared();
        } else {
            return userAddressToBalances[account];
        }
    }
}
