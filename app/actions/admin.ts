'use server';

import { getSession } from '@/lib/session';
import { updateAdminPassword, verifyAdminPassword } from '@/lib/admins';

export async function changePasswordAction(formData: FormData) {
  const session = await getSession();
  if (!session) return { error: 'Unauthorized' };

  const currentPassword = formData.get('currentPassword') as string;
  const newPassword = formData.get('newPassword') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: 'All fields are required.' };
  }

  if (newPassword !== confirmPassword) {
    return { error: 'New passwords do not match.' };
  }

  if (newPassword.length < 8) {
    return { error: 'New password must be at least 8 characters.' };
  }

  // Verify old password
  const admin = await verifyAdminPassword(session.adminEmail, currentPassword);
  if (!admin) {
    return { error: 'Incorrect current password.' };
  }

  try {
    await updateAdminPassword(session.adminId, newPassword);
    return { success: true };
  } catch (err) {
    return { error: 'Failed to update password.' };
  }
}
