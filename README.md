# Somnia Tools

🌟 **Open Source** professional blockchain tools developed for BNB Smart Chain (BSC). A modern web application that simplifies your token creation and bulk transfer operations.

> **Open Source Project**: This is a completely open source project. You can examine the source code, contribute, and use it freely under the MIT license.

## 🚀 Features

### Token Factory
- **Standard ERC-20 Token**: Simple and secure token creation
- **Ownable Token**: Tokens with owner control
- **Mintable Token**: Dynamic supply tokens that can mint new tokens

### Multi Sender
- **Bulk Transfer**: Send tokens to multiple addresses in a single transaction
- **Flexible Amount Options**: Send same amount or different amounts
- **Gas Optimization**: Multi-transfer with single transaction

## 🛠 Technology Stack

- **Next.js 14** - App Router
- **TypeScript** - Type safety
- **Tailwind CSS** - Modern UI design
- **RainbowKit** - Wallet connection
- **Wagmi** - Ethereum interaction
- **Viem** - Low-level Ethereum utilities

## 🌐 Network Information

- **Network**: BNB Smart Chain (BSC)
- **Chain ID**: 56
- **RPC URL**: https://bsc-dataseed.binance.org
- **Native Token**: BNB

## 📋 Smart Contracts

### Token Factory Contract
- **Address**: `0xe2e30CefE5685dc632136A748F271D863A783459`
- **Features**:
  - Creates Standard ERC-20 tokens
  - Creates Ownable ERC-20 tokens (with owner privileges)
  - Creates Mintable ERC-20 tokens (owner can mint new tokens)
  - Token creation fee: **Contract-defined (BNB)**
  - Tracks all tokens created by each user
  - Secure deployment using OpenZeppelin standards

### Multi Sender Contract
- **Address**: `0xbeCE7ce8F9D5e79eC3e59694758326B0FE5d5523`
- **Features**:
  - Bulk token transfers in a single transaction
  - Two modes: Same amount to all recipients / Different amounts
  - Gas-optimized batch processing
  - Support for any ERC-20 token
  - Automatic fee calculation
  - Secure approval mechanism required before transfers

### Contract Security
- ✅ **Audited Code**: Built with OpenZeppelin secure libraries
- ✅ **Access Control**: Proper owner and permission management
- ✅ **Reentrancy Protection**: Safe from common attack vectors
- ✅ **Input Validation**: All inputs are validated and sanitized
- ✅ **Fee Protection**: Prevents unauthorized fee changes

## 🚀 Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open `http://localhost:3000` in your browser

## 🎨 Design

The application uses a purple and black color palette suitable for the Somnia Meme theme:
- **Primary Colors**: Purple tones (#7916ff, #843dff)
- **Background**: Dark black tones
- **Gradients**: Purple gradient effects
- **Glass Effects**: Modern glass effect cards

## 📱 Usage

### Token Creation
1. Go to "Token Factory" page
2. Select token type (Standard, Ownable, Mintable)
3. Enter token details (name, symbol, total supply)
4. Connect your wallet and confirm the transaction

### Bulk Transfer
1. Go to "Multi Sender" page
2. Select send mode (Same amount / Different amounts)
3. Enter token address and recipient information
4. Confirm transaction fee and send

## 🔐 Security

- All contract interactions are performed using secure libraries
- User inputs are validated and sanitized
- Pre-transaction confirmation mechanisms are available
- Two-step approval process for token transfers
- Real-time transaction monitoring and error handling

## 🤝 Contributing

This is an **open source project** and we welcome contributions!

### How to Contribute
1. **Fork** the repository
2. **Clone** your fork locally
3. Create a new **branch** for your feature
4. Make your **changes** and test thoroughly
5. **Commit** your changes with clear messages
6. **Push** to your fork and submit a **Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Maintain consistent code formatting
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

### Areas for Contribution
- 🐛 **Bug fixes** and improvements
- ✨ **New features** and enhancements
- 📚 **Documentation** improvements
- 🎨 **UI/UX** enhancements
- 🔒 **Security** improvements
- 🌐 **Translations** to other languages

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

### MIT License Summary
- ✅ **Commercial use** allowed
- ✅ **Modification** allowed
- ✅ **Distribution** allowed
- ✅ **Private use** allowed
- ❌ **Liability** - No warranty provided
- ❌ **Warranty** - Use at your own risk

## 🌟 Support the Project

If you find this project useful, please consider:
- ⭐ **Starring** the repository
- 🐛 **Reporting** bugs and issues
- 💡 **Suggesting** new features
- 🤝 **Contributing** code improvements
- 📢 **Sharing** with the community
