export const colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
  },
  accent: {
    400: '#fbbf24',
    500: '#f59e0b',
  },
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#6366f1',
};

export const skillCategoryColors: Record<string, string> = {
  'Programming Languages': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Frameworks': 'bg-violet-100 text-violet-800 dark:bg-violet-900/30 dark:text-violet-300',
  'Cloud': 'bg-sky-100 text-sky-800 dark:bg-sky-900/30 dark:text-sky-300',
  'Databases': 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300',
  'AI/ML': 'bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/30 dark:text-fuchsia-300',
  'Soft Skills': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  'Tools': 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300',
};

export const atsScoreColor = (score: number): string => {
  if (score >= 70) return 'text-green-500';
  if (score >= 50) return 'text-amber-500';
  return 'text-red-500';
};

export const atsStrokeColor = (score: number): string => {
  if (score >= 70) return '#22c55e';
  if (score >= 50) return '#f59e0b';
  return '#ef4444';
};

export const animation = {
  stagger: 0.05,
  fadeUp: {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
  tooltip: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: { duration: 0.15 },
  },
};