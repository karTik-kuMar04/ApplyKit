export const APP_VERSION = '1.0.0';
export const CANDIDATE_NAME = 'Kartik Kumar';

export const APPLICATION_STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  ready: 'Ready to Apply',
  applied: 'Applied',
  interview: 'Interview',
  offer: 'Offer',
  rejected: 'Rejected',
  withdrawn: 'Withdrawn',
};

export const SYNC_STATUS_LABELS: Record<string, string> = {
  synced: 'Synced',
  syncing: 'Syncing…',
  offline: 'Offline',
  failed: 'Sync failed',
};

export const PLACEHOLDER_HINTS = [
  '{{company}}',
  '{{role}}',
  '{{hiring_manager}}',
  '{{candidate_name}}',
];
