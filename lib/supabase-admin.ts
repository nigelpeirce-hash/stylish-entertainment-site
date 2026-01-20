/**
 * Supabase Admin Client for User Management
 * This is used for admin operations like inviting users via Supabase Auth
 */

import { createClient } from '@supabase/supabase-js';

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.warn(
    '⚠️  Supabase credentials not found. User invite functionality will not work.\n' +
    'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
  );
}

/**
 * Create Supabase admin client with service role key
 * This has elevated permissions for admin operations
 */
export function getSupabaseAdmin() {
  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Supabase credentials not configured. ' +
      'Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.'
    );
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/**
 * Invite a user by email using Supabase Admin Auth
 */
export async function inviteUserByEmail(
  email: string,
  role: 'admin' | 'user' = 'user',
  options?: {
    redirectTo?: string;
    data?: Record<string, any>;
  }
) {
  const supabase = getSupabaseAdmin();
  
  try {
    // Invite user via Supabase Admin Auth API
    const { data, error } = await supabase.auth.admin.inviteUserByEmail(email, {
      redirectTo: options?.redirectTo || (process.env.NEXT_PUBLIC_SITE_URL ? `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` : '/auth/callback'),
      data: {
        role,
        ...options?.data,
      },
    });

    if (error) {
      throw error;
    }

    return {
      success: true,
      user: data.user,
      inviteUrl: (data.user as any)?.invite_link,
    };
  } catch (error: any) {
    console.error('Error inviting user:', error);
    return {
      success: false,
      error: error.message || 'Failed to invite user',
    };
  }
}

/**
 * Get all users from Supabase Auth
 */
export async function getAllUsers() {
  const supabase = getSupabaseAdmin();
  
  try {
    const { data, error } = await supabase.auth.admin.listUsers();

    if (error) {
      throw error;
    }

    return {
      success: true,
      users: data.users || [],
    };
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      error: error.message || 'Failed to fetch users',
      users: [],
    };
  }
}

/**
 * Update user role in profiles table
 */
export async function updateUserRole(userId: string, role: 'admin' | 'user' | 'client') {
  const supabase = getSupabaseAdmin();
  
  try {
    // Update role in auth metadata
    const { data: authUpdate, error: authError } = await supabase.auth.admin.updateUserById(userId, {
      user_metadata: { role },
    });

    if (authError) {
      throw authError;
    }

    // Update role in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ role })
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    return {
      success: true,
      user: authUpdate.user,
    };
  } catch (error: any) {
    console.error('Error updating user role:', error);
    return {
      success: false,
      error: error.message || 'Failed to update user role',
    };
  }
}

/**
 * Delete a user from Supabase Auth
 */
export async function deleteUser(userId: string) {
  const supabase = getSupabaseAdmin();
  
  try {
    const { error } = await supabase.auth.admin.deleteUser(userId);

    if (error) {
      throw error;
    }

    return {
      success: true,
    };
  } catch (error: any) {
    console.error('Error deleting user:', error);
    return {
      success: false,
      error: error.message || 'Failed to delete user',
    };
  }
}
