import { useState, useCallback } from 'react';
import { DeveloperApp, DeveloperAppCreateRequest } from '../api/developerAppsApi';
import { validateEmail, validateUrl, validateAppId } from '../utils/validation';

export interface AppFormData {
  name: string;
  appId: string;
  shortDescription: string;
  longDescription: string;
  tags: string;
  logo: string;
  banner: string;
  supportEmail: string;
  launchUrl: string;
  socialTelegram: string;
  socialX: string;
  socialFacebook: string;
  socialTiktok: string;
}

export interface FormErrors {
  name?: string;
  appId?: string;
  shortDescription?: string;
  tags?: string;
  logo?: string;
  supportEmail?: string;
  launchUrl?: string;
  socialTelegram?: string;
  socialX?: string;
  socialFacebook?: string;
  socialTiktok?: string;
}

const initialFormData: AppFormData = {
  name: '',
  appId: '',
  shortDescription: '',
  longDescription: '',
  tags: '',
  logo: '',
  banner: '',
  supportEmail: '',
  launchUrl: '',
  socialTelegram: '',
  socialX: '',
  socialFacebook: '',
  socialTiktok: '',
};

export const useAppForm = (existingApp?: DeveloperApp) => {
  const [formData, setFormData] = useState<AppFormData>(() => {
    if (existingApp) {
      return {
        name: existingApp.name,
        appId: existingApp.appId,
        shortDescription: existingApp.shortDescription,
        longDescription: existingApp.longDescription || '',
        tags: existingApp.tags,
        logo: existingApp.logo,
        banner: existingApp.banner || '',
        supportEmail: existingApp.supportEmail,
        launchUrl: existingApp.launchUrl,
        socialTelegram: existingApp.socialTelegram || '',
        socialX: existingApp.socialX || '',
        socialFacebook: existingApp.socialFacebook || '',
        socialTiktok: existingApp.socialTiktok || '',
      };
    }
    return initialFormData;
  });

  const [errors, setErrors] = useState<FormErrors>({});

  const updateField = useCallback((field: keyof AppFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user types
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {};

    // Required fields
    if (!formData.name.trim()) {
      newErrors.name = 'App name is required';
    }

    if (!formData.appId.trim()) {
      newErrors.appId = 'App ID is required';
    } else if (!validateAppId(formData.appId)) {
      newErrors.appId = 'App ID must be lowercase alphanumeric with hyphens/underscores (3-50 chars)';
    }

    if (!formData.shortDescription.trim()) {
      newErrors.shortDescription = 'Short description is required';
    } else if (formData.shortDescription.length > 200) {
      newErrors.shortDescription = 'Short description must be 200 characters or less';
    }

    if (!formData.tags.trim()) {
      newErrors.tags = 'At least one tag is required';
    }

    if (!formData.logo.trim()) {
      newErrors.logo = 'Logo is required';
    }

    if (!formData.supportEmail.trim()) {
      newErrors.supportEmail = 'Support email is required';
    } else if (!validateEmail(formData.supportEmail)) {
      newErrors.supportEmail = 'Invalid email address';
    }

    if (!formData.launchUrl.trim()) {
      newErrors.launchUrl = 'Launch URL is required';
    } else if (!validateUrl(formData.launchUrl)) {
      newErrors.launchUrl = 'Invalid URL';
    }

    // Optional URL validations
    if (formData.socialTelegram && !validateUrl(formData.socialTelegram)) {
      newErrors.socialTelegram = 'Invalid URL';
    }

    if (formData.socialX && !validateUrl(formData.socialX)) {
      newErrors.socialX = 'Invalid URL';
    }

    if (formData.socialFacebook && !validateUrl(formData.socialFacebook)) {
      newErrors.socialFacebook = 'Invalid URL';
    }

    if (formData.socialTiktok && !validateUrl(formData.socialTiktok)) {
      newErrors.socialTiktok = 'Invalid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setErrors({});
  }, []);

  const prepareSubmitData = useCallback(
    (ownerEoaAddress: string): DeveloperAppCreateRequest => {
      return {
        ownerEoaAddress,
        name: formData.name.trim(),
        appId: formData.appId.trim(),
        shortDescription: formData.shortDescription.trim(),
        longDescription: formData.longDescription.trim() || undefined,
        tags: formData.tags.trim(),
        logo: formData.logo,
        banner: formData.banner || undefined,
        supportEmail: formData.supportEmail.trim(),
        launchUrl: formData.launchUrl.trim(),
        socialTelegram: formData.socialTelegram.trim() || undefined,
        socialX: formData.socialX.trim() || undefined,
        socialFacebook: formData.socialFacebook.trim() || undefined,
        socialTiktok: formData.socialTiktok.trim() || undefined,
      };
    },
    [formData]
  );

  return {
    formData,
    errors,
    updateField,
    validateForm,
    resetForm,
    prepareSubmitData,
    setFormData,
  };
};

