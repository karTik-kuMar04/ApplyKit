import { mockApplications } from '@/mock/applications';
import { mockActivity } from '@/mock/activity';
import { delay, generateId, simulateRandomFailure } from '@/utils';
import type {
  ActivityItem,
  Application,
  ApplicationFormData,
  ApplicationStatus,
  ServiceResult,
} from '@/types';

let applications: Application[] = [...mockApplications];
let activity: ActivityItem[] = [...mockActivity];

export const applicationService = {
  async getApplications(): Promise<ServiceResult<Application[]>> {
    await delay(700);
    if (simulateRandomFailure(0.03)) {
      return {
        success: false,
        error: { message: "Couldn't load your applications. Check your connection and try again." },
      };
    }
    return {
      success: true,
      data: [...applications].sort(
        (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      ),
    };
  },

  async getApplication(id: string): Promise<ServiceResult<Application>> {
    await delay(400);
    const app = applications.find((a) => a.id === id);
    if (!app) {
      return { success: false, error: { message: 'Application not found.' } };
    }
    return { success: true, data: { ...app } };
  },

  async createApplication(data: ApplicationFormData): Promise<ServiceResult<Application>> {
    await delay(800);
    const now = new Date().toISOString();
    const newApp: Application = {
      id: generateId('app'),
      company: data.company,
      role: data.role,
      location: data.location ?? '',
      status: 'draft',
      dateApplied: null,
      resumeUsed: null,
      coverLetterUsed: null,
      hiringManager: data.hiringManager ?? null,
      email: data.email ?? null,
      jobUrl: data.jobUrl ?? null,
      notes: data.notes ?? null,
      createdAt: now,
      updatedAt: now,
    };
    applications = [newApp, ...applications];
    activity = [
      {
        id: generateId('act'),
        type: 'application_created',
        title: 'New application',
        subtitle: `${data.company} — ${data.role}`,
        timestamp: now,
      },
      ...activity,
    ];
    return { success: true, data: newApp };
  },

  async updateApplication(
    id: string,
    updates: Partial<Application>
  ): Promise<ServiceResult<Application>> {
    await delay(600);
    const index = applications.findIndex((a) => a.id === id);
    if (index === -1) {
      return { success: false, error: { message: 'Application not found.' } };
    }
    const updated: Application = {
      ...applications[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    applications[index] = updated;
    return { success: true, data: updated };
  },

  async updateStatus(
    id: string,
    status: ApplicationStatus
  ): Promise<ServiceResult<Application>> {
    const result = await this.updateApplication(id, { status });
    if (result.success) {
      activity = [
        {
          id: generateId('act'),
          type: 'application_status_changed',
          title: `${result.data.company} application updated`,
          subtitle: `Status changed to ${status}`,
          timestamp: new Date().toISOString(),
        },
        ...activity,
      ];
    }
    return result;
  },

  async deleteApplication(id: string): Promise<ServiceResult<void>> {
    await delay(500);
    applications = applications.filter((a) => a.id !== id);
    return { success: true, data: undefined };
  },

  async getActivity(): Promise<ServiceResult<ActivityItem[]>> {
    await delay(300);
    return { success: true, data: [...activity].slice(0, 10) };
  },

  getOverview() {
    const active = applications.filter(
      (a) => !['rejected', 'withdrawn'].includes(a.status)
    );
    const interviews = applications.filter((a) => a.status === 'interview');
    const recent = [...applications]
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      .slice(0, 3);
    return { activeCount: active.length, interviewCount: interviews.length, recent };
  },

  reset() {
    applications = [...mockApplications];
    activity = [...mockActivity];
  },
};
