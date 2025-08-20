"use client";

import React, { useState } from "react";
import { Heart, Trophy } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { DateCard } from "@/components/DateCard";
import { PrizeCard } from "@/components/PrizeCard";
import { AddDateForm } from "@/components/AddDateForm";
import { AddPrizeForm } from "@/components/AddPrizeForm";
import { Stats } from "@/components/Stats";

import { PrizeNotification } from "@/components/PrizeNotification";
import { LoginForm } from "@/components/auth/LoginForm";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { UserMenu } from "@/components/UserMenu";
import { NoPartnerMessage } from "@/components/NoPartnerMessage";
import { useAuth } from "@/context/AuthContext";
import { usePartner } from "@/context/PartnerContext";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageSelector } from "@/components/LanguageSelector";

type TabType = "dates" | "prizes";

export default function Home() {
  const { state } = useApp();
  const { user, loading } = useAuth();
  const { partner, partnerUser, loading: partnerLoading } = usePartner();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<TabType>("dates");

  const pendingDates = state.dates.filter((date) => !date.completed);
  const completedDates = state.dates.filter((date) => date.completed);

  const tabs = [
    { id: "dates", label: t("navigation.dates"), icon: Heart },
    { id: "prizes", label: t("navigation.prizes"), icon: Trophy },
  ];

  // Показываем загрузку пока проверяется авторизация или загружаются данные партнера
  if (loading || partnerLoading) {
    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden flex items-center justify-center">
        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-40 left-40 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        <div className="relative text-center z-10">
          <div className="relative inline-block mb-4 sm:mb-6">
            <div className="p-4 sm:p-6 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl sm:rounded-3xl shadow-modern-xl">
              <Heart
                className="h-12 w-12 sm:h-16 sm:w-16 text-white mx-auto animate-bounce"
                style={{ animationDuration: "2s" }}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl sm:rounded-3xl opacity-20 animate-ping"></div>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4">
            {t("common.loading")}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 font-medium">
            LoveQuest
          </p>
        </div>
      </div>
    );
  }

  // Если пользователь не авторизован, показываем страницу входа
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
          <div
            className="absolute top-40 left-40 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
            style={{ animationDelay: "4s" }}
          ></div>
        </div>

        {/* Header */}
        <header className="relative bg-white/90 backdrop-blur-xl shadow-modern-xl border-b border-pink-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Логотип и название */}
              <div className="flex items-center gap-2 sm:gap-4">
                <div className="relative group">
                  <div className="p-1.5 sm:p-2 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl sm:rounded-2xl shadow-modern-lg group-hover:shadow-modern-xl transition-all duration-300">
                    <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-white animate-pulse" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl sm:rounded-2xl opacity-20 animate-ping"></div>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  LoveQuest
                </h1>
              </div>

              {/* Правая часть header */}
              <div className="flex items-center gap-2 sm:gap-3">
                <LanguageSelector />
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-6 sm:mb-8 lg:mb-10">
              <div className="relative inline-block mb-4 sm:mb-6 lg:mb-8">
                <div className="p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl sm:rounded-3xl shadow-modern-xl group-hover:shadow-2xl transition-all duration-500 transform group-hover:scale-105">
                  <Heart
                    className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 text-white mx-auto animate-bounce"
                    style={{ animationDuration: "2s" }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl sm:rounded-3xl opacity-20 animate-ping"></div>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 lg:mb-6 leading-tight">
                {t("auth.welcome")}
              </h2>
              <p className="text-base sm:text-lg lg:text-xl text-gray-700 leading-relaxed max-w-lg mx-auto px-2 sm:px-4">
                {t("auth.welcomeSubtitle")}
              </p>
            </div>

            <div className="bg-white/95 backdrop-blur-xl rounded-2xl sm:rounded-3xl shadow-modern-2xl border border-white/30 p-4 sm:p-6 lg:p-8 xl:p-10 space-y-4 sm:space-y-6 lg:space-y-8 hover-lift transition-all duration-500">
              <div className="text-center mb-4 sm:mb-6 lg:mb-8">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                  {t("auth.loginOrRegister")}
                </h3>
                <p className="text-sm sm:text-base lg:text-lg text-gray-600">
                  {t("auth.loginOrRegisterSubtitle")}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center w-full">
                <LoginForm />
                <RegisterForm />
              </div>

              <div className="text-xs sm:text-sm text-gray-500 text-center pt-3 sm:pt-4 lg:pt-6 border-t border-pink-200/50">
                <p className="font-medium">{t("auth.createMemories")}</p>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="relative bg-white/80 backdrop-blur-md border-t border-pink-200/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>LoveQuest - {t("auth.welcomeSubtitle")}</p>
              <p className="mt-1">{t("auth.createMemories")}</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Если у пользователя нет партнера, показываем сообщение о необходимости партнера
  if (!partner || !partnerUser) {
    return (
      <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
          <div
            className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        {/* Header */}
        <header className="relative bg-white/80 backdrop-blur-md shadow-modern border-b border-pink-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16 sm:h-20">
              {/* Логотип и название */}
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative">
                  <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 animate-pulse" />
                  <div className="absolute inset-0 bg-pink-500 rounded-full opacity-20 animate-ping"></div>
                </div>
                <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  LoveQuest
                </h1>
              </div>

              {/* Правая часть header */}
              <div className="flex items-center gap-2 sm:gap-3">
                <UserMenu />
              </div>
            </div>
          </div>
        </header>

        <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <NoPartnerMessage />
        </main>

        {/* Footer */}
        <footer className="relative bg-white/80 backdrop-blur-md border-t border-pink-200/50 mt-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="text-center text-sm text-gray-500">
              <p>LoveQuest - {t("auth.welcomeSubtitle")}</p>
              <p className="mt-1">{t("auth.createMemories")}</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  // Основное приложение для авторизованных пользователей с партнером
  return (
    <div className="min-h-screen bg-gradient-primary relative overflow-hidden">
      {/* Декоративные элементы */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
        <div
          className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
        <div
          className="absolute top-40 left-40 w-60 h-60 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"
          style={{ animationDelay: "4s" }}
        ></div>
      </div>

      <PrizeNotification />

      {/* Header */}
      <header className="relative bg-white/80 backdrop-blur-md shadow-modern border-b border-pink-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Логотип и название */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="relative">
                <Heart className="h-6 w-6 sm:h-8 sm:w-8 text-pink-500 animate-pulse" />
                <div className="absolute inset-0 bg-pink-500 rounded-full opacity-20 animate-ping"></div>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                LoveQuest
              </h1>
            </div>

            {/* Правая часть header */}
            <div className="flex items-center gap-2 sm:gap-3">
              <UserMenu />
            </div>
          </div>
        </div>
      </header>

      <main className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Информация о партнере */}
        <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-modern-lg border border-white/20 p-4 sm:p-6 mb-4 sm:mb-6 hover-lift">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 sm:mb-2">
                {t("partners.title")}
              </h2>
              <p className="text-sm sm:text-base text-gray-600">
                {partnerUser.name} ({partnerUser.email})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm text-gray-500">
                {t("partners.connected")}:
              </span>
              <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs sm:text-sm rounded-full font-medium shadow-modern">
                {t("partners.connected")}
              </span>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <Stats />

        {/* Табы */}
        <div className="mb-4 sm:mb-6">
          <div className="flex space-x-1 bg-white/90 backdrop-blur-md p-1.5 sm:p-2 rounded-xl sm:rounded-2xl shadow-modern border border-white/20">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className={`flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm font-medium transition-all duration-300 ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-modern-lg transform scale-105"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/50 hover:scale-105"
                  }`}
                >
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">
                    {tab.id === "dates" ? "💕" : "🏆"}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Контент табов */}
        {activeTab === "dates" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Кнопки добавления */}
            <div className="flex gap-3 sm:gap-4">
              <AddDateForm />
            </div>

            {/* Свидания */}
            <div className="space-y-4 sm:space-y-6">
              {pendingDates.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    {t("dates.plannedDates")} ({pendingDates.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {pendingDates.map((date) => (
                      <DateCard key={date.id} date={date} />
                    ))}
                  </div>
                </div>
              )}

              {completedDates.length > 0 && (
                <div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                    {t("dates.completedDates")} ({completedDates.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {completedDates.map((date) => (
                      <DateCard key={date.id} date={date} />
                    ))}
                  </div>
                </div>
              )}

              {state.dates.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Heart className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4 animate-bounce" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    {t("dates.noDates")}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 px-4">
                    {t("dates.noDatesSubtitle", {
                      partnerName: partnerUser.name,
                    })}
                  </p>
                  <AddDateForm />
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "prizes" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Кнопки добавления */}
            <div className="flex gap-3 sm:gap-4">
              <AddPrizeForm />
            </div>

            {/* Призы */}
            <div className="space-y-4 sm:space-y-6">
              {/* Доступные призы */}
              {(() => {
                const availablePrizes = state.prizes.filter(
                  (prize) => !prize.claimedAt
                );
                return availablePrizes.length > 0 ? (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      {t("prizes.availablePrizes")} ({availablePrizes.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {availablePrizes.map((prize) => (
                        <PrizeCard key={prize.id} prize={prize} />
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Полученные призы */}
              {(() => {
                const claimedPrizes = state.prizes.filter(
                  (prize) => prize.claimedAt
                );
                return claimedPrizes.length > 0 ? (
                  <div>
                    <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      {t("prizes.claimedPrizes")} ({claimedPrizes.length})
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                      {claimedPrizes.map((prize) => (
                        <PrizeCard key={prize.id} prize={prize} />
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Если нет призов вообще */}
              {state.prizes.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Trophy className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-3 sm:mb-4 animate-bounce" />
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                    {t("prizes.noPrizes")}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-500 mb-3 sm:mb-4 px-4">
                    {t("prizes.noPrizesSubtitle", {
                      partnerName: partnerUser.name,
                    })}
                  </p>
                  <AddPrizeForm />
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative bg-white/80 backdrop-blur-md border-t border-pink-200/50 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="text-center text-sm text-gray-500">
            <p>LoveQuest - {t("auth.welcomeSubtitle")}</p>
            <p className="mt-1">{t("auth.createMemories")}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

