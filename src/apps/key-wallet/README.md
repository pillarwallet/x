# Key Wallet (KW)

Key Wallet is a simple and intuitive app for managing and sending assets from your Key Wallet (EOA - Externally Owned Account).

## Features

### 1. Wallet Address Display

- Shows your Key Wallet (EOA) address prominently
- Copy address to clipboard functionality
- Instructions for receiving assets

### 2. Portfolio Overview

- Displays total portfolio value across all supported chains
- Real-time balance updates from Mobula Portfolio API
- Shows asset count

### 3. Assets List

- Lists all assets with positive balances
- Shows asset logo, name, symbol, and chain
- Displays balance, USD value, and 24h price change
- Sorted by USD value (highest first)
- Click any asset to initiate a send transaction

### 4. Send Assets

- Modal-based interface for sending assets
- Support for both native tokens (ETH, MATIC, etc.) and ERC-20 tokens
- "MAX" button for sending entire balance
- Real-time USD value estimation
- Form validation for address and amount
- Transaction status feedback

### 5. Transaction History

- Displays recent transactions
- Transaction status indicators (pending, success, failed)
- Links to block explorer for each transaction
- Clear individual transactions
- Auto-refresh portfolio after successful transactions

## Supported Chains

Key Wallet supports all chains that PillarX supports:

- Ethereum (Mainnet)
- Polygon
- Base
- BNB Smart Chain
- Optimism
- Arbitrum
- Gnosis (if enabled)

## Technical Details

### Components

- `index.tsx` - Main app component
- `WalletAddress.tsx` - Displays and allows copying of wallet address
- `AssetsList.tsx` - Lists all assets with portfolio value
- `AssetRow.tsx` - Individual asset row component
- `SendAssetModal.tsx` - Modal for sending assets
- `TransactionStatus.tsx` - Shows recent transaction history

### Utilities

- `blockchain.ts` - Blockchain utilities for transactions and formatting
- `portfolio.ts` - Portfolio data transformation utilities

### Types

- `index.ts` - TypeScript type definitions

## Usage

1. The app automatically loads your Key Wallet (EOA) address
2. Portfolio balances are fetched from the Mobula Portfolio API
3. Click on any asset to open the send modal
4. Enter recipient address and amount
5. Click "Send" to execute the transaction
6. View transaction status in the "Recent Transactions" section
7. Use the "Refresh Balances" button to manually update portfolio data

## Design

- Mobile-first responsive design
- Clean, modern UI using Tailwind CSS
- Master-detail view pattern (list → detail modal)
- Loading states and error handling
- Smooth transitions and hover effects

## API Integration

The app uses the Mobula Portfolio API (via `pillarXApiWalletPortfolio` service) to fetch portfolio balances across all supported chains.

## Transaction Execution

Transactions are executed through the connected wallet provider using viem:

- Native token transfers use `sendTransaction` with value
- ERC-20 transfers use `encodeFunctionData` with the ERC-20 transfer function
- All transactions include proper error handling and user feedback
