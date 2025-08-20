"use client";

import React, { useState } from "react";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useLanguage } from "@/context/LanguageContext";

interface PasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordDialog({ open, onOpenChange }: PasswordDialogProps) {
  const { t } = useLanguage();
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Защита от повторных вызовов
    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    // Валидация
    if (!newPassword || !confirmPassword) {
      setError("Все поля обязательны для заполнения");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("Новый пароль должен содержать минимум 6 символов");
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Новые пароли не совпадают");
      setLoading(false);
      return;
    }

    try {
      // Получаем данные пользователя
      const { data: userData } = await supabase.auth.getUser();
      const userEmail = userData.user?.email;

      if (!userEmail) {
        setError("Не удалось получить email пользователя");
        setLoading(false);
        return;
      }

      // Изменяем пароль
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) {
        setError(error.message);
        setLoading(false);
      } else {
        setSuccess(true);
        setNewPassword("");
        setConfirmPassword("");
        setLoading(false);
      }
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Произошла ошибка при изменении пароля";
      setError(errorMessage);
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      setSuccess(false);
      onOpenChange(false);
    }
  };

  const handleReset = () => {
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setSuccess(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] sm:max-w-[450px] bg-white/95 backdrop-blur-xl border-0 shadow-modern-xl rounded-2xl sm:rounded-3xl p-0 animate-modal-fade-in">
        <DialogHeader className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg sm:rounded-xl">
              <Lock className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {t("auth.changePassword")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6"
        >
          {/* Новый пароль */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("auth.newPassword")}
            </label>
            <div className="relative">
              <Input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={t("common.enterNewPassword")}
                className="pr-12 input-modern focus:border-green-400 focus:ring-2 focus:ring-green-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors duration-200 p-1 rounded-lg hover:bg-green-50"
              >
                {showNewPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Подтверждение пароля */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("auth.confirmPassword")}
            </label>
            <div className="relative">
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder={t("common.repeatNewPassword")}
                className="pr-12 input-modern focus:border-green-400 focus:ring-2 focus:ring-green-100"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-600 transition-colors duration-200 p-1 rounded-lg hover:bg-green-50"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Ошибка */}
          {error && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-modern animate-modal-slide-in">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Успех */}
          {success && (
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-modern animate-modal-slide-in">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-green-100 rounded-lg">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                </div>
                <p className="text-green-700 font-medium">
                  {t("profile.passwordChanged")}!
                </p>
              </div>
            </div>
          )}

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            {!success ? (
              <>
                <Button
                  type="submit"
                  className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>{t("common.loading")}</span>
                    </div>
                  ) : (
                    t("auth.changePassword")
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={loading}
                  className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {t("common.cancel")}
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  className="w-full sm:flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                  onClick={handleReset}
                >
                  {t("auth.changePassword")}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                >
                  {t("common.close")}
                </Button>
              </>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
