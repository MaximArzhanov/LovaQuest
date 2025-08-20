"use client";

import React from "react";
import { Calendar, Target, Heart, Trophy } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useApp } from "@/context/AppContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function Stats() {
  const { state } = useApp();
  const { user } = useAuth();
  const { t } = useLanguage();

  const totalDates = state.dates.length;
  const completedDates = state.dates.filter((date) => date.completed).length;
  const myTotalPoints = user?.points || 0;
  const availablePrizes = state.prizes.filter(
    (prize) => !prize.claimedAt
  ).length;

  // Группируем свидания по создателю
  const myCreatedDates = state.dates.filter(
    (date) => date.createdBy === user?.id
  );
  const partnerCreatedDates = state.dates.filter(
    (date) => date.createdBy !== user?.id
  );

  const myCreatedCompleted = myCreatedDates.filter(
    (date) => date.completed
  ).length;
  const partnerCreatedCompleted = partnerCreatedDates.filter(
    (date) => date.completed
  ).length;

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
      {/* Общее количество свиданий */}
      <Card className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">
            {t("stats.totalDates")}
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Calendar className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {totalDates}
          </div>
          <p className="text-xs text-gray-500">
            {t("stats.completedDates")}: {completedDates}
          </p>
        </CardContent>
      </Card>

      {/* Общее количество очков */}
      <Card className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">
            {t("stats.totalPoints")}
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Target className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {myTotalPoints}
          </div>
          <p className="text-xs text-gray-500">
            {t("stats.availablePrizes")}: {availablePrizes}
          </p>
        </CardContent>
      </Card>

      {/* Свидания назначенные мной */}
      <Card className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">
            {t("stats.myCreatedDates")}
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-pink-400 to-pink-600 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Heart className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {myCreatedDates.length}
          </div>
          <p className="text-xs text-gray-500">
            {t("stats.myCreatedCompleted")}: {myCreatedCompleted}
          </p>
        </CardContent>
      </Card>

      {/* Свидания назначенные партнёром */}
      <Card className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-900">
            {t("stats.partnerCreatedDates")}
          </CardTitle>
          <div className="p-2 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl group-hover:scale-110 transition-transform duration-300">
            <Trophy className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-gray-900 mb-1">
            {partnerCreatedDates.length}
          </div>
          <p className="text-xs text-gray-500">
            {t("stats.partnerCreatedCompleted")}: {partnerCreatedCompleted}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

