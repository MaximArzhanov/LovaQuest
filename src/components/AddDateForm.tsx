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
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";

export function AddDateForm() {
  const { addDate } = useApp();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tags: [] as string[],
    location: "",
    budget: "",
    difficulty: 1 as 1 | 2 | 3,
    newTag: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) return;

    setIsSubmitting(true);
    try {
      await addDate({
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        tags: formData.tags,
        location: formData.location.trim() || undefined,
        budget: formData.budget ? Number(formData.budget) : undefined,
        difficulty: formData.difficulty,
        userId: "", // Будет установлено в контексте
        partnerId: undefined,
        createdBy: "", // Будет установлено в контексте
      });

      // Сброс формы только при успешном создании
      setFormData({
        title: "",
        description: "",
        tags: [],
        location: "",
        budget: "",
        difficulty: 1,
        newTag: "",
      });
      setOpen(false);
    } catch (error) {
      console.error("Ошибка при создании свидания:", error);
      // Здесь можно добавить уведомление об ошибке
      // Форма не закрывается при ошибке, чтобы пользователь мог исправить данные
    } finally {
      setIsSubmitting(false);
    }
  };

  const addTag = () => {
    if (
      formData.newTag.trim() &&
      !formData.tags.includes(formData.newTag.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, prev.newTag.trim()],
        newTag: "",
      }));
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105">
          <Plus className="h-4 w-4 mr-2" />
          {t("dates.addDate")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-modern-xl rounded-2xl sm:rounded-3xl p-0 animate-modal-fade-in">
        <DialogHeader className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-lg sm:rounded-xl">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {t("dates.newDate")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("dates.dateTitle")} *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t("dates.dateTitlePlaceholder")}
              required
              className="input-modern focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("dates.description")}
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("dates.dateDescriptionPlaceholder")}
              rows={3}
              className="input-modern focus:border-pink-400 focus:ring-2 focus:ring-pink-100 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("dates.tags")}
            </label>
            <div className="flex gap-2">
              <Input
                type="text"
                value={formData.newTag}
                onChange={(e) =>
                  setFormData({ ...formData, newTag: e.target.value })
                }
                onKeyPress={handleKeyPress}
                placeholder={t("dates.addTag")}
                className="input-modern focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
              <Button
                type="button"
                onClick={addTag}
                variant="outline"
                className="border-2 border-gray-300 hover:border-pink-400 text-gray-700 hover:text-pink-600 font-medium rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
              >
                {t("common.add")}
              </Button>
            </div>
            {formData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.tags.map((tag, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-gradient-to-r from-pink-100 to-purple-100 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium shadow-modern hover:shadow-modern-lg transition-all duration-300 group"
                  >
                    <span>{tag}</span>
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="text-gray-500 hover:text-red-600 transition-colors duration-200 group-hover:scale-110"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                {t("dates.location")}
              </label>
              <Input
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                placeholder={t("dates.locationPlaceholder")}
                className="input-modern focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                {t("dates.budget")}
              </label>
              <Input
                type="number"
                value={formData.budget}
                onChange={(e) =>
                  setFormData({ ...formData, budget: e.target.value })
                }
                placeholder={t("dates.budgetPlaceholder")}
                min="0"
                className="input-modern focus:border-pink-400 focus:ring-2 focus:ring-pink-100"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("dates.difficulty")}
            </label>
            <div className="flex gap-3">
              {[1, 2, 3].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      difficulty: level as 1 | 2 | 3,
                    }))
                  }
                  className={`flex-1 py-3 px-4 rounded-xl border-2 font-medium transition-all duration-300 transform hover:scale-105 ${
                    formData.difficulty === level
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white border-pink-500 shadow-modern-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:border-pink-400 hover:text-pink-600 hover:bg-pink-50 shadow-modern"
                  }`}
                >
                  {level} {t(`dates.difficultyPoints${level}`)}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  {t("common.loading")}
                </div>
              ) : (
                t("dates.addDate")
              )}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

