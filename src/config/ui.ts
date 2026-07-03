export const colors = {
  primary: {
    DEFAULT: '#171717',
    foreground: '#fafafa',
  },
  accent: {
    DEFAULT: '#171717',
    foreground: '#fafafa',
  },
  success: '#16a34a',
  warning: '#ca8a04',
  danger: '#dc2626',
  info: '#171717',
};

export const skillCategoryColors: Record<string, string> = {
  'Programming Languages': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
  'Frameworks': 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800/70 dark:text-neutral-300',
  'Cloud': 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800/50 dark:text-neutral-400',
  'Databases': 'bg-neutral-50 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
  'AI/ML': 'bg-neutral-100 text-neutral-800 dark:bg-neutral-800 dark:text-neutral-200',
  'Soft Skills': 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800/60 dark:text-neutral-300',
  'Tools': 'bg-neutral-50 text-neutral-600 dark:bg-neutral-800/40 dark:text-neutral-400',
};

export const atsScoreColor = (score: number): string => {
  if (score >= 70) return 'text-green-600 dark:text-green-400';
  if (score >= 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

export const atsStrokeColor = (score: number): string => {
  if (score >= 70) return '#16a34a';
  if (score >= 50) return '#ca8a04';
  return '#dc2626';
};

export const animation = {
  stagger: 0.06,
  fadeUp: {
    initial: { opacity: 0, y: 16 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] as const },
  },
  tooltip: {
    initial: { opacity: 0, y: 4 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 4 },
    transition: { duration: 0.15 },
  },
};