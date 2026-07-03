import { Link, useLocation } from 'react-router-dom';
import { Moon, Sun, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  isDark: boolean;
  onToggleDark: () => void;
}

export function Navbar({ isDark, onToggleDark }: NavbarProps) {
  const location = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-sm bg-white/80 dark:bg-stone-900/80 border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-foreground hover:opacity-80 transition-opacity">
            <FileText className="w-5 h-5 text-primary" />
            CV Insight AI
          </Link>
          <div className="flex items-center gap-2">
            {location.pathname === '/' && (
              <Link to="/upload">
                <Button size="sm">Upload Resume</Button>
              </Link>
            )}
            <Button variant="ghost" size="icon" onClick={onToggleDark} aria-label="Toggle dark mode">
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}