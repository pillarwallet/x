import React, { useRef, useState } from 'react';

// utils
import { fileToBase64, validateImageFile } from '../utils/imageUtils';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (base64: string) => void;
  error?: string;
  required?: boolean;
  description?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  error,
  required = false,
  description,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string>('');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadError('');
    setUploading(true);

    // Validate file
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setUploadError(validation.error || 'Invalid file');
      setUploading(false);
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      onChange(base64);
    } catch (err) {
      setUploadError('Failed to process image');
    } finally {
      setUploading(false);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-300 mb-2">
        {label} {required && <span className="text-red-400">*</span>}
      </label>
      {description && <p className="text-xs text-gray-500 mb-3">{description}</p>}

      <div className="space-y-3">
        {/* Preview */}
        {value && (
          <div className="relative inline-block">
            <img
              src={value}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border border-purple-700/30"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-colors"
            >
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {/* Upload Button */}
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/jpg,image/gif,image/webp"
            onChange={handleFileSelect}
            className="hidden"
          />
          <button
            type="button"
            onClick={handleClick}
            disabled={uploading}
            className="px-4 py-2 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-700/50 text-purple-300 rounded text-sm font-medium transition-colors disabled:opacity-50"
          >
            {uploading ? 'Processing...' : value ? 'Change Image' : 'Upload Image'}
          </button>
        </div>
      </div>

      {/* Errors */}
      {(error || uploadError) && (
        <p className="mt-2 text-sm text-red-400">{error || uploadError}</p>
      )}
    </div>
  );
};

export default ImageUpload;

