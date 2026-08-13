import { mockEmailTemplates } from '@/mock/emailTemplates';
import { delay, generateId, replacePlaceholders, simulateRandomFailure } from '@/utils';
import type { EmailFormData, EmailTemplate, ServiceResult } from '@/types';

let templates: EmailTemplate[] = [...mockEmailTemplates];

export const emailTemplateService = {
  async getTemplates(): Promise<ServiceResult<EmailTemplate[]>> {
    await delay(500);
    if (simulateRandomFailure(0.02)) {
      return {
        success: false,
        error: { message: "Couldn't load email templates." },
      };
    }
    return {
      success: true,
      data: [...templates].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    };
  },

  async getTemplate(id: string): Promise<ServiceResult<EmailTemplate>> {
    await delay(300);
    const template = templates.find((t) => t.id === id);
    if (!template) {
      return { success: false, error: { message: 'Template not found.' } };
    }
    return { success: true, data: { ...template } };
  },

  async createTemplate(
    data: Omit<EmailTemplate, 'id' | 'updatedAt'>
  ): Promise<ServiceResult<EmailTemplate>> {
    await delay(700);
    const template: EmailTemplate = {
      ...data,
      id: generateId('em'),
      updatedAt: new Date().toISOString(),
    };
    templates = [template, ...templates];
    return { success: true, data: template };
  },

  async updateTemplate(
    id: string,
    data: Partial<Omit<EmailTemplate, 'id'>>
  ): Promise<ServiceResult<EmailTemplate>> {
    await delay(600);
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) {
      return { success: false, error: { message: 'Template not found.' } };
    }
    const updated: EmailTemplate = {
      ...templates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    templates[index] = updated;
    return { success: true, data: updated };
  },

  async duplicateTemplate(id: string): Promise<ServiceResult<EmailTemplate>> {
    await delay(500);
    const original = templates.find((t) => t.id === id);
    if (!original) {
      return { success: false, error: { message: 'Template not found.' } };
    }
    const duplicate: EmailTemplate = {
      ...original,
      id: generateId('em'),
      name: `${original.name} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    templates = [duplicate, ...templates];
    return { success: true, data: duplicate };
  },

  async deleteTemplate(id: string): Promise<ServiceResult<void>> {
    await delay(500);
    if (templates.length <= 1) {
      return {
        success: false,
        error: { message: 'You need at least one template.' },
      };
    }
    templates = templates.filter((t) => t.id !== id);
    return { success: true, data: undefined };
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
    await delay(1000);
    return {
      success: true,
      data: { message: 'Email prepared. Ready to open in your mail app.' },
    };
  },

  reset() {
    templates = [...mockEmailTemplates];
  },
};
