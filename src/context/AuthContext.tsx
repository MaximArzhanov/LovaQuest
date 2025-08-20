"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import { AuthUser, AuthState } from "@/types";

interface AuthContextType extends AuthState {
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: { name?: string; avatar?: string }) => Promise<void>;
  refreshUserProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // Получаем текущую сессию
    const getSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const user = await getUserProfile(session.user.id);
        setState({
          user,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    };

    getSession();

    // Слушаем изменения авторизации
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Игнорируем TOKEN_REFRESHED и USER_UPDATED
      if (event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
        return;
      }

      if (event === "SIGNED_OUT") {
        setState({
          user: null,
          loading: false,
          error: null,
        });
        return;
      }

      if (session?.user) {
        const user = await getUserProfile(session.user.id);
        setState({
          user,
          loading: false,
          error: null,
        });
      } else {
        setState({
          user: null,
          loading: false,
          error: null,
        });
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const getUserProfile = async (userId: string): Promise<AuthUser | null> => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        // Если профиль не найден, создаем его
        if (error.code === "PGRST116") {
          const { data: userData } = await supabase.auth.getUser();
          if (userData.user) {
            const { error: insertError } = await supabase
              .from("profiles")
              .insert([
                {
                  id: userId,
                  email: userData.user.email!,
                  name: userData.user.user_metadata?.name || "Пользователь",
                  created_at: new Date().toISOString(),
                },
              ]);

            if (insertError) {
              console.error("Error creating profile:", insertError);
              return null;
            }

            // Получаем созданный профиль
            const { data: newProfile, error: selectError } = await supabase
              .from("profiles")
              .select("*")
              .eq("id", userId)
              .single();

            if (selectError) {
              console.error("Error fetching new profile:", selectError);
              return null;
            }

            return {
              id: newProfile.id,
              email: newProfile.email,
              name: newProfile.name,
              avatar: newProfile.avatar,
              points: newProfile.points || 0,
            };
          }
        }
        throw error;
      }

      return {
        id: data.id,
        email: data.email,
        name: data.name,
        avatar: data.avatar,
        points: data.points || 0,
      };
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Создаем профиль пользователя
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            id: data.user.id,
            email: data.user.email!,
            name,
            created_at: new Date().toISOString(),
          },
        ]);

        if (profileError) throw profileError;
      }

      // Сбрасываем loading состояние
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setState((prev) => ({ ...prev, loading: true, error: null }));

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Сбрасываем loading состояние
      setState((prev) => ({ ...prev, loading: false }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: error.message,
      }));
    }
  };

  const signOut = async () => {
    console.log("AuthContext signOut called");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Supabase signOut successful");
    } catch (error: any) {
      console.error("Error during sign out:", error);
    }
  };

  const updateProfile = async (updates: { name?: string; avatar?: string }) => {
    try {
      if (!state.user) throw new Error("No user logged in");

      const { error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", state.user.id);

      if (error) throw error;

      // Обновляем локальное состояние
      setState((prev) => ({
        ...prev,
        user: prev.user ? { ...prev.user, ...updates } : null,
      }));
    } catch (error: any) {
      setState((prev) => ({
        ...prev,
        error: error.message,
      }));
    }
  };

  const refreshUserProfile = async () => {
    try {
      if (!state.user) return;

      const user = await getUserProfile(state.user.id);
      if (user) {
        setState((prev) => ({
          ...prev,
          user,
        }));
      }
    } catch (error: any) {
      console.error("Error refreshing user profile:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signUp,
        signIn,
        signOut,
        updateProfile,
        refreshUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
