import { Hero } from '@/components/landing/Hero';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { PageTransition } from '@/components/layout/PageTransition';
import { Brain, ChartBar, Eye } from '@phosphor-icons/react';

const features = [
  {
    icon: <Brain size={22} weight="duotone" />,
    title: 'Deep Resume Analysis',
    description: 'Skills extraction, strength identification, and targeted improvement recommendations.',
  },
  {
    icon: <ChartBar size={22} weight="duotone" />,
    title: 'ATS Compatibility Scoring',
    description: 'Estimated ATS score with per-dimension breakdown so you know exactly what to fix.',
  },
  {
    icon: <Eye size={22} weight="duotone" />,
    title: 'AI System Transparency',
    description: 'See the model used, tokens consumed, latency, cost — every metric that matters, explained in plain language.',
  },
];

export function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Hero />
        <section className="max-w-5xl mx-auto px-5 sm:px-8 pb-20">
          <div className="border-t border-border/40 pt-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-8">
              What it does
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-0 divide-y md:divide-y-0 md:divide-x divide-border/40">
              {features.map((feature, i) => (
                <div key={feature.title} className="md:first:pl-0 md:pl-8 first:pt-0 pt-8">
                  <FeatureCard {...feature} index={i} />
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}