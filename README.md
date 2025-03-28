# FlashCoin - Disappearing Token Protocol

FlashCoin is an innovative protocol that implements disappearing tokens on the Base Sepolia testnet. It features ETH and USDT variants where tokens automatically disappear from wallets after a specified time period, creating unique use cases for temporary token ownership.

## Features

- **Temporary Token Ownership**: Tokens automatically disappear after a configurable time period (currently set to 20 seconds)
- **Multiple Token Types**: Supports both ETH (18 decimals) and USDT (6 decimals) variants
- **Smart Contract Security**: Built using OpenZeppelin's ERC20 implementation
- **Full Test Coverage**: Comprehensive test suite for all core functionality
- **Modern Frontend**: Built with Next.js, RainbowKit, and TailwindCSS

## Deployed Contracts (Base Sepolia)

- ETH Flash Token: `0xfD49f5225eEee29fCd3f829D0F96e53F9eC4B486`
- USDT Flash Token: `0xAf1C67c5c1C4B662C809df67c0071C22def31502`

## Prerequisites

- Node.js >= 18
- Foundry (for smart contract development)
- Git

## Installation

### Smart Contracts

```bash
# Clone the repository
git clone https://github.com/yourusername/FlashCoin.git
cd FlashCoin/contracts

# Install Foundry dependencies
forge install

# Build contracts
forge build

# Run tests
forge test
```

### Frontend

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at http://localhost:3000

## Testing

The smart contracts include comprehensive tests covering:

- Token initialization
- Minting functionality
- Token disappearance mechanism
- Multiple minting scenarios

Run tests with:

```bash
forge test
```

## Contract Architecture

The core contract `ETH_USDT_FLASH.sol` implements:

- Custom ERC20 token with disappearing functionality
- Configurable decimals (18 for ETH, 6 for USDT)
- Timestamp-based token disappearance
- Balance tracking with disappearance checks

## Frontend Features

- Web3 wallet integration via RainbowKit
- Token minting interface
- Real-time balance display
- Countdown timer for token disappearance

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

UNLICENSED

## Author

Jaskaran Singh
