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
import { Plus, Calendar } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { Prize } from "@/types";

export function AddPrizeForm() {
  const { state, addPrize } = useApp();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    type: "specific" as Prize["type"],
    specificDateId: "",
    countThreshold: "",
    pointsThreshold: "",
    isRepeatable: false,
    expiresAt: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.description.trim()) return;

    const conditions: Prize["conditions"] = {};

    switch (formData.type) {
      case "specific":
        if (!formData.specificDateId) return;
        conditions.specificDateId = formData.specificDateId;
        break;
      case "count":
        if (!formData.countThreshold) return;
        conditions.countThreshold = Number(formData.countThreshold);
        break;
      case "points":
        if (!formData.pointsThreshold) return;
        conditions.pointsThreshold = Number(formData.pointsThreshold);
        break;
    }

    await addPrize({
      title: formData.title.trim(),
      description: formData.description.trim(),
      type: formData.type,
      conditions,
      isRepeatable: formData.isRepeatable,
      expiresAt: formData.expiresAt ? new Date(formData.expiresAt) : undefined,
      userId: "", // Будет установлено в контексте
      partnerId: undefined,
    });

    // Сброс формы
    setFormData({
      title: "",
      description: "",
      type: "specific",
      specificDateId: "",
      countThreshold: "",
      pointsThreshold: "",
      isRepeatable: false,
      expiresAt: "",
    });
    setOpen(false);
  };

  const availableDates = state.dates.filter((date) => !date.completed);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full sm:w-auto border-2 border-purple-300 text-purple-700 hover:border-purple-400 hover:text-purple-800 hover:bg-purple-50 font-medium py-2.5 sm:py-3 px-4 sm:px-6 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("prizes.addPrize")}
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] sm:max-w-[500px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-modern-xl rounded-2xl sm:rounded-3xl p-0 animate-modal-fade-in">
        <DialogHeader className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg sm:rounded-xl">
              <Plus className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {t("prizes.newPrize")}
          </DialogTitle>
        </DialogHeader>

        <form
          onSubmit={handleSubmit}
          className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("prizes.prizeTitle")} *
            </label>
            <Input
              type="text"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder={t("prizes.prizeTitlePlaceholder")}
              required
              className="input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("prizes.description")} *
            </label>
            <Textarea
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder={t("prizes.prizeDescriptionPlaceholder")}
              rows={3}
              required
              className="input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100 resize-none"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("prizes.type")} *
            </label>
            <div className="grid grid-cols-1 gap-3">
              {[
                { value: "specific", label: t("prizes.typeSpecific") },
                { value: "count", label: t("prizes.typeCount") },
                { value: "points", label: t("prizes.typePoints") },
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      type: type.value as Prize["type"],
                    }))
                  }
                  className={`text-left p-4 rounded-xl border-2 font-medium transition-all duration-300 transform hover:scale-105 ${
                    formData.type === type.value
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-purple-500 shadow-modern-lg"
                      : "bg-white text-gray-700 border-gray-300 hover:border-purple-400 hover:text-purple-600 hover:bg-purple-50 shadow-modern"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Условия в зависимости от типа */}
          {formData.type === "specific" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                {t("prizes.selectDate")} *
              </label>
              <select
                value={formData.specificDateId}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    specificDateId: e.target.value,
                  }))
                }
                className="w-full p-3 border-2 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-2 focus:ring-purple-100 bg-white text-gray-900 transition-all duration-300"
                required
              >
                <option value="">{t("prizes.selectDatePlaceholder")}</option>
                {availableDates.map((date) => (
                  <option key={date.id} value={date.id}>
                    {date.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          {formData.type === "count" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                {t("prizes.countThreshold")} *
              </label>
              <Input
                type="number"
                value={formData.countThreshold}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    countThreshold: e.target.value,
                  }))
                }
                placeholder={t("prizes.countThresholdPlaceholder")}
                min="1"
                required
                className="input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          )}

          {formData.type === "points" && (
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900">
                {t("prizes.pointsThreshold")} *
              </label>
              <Input
                type="number"
                value={formData.pointsThreshold}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    pointsThreshold: e.target.value,
                  }))
                }
                placeholder={t("prizes.pointsThresholdPlaceholder")}
                min="1"
                required
                className="input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
              />
            </div>
          )}

          <div className="flex items-center gap-3 p-4 bg-purple-50 rounded-xl">
            <input
              type="checkbox"
              id="isRepeatable"
              checked={formData.isRepeatable}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  isRepeatable: e.target.checked,
                }))
              }
              className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500 transition-all duration-200"
            />
            <label
              htmlFor="isRepeatable"
              className="text-sm font-semibold text-gray-900 cursor-pointer"
            >
              {t("prizes.isRepeatable")}
            </label>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              {t("prizes.expiresAtOptional")}
            </label>
            <Input
              type="date"
              value={formData.expiresAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, expiresAt: e.target.value }))
              }
              min={new Date().toISOString().split("T")[0]}
              className="input-modern focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-6">
            <Button
              type="submit"
              className="w-full sm:flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
            >
              {t("prizes.addPrize")}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              className="w-full sm:w-auto border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
            >
              {t("common.cancel")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
