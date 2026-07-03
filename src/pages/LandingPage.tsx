import { Hero } from '@/components/landing/Hero';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { PageTransition } from '@/components/layout/PageTransition';
import { Brain, BarChart3, Eye } from 'lucide-react';

const features = [
  {
    icon: <Brain className="w-5 h-5" />,
    title: 'Deep Resume Analysis',
    description: 'Skills extraction, strength identification, and targeted improvement recommendations.',
  },
  {
    icon: <BarChart3 className="w-5 h-5" />,
    title: 'ATS Compatibility Scoring',
    description: 'Estimated ATS score with per-dimension breakdown so you know exactly what to fix.',
  },
  {
    icon: <Eye className="w-5 h-5" />,
    title: 'AI System Transparency',
    description: 'See the model used, tokens consumed, latency, cost — every metric that matters in production AI, explained in plain language.',
  },
];

export function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Hero />
        <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <FeatureCard key={feature.title} {...feature} index={i} />
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
}