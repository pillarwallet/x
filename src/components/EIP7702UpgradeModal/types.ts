export type UpgradeStatus =
  | 'ready'
  | 'submitted'
  | 'upgrading'
  | 'completed'
  | 'failed';

export type UserOpUpgradeStatus =
  | 'New'
  | 'Pending'
  | 'Submitted'
  | 'OnChain'
  | 'Finalized'
  | 'Cancelled'
  | 'Reverted';
