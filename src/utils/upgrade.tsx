import { UpgradeStatus } from '../components/EIP7702UpgradeModal/types';

// components

interface StatusConfig {
  icon: string;
  containerClasses: string;
  iconClasses: string;
  color: string;
  label: string;
}

interface ButtonConfig {
  bgColor: string;
  textColor: string;
  borderColor: string;
  label: string;
}

// Status configuration for icons
export const STATUS_CONFIG: Record<UpgradeStatus, StatusConfig> = {
  ready: {
    icon: 'pending',
    containerClasses:
      'w-[90px] h-[90px] rounded-full bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[60px] h-[60px]',
    color: '#8A77FF',
    label: 'Ready',
  },
  submitted: {
    icon: 'pending',
    containerClasses:
      'w-[90px] h-[90px] rounded-full bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[60px] h-[60px]',
    color: '#8A77FF',
    label: 'Upgrade Pending',
  },
  upgrading: {
    icon: 'pending',
    containerClasses:
      'w-[90px] h-[90px] rounded-full bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[60px] h-[60px]',
    color: '#8A77FF',
    label: 'Upgrade Pending',
  },
  completed: {
    icon: 'confirmed',
    containerClasses:
      'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[33px] h-[21px]',
    color: '#5CFF93',
    label: 'Upgrade Complete',
  },
  failed: {
    icon: 'failed',
    containerClasses:
      'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[8px] h-[38px]',
    color: '#FF366C',
    label: 'Upgrade Failed',
  },
};

// Button configuration for status
export const BUTTON_CONFIG: Record<UpgradeStatus, ButtonConfig> = {
  ready: {
    bgColor: 'bg-[#8A77FF]/10',
    textColor: 'text-[#8A77FF]',
    borderColor: 'border-[#8A77FF]',
    label: 'Ready',
  },
  submitted: {
    bgColor: 'bg-[#FFAB36]/10',
    textColor: 'text-[#FFAB36]',
    borderColor: 'border-[#FFAB36]',
    label: 'View Details',
  },
  upgrading: {
    bgColor: 'bg-[#FFAB36]/10',
    textColor: 'text-[#FFAB36]',
    borderColor: 'border-[#FFAB36]',
    label: 'View Details',
  },
  completed: {
    bgColor: 'bg-[#5CFF93]/10',
    textColor: 'text-[#5CFF93]',
    borderColor: 'border-[#5CFF93]',
    label: 'Success',
  },
  failed: {
    bgColor: 'bg-[#FF366C]/10',
    textColor: 'text-[#FF366C]',
    borderColor: 'border-[#FF366C]',
    label: 'View Details',
  },
};

/**
 * Gets the configuration for a given status
 */
export const getStatusConfig = (status: UpgradeStatus) => {
  return STATUS_CONFIG[status];
};

/**
 * Gets the button configuration for a given status
 */
export const getButtonConfig = (status: UpgradeStatus) => {
  return BUTTON_CONFIG[status];
};
