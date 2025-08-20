"use client";

import React from "react";
import { Trophy, Calendar, Star, Gift } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/context/LanguageContext";
import { Prize } from "@/types";

interface PrizeCardProps {
  prize: Prize;
}

export function PrizeCard({ prize }: PrizeCardProps) {
  const { t } = useLanguage();

  const getPrizeTypeText = (type: string) => {
    switch (type) {
      case "specific":
        return t("prizes.typeSpecific");
      case "count":
        return t("prizes.typeCount");
      case "points":
        return t("prizes.typePoints");
      default:
        return type;
    }
  };

  const getPrizeTypeIcon = (type: string) => {
    switch (type) {
      case "specific":
        return <Calendar className="h-4 w-4" />;
      case "count":
        return <Star className="h-4 w-4" />;
      case "points":
        return <Trophy className="h-4 w-4" />;
      default:
        return <Gift className="h-4 w-4" />;
    }
  };

  const getPrizeTypeColor = (type: string) => {
    switch (type) {
      case "specific":
        return "bg-blue-100 text-blue-800";
      case "count":
        return "bg-purple-100 text-purple-800";
      case "points":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusText = () => {
    if (prize.claimedAt) {
      if (prize.claimedBy === "currentUser") {
        return t("prizes.claimedByMe");
      } else {
        return t("prizes.claimedByPartner");
      }
    }
    return "";
  };

  const getStatusColor = () => {
    if (prize.claimedAt) {
      return "bg-green-100 text-green-800";
    }
    return "";
  };

  return (
    <Card
      className={`group bg-white/90 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 transition-all duration-300 hover-lift ${
        prize.claimedAt
          ? "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 shadow-modern-lg"
          : "hover:shadow-modern-lg"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg text-gray-900 line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {prize.title}
          </CardTitle>
          <div className="flex flex-col gap-2 items-end">
            <Badge
              className={`badge-modern group-hover:scale-105 transition-transform duration-300 ${getPrizeTypeColor(
                prize.type
              )}`}
            >
              <div className="flex items-center gap-1">
                {getPrizeTypeIcon(prize.type)}
                <span>{getPrizeTypeText(prize.type)}</span>
              </div>
            </Badge>
            {prize.claimedAt && (
              <Badge
                className={`badge-modern group-hover:scale-105 transition-transform duration-300 ${getStatusColor()}`}
              >
                {getStatusText()}
              </Badge>
            )}
          </div>
        </div>

        {prize.description && (
          <p className="text-gray-600 text-sm line-clamp-2 group-hover:text-gray-700 transition-colors duration-300">
            {prize.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Условия получения */}
        <div className="space-y-3">
          {prize.type === "specific" && prize.conditions.specificDateId && (
            <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <div className="p-1.5 bg-blue-100 rounded-lg">
                <Calendar className="h-3.5 w-3.5 text-blue-600" />
              </div>
              <span>
                {t("prizes.conditions")}: {t("prizes.typeSpecific")}
              </span>
            </div>
          )}

          {prize.type === "count" && prize.conditions.countThreshold && (
            <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <div className="p-1.5 bg-purple-100 rounded-lg">
                <Star className="h-3.5 w-3.5 text-purple-600" />
              </div>
              <span>
                {t("prizes.conditions")}: {prize.conditions.countThreshold}{" "}
                {t("dates.completedDates")}
              </span>
            </div>
          )}

          {prize.type === "points" && prize.conditions.pointsThreshold && (
            <div className="flex items-center gap-3 text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <div className="p-1.5 bg-yellow-100 rounded-lg">
                <Trophy className="h-3.5 w-3.5 text-yellow-600" />
              </div>
              <span>
                {t("prizes.conditions")}: {prize.conditions.pointsThreshold}{" "}
                {t("stats.totalPoints")}
              </span>
            </div>
          )}
        </div>

        {/* Дополнительная информация */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
            <div className="p-1.5 bg-pink-100 rounded-lg">
              <Gift className="h-3.5 w-3.5 text-pink-600" />
            </div>
            <span>
              {prize.isRepeatable
                ? t("prizes.isRepeatable")
                : t("prizes.typeSpecific")}
            </span>
          </div>

          {prize.expiresAt && (
            <div className="text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg text-xs font-medium">
              {t("prizes.expiresAtOptional")}:{" "}
              {new Date(prize.expiresAt).toLocaleDateString()}
            </div>
          )}
        </div>

        {/* Дата создания */}
        <div className="text-xs text-gray-500 bg-gray-50 px-3 py-2 rounded-lg">
          {t("common.created")}:{" "}
          {new Date(prize.createdAt).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
}
