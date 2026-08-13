import type { ActivityItem } from '@/types';

export const mockActivity: ActivityItem[] = [
  {
    id: 'act-1',
    type: 'application_status_changed',
    title: 'Linear application updated',
    subtitle: 'Status changed to Interview',
    timestamp: '2026-08-12T16:30:00Z',
  },
  {
    id: 'act-2',
    type: 'cover_letter_generated',
    title: 'Cover letter created',
    subtitle: 'For Vercel — Frontend Developer',
    timestamp: '2026-08-08T09:00:00Z',
  },
  {
    id: 'act-3',
    type: 'application_created',
    title: 'New application',
    subtitle: 'Stripe — Software Engineer',
    timestamp: '2026-08-11T11:00:00Z',
  },
  {
    id: 'act-4',
    type: 'resume_updated',
    title: 'Resume synced',
    subtitle: 'Kartik_Kumar_Resume.pdf updated',
    timestamp: '2026-08-10T14:30:00Z',
  },
  {
    id: 'act-5',
    type: 'email_prepared',
    title: 'Email prepared',
    subtitle: 'For Vercel application',
    timestamp: '2026-08-08T09:15:00Z',
  },
];
