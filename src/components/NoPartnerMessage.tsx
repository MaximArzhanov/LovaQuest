"use client";

import React from "react";
import { Heart, Users, Trophy } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export function NoPartnerMessage() {
  const { t } = useLanguage();

  return (
    <div className="text-center py-12">
      <div className="relative inline-block mb-8">
        <Heart
          className="h-20 w-20 text-pink-500 mx-auto animate-bounce"
          style={{ animationDuration: "2s" }}
        />
        <div className="absolute inset-0 bg-pink-500 rounded-full opacity-20 animate-ping"></div>
      </div>

      <h2 className="text-4xl font-bold text-gray-900 mb-4 leading-tight">
        {t("partners.noPartner")}
      </h2>
      <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
        {t("partners.noPartnerSubtitle")}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {/* Карточка поиска партнера */}
        <div className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 p-8 hover-lift transition-all duration-300">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-blue-400 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300">
            {t("partners.addPartner")}
          </h3>
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            Найдите своего партнера по email и начните планировать свидания
            вместе.
          </p>
        </div>

        {/* Карточка планирования свиданий */}
        <div className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 p-8 hover-lift transition-all duration-300">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-400 to-pink-600 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-pink-400 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-pink-600 transition-colors duration-300">
            {t("dates.plannedDates")}
          </h3>
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            Создавайте интересные свидания, добавляйте теги, место и бюджет.
          </p>
        </div>

        {/* Карточка получения призов */}
        <div className="group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 p-8 hover-lift transition-all duration-300">
          <div className="relative mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="absolute inset-0 bg-yellow-400 rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          </div>

          <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-orange-600 transition-colors duration-300">
            {t("prizes.title")}
          </h3>
          <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
            Получайте призы за выполнение свиданий и накапливайте очки.
          </p>
        </div>
      </div>

      <div className="mt-12">
        <div className="bg-white/80 backdrop-blur-md rounded-xl shadow-modern border border-white/20 p-6 inline-block">
          <p className="text-gray-600 text-lg font-medium">
            После добавления партнера вы сможете создавать свидания и призы
          </p>
        </div>
      </div>
    </div>
  );
}
