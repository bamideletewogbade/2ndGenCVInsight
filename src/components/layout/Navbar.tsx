import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface NavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Navbar({ isDark, onToggleDark }: NavbarProps) {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/40">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-14">
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
                  Get Started
                  <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
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
              {isDark ? <Sun className="w-3.5 h-3.5" /> : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}