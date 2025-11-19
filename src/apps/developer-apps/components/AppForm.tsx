import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallets } from '@privy-io/react-auth';

// api
import {
  useCreateDeveloperAppMutation,
  useUpdateDeveloperAppMutation,
  DeveloperApp,
} from '../api/developerAppsApi';

// hooks
import { useAppForm } from '../hooks/useAppForm';

// utils
import { sanitizeAppId } from '../utils/validation';

// components
import ImageUpload from './ImageUpload';

interface AppFormProps {
  existingApp?: DeveloperApp;
  mode: 'create' | 'edit';
}

const AppForm: React.FC<AppFormProps> = ({ existingApp, mode }) => {
  const navigate = useNavigate();
  const { wallets } = useWallets();
  const eoaAddress = wallets[0]?.address;

  const { formData, errors, updateField, validateForm, prepareSubmitData, setFormData } =
    useAppForm(existingApp);

  const [createApp, { isLoading: isCreating }] = useCreateDeveloperAppMutation();
  const [updateApp, { isLoading: isUpdating }] = useUpdateDeveloperAppMutation();

  const isLoading = isCreating || isUpdating;

  // Auto-generate appId from name in create mode
  useEffect(() => {
    if (mode === 'create' && formData.name && !formData.appId) {
      const sanitized = sanitizeAppId(formData.name);
      setFormData((prev) => ({ ...prev, appId: sanitized }));
    }
  }, [formData.name, formData.appId, mode, setFormData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!eoaAddress) {
      alert('Please connect your wallet');
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      if (mode === 'create') {
        const data = prepareSubmitData(eoaAddress);
        await createApp(data).unwrap();
        navigate('/developer-apps');
      } else if (existingApp) {
        // For updates, exclude appId from the data to be signed
        const { appId, ownerEoaAddress, ...updateData } = prepareSubmitData(eoaAddress);
        
        console.log('📝 UPDATE - Data being sent for update:', {
          appId: existingApp.appId,
          data: {
            ownerEoaAddress: eoaAddress,
            ...updateData,
          }
        });
        
        await updateApp({
          appId: existingApp.appId,
          data: {
            ownerEoaAddress: eoaAddress,
            ...updateData,
          },
        }).unwrap();
        navigate('/developer-apps');
      }
    } catch (err: unknown) {
      console.error('Failed to save app:', err);
      
      // Check for MetaMask signature rejection
      if (err && typeof err === 'object' && 'message' in err) {
        const errorMessage = err.message as string;
        if (errorMessage.includes('MetaMask') || errorMessage.includes('signature required')) {
          alert('Please approve the signature request in MetaMask to save the app.');
          return;
        }
      }
      
      const errorMessage = err && typeof err === 'object' && 'data' in err
        ? (err.data as { error?: string })?.error || 'Failed to save app'
        : 'Failed to save app';
      alert(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate('/developer-apps');
  };

  if (!eoaAddress) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <div className="w-20 h-20 mb-6 rounded-full bg-purple-900/20 border border-purple-700/30 flex items-center justify-center">
          <svg className="w-10 h-10 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Connect Your Wallet</h2>
        <p className="text-gray-400 max-w-md">
          Please connect your wallet to {mode} applications.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          {mode === 'create' ? 'Create New Application' : 'Edit Application'}
        </h1>
        <p className="text-gray-400">
          {mode === 'create'
            ? 'Fill in the details below to register your application'
            : 'Update your application details'}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6 mb-20">
        {/* Basic Info Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-6">Basic Information</h2>
          <p className="text-sm text-gray-400 mb-6">
            The basic information is used to display your app in the Web3 App Store listings and inside the PillarX action bar.
          </p>
          <div className="space-y-5">
            {/* App Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                App Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="My Awesome App"
              />
              {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
              <p className="mt-1 text-xs text-gray-500">
                This is the public name of your app that will be displayed to users.
              </p>
            </div>

            {/* App ID */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                App ID <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.appId}
                onChange={(e) => updateField('appId', sanitizeAppId(e.target.value))}
                disabled={mode === 'edit'}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-mono"
                placeholder="my-awesome-app"
              />
              <p className="mt-1 text-xs text-gray-500">
                This becomes part of the PillarX URL. Lowercase letters, numbers, hyphens, and underscores only. Cannot be changed after creation.
              </p>
              {errors.appId && <p className="mt-1 text-sm text-red-400">{errors.appId}</p>}
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Short Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={formData.shortDescription}
                onChange={(e) => updateField('shortDescription', e.target.value)}
                rows={2}
                maxLength={200}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                placeholder="A brief description of your app (max 200 characters)"
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">Brief overview - shown in the Web3 App Store listings</p>
                <p className="text-xs text-gray-500">{formData.shortDescription.length}/200</p>
              </div>
              {errors.shortDescription && (
                <p className="mt-1 text-sm text-red-400">{errors.shortDescription}</p>
              )}
            </div>

            {/* Long Description */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Long Description
              </label>
              <textarea
                value={formData.longDescription}
                onChange={(e) => updateField('longDescription', e.target.value)}
                rows={5}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors resize-none"
                placeholder="A detailed description of your app's features and benefits"
              />
              <p className="mt-1 text-xs text-gray-500">Detailed information - shown in the Web3 App Store listings</p>
            </div>

            {/* Tags */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Tags <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => updateField('tags', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="defi, trading, wallet"
              />
              <p className="mt-1 text-xs text-gray-500">Comma-separated tags (e.g. defi, trading, nft) - shown and used for search and filtering in the Web3 App Store listings</p>
              {errors.tags && <p className="mt-1 text-sm text-red-400">{errors.tags}</p>}
            </div>
          </div>
        </div>

        {/* Launch URL Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Launch URL</h2>
          <p className="text-sm text-gray-400 mb-6">
            The launch URL is the URL of where your app is hosted. This will be launched inside PillarX when a user launches your app.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Launch URL <span className="text-red-400">*</span>
            </label>
            <input
              type="url"
              value={formData.launchUrl}
              onChange={(e) => updateField('launchUrl', e.target.value)}
              className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
              placeholder="https://example.com"
            />
            {errors.launchUrl && <p className="mt-1 text-sm text-red-400">{errors.launchUrl}</p>}
          </div>
        </div>

        {/* Images Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Images</h2>
          <p className="text-sm text-gray-400 mb-6">
            The images are used to display your app in the Web3 App Store listings and inside the PillarX action bar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUpload
              label="Logo"
              value={formData.logo}
              onChange={(value) => updateField('logo', value)}
              error={errors.logo}
              required
              description="Square image, recommended 512x512px (PNG, JPG, or GIF, max 5MB)"
            />
            <ImageUpload
              label="Banner"
              value={formData.banner}
              onChange={(value) => updateField('banner', value)}
              error={(errors as Record<string, string | undefined>).banner}
              description="Wide image, recommended 1200x400px (PNG, JPG, or GIF, max 5MB)"
            />
          </div>
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Contact & Links</h2>
          <p className="text-sm text-gray-400 mb-6">
            The support email is the email address that will be used to contact you for support.
          </p>
          <div className="space-y-5">
            {/* Support Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Support Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                value={formData.supportEmail}
                onChange={(e) => updateField('supportEmail', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="support@example.com"
              />
              {errors.supportEmail && (
                <p className="mt-1 text-sm text-red-400">{errors.supportEmail}</p>
              )}
            </div>
          </div>
        </div>

        {/* Social Links Section */}
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 border border-purple-900/30 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-white mb-2">Social Links</h2>
          <p className="text-sm text-gray-400 mb-6">
            The social links are used to display your app in the Web3 App Store listings and inside the PillarX action bar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Telegram */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Telegram</label>
              <input
                type="url"
                value={formData.socialTelegram}
                onChange={(e) => updateField('socialTelegram', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://t.me/yourgroup"
              />
              {errors.socialTelegram && (
                <p className="mt-1 text-sm text-red-400">{errors.socialTelegram}</p>
              )}
            </div>

            {/* X (Twitter) */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">X (Twitter)</label>
              <input
                type="url"
                value={formData.socialX}
                onChange={(e) => updateField('socialX', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://x.com/yourhandle"
              />
              {errors.socialX && <p className="mt-1 text-sm text-red-400">{errors.socialX}</p>}
            </div>

            {/* Facebook */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Facebook</label>
              <input
                type="url"
                value={formData.socialFacebook}
                onChange={(e) => updateField('socialFacebook', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://facebook.com/yourpage"
              />
              {errors.socialFacebook && (
                <p className="mt-1 text-sm text-red-400">{errors.socialFacebook}</p>
              )}
            </div>

            {/* TikTok */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">TikTok</label>
              <input
                type="url"
                value={formData.socialTiktok}
                onChange={(e) => updateField('socialTiktok', e.target.value)}
                className="w-full px-4 py-2 bg-gray-900/50 border border-purple-700/30 rounded text-white placeholder-gray-500 focus:border-purple-500 focus:outline-none transition-colors"
                placeholder="https://tiktok.com/@yourhandle"
              />
              {errors.socialTiktok && (
                <p className="mt-1 text-sm text-red-400">{errors.socialTiktok}</p>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-4 justify-end pt-6">
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className="px-6 py-3 bg-gray-700/50 hover:bg-gray-700/70 text-gray-300 rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-lg font-medium transition-all duration-300 shadow-lg shadow-purple-900/50 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : mode === 'create' ? 'Create App' : 'Update App'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AppForm;

