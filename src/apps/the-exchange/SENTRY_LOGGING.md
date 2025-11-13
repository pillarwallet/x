# Sentry Logging Implementation for The Exchange App

## Overview

This document outlines the comprehensive Sentry logging implementation for the `/src/apps/the-exchange` folder. The implementation ensures that all user interactions, errors, and operations are logged with the user's wallet address for complete traceability.

## Key Features

### 1. Wallet Address Tracking

- All logging includes the user's wallet address from TransactionKit
- Wallet address is automatically captured from `useWalletAddress()` hook
- Fallback handling for cases where wallet address is not available

### 2. Comprehensive Logging Categories

#### User Interactions

- Token selection
- Amount changes
- Card switching
- Exchange button clicks
- Token list opening

#### Swap Operations

- Offer retrieval
- Transaction creation
- Batch operations
- Exchange rate calculations

#### Error Handling

- API failures
- Transaction errors
- Validation errors
- Network issues

#### Performance Metrics

- Operation timing
- Transaction processing times
- API response times

## Implementation Details

### Sentry Utility Functions

Located in `src/apps/the-exchange/utils/sentry.ts`:

#### Core Logging Functions

- `logExchangeEvent()` - General event logging
- `logExchangeError()` - Error logging with context
- `logSwapOperation()` - Swap-specific operations
- `logTokenOperation()` - Token-related operations
- `logOfferOperation()` - Offer-related operations
- `logTransactionOperation()` - Transaction operations
- `logUserInteraction()` - User interaction tracking
- `logPerformanceMetric()` - Performance monitoring

#### Utility Functions

- `getWalletAddressForLogging()` - Get wallet address with fallback
- `useWalletAddressForLogging()` - Hook for wallet address
- `addExchangeBreadcrumb()` - Add breadcrumbs for debugging

### Component Integration

#### Main App (`index.tsx`)

- Initializes Sentry for the-exchange app
- Logs app initialization
- Tracks chain switching operations
- Monitors provider setup

#### Exchange Action Component

- Logs exchange button clicks
- Tracks transaction batch creation
- Monitors step transaction generation
- Error handling for exchange operations

#### Enter Amount Component

- Tracks amount changes
- Monitors offer retrieval
- Logs validation errors
- Performance tracking for offer fetching

#### Cards Swap Component

- Logs card switching
- Tracks token list opening
- Monitors user interactions

#### Select Token Component

- Logs token selection
- Tracks token metadata
- Monitors user choices

#### Swap Summary Component

- Tracks exchange rate updates
- Monitors swap summary changes
- Logs pricing information

### Hook Integration

#### useOffer Hook

- Comprehensive offer retrieval logging
- Error handling for API calls
- Performance monitoring
- Transaction step logging

## Logging Structure

### Tags

All logs include the following tags:

- `wallet_address` - User's wallet address
- `app_module` - Always "the-exchange"
- `operation_type` - Type of operation (swap, token, offer, etc.)
- `component` - Component name
- `method` - Method name

### Extra Data

Each log includes relevant context:

- Token symbols and addresses
- Amounts and balances
- Chain information
- Error details
- Performance metrics

### Breadcrumbs

Breadcrumbs provide debugging context:

- User actions
- API calls
- State changes
- Error conditions

## Error Boundaries

The implementation includes enhanced error boundaries:

- Automatic error capture
- Wallet address context
- User-friendly error messages
- Recovery mechanisms

## Performance Monitoring

### Transaction Monitoring

- Start/end transaction tracking
- Operation timing
- Resource usage
- API response times

### Metrics Collection

- Exchange rate calculations
- Offer retrieval times
- Transaction processing
- User interaction timing

## Usage Examples

### Basic Event Logging

```typescript
import { logExchangeEvent } from './utils/sentry';

logExchangeEvent('User clicked exchange button', 'info', {
  swapToken: 'ETH',
  receiveToken: 'USDC',
  amount: 1.5,
});
```

### Error Logging

```typescript
import { logExchangeError } from './utils/sentry';

try {
  // operation
} catch (error) {
  logExchangeError(error, {
    operation: 'get_offer',
    swapToken: 'ETH',
  });
}
```

### User Interaction Logging

```typescript
import { logUserInteraction } from './utils/sentry';

logUserInteraction('token_selected', {
  tokenSymbol: 'ETH',
  tokenChain: 'ethereum',
});
```

## Configuration

### Environment Variables

- `VITE_SENTRY_DSN` - Sentry DSN (if not already configured)
- `VITE_LIFI_API_KEY` - LiFi API key for exchange operations

### Initialization

Sentry is automatically initialized in the main App component:

```typescript
useEffect(() => {
  initSentryForExchange();
  // ... logging setup
}, [walletAddress]);
```

## Best Practices

### 1. Always Include Wallet Address

All logging functions automatically include the wallet address when available.

### 2. Use Appropriate Log Levels

- `info` - Normal operations
- `warning` - Potential issues
- `error` - Actual errors
- `debug` - Debugging information

### 3. Include Relevant Context

Always include relevant data for debugging:

- Token information
- Amounts and balances
- Chain details
- Error messages

### 4. Use Breadcrumbs for Debugging

Add breadcrumbs for complex operations to track user flow.

### 5. Monitor Performance

Use transaction monitoring for expensive operations.

## Troubleshooting

### Common Issues

1. **Wallet Address Not Available**

   - Check if user is connected
   - Verify TransactionKit setup
   - Use fallback logging

2. **Missing Context**

   - Ensure all required data is passed
   - Check component state
   - Verify API responses

3. **Performance Issues**
   - Monitor transaction timing
   - Check API response times
   - Review error rates

### Debug Mode

Enable debug logging by setting appropriate log levels in the Sentry utility functions.

## Future Enhancements

1. **Advanced Analytics**

   - User behavior tracking
   - Conversion funnel analysis
   - Performance optimization insights

2. **Real-time Monitoring**

   - Live error tracking
   - Performance alerts
   - User session monitoring

3. **Enhanced Error Recovery**
   - Automatic retry mechanisms
   - Graceful degradation
   - User guidance

## Security Considerations

1. **Data Privacy**

   - Wallet addresses are logged for debugging
   - Sensitive data is not logged
   - PII is handled appropriately

2. **Error Information**
   - Error details are logged for debugging
   - User-facing messages are sanitized
   - No sensitive data in public error messages

## Conclusion

This comprehensive Sentry logging implementation provides complete visibility into the the-exchange app's operations, ensuring that all user interactions, errors, and performance metrics are tracked with the user's wallet address for complete traceability and debugging capabilities.
