import type {
  AuthChangeEvent,
  Session,
  User as SupabaseUser,
} from "@supabase/supabase-js";
import {
  normalizeError,
  AuthenticationError,
  AppErrorCode,
  ERROR_MESSAGES,
} from "@/shared/errors";
import { LoginFormInput, SignUpFormInput } from "./auth.types";
import { User } from "@clerk/nextjs/server";

// Authentication utilities
export class AuthService {
  // Create new user account
  async signup(data: SignUpFormInput): Promise<User | null> {
    // try {
    //   const { data: authData, error } = await supabase.auth.signUp({
    //     email: data.email,
    //     password: data.password,
    //     options: {
    //       data: {
    //         full_name: `${data.firstName} ${data.lastName}`,
    //       }
    //     }
    //   });

    //   if (error) {
    //     throw error;
    //   }

    //   if (!authData.user) {
    //     throw new AuthenticationError(
    //       AppErrorCode.AUTH_USER_NOT_FOUND,
    //       ERROR_MESSAGES[AppErrorCode.AUTH_USER_NOT_FOUND]
    //     );
    //   }

    //   return authData.user;
    // } catch (error) {
    //   throw normalizeError(error);
    // }
    return null;
  }

  async login(data: LoginFormInput): Promise<User | null> {
    // try {
    //   const { data: authData, error } = await supabase.auth.signInWithPassword({
    //     email: data.email,
    //     password: data.password,
    //   });

    //   if (error) {
    //     throw error;
    //   }

    //   if (!authData.user) {
    //     throw new AuthenticationError(
    //       AppErrorCode.AUTH_USER_NOT_FOUND,
    //       ERROR_MESSAGES[AppErrorCode.AUTH_USER_NOT_FOUND]
    //     );
    //   }

    //   return authData.user;
    // } catch (error) {
    //   // Record failed login attempt
    //   throw normalizeError(error);
    // }
    return null;
  }

  // Sign out current user
  async logout(): Promise<void> {
    // try {
    //   const { error } = await supabase.auth.signOut();
    //   if (error) {
    //     throw error;
    //   }
    // } catch (error) {
    //   throw normalizeError(error);
    // }
  }

  // Send password reset email with rate limiting
  async resetPassword(email: string): Promise<void> {
    // try {
    //   const { error } = await supabase.auth.resetPasswordForEmail(email, {
    //     redirectTo: `${window.location.origin}/auth/reset-password`,
    //   });
    //   if (error) {
    //     throw error;
    //   }
    // } catch (error) {
    //   throw normalizeError(error);
    // }
  }

  // Get current user
  async getCurrentUser(): Promise<User | null> {
    // const {
    //   data: { user }
    // } = await supabase.auth.getUser();
    // return user || null;
    return null;
  }
}

export const authService = new AuthService();
