import { Link } from 'react-router-dom';
import { Hero } from '@/components/landing/Hero';
import { FeatureCard } from '@/components/landing/FeatureCard';
import { PageTransition } from '@/components/layout/PageTransition';
import {
  Brain, ChartBar, Eye, CloudArrowUp, ArrowsClockwise,
  ArrowUpRight,
} from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: <Brain size={22} weight="duotone" />,
    title: 'Deep Analysis',
    description: 'Skills extraction, strength identification, and targeted improvement recommendations from a 3-model AI pipeline.',
  },
  {
    icon: <ChartBar size={22} weight="duotone" />,
    title: 'ATS Scoring',
    description: 'Estimated compatibility score across 6 dimensions — formatting, keywords, readability, experience, skills, consistency.',
  },
  {
    icon: <Eye size={22} weight="duotone" />,
    title: 'Full Transparency',
    description: 'Model used, tokens consumed, latency, cost — every metric visible and explained. No black box.',
  },
];

const steps = [
  { number: '01', icon: <CloudArrowUp size={22} weight="duotone" />, title: 'Upload', desc: 'Drop your PDF or DOCX' },
  { number: '02', icon: <Brain size={22} weight="duotone" />, title: 'Analyze', desc: 'AI evaluates your resume in seconds' },
  { number: '03', icon: <ArrowsClockwise size={22} weight="duotone" />, title: 'Improve', desc: 'Act on specific, prioritized feedback' },
];

const socials = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/bamidele-tewogbade/', icon: <LinkedinLogo size={18} weight="regular" /> },
  { label: 'X', href: 'https://x.com/_tewogbade', icon: <XLogo size={18} weight="regular" /> },
  { label: 'Instagram', href: 'https://instagram.com/tewogbadebamidele', icon: <InstagramLogo size={18} weight="regular" /> },
];

export function LandingPage() {
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col">
        <Hero />

        {/* How It Works — full width */}
        <section className="w-full px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div className="border-t border-border/40 pt-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-10">
              How It Works
            </p>
            <div className="flex flex-col sm:flex-row sm:items-start gap-0">
              {steps.map((step, i) => (
                <div key={step.number} className="flex-1">
                  {i > 0 && (
                    <>
                      <div className="sm:hidden flex justify-center py-3">
                        <div className="w-px h-6 bg-border/40" />
                      </div>
                      <div className="hidden sm:flex items-center w-full">
                        <div className="border-t border-dashed border-border/40 w-full" />
                      </div>
                    </>
                  )}
                  <div className="flex sm:flex-col gap-4 sm:gap-0 sm:items-center sm:text-center">
                    <span className="text-[11px] font-mono text-muted-foreground shrink-0">
                      {step.number}
                    </span>
                    <div className="text-foreground/70 shrink-0">{step.icon}</div>
                    <div className="flex-1 sm:mt-3">
                      <h3 className="font-heading text-sm font-semibold tracking-tight text-foreground">
                        {step.title}
                      </h3>
                      <p className="text-[13px] text-muted-foreground leading-relaxed mt-1">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features — full width */}
        <section className="w-full px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div className="border-t border-border/40 pt-12">
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted-foreground mb-8">
              What It Does
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
        <section className="w-full px-5 sm:px-8 lg:px-12 pb-16 sm:pb-20">
          <div className="border-t border-border/40 pt-14 sm:pt-20 flex flex-col items-center text-center">
            <h2 className="font-heading text-[clamp(1.25rem,4vw,1.75rem)] font-bold leading-tight tracking-[-0.02em] text-foreground max-w-md">
              Ready to see how your resume scores?
            </h2>
            <div className="mt-6">
              <Link to="/upload">
                <Button size="lg" className="rounded-full gap-2 group">
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