import type { CoverLetterTemplate } from '@/types';

export const mockCoverLetterTemplates: CoverLetterTemplate[] = [
  {
    id: 'cl-1',
    name: 'Standard Professional',
    description: 'A versatile cover letter for most applications.',
    body: `Dear {{hiring_manager}},

I am writing to express my interest in the {{role}} position at {{company}}. With several years of experience building polished, performant web and mobile applications, I am confident I would be a strong addition to your team.

In my recent work, I have focused on creating intuitive user experiences while maintaining clean, maintainable codebases. I thrive in collaborative environments where design quality and engineering excellence are equally valued.

I would welcome the opportunity to discuss how my skills align with {{company}}'s goals. Thank you for considering my application.

Best regards,
Kartik Kumar`,
    updatedAt: '2026-08-01T10:00:00Z',
  },
  {
    id: 'cl-2',
    name: 'Startup Enthusiast',
    description: 'Emphasizes passion for fast-moving startup environments.',
    body: `Hi {{hiring_manager}},

I'm excited about the {{role}} role at {{company}}. What draws me to {{company}} is the opportunity to build products that move quickly without sacrificing quality — something I've consistently prioritized throughout my career.

I've shipped features end-to-end, from initial design discussions through production deployment, and I enjoy wearing multiple hats when the situation calls for it. I believe my experience would translate well to the pace and expectations at {{company}}.

I'd love to connect and learn more about what you're building.

Cheers,
Kartik`,
    updatedAt: '2026-07-28T14:00:00Z',
  },
  {
    id: 'cl-3',
    name: 'Technical Deep Dive',
    description: 'Highlights technical expertise and engineering focus.',
    body: `Dear {{hiring_manager}},

I am applying for the {{role}} position at {{company}}. My background spans React, React Native, TypeScript, and modern frontend architecture — skills that align closely with the technical requirements of this role.

At my current position, I have led initiatives to improve application performance, establish design systems, and mentor junior engineers. I am particularly interested in {{company}}'s approach to developer experience and product quality.

I look forward to the possibility of contributing to your engineering team.

Sincerely,
Kartik Kumar`,
    updatedAt: '2026-07-15T09:00:00Z',
  },
];
