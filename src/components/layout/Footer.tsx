import { LinkedinLogo, XLogo, InstagramLogo } from '@phosphor-icons/react';

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bamidele-tewogbade/', icon: 'linkedin' },
  { label: 'X', href: 'https://x.com/_tewogbade', icon: 'x' },
  { label: 'Instagram', href: 'https://instagram.com/tewogbadebamidele', icon: 'instagram' },
];

function SocialIcon({ name, size = 16 }: { name: string; size?: number }) {
  const s = size;
  const color = 'currentColor';
  if (name === 'linkedin') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect x="2" y="9" width="4" height="12" />
        <circle cx="4" cy="4" r="2" />
      </svg>
    );
  }
  if (name === 'x') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill={color}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
    );
  }
  if (name === 'instagram') {
    return (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
        <circle cx="12" cy="12" r="5" />
        <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }
  return null;
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 py-6 sm:py-8 mt-auto">
      <div className="w-full px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Built with care by{' '}
              <a
                href="https://www.linkedin.com/in/bamidele-tewogbade/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground hover:underline underline-offset-2"
              >
                Bamidele Tewogbade
              </a>
            </p>
            <p className="text-xs text-muted-foreground/50 mt-1">
              Powered by NVIDIA NIM
            </p>
          </div>
          <div className="flex items-center gap-3.5">
            {socials.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-muted-foreground/50 hover:text-foreground transition-colors"
              >
                <SocialIcon name={s.icon} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}