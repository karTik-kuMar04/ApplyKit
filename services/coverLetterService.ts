import { mockCoverLetterTemplates } from '@/mock/coverLetterTemplates';
import { delay, generateId, replacePlaceholders, simulateRandomFailure } from '@/utils';
import type { CoverLetterFormData, CoverLetterTemplate, ServiceResult } from '@/types';

let templates: CoverLetterTemplate[] = [...mockCoverLetterTemplates];

export const coverLetterService = {
  async getTemplates(): Promise<ServiceResult<CoverLetterTemplate[]>> {
    await delay(500);
    if (simulateRandomFailure(0.02)) {
      return {
        success: false,
        error: { message: "Couldn't load cover letter templates." },
      };
    }
    return {
      success: true,
      data: [...templates].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    };
  },

  async getTemplate(id: string): Promise<ServiceResult<CoverLetterTemplate>> {
    await delay(300);
    const template = templates.find((t) => t.id === id);
    if (!template) {
      return { success: false, error: { message: 'Template not found.' } };
    }
    return { success: true, data: { ...template } };
  },

  async createTemplate(
    data: Omit<CoverLetterTemplate, 'id' | 'updatedAt'>
  ): Promise<ServiceResult<CoverLetterTemplate>> {
    await delay(700);
    const template: CoverLetterTemplate = {
      ...data,
      id: generateId('cl'),
      updatedAt: new Date().toISOString(),
    };
    templates = [template, ...templates];
    return { success: true, data: template };
  },

  async updateTemplate(
    id: string,
    data: Partial<Omit<CoverLetterTemplate, 'id'>>
  ): Promise<ServiceResult<CoverLetterTemplate>> {
    await delay(600);
    const index = templates.findIndex((t) => t.id === id);
    if (index === -1) {
      return { success: false, error: { message: 'Template not found.' } };
    }
    const updated: CoverLetterTemplate = {
      ...templates[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    templates[index] = updated;
    return { success: true, data: updated };
  },

  async duplicateTemplate(id: string): Promise<ServiceResult<CoverLetterTemplate>> {
    await delay(500);
    const original = templates.find((t) => t.id === id);
    if (!original) {
      return { success: false, error: { message: 'Template not found.' } };
    }
    const duplicate: CoverLetterTemplate = {
      ...original,
      id: generateId('cl'),
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

  generatePreview(templateBody: string, formData: CoverLetterFormData): string {
    return replacePlaceholders(templateBody, {
      company: formData.company,
      role: formData.role,
      hiring_manager: formData.hiringManager || 'Hiring Manager',
    });
  },

  async exportPdf(): Promise<ServiceResult<{ message: string }>> {
    await delay(1200);
    return { success: true, data: { message: 'Cover letter exported as PDF.' } };
  },

  async copyToClipboard(text: string): Promise<ServiceResult<void>> {
    await delay(200);
    return { success: true, data: undefined };
  },

  reset() {
    templates = [...mockCoverLetterTemplates];
  },
};
