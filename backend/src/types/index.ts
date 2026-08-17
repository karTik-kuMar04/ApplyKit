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
  body: string; // contains {{company}}, {{role}}, {{hiring_manager}} placeholders
  created_at: string;
  updated_at: string;
}

export interface EmailTemplate {
  id: string;
  name: string;
  subject: string; // supports placeholders too, e.g. "Application for {{role}} at {{company}}"
  body: string;
  created_at: string;
  updated_at: string;
}

export interface RenderFieldsInput {
  company?: string;
  role?: string;
  hiring_manager?: string;
  [key: string]: string | undefined;
}

export interface ApiError {
  error: string;
  details?: string;
}
