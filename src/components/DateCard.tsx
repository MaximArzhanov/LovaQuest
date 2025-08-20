"use client";

import React, { useState } from "react";
import {
  Heart,
  MapPin,
  DollarSign,
  Calendar,
  CheckCircle,
  RotateCcw,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/context/AppContext";
import { useLanguage } from "@/context/LanguageContext";
import { DateItem } from "@/types";

interface DateCardProps {
  date: DateItem;
}

export function DateCard({ date }: DateCardProps) {
  const { updateDate } = useApp();
  const { t } = useLanguage();
  const [isCompleting, setIsCompleting] = useState(false);
  const [isUndoing, setIsUndoing] = useState(false);
  const [notes, setNotes] = useState("");

  const handleComplete = async () => {
    if (!notes.trim()) return;

    setIsCompleting(true);
    try {
      await updateDate(date.id, {
        ...date,
        completed: true,
        completedAt: new Date(),
      });
      setNotes(""); // Очищаем заметки после успешного завершения
    } catch (error) {
      console.error("Ошибка при завершении свидания:", error);
      // Здесь можно добавить уведомление об ошибке
    } finally {
      setIsCompleting(false);
    }
  };

  const handleUndo = async () => {
    setIsUndoing(true);
    try {
      await updateDate(date.id, {
        ...date,
        completed: false,
        completedAt: undefined,
      });
      setNotes("");
    } catch (error) {
      console.error("Ошибка при отмене завершения свидания:", error);
      // Здесь можно добавить уведомление об ошибке
    } finally {
      setIsUndoing(false);
    }
  };

  const getDifficultyColor = (difficulty: number) => {
    switch (difficulty) {
      case 1:
        return "bg-green-100 text-green-800";
      case 2:
        return "bg-yellow-100 text-yellow-800";
      case 3:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyText = (difficulty: number) => {
    const points = difficulty === 1 ? 1 : difficulty;
    if (difficulty === 1) return `${points} ${t("dates.difficultyPoints1")}`;
    if (difficulty === 2) return `${points} ${t("dates.difficultyPoints2")}`;
    return `${points} ${t("dates.difficultyPoints3")}`;
  };

  return (
    <Card
      className={`group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 transition-all duration-300 hover-lift ${
        date.completed
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-modern-lg"
          : "hover:shadow-modern-lg"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {date.title}
          </CardTitle>
          <Badge
            className={`ml-2 flex-shrink-0 badge-modern ${getDifficultyColor(
              date.difficulty
            )} group-hover:scale-105 transition-transform duration-300`}
          >
            {getDifficultyText(date.difficulty)}
          </Badge>
        </div>

        {date.description && (
          <p className="text-gray-600 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {date.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Детали свидания */}
        <div className="space-y-3">
          {date.location && (
            <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <MapPin className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span>{date.location}</span>
            </div>
          )}

          {date.budget && (
            <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <div className="p-1.5 bg-green-100 rounded-lg">
                <DollarSign className="h-3.5 w-3.5 text-green-600" />
              </div>
              <span>{date.budget.toLocaleString()} ₸</span>
            </div>
          )}

          {date.createdAt && (
            <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Calendar className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <span>{new Date(date.createdAt).toLocaleDateString()}</span>
            </div>
          )}
        </div>

        {/* Теги */}
        {date.tags && date.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {date.tags.map((tag, index) => (
              <Badge
                key={index}
                variant="secondary"
                className="text-xs badge-modern bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors duration-300"
              >
                {tag}
              </Badge>
            ))}
          </div>
        )}

        {/* Статус завершения */}
        {date.completed && (
          <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 rounded-xl p-3 border border-green-200">
            <div className="p-1.5 bg-green-100 rounded-lg">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <span className="font-medium">
              {t("dates.completed")}:{" "}
              {new Date(date.completedAt!).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Поле для заметок */}
        {!date.completed && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-900">
              {t("dates.notes")}:
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("dates.notes")}
              className="w-full p-3 text-sm border-2 border-gray-200 rounded-xl bg-white text-gray-900 resize-none input-modern focus:border-pink-400 focus:ring-2 focus:ring-pink-100 transition-all duration-300"
              rows={2}
            />
          </div>
        )}

        {/* Кнопки действий */}
        <div className="flex gap-3">
          {!date.completed ? (
            <Button
              onClick={handleComplete}
              disabled={isCompleting || !notes.trim()}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isCompleting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("common.loading")}</span>
                </div>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {t("dates.complete")}
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleUndo}
              disabled={isUndoing}
              variant="outline"
              className="flex-1 border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900 font-medium py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isUndoing ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-gray-700 border-t-transparent rounded-full animate-spin"></div>
                  <span>{t("common.loading")}</span>
                </div>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  {t("dates.undo")}
                </>
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

