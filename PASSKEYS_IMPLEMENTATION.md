# Passkey Implementation

This document describes the passkey authentication implementation for the PillarX application.

## Overview

The passkey implementation consists of:

1. **Backend**: Firebase Functions (`x-firebase/functions/controllers/passkeys.js`)
2. **Frontend**: React service (`x/src/services/passkeys.ts`) and UI integration (`x/src/pages/Login.tsx`)

## Backend (Firebase Functions)

The backend provides four endpoints:

- `POST /passkeys/register/options` - Get registration options
- `POST /passkeys/register/verify` - Verify registration
- `POST /passkeys/authenticate/options` - Get authentication options
- `POST /passkeys/authenticate/verify` - Verify authentication

### Configuration

- **rpID**: Currently set to "localhost" for development
- **rpName**: "PillarX"
- **Origin**: `https://localhost` for development

### Data Storage

- Passkeys are stored in the `passkeys` collection
- Challenges are stored in the `passkeyChallenges` collection

## Frontend (React)

### Service (`src/services/passkeys.ts`)

Provides functions for:

- `registerPasskey(userId, username)` - Register a new passkey
- `authenticateWithPasskey(userId)` - Authenticate with existing passkey
- `isPasskeySupported()` - Check browser support
- `isPasskeyAvailable()` - Check platform authenticator availability

### UI Integration (`src/pages/Login.tsx`)

- Added two new buttons for passkey registration and authentication
- Buttons only appear if passkeys are supported and available
- Shows loading states during operations
- Displays success/error alerts

## Usage

1. **Registration**: User clicks "Register Passkey" button

   - Requires wallet connection first
   - Creates a passkey for the wallet address
   - Shows success/error alert

2. **Authentication**: User clicks "Login with Passkey" button
   - Requires wallet connection first
   - Authenticates using existing passkey
   - Shows success/error alert

## Development Notes

### Current Limitations

- Backend configured for `localhost` only
- No production domain configuration
- No user session management after successful authentication

### Required Updates for Production

1. Update `rpID` in backend to production domain
2. Update `origin` in backend to production URL
3. Update `FIREBASE_FUNCTIONS_BASE_URL` in frontend service
4. Implement proper session management after successful authentication

### Testing

- Test on HTTPS (required for WebAuthn)
- Test on supported browsers (Chrome, Safari, Firefox)
- Test on devices with platform authenticators (Touch ID, Face ID, Windows Hello)

## Dependencies

- `@simplewebauthn/server` (backend)
- `@simplewebauthn/browser` (frontend)

## Security Considerations

- All operations require HTTPS
- Challenges are stored temporarily and cleaned up
- Passkey data is encrypted and stored securely
- User verification is preferred for enhanced security
