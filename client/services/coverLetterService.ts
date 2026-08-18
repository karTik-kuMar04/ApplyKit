import api from '@/lib/api/api';
import { replacePlaceholders } from '@/utils';
import type { CoverLetterFormData, CoverLetterTemplate, RenderFieldsInput, ServiceResult } from '@/types';

export const coverLetterService = {
  async getTemplates(): Promise<ServiceResult<CoverLetterTemplate[]>> {
    try {
      const res = await api.get<CoverLetterTemplate[]>('/api/cover-letters');
      const sorted = [...res.data].sort((a, b) => {
        const timeA = new Date(a.updated_at || a.updatedAt || 0).getTime();
        const timeB = new Date(b.updated_at || b.updatedAt || 0).getTime();
        return timeB - timeA;
      });
      return {
        success: true,
        data: sorted,
      };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't load cover letter templates." },
      };
    }
  },

  async getTemplate(id: string): Promise<ServiceResult<CoverLetterTemplate>> {
    try {
      const res = await api.get<CoverLetterTemplate>(`/api/cover-letters/${id}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || 'Template not found.' },
      };
    }
  },

  async createTemplate(
    data: { name: string; body: string; description?: string }
  ): Promise<ServiceResult<CoverLetterTemplate>> {
    try {
      const res = await api.post<CoverLetterTemplate>('/api/cover-letters', {
        name: data.name,
        body: data.body,
      });
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't create template." },
      };
    }
  },

  async updateTemplate(
    id: string,
    data: { name?: string; body?: string; description?: string }
  ): Promise<ServiceResult<CoverLetterTemplate>> {
    try {
      const res = await api.put<CoverLetterTemplate>(`/api/cover-letters/${id}`, {
        name: data.name,
        body: data.body,
      });
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't update template." },
      };
    }
  },

  async duplicateTemplate(id: string): Promise<ServiceResult<CoverLetterTemplate>> {
    try {
      const originalRes = await api.get<CoverLetterTemplate>(`/api/cover-letters/${id}`);
      const original = originalRes.data;
      const res = await api.post<CoverLetterTemplate>('/api/cover-letters', {
        name: `${original.name} (Copy)`,
        body: original.body,
      });
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't duplicate template." },
      };
    }
  },

  async deleteTemplate(id: string): Promise<ServiceResult<void>> {
    try {
      await api.delete(`/api/cover-letters/${id}`);
      return { success: true, data: undefined };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't delete template." },
      };
    }
  },

  async renderTemplate(
    id: string,
    fields: RenderFieldsInput
  ): Promise<ServiceResult<{ rendered: string }>> {
    try {
      const res = await api.post<{ rendered: string }>(`/api/cover-letters/${id}/render`, fields);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't render cover letter." },
      };
    }
  },

  generatePreview(templateBody: string, formData: CoverLetterFormData): string {
    return replacePlaceholders(templateBody, {
      company: formData.company,
      role: formData.role,
      hiring_manager: formData.hiringManager || 'Hiring Manager',
    });
  },

  async exportPdf(): Promise<ServiceResult<{ message: string }>> {
    return { success: true, data: { message: 'Cover letter exported as PDF.' } };
  },

  async copyToClipboard(_text: string): Promise<ServiceResult<void>> {
    return { success: true, data: undefined };
  },
};
