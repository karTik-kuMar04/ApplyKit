import api from '@/lib/api/api';
import { replacePlaceholders } from '@/utils';
import type { EmailFormData, EmailTemplate, RenderFieldsInput, ServiceResult } from '@/types';

export const emailTemplateService = {
  async getTemplates(): Promise<ServiceResult<EmailTemplate[]>> {
    try {
      const res = await api.get<EmailTemplate[]>('/api/email-templates');
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
        error: { message: error.response?.data?.error || error.message || "Couldn't load email templates." },
      };
    }
  },

  async getTemplate(id: string): Promise<ServiceResult<EmailTemplate>> {
    try {
      const res = await api.get<EmailTemplate>(`/api/email-templates/${id}`);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || 'Template not found.' },
      };
    }
  },

  async createTemplate(
    data: { name: string; subject: string; body: string; description?: string }
  ): Promise<ServiceResult<EmailTemplate>> {
    try {
      const res = await api.post<EmailTemplate>('/api/email-templates', {
        name: data.name,
        subject: data.subject,
        body: data.body,
      });
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't create email template." },
      };
    }
  },

  async updateTemplate(
    id: string,
    data: { name?: string; subject?: string; body?: string; description?: string }
  ): Promise<ServiceResult<EmailTemplate>> {
    try {
      const res = await api.put<EmailTemplate>(`/api/email-templates/${id}`, {
        name: data.name,
        subject: data.subject,
        body: data.body,
      });
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't update email template." },
      };
    }
  },

  async duplicateTemplate(id: string): Promise<ServiceResult<EmailTemplate>> {
    try {
      const originalRes = await api.get<EmailTemplate>(`/api/email-templates/${id}`);
      const original = originalRes.data;
      const res = await api.post<EmailTemplate>('/api/email-templates', {
        name: `${original.name} (Copy)`,
        subject: original.subject,
        body: original.body,
      });
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't duplicate email template." },
      };
    }
  },

  async deleteTemplate(id: string): Promise<ServiceResult<void>> {
    try {
      await api.delete(`/api/email-templates/${id}`);
      return { success: true, data: undefined };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't delete email template." },
      };
    }
  },

  async renderTemplate(
    id: string,
    fields: RenderFieldsInput
  ): Promise<ServiceResult<{ subject: string; body: string }>> {
    try {
      const res = await api.post<{ subject: string; body: string }>(`/api/email-templates/${id}/render`, fields);
      return { success: true, data: res.data };
    } catch (error: any) {
      return {
        success: false,
        error: { message: error.response?.data?.error || error.message || "Couldn't render email template." },
      };
    }
  },

  generatePreview(
    template: EmailTemplate,
    formData: EmailFormData
  ): { subject: string; body: string; to: string } {
    const values = {
      company: formData.company,
      role: formData.role,
      hiring_manager: formData.hiringManager || 'Hiring Manager',
      candidate_name: formData.candidateName,
    };
    return {
      to: formData.hiringManager ? `${formData.hiringManager} <contact@${formData.company.toLowerCase().replace(/\s+/g, '')}.com>` : '',
      subject: replacePlaceholders(template.subject, values),
      body: replacePlaceholders(template.body, values),
    };
  },

  async prepareEmail(): Promise<ServiceResult<{ message: string }>> {
    return {
      success: true,
      data: { message: 'Email prepared. Ready to open in your mail app.' },
    };
  },
};
