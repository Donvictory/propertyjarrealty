import { NextRequest, NextResponse } from 'next/server';
import { getAllAdmins, createAdmin, deleteAdmin } from '@/lib/admins';
import { getSession } from '@/lib/session';

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const admins = await getAllAdmins();
  return NextResponse.json(admins);
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden — super admin only' }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { name, email, password, role } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ error: 'name, email, and password are required' }, { status: 400 });
    }
    const admin = await createAdmin({ name, email, password, role });
    return NextResponse.json(admin, { status: 201 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal server error';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getSession();
  if (!session || session.role !== 'super_admin') {
    return NextResponse.json({ error: 'Forbidden — super admin only' }, { status: 403 });
  }

  try {
    const { id } = await request.json();
    if (!id) return NextResponse.json({ error: 'id is required' }, { status: 400 });
    if (id === session.adminId) {
      return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
    }
    const deleted = await deleteAdmin(id);
    if (!deleted) return NextResponse.json({ error: 'Admin not found' }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
