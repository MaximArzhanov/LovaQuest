"use client";

import React, { useState, useRef } from "react";
import { User, Camera, Moon, Sun, Save, CheckCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { PasswordDialog } from "./PasswordDialog";
import { AvatarViewer } from "./AvatarViewer";
import { LanguageSelector } from "./LanguageSelector";
import { User as UserType } from "@/types";

interface AccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType;
}

export function AccountDialog({
  open,
  onOpenChange,
  user,
}: AccountDialogProps) {
  const { updateProfile } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    avatar: user?.avatar || "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showAvatarViewer, setShowAvatarViewer] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      await updateProfile(formData);
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Ошибка при обновлении профиля:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarClick = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    } else if (formData.avatar) {
      setShowAvatarViewer(true);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Проверяем размер файла (максимум 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Файл слишком большой. Максимальный размер: 5MB");
        return;
      }

      // Проверяем тип файла
      if (!file.type.startsWith("image/")) {
        alert("Пожалуйста, выберите изображение");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Создаем canvas для обработки изображения
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return;

          // Устанавливаем размер canvas (96x96 для лучшего качества)
          canvas.width = 96;
          canvas.height = 96;

          // Настраиваем качество рендеринга
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";

          // Рисуем изображение в canvas
          ctx.drawImage(img, 0, 0, 96, 96);

          // Получаем результат в высоком качестве (PNG для лучшего качества)
          const result = canvas.toDataURL("image/png");
          setFormData({ ...formData, avatar: result });
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      avatar: user?.avatar || "",
    });
    setIsEditing(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-modern-xl rounded-2xl sm:rounded-3xl p-0 animate-modal-fade-in">
        <DialogHeader className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg sm:rounded-xl">
              <User className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {t("profile.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-6 sm:space-y-8">
          {/* Профиль пользователя */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                {t("profile.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Аватар */}
              <div className="flex flex-col items-center gap-4 sm:gap-6">
                <div className="relative group">
                  <div
                    className={`w-20 h-20 sm:w-28 sm:h-28 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl sm:rounded-3xl flex items-center justify-center text-white font-bold text-xl sm:text-3xl overflow-hidden ${
                      isEditing
                        ? "cursor-pointer hover:scale-105 transition-transform duration-300"
                        : formData.avatar
                        ? "cursor-pointer hover:scale-105 transition-transform duration-300"
                        : ""
                    }`}
                    onClick={handleAvatarClick}
                    style={{
                      boxShadow: "0 8px 32px rgba(236, 72, 153, 0.3)",
                      border: "3px solid white",
                    }}
                  >
                    {formData.avatar ? (
                      <img
                        src={formData.avatar}
                        alt={formData.name}
                        className="w-20 h-20 sm:w-28 sm:h-28 rounded-2xl sm:rounded-3xl object-cover"
                        style={{
                          imageRendering: "crisp-edges",
                        }}
                      />
                    ) : (
                      formData.name.charAt(0).toUpperCase()
                    )}
                  </div>

                  {isEditing && (
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-modern">
                      <Camera className="h-4 w-4 sm:h-5 sm:w-5" />
                    </div>
                  )}

                  {!isEditing && formData.avatar && (
                    <div className="absolute -bottom-1 -right-1 sm:-bottom-2 sm:-right-2 w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center text-white hover:scale-110 transition-transform duration-300 shadow-modern">
                      <svg
                        className="h-4 w-4 sm:h-5 sm:w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                <div className="text-center">
                  {isEditing ? (
                    <Input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder={t("profile.namePlaceholder")}
                      required
                      className="w-full text-center text-base sm:text-lg font-medium input-modern focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
                    />
                  ) : (
                    <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {user?.name}
                    </h3>
                  )}
                  <p className="text-sm sm:text-base text-gray-600 mt-1 font-medium">
                    {user?.email}
                  </p>
                </div>
              </div>

              {/* Кнопки редактирования */}
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  variant="outline"
                  className="w-full py-2.5 sm:py-3 border-2 border-gray-300 hover:border-pink-400 text-gray-700 hover:text-pink-600 font-medium rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                >
                  {t("common.edit")} {t("profile.title").toLowerCase()}
                </Button>
              ) : (
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full sm:flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {loading ? t("common.loading") : t("common.save")}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                  >
                    {t("common.cancel")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Настройки приложения */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                {t("profile.title")} {t("common.settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              {/* Язык */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl gap-3 sm:gap-0">
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                    {t("profile.language")}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t("profile.language")} {t("common.settings")}
                  </p>
                </div>
                <LanguageSelector />
              </div>
            </CardContent>
          </Card>

          {/* Информация о безопасности */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl font-semibold text-gray-900">
                {t("profile.title")} {t("common.settings")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-xl gap-3 sm:gap-0">
                <div>
                  <h4 className="text-sm sm:text-base font-semibold text-gray-900">
                    {t("auth.changePassword")}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600">
                    {t("auth.changePassword")} {t("common.settings")}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowPasswordDialog(true)}
                  className="w-full sm:w-auto border-2 border-gray-300 hover:border-pink-400 text-gray-700 hover:text-pink-600 font-medium rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                >
                  {t("common.edit")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>

      {/* Уведомление об успешном сохранении */}
      {showSuccess && (
        <div className="fixed top-4 sm:top-6 right-4 sm:right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 sm:px-6 py-3 sm:py-4 rounded-xl sm:rounded-2xl shadow-modern-xl flex items-center gap-2 sm:gap-3 z-50 animate-modal-slide-in">
          <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="text-sm sm:text-base font-medium">
            {t("profile.changesSaved")}!
          </span>
        </div>
      )}

      {/* Диалог изменения пароля */}
      <PasswordDialog
        open={showPasswordDialog}
        onOpenChange={setShowPasswordDialog}
      />

      {/* Диалог просмотра аватара */}
      {formData.avatar && (
        <AvatarViewer
          open={showAvatarViewer}
          onOpenChange={setShowAvatarViewer}
          avatar={formData.avatar}
          name={formData.name}
        />
      )}
    </Dialog>
  );
}
