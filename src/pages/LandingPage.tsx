import { Link } from 'react-router-dom';
import { Hero } from '@/components/landing/Hero';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { PageTransition } from '@/components/layout/PageTransition';
import { Brain, ChartBar, Eye, CloudArrowUp, ArrowsClockwise, ArrowUpRight } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

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

const steps = [
  {
    number: '01',
    icon: <CloudArrowUp size={24} weight="duotone" />,
    title: 'Upload',
    description: 'Drop your PDF or DOCX resume',
  },
  {
    number: '02',
    icon: <Brain size={24} weight="duotone" />,
    title: 'Analyze',
    description: 'AI evaluates skills, ATS score, and more',
  },
  {
    number: '03',
    icon: <ArrowsClockwise size={24} weight="duotone" />,
    title: 'Improve',
    description: 'Get detailed, actionable feedback',
  },
];

export function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Hero />

        {/* How It Works */}
        <section className="max-w-5xl mx-auto w-full px-4 sm:px-8 pb-16 sm:pb-20">
          <div className="border-t border-border/40 pt-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-10">
              How It Works
            </p>
            <div className="flex flex-col sm:flex-row sm:items-start gap-0">
              {steps.map((step, i) => (
                <div key={step.number} className="flex-1">
                  {/* Vertical connector on mobile, horizontal on desktop */}
                  {i > 0 && (
                    <div className="sm:hidden flex justify-center py-4">
                      <div className="w-px h-8 bg-border/40" />
                    </div>
                  )}
                  {i > 0 && (
                    <div className="hidden sm:flex items-center w-full">
                      <div className="border-t border-dashed border-border/40 w-full" />
                    </div>
                  )}
                  <div className="flex sm:flex-col gap-4 sm:gap-0 sm:items-center sm:text-center">
                    <div className="flex-shrink-0">
                      <span className="text-[11px] font-mono text-muted-foreground">
                        {step.number}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="text-foreground/70">
                        {step.icon}
                      </div>
                    </div>
                    <div className="flex-1 sm:mt-3">
                      <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="max-w-5xl mx-auto w-full px-4 sm:px-8 pb-16 sm:pb-20">
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

        {/* Bottom CTA */}
        <section className="max-w-5xl mx-auto w-full px-4 sm:px-8 pb-16 sm:pb-20">
          <div className="border-t border-border/40 pt-16 sm:pt-20 flex flex-col items-center text-center">
            <h2 className="font-heading text-[clamp(1.25rem,4vw,1.75rem)] font-bold leading-tight tracking-[-0.02em] text-foreground max-w-md">
              Ready to see how your resume scores?
            </h2>
            <div className="mt-6">
              <Link to="/upload">
                <Button
                  size="lg"
                  className="rounded-full gap-2 group"
                >
                  Analyze Your Resume
                  <ArrowUpRight
                    size={14}
                    weight="regular"
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}