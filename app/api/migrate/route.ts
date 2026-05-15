import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import fs from 'fs';
import path from 'path';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Unauthorized. Super admin only.' }, { status: 401 });
  }

  try {
    if (!db) {
      return NextResponse.json({ error: 'Database not initialized' }, { status: 500 });
    }
    const results: any = {};

    // Migrate Admins
    const adminsPath = path.join(process.cwd(), 'data', 'admins.json');
    if (fs.existsSync(adminsPath)) {
      const admins = JSON.parse(fs.readFileSync(adminsPath, 'utf-8'));
      for (const admin of admins) {
        const { id, ...data } = admin;
        await db.collection('admins').doc(id).set(data);
      }
      results.admins = `Migrated ${admins.length} admins.`;
    }

    // Migrate Properties
    const propertiesPath = path.join(process.cwd(), 'data', 'properties.json');
    if (fs.existsSync(propertiesPath)) {
      const properties = JSON.parse(fs.readFileSync(propertiesPath, 'utf-8'));
      for (const prop of properties) {
        const { id, ...data } = prop;
        // Default to isCampaign: true if not specified, since these are currently on the campaign page
        await db.collection('properties').doc(id).set({
          ...data,
          id, // Explicitly include id for sorting
          isCampaign: data.isCampaign ?? true
        });
      }
      results.properties = `Migrated ${properties.length} properties.`;
    }

    return NextResponse.json({ success: true, results });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
