import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ArrowUpRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Navbar({ isDark, onToggleDark }: NavbarProps) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        'sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40 transition-shadow',
        scrolled && 'shadow-[0_1px_0_0_var(--border)]'
      )}
    >
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-12 sm:h-14">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-7 h-7 rounded-md bg-foreground flex items-center justify-center">
              <span className="text-background text-xs font-heading font-bold">CV</span>
            </div>
            <span className="font-heading font-semibold text-sm tracking-tight text-foreground">
              CV Insight
            </span>
          </Link>
          <div className="flex items-center gap-1">
            {location.pathname === '/' && (
              <Link to="/upload" className="mr-1">
                <Button size="sm" className="rounded-full gap-1.5 group">
                  <span className="hidden sm:inline">Get Started</span>
                  <ArrowUpRight
                    size={14}
                    weight="regular"
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Button>
              </Link>
            )}
            <button
              onClick={onToggleDark}
              aria-label="Toggle dark mode"
              className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center transition-colors',
                'hover:bg-secondary cursor-pointer'
              )}
            >
              {isDark
                ? <Sun size={14} weight="regular" />
                : <Moon size={14} weight="regular" />
              }
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}