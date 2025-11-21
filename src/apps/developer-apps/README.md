# Developer Hub App

A comprehensive application management system for PillarX developers to register, manage, and update their applications.

## Overview

The Developer Hub app provides a user-friendly interface for developers to:

- Create and register new applications
- View all their registered applications
- Edit application details and metadata
- Delete applications
- Manage app images (logos and banners)
- Update social media links and contact information

## Features

### ✨ Key Features

- **Full CRUD Operations**: Create, Read, Update, and Delete applications
- **Wallet Authentication**: Uses Privy wallet integration for EOA address verification
- **Image Upload**: Base64 image upload with validation for logos and banners
- **Real-time Validation**: Form validation with helpful error messages
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Theme**: Beautiful dark theme with purple gradient accents
- **Roboto Mono Font**: Monospace font for a developer-friendly aesthetic

### 🔒 Security

- **Ownership Verification**: Only the app owner (EOA address) can edit or delete their apps
- **Input Validation**: Comprehensive validation for all form fields
- **Image Validation**: File type and size validation for uploaded images
- **URL Validation**: Ensures all URLs are properly formatted

## File Structure

```
developers/
├── api/
│   └── developerAppsApi.ts          # RTK Query API service
├── components/
│   ├── AppCard.tsx                  # Individual app card component
│   ├── AppForm.tsx                  # Create/Edit form component
│   ├── AppsList.tsx                 # Apps list view component
│   └── ImageUpload.tsx              # Image upload component
├── hooks/
│   └── useAppForm.ts                # Form state management hook
├── styles/
│   └── developers.css               # Custom styles
├── utils/
│   ├── imageUtils.ts                # Image processing utilities
│   └── validation.ts                # Validation utilities
├── icon.png                         # App icon
├── index.tsx                        # Main app component with routing
├── manifest.json                    # App manifest
└── README.md                        # This file
```

## Routes

The app uses the following route structure:

- `/developer-apps` - List of all user's apps
- `/developer-apps/create` - Create new app form
- `/developer-apps/edit/:appId` - Edit existing app form

## Components

### AppsList

The main list view that displays all apps owned by the connected wallet.

**Features:**

- Grid layout with responsive columns
- Empty state with call-to-action
- Loading and error states
- Quick access to edit and delete actions

### AppCard

Individual app card component showing app details.

**Displays:**

- App logo
- App name and ID
- Short description
- Tags
- Social media links
- Creation/update dates
- Edit and delete buttons

### AppForm

Comprehensive form for creating or editing apps.

**Sections:**

1. **Basic Information**

   - App name
   - App ID (auto-generated from name, immutable after creation)
   - Short description (max 200 chars)
   - Long description
   - Tags

2. **Images**

   - Logo (required, recommended 512x512px)
   - Banner (optional, recommended 1200x400px)

3. **Contact & Links**

   - Support email
   - Launch URL

4. **Social Links** (all optional)
   - Telegram
   - X (Twitter)
   - Facebook
   - TikTok

### ImageUpload

Reusable image upload component with preview and validation.

**Features:**

- Drag and drop support
- File type validation (PNG, JPG, GIF, WEBP)
- File size validation (max 5MB)
- Image preview
- Remove uploaded image option

## API Integration

The app uses Redux Toolkit Query (RTK Query) for API calls to the Firebase Functions backend.

### Endpoints

```typescript
// Get all apps
useGetAllDeveloperAppsQuery();

// Get single app
useGetDeveloperAppQuery(appId);

// Create app
useCreateDeveloperAppMutation();

// Update app
useUpdateDeveloperAppMutation();

// Delete app
useDeleteDeveloperAppMutation();
```

### API Configuration

The API automatically switches between staging and production based on the `isTestnet` flag:

- **Production**: `https://developersapps-7eu4izffpa-uc.a.run.app`
- **Staging**: `https://developersapps-nubpgwxpiq-uc.a.run.app`

## Hooks

### useAppForm

Custom hook for managing form state and validation.

**Features:**

- Form data state management
- Field-level validation
- Error state management
- Form submission data preparation
- Auto-sanitization of app ID

**Usage:**

```typescript
const {
  formData,
  errors,
  updateField,
  validateForm,
  resetForm,
  prepareSubmitData,
} = useAppForm(existingApp);
```

## Utilities

### imageUtils.ts

Image processing utilities:

```typescript
// Convert file to base64
fileToBase64(file: File): Promise<string>

// Validate image file
validateImageFile(file: File): { valid: boolean; error?: string }

// Validate image dimensions
validateImageDimensions(file: File, minWidth: number, minHeight: number)
```

### validation.ts

Form validation utilities:

```typescript
// Validate Ethereum address
validateEthereumAddress(address: string): boolean

// Validate email
validateEmail(email: string): boolean

// Validate URL
validateUrl(url: string): boolean

// Validate app ID
validateAppId(appId: string): boolean

// Sanitize app ID
sanitizeAppId(input: string): string
```

## Styling

### Theme

The app uses a dark theme with purple gradient accents:

- **Background**: Dark gray gradients (from-gray-950 to-gray-900)
- **Cards**: Gradient from gray-900 to gray-800 with purple borders
- **Accent Color**: Purple (various shades from purple-300 to purple-900)
- **Font**: Roboto Mono (monospace)

### Tailwind CSS

The app is styled entirely with Tailwind CSS utility classes. Custom styles are defined in `styles/developers.css`.

### Key Design Elements

- Gradient backgrounds
- Purple border accents
- Hover effects with transitions
- Responsive grid layouts
- Custom scrollbar styling
- Loading spinners
- Icon buttons with SVGs

## Wallet Integration

The app uses Privy for wallet authentication:

```typescript
import { useWallets } from '@privy-io/react-auth';

const { wallets } = useWallets();
const eoaAddress = wallets[0]?.address;
```

### Ownership Verification

All create, update, and delete operations require:

1. Connected wallet
2. EOA address from the wallet
3. Ownership verification (for update/delete)

## Error Handling

The app provides comprehensive error handling:

- **Form Validation Errors**: Displayed inline below each field
- **API Errors**: Displayed in alerts with helpful messages
- **Loading States**: Spinner indicators during API calls
- **Empty States**: Helpful messages when no data is available
- **Not Found States**: Clear messaging for missing resources

## Validation Rules

### Required Fields

- App name
- App ID (3-50 characters, lowercase alphanumeric with hyphens/underscores)
- Short description (max 200 characters)
- Tags (comma-separated)
- Logo (base64 image)
- Support email (valid email format)
- Launch URL (valid URL format)

### Optional Fields

- Long description
- Banner (base64 image)
- Social links (valid URLs if provided)

### Image Requirements

- **Supported formats**: PNG, JPG, JPEG, GIF, WEBP
- **Max file size**: 5MB
- **Logo**: Square format recommended (512x512px)
- **Banner**: Wide format recommended (1200x400px)

## Usage Examples

### Creating a New App

1. Navigate to `/app/developers`
2. Click "Create New App"
3. Fill in all required fields
4. Upload logo (and optionally banner)
5. Add social links (optional)
6. Click "Create App"

### Editing an Existing App

1. Navigate to `/app/developers`
2. Click "Edit" on an app card
3. Modify desired fields
4. Click "Update App"

### Deleting an App

1. Navigate to `/app/developers`
2. Click "Delete" on an app card
3. Confirm deletion in the dialog
4. App and all associated images are removed

## Development

### Prerequisites

- Node.js 20+
- Privy wallet integration set up
- Firebase Functions backend deployed
- Redux store configured

### Adding New Features

To add new features to the app:

1. **API Changes**: Update `api/developerAppsApi.ts` with new endpoints
2. **Form Fields**: Add fields to `hooks/useAppForm.ts` and `components/AppForm.tsx`
3. **Validation**: Add validation rules to `utils/validation.ts`
4. **Styling**: Add styles to `styles/developers.css` or use Tailwind classes

### Testing

Test the following scenarios:

1. **Create App**: With all fields and without optional fields
2. **Edit App**: Modify various fields
3. **Delete App**: Confirm deletion works
4. **Validation**: Test all validation rules
5. **Image Upload**: Test with various image formats and sizes
6. **Wallet Connection**: Test without wallet and with wrong wallet
7. **Ownership**: Try editing someone else's app (should fail)

## Future Enhancements

Potential features to add:

1. **App Analytics**: Track views, launches, etc.
2. **App Verification**: Verification badge system
3. **Categories**: Organize apps by categories
4. **Search & Filter**: Search apps by name, tags, etc.
5. **Version History**: Track changes to app listings
6. **Ratings & Reviews**: Allow users to rate apps
7. **Featured Apps**: Highlight certain apps
8. **Draft Mode**: Save apps as drafts before publishing
9. **Bulk Operations**: Manage multiple apps at once
10. **Export Data**: Export app data as JSON/CSV

## Troubleshooting

### Common Issues

**Issue**: Images not uploading

- **Solution**: Check file size (must be < 5MB) and format (PNG, JPG, GIF, WEBP)

**Issue**: Can't edit/delete app

- **Solution**: Ensure you're connected with the wallet that created the app

**Issue**: Form validation errors

- **Solution**: Check that all required fields are filled and properly formatted

**Issue**: App ID already exists

- **Solution**: Choose a different app ID (must be unique)

## Support

For issues or questions:

- Check the API documentation in `/x-firebase/functions/DEVELOPER_APPS_API.md`
- Review the backend service code in `/x-firebase/functions/services/developerApps.js`
- Check Firebase Functions logs for backend errors

## License

Part of the PillarX project.
