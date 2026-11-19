export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds?: number | null;
  baths?: number | null;
  sqft?: string | null;
  image: string;
  images?: string[];
  tag?: string | null;
  type: string;
  category?: string;
  description: string;
  highlights?: string[];
  locationAdvantages?: string[];
  pricingOptions?: { size: string; price: string }[];
  installmentPlan?: string;
  bestFor?: string;
  whatYouCanBuild?: string[];
  isCampaign?: boolean;
  brochureUrl?: string;
  shortLetDetails?: {
    checkIn?: string;
    checkOut?: string;
    guestCapacity?: number;
    nightlyRate?: number;
    pricePerNight?: number;
    cautionDeposit?: number;
    maxGuests?: number;
    sleepingArrangements?: string;
    instantBooking?: boolean;
    blockedDates?: string[];
  };
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
  sessionVersion: number; 
}

export interface SessionPayload {
  adminId: string;
  adminEmail: string;
  adminName: string;
  role: string;
  sessionVersion: number; 
  expiresAt: Date;
}
