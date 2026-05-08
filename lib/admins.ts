import 'server-only';
import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import type { Admin } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'admins.json');

function readData(): Admin[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Admin[];
  } catch {
    return [];
  }
}

function writeData(admins: Admin[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(admins, null, 2), 'utf-8');
}

export function getAdminByEmail(email: string): Admin | undefined {
  return readData().find((a) => a.email.toLowerCase() === email.toLowerCase());
}

export function getAdminById(id: string): Admin | undefined {
  return readData().find((a) => a.id === id);
}

export function getAllAdmins(): Omit<Admin, 'passwordHash'>[] {
  return readData().map(({ passwordHash: _, ...rest }) => rest);
}

export async function verifyAdminPassword(
  email: string,
  password: string
): Promise<Admin | null> {
  const admin = getAdminByEmail(email);
  if (!admin) return null;
  const valid = await bcrypt.compare(password, admin.passwordHash);
  return valid ? admin : null;
}

export async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
  role?: 'admin' | 'super_admin';
}): Promise<Omit<Admin, 'passwordHash'>> {
  const admins = readData();
  const exists = admins.find((a) => a.email.toLowerCase() === data.email.toLowerCase());
  if (exists) throw new Error('An admin with this email already exists.');

  const passwordHash = await bcrypt.hash(data.password, 12);
  const newAdmin: Admin = {
    id: String(Date.now()),
    name: data.name,
    email: data.email,
    passwordHash,
    role: data.role ?? 'admin',
    createdAt: new Date().toISOString(),
  };
  admins.push(newAdmin);
  writeData(admins);
  const { passwordHash: _, ...rest } = newAdmin;
  return rest;
}

export function deleteAdmin(id: string): boolean {
  const admins = readData();
  const filtered = admins.filter((a) => a.id !== id);
  if (filtered.length === admins.length) return false;
  writeData(filtered);
  return true;
}
