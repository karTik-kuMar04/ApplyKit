import type { EmailTemplate } from '@/types';

export const mockEmailTemplates: EmailTemplate[] = [
  {
    id: 'em-1',
    name: 'Standard Application',
    description: 'A professional email for submitting job applications.',
    subject: 'Application for {{role}} — {{candidate_name}}',
    body: `Dear {{hiring_manager}},

Please find attached my resume and cover letter for the {{role}} position at {{company}}.

I am very interested in this opportunity and believe my experience would be a strong fit for your team. I would welcome the chance to discuss my qualifications further.

Thank you for your time and consideration.

Best regards,
{{candidate_name}}`,
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'em-2',
    name: 'Follow Up',
    description: 'A polite follow-up after submitting an application.',
    subject: 'Following up — {{role}} at {{company}}',
    body: `Hi {{hiring_manager}},

I wanted to follow up on my application for the {{role}} position at {{company}}, which I submitted recently.

I remain very interested in this opportunity and would appreciate any update on the status of my application. Please let me know if you need any additional information.

Thank you,
{{candidate_name}}`,
    updatedAt: '2026-07-25T11:00:00Z',
  },
  {
    id: 'em-3',
    name: 'Referral Introduction',
    description: 'Email when applying through a referral.',
    subject: '{{role}} Application — Referred by [Name]',
    body: `Dear {{hiring_manager}},

I was referred to the {{role}} position at {{company}} and am excited to apply. Please find my resume and cover letter attached.

I have been following {{company}}'s work and am impressed by the product and engineering culture. I would love the opportunity to contribute.

Best regards,
{{candidate_name}}`,
    updatedAt: '2026-07-20T08:00:00Z',
  },
];
