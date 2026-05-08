export interface Property {
  id: string;
  title: string;
  location: string;
  price: string;
  beds: number;
  baths: number;
  sqft: string;
  image: string;
  tag?: string | null;
  type: string;
  description: string;
}

export interface Admin {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  role: 'super_admin' | 'admin';
  createdAt: string;
}

export interface SessionPayload {
  adminId: string;
  adminEmail: string;
  adminName: string;
  role: string;
  expiresAt: Date;
}
