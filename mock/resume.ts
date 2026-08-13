import type { Resume } from '@/types';

export const mockResume: Resume = {
  id: 'resume-1',
  fileName: 'Kartik_Kumar_Resume.pdf',
  fileType: 'pdf',
  updatedAt: '2026-08-10T14:30:00Z',
  syncStatus: 'synced',
  lastSyncedAt: '2026-08-13T09:15:00Z',
  pageCount: 2,
  fileSize: '245 KB',
  isCurrent: true,
};

export const mockResumeOffline: Resume = {
  ...mockResume,
  syncStatus: 'offline',
  lastSyncedAt: '2026-08-12T18:00:00Z',
};
