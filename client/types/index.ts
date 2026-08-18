export type ThemeMode = 'light' | 'dark' | 'system';

export type SyncStatus = 'synced' | 'syncing' | 'offline' | 'failed';

export interface Resume {
  id: string;
  original_filename: string;
  file_path?: string;
  fileType?: 'pdf';
  uploaded_at: string;
  syncStatus?: SyncStatus;
  lastSyncedAt?: string | null;
  pageCount?: number;
  size_bytes: number | string;
  isCurrent?: boolean;
}

export type ApplicationStatus =
  | 'draft'
  | 'ready'
  | 'applied'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export interface Application {
  id: string;
  company: string;
  role: string;
  location: string;
  status: ApplicationStatus;
  dateApplied: string | null;
  resumeUsed: string | null;
  coverLetterUsed: string | null;
  hiringManager: string | null;
  email: string | null;
  jobUrl: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ResumeMeta {
  id: string;
  file_path: string;
  original_filename: string;
  uploaded_at: string;
  size_bytes: number;
}

export interface CoverLetterTemplate {
  id: string;
  name: string;
  body: string;
  created_at: string;
  updated_at: string;
  description?: string;
  updatedAt?: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string;
  body: string;
  created_at: string;
  updated_at: string;
  description?: string;
  updatedAt?: string;
}

export interface RenderFieldsInput {
  company?: string;
  role?: string;
  hiring_manager?: string;
  candidate_name?: string;
  [key: string]: string | undefined;
}

export type ActivityType =
  | 'resume_updated'
  | 'application_created'
  | 'cover_letter_generated'
  | 'email_prepared'
  | 'application_status_changed';

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  subtitle: string;
  timestamp: string;
}

export interface UserPreferences {
  themeMode: ThemeMode;
  defaultCoverLetterTemplateId: string | null;
  defaultEmailTemplateId: string | null;
  autoSyncResume: boolean;
}

export interface ApplicationFormData {
  company: string;
  role: string;
  hiringManager?: string;
  email?: string;
  location?: string;
  jobUrl?: string;
  notes?: string;
}

export interface CoverLetterFormData {
  company: string;
  role: string;
  hiringManager: string;
}

export interface EmailFormData {
  company: string;
  role: string;
  hiringManager: string;
  candidateName: string;
}

export interface ServiceError {
  message: string;
  code?: string;
}

export type ServiceResult<T> =
  | { success: true; data: T }
  | { success: false; error: ServiceError };
