export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  sqft?: string;
  image: string;
  tag?: string | null;
  type: string;
  description: string;
  highlights?: string[];
  locationAdvantages?: string[];
  pricingOptions?: { size: string; price: string }[];
  installmentPlan?: string;
  bestFor?: string;
  whatYouCanBuild?: string[];
  isCampaign?: boolean;
  brochureUrl?: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  sessionVersion: number; // incremented on password change to invalidate sessions
}

export interface SessionPayload {
  adminId: string;
  adminEmail: string;
  adminName: string;
  role: string;
  sessionVersion: number; // must match Admin.sessionVersion in Firestore
  expiresAt: Date;
}
