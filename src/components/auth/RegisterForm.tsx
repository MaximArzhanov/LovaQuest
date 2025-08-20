"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserPlus, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function RegisterForm() {
  const { signUp, error, loading } = useAuth();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password.trim()
    )
      return;

    if (formData.password !== formData.confirmPassword) {
      return;
    }

    if (formData.password.length < 6) {
      return;
    }

    await signUp(
      formData.email.trim(),
      formData.password,
      formData.name.trim()
    );

    if (!error) {
      setFormData({ name: "", email: "", password: "", confirmPassword: "" });
      setOpen(false);
    }
  };

  const isPasswordValid = formData.password.length >= 6;
  const doPasswordsMatch =
    formData.password === formData.confirmPassword ||
    formData.confirmPassword === "";

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105">
          <UserPlus className="h-4 w-4 mr-2" />
          {t("auth.register")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[500px] bg-white/95 backdrop-blur-xl border-0 shadow-modern-xl rounded-2xl sm:rounded-3xl p-0 animate-modal-fade-in">
        <DialogHeader className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="flex items-center justify-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg sm:rounded-xl">
              <UserPlus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {t("auth.register")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("auth.name")}
            </label>
            <div className="relative">
              <User className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder={t("auth.yourName")}
                className="pl-10 input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("auth.email")}
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder={t("auth.yourEmail")}
                className="pl-10 input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("auth.password")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, password: e.target.value }))
                }
                placeholder={t("auth.passwordPlaceholder")}
                className={`pl-10 pr-12 input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100 ${
                  !isPasswordValid && formData.password
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200 p-1 rounded-lg hover:bg-purple-50"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formData.password && !isPasswordValid && (
              <p className="text-red-600 text-xs mt-2 font-medium">
                {t("auth.password")} {t("common.error")}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("auth.confirmPassword")}
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
              <Input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    confirmPassword: e.target.value,
                  }))
                }
                placeholder={t("auth.passwordPlaceholder")}
                className={`pl-10 pr-12 input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100 ${
                  !doPasswordsMatch && formData.confirmPassword
                    ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                    : ""
                }`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-purple-600 transition-colors duration-200 p-1 rounded-lg hover:bg-purple-50"
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {formData.confirmPassword && !doPasswordsMatch && (
              <p className="text-red-600 text-xs mt-2 font-medium">
                {t("auth.passwordsDoNotMatch")}
              </p>
            )}
          </div>

          {error && (
            <div className="p-4 bg-gradient-to-r from-red-50 to-pink-50 border border-red-200 rounded-xl shadow-modern animate-modal-slide-in">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            disabled={loading || !isPasswordValid || !doPasswordsMatch}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>{t("common.loading")}</span>
              </div>
            ) : (
              t("auth.register")
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
