# AGENT.md - PillarX Development Guide

## Build/Test Commands
- `npm run test` - Run tests with Vitest
- `npm run test:watch` - Run tests in watch mode (after linting)
- `npm run test:ci` - Run tests with coverage for CI
- `npm run test:update` - Update test snapshots
- `npm run build` - Build for production
- `npm run dev` - Start development server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Auto-fix linting issues
- `npm run format` - Format code with Prettier

## Architecture & Structure
- **Multi-app platform**: Core PillarX with multiple sub-apps in `src/apps/`
- **Active apps**: pillarx-app, the-exchange, token-atlas, deposit, leaderboard
- **Testing**: Vitest + React Testing Library, tests in `__tests__/` or `test/` directories
- **State**: Redux Toolkit (`src/store.ts`) + React Query for server state
- **Styling**: Tailwind CSS + styled-components + Material-UI Joy components
- **Blockchain**: Ethers v5, Viem, multiple wallet connectors (Privy, Reown/WalletConnect)

## Code Style & Conventions
- **Linting**: Airbnb TypeScript + Prettier integration
- **Imports**: Absolute imports, TypeScript strict mode, no file extensions
- **Components**: Arrow functions or function declarations, no React imports needed (JSX runtime)
- **Quotes**: Single quotes, trailing commas (ES5), 80 char width, 2 space tabs
- **Error handling**: Console.warn/error allowed, no console.log in production
- **Files**: .tsx for React components, .ts for utilities
- **Naming**: camelCase for variables/functions, PascalCase for components
