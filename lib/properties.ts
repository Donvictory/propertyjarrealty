import 'server-only';
import fs from 'fs';
import path from 'path';
import type { Property } from './types';

const DATA_FILE = path.join(process.cwd(), 'data', 'properties.json');

function readData(): Property[] {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw) as Property[];
  } catch {
    return [];
  }
}

function writeData(properties: Property[]): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(properties, null, 2), 'utf-8');
}

export function getProperties(): Property[] {
  return readData();
}

export function getPropertyById(id: string): Property | undefined {
  return readData().find((p) => p.id === id);
}

export function addProperty(data: Omit<Property, 'id'>): Property {
  const properties = readData();
  const newProperty: Property = {
    ...data,
    id: String(Date.now()),
  };
  properties.push(newProperty);
  writeData(properties);
  return newProperty;
}

export function updateProperty(id: string, data: Partial<Omit<Property, 'id'>>): Property | null {
  const properties = readData();
  const index = properties.findIndex((p) => p.id === id);
  if (index === -1) return null;
  properties[index] = { ...properties[index], ...data };
  writeData(properties);
  return properties[index];
}

export function deleteProperty(id: string): boolean {
  const properties = readData();
  const filtered = properties.filter((p) => p.id !== id);
  if (filtered.length === properties.length) return false;
  writeData(filtered);
  return true;
}
