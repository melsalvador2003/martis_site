export interface WaitlistContact {
  id: number;
  nome: string;
  email: string;
  created_at: string;
}

export interface ProductPillar {
  id: string;
  title: string;
  tagline: string;
  description: string;
  bullets: string[];
}

export interface HowItWorksStep {
  stepNumber: string;
  title: string;
  tagline: string;
  description: string;
  detail: string;
}

export interface BusinessPlan {
  id: string;
  name: string;
  type: "HaaS" | "Venda" | "Risco Mutuo";
  priceText: string;
  period: string;
  description: string;
  features: string[];
  ctaText: string;
  badge?: string;
  popular?: boolean;
}
