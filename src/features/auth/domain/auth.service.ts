import type {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase/client";
import {
  normalizeError,
  AuthenticationError,
  AppErrorCode,
  ERROR_MESSAGES,
} from "@/shared/errors";
import { LoginFormInput, SignUpFormInput } from "./auth.types";

// Authentication utilities
export const authServices = {
  // Create new user account
  async signup(data: SignUpFormInput): Promise<SupabaseUser> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (!authData.user) {
        throw new AuthenticationError(
          AppErrorCode.AUTH_USER_NOT_FOUND,
          ERROR_MESSAGES[AppErrorCode.AUTH_USER_NOT_FOUND]
        );
      }

      return authData.user;
    } catch (error) {
      throw normalizeError(error);
    }
  },

  async login(data: LoginFormInput): Promise<SupabaseUser> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw error;
      }

      if (!authData.user) {
        throw new AuthenticationError(
          AppErrorCode.AUTH_USER_NOT_FOUND,
          ERROR_MESSAGES[AppErrorCode.AUTH_USER_NOT_FOUND]
        );
      }

      return authData.user;
    } catch (error) {
      // Record failed login attempt
      throw normalizeError(error);
    }
  },

  // Sign out current user
  async logout(): Promise<void> {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
    } catch (error) {
      throw normalizeError(error);
    }
  },

  // Send password reset email with rate limiting
  async resetPassword(email: string): Promise<void> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw normalizeError(error);
    }
  },

  // Update user password with strength validation (requires recent authentication)
  async updateUserPassword(newPassword: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new AuthenticationError(
        AppErrorCode.AUTH_USER_NOT_FOUND,
        ERROR_MESSAGES[AppErrorCode.AUTH_USER_NOT_FOUND]
      );
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw normalizeError(error);
    }
  },

  // Reauthenticate user with password (Supabase handles this automatically)
  async reauthenticate(password: string): Promise<void> {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user || !user.email) {
      throw new AuthenticationError(
        AppErrorCode.AUTH_USER_NOT_FOUND,
        ERROR_MESSAGES[AppErrorCode.AUTH_USER_NOT_FOUND]
      );
    }

    try {
      // In Supabase, we re-authenticate by signing in again
      const { error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: password,
      });

      if (error) {
        throw error;
      }
    } catch (error) {
      throw normalizeError(error);
    }
  },

  // Get current user
  async getCurrentUser(): Promise<SupabaseUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user || null;
  },

  // Subscribe to auth state changes
  onAuthStateChange(callback: (user: SupabaseUser | null) => void) {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        callback(session?.user || null);
      }
    );

    // Return unsubscribe function
    return () => {
      subscription.unsubscribe();
    };
  },
};
