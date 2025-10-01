export const TRANSACTION_STATUSES = {
  STARTING: 'Starting Transaction',
  PENDING: 'Transaction Pending',
  COMPLETE: 'Transaction Complete',
  FAILED: 'Transaction Failed',
};

export const TRANSACTION_STEPS = {
  SUBMITTED: 'Submitted',
  PENDING: 'Pending',
  RESOURCE_LOCK: 'ResourceLock',
  COMPLETED: 'Completed',
};

export const STATUS_COLORS = {
  [TRANSACTION_STATUSES.STARTING]: '#8A77FF',
  [TRANSACTION_STATUSES.PENDING]: '#FFAB36',
  [TRANSACTION_STATUSES.COMPLETE]: '#5CFF93',
  [TRANSACTION_STATUSES.FAILED]: '#FF366C',
};

export const STATUS_CONFIG = {
  [TRANSACTION_STATUSES.STARTING]: {
    icon: 'pending',
    containerClasses:
      'w-[90px] h-[90px] rounded-full border-[3px] border-white/10 bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[60px] h-[60px]',
    color: '#8A77FF',
  },
  [TRANSACTION_STATUSES.PENDING]: {
    icon: 'pending',
    containerClasses:
      'w-[90px] h-[90px] rounded-full border-[3px] border-white/10 bg-[#8A77FF] flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[60px] h-[60px]',
    color: '#8A77FF',
  },
  [TRANSACTION_STATUSES.COMPLETE]: {
    icon: 'confirmed',
    containerClasses:
      'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#5CFF93] bg-[#5CFF93]/30 flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[33px] h-[21px]',
    color: '#5CFF93',
  },
  [TRANSACTION_STATUSES.FAILED]: {
    icon: 'failed',
    containerClasses:
      'w-[90px] h-[90px] rounded-full border-[4.5px] border-[#FF366C] bg-[#FF366C]/30 flex items-center justify-center flex-shrink-0',
    iconClasses: 'w-[8px] h-[38px]',
    color: '#FF366C',
  },
};

export const BUTTON_CONFIG = {
  [TRANSACTION_STATUSES.STARTING]: {
    bgColor: 'bg-[#8A77FF]/10',
    textColor: 'text-[#8A77FF]',
    borderColor: 'border-[#8A77FF]',
    label: 'Starting...',
  },
  [TRANSACTION_STATUSES.PENDING]: {
    bgColor: 'bg-[#FFAB36]/10',
    textColor: 'text-[#FFAB36]',
    borderColor: 'border-[#FFAB36]',
    label: 'View Status',
  },
  [TRANSACTION_STATUSES.COMPLETE]: {
    bgColor: 'bg-[#5CFF93]/10',
    textColor: 'text-[#5CFF93]',
    borderColor: 'border-[#5CFF93]',
    label: 'Success',
  },
  [TRANSACTION_STATUSES.FAILED]: {
    bgColor: 'bg-[#FF366C]/10',
    textColor: 'text-[#FF366C]',
    borderColor: 'border-[#FF366C]',
    label: 'View Status',
  },
};
