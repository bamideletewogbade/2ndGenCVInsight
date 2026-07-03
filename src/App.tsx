import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import { ParticleBackground } from '@/components/effects/ParticleBackground';
import { CursorFollower } from '@/components/effects/CursorFollower';
import { LandingPage } from '@/pages/LandingPage';
import { UploadPage } from '@/pages/UploadPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { useDarkMode } from '@/hooks/useDarkMode';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/upload" element={<UploadPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </AnimatePresence>
  );
}

function AppLayout() {
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="min-h-screen flex flex-col relative">
      <ParticleBackground />
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar isDark={isDark} onToggleDark={toggle} />
        <main className="flex-1">
          <AnimatedRoutes />
        </main>
        <Footer />
      </div>
      <CursorFollower />
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  );
}

export default App;