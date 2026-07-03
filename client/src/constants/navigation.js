import { BookOpen, CircleHelp, Home, NotebookPen, Settings, UserRound, Sparkles, CalendarDays } from 'lucide-react';

export const appNavigation = [
  { label: 'Workspace', href: '/dashboard', icon: Home },
  { label: 'Questions', href: '/questions', icon: CircleHelp },
  { label: 'Notes', href: '/notes', icon: NotebookPen },
  { label: 'Revisions', href: '/revisions', icon: CalendarDays },
  { label: 'Profile', href: '/profile', icon: UserRound },
  { label: 'Settings', href: '/settings', icon: Settings },
];

export const futureNavigation = [
  { label: 'AI Assistant', href: '/ai/assistant', icon: Sparkles },
  { label: 'AI Roadmap', href: '/ai/roadmap', icon: Sparkles },
  { label: 'AI Question Generator', href: '/ai/question-generator', icon: Sparkles },
  { label: 'AI Resume Analyzer', href: '/ai/resume-analyzer', icon: Sparkles },
  { label: 'AI Note Summarizer', href: '/ai/note-summarizer', icon: Sparkles },
  { label: 'AI Interview Simulator', href: '/ai/interview-simulator', icon: Sparkles },
  { label: 'Company Hub', href: '/ai/company-hub', icon: BookOpen },
];
