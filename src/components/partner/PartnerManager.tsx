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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  UserPlus,
  UserCheck,
  UserX,
  Mail,
  Heart,
  LogOut,
} from "lucide-react";
import { usePartner } from "@/context/PartnerContext";
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";

export function PartnerManager() {
  const { user, signOut } = useAuth();
  const {
    partner,
    partnerUser,
    incomingRequests,
    outgoingRequests,
    loading,
    error,
    sendPartnerRequest,
    acceptPartnerRequest,
    rejectPartnerRequest,
    removePartner,
  } = usePartner();

  // Отладочная информация
  console.log("PartnerManager - partner:", partner);
  console.log("PartnerManager - incomingRequests:", incomingRequests);
  console.log("PartnerManager - outgoingRequests:", outgoingRequests);
  console.log("PartnerManager - user:", user);
  const [open, setOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState("");
  const { t } = useLanguage();

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!partnerEmail.trim()) return;

    await sendPartnerRequest(partnerEmail.trim());

    if (!error) {
      setPartnerEmail("");
    }
  };

  const handleAcceptRequest = async (partnerId: string) => {
    await acceptPartnerRequest(partnerId);
  };

  const handleRejectRequest = async (partnerId: string) => {
    await rejectPartnerRequest(partnerId);
  };

  const handleRemovePartner = async () => {
    if (confirm("Вы уверены, что хотите удалить партнера?")) {
      await removePartner();
    }
  };

  const handleSignOut = async () => {
    if (confirm("Вы уверены, что хотите выйти из аккаунта?")) {
      await signOut();
    }
  };

  if (!user) return null;

  return (
    <div className="flex items-center gap-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="border-pink-200 text-pink-700 hover:bg-pink-50"
          >
            <Users className="h-4 w-4 mr-2" />
            Партнер
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Управление партнером
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Текущий партнер */}
            {partner && partnerUser && (
              <Card className="border-green-200 bg-green-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <Heart className="h-5 w-5" />
                    Ваш партнер
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-green-900">
                        {partnerUser.name}
                      </p>
                      <p className="text-sm text-green-700">
                        {partnerUser.email}
                      </p>
                      <Badge className="bg-green-100 text-green-800 mt-2">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Подтверждено
                      </Badge>
                    </div>
                    <Button
                      onClick={handleRemovePartner}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Удалить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Входящие запросы на партнерство */}
            {incomingRequests.length > 0 && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <UserPlus className="h-5 w-5" />
                    Входящие запросы ({incomingRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {incomingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-white rounded-md border border-blue-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-blue-900">
                            Запрос от{" "}
                            {(request as any).sender?.name || "Пользователя"}
                          </p>
                          <p className="text-xs text-blue-700">
                            {(request as any).sender?.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => handleAcceptRequest(request.id)}
                            size="sm"
                            className="bg-green-500 hover:bg-green-600"
                          >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Принять
                          </Button>
                          <Button
                            onClick={() => handleRejectRequest(request.id)}
                            variant="outline"
                            size="sm"
                            className="border-red-200 text-red-700 hover:bg-red-50"
                          >
                            <UserX className="h-4 w-4 mr-1" />
                            Отклонить
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Исходящие запросы на партнерство */}
            {outgoingRequests.length > 0 && (
              <Card className="border-purple-200 bg-purple-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-purple-800">
                    <UserPlus className="h-5 w-5" />
                    Отправленные запросы ({outgoingRequests.length})
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    {outgoingRequests.map((request) => (
                      <div
                        key={request.id}
                        className="flex items-center justify-between p-3 bg-white rounded-md border border-purple-200"
                      >
                        <div>
                          <p className="text-sm font-medium text-purple-900">
                            Запрос к{" "}
                            {(request as any).receiver?.name || "Пользователю"}
                          </p>
                          <p className="text-xs text-purple-700">
                            {(request as any).receiver?.email}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Badge className="bg-yellow-100 text-yellow-800">
                            Ожидает ответа
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ожидающие запросы */}
            {partner && partner.status === "pending" && (
              <Card className="border-yellow-200 bg-yellow-50">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-yellow-800">
                    <UserPlus className="h-5 w-5" />
                    Ожидающий запрос
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-yellow-700 mb-3">
                    У вас есть запрос на партнерство
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleAcceptRequest(partner.id)}
                      size="sm"
                      className="bg-green-500 hover:bg-green-600"
                    >
                      <UserCheck className="h-4 w-4 mr-1" />
                      Принять
                    </Button>
                    <Button
                      onClick={() => handleRejectRequest(partner.id)}
                      variant="outline"
                      size="sm"
                      className="border-red-200 text-red-700 hover:bg-red-50"
                    >
                      <UserX className="h-4 w-4 mr-1" />
                      Отклонить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Добавить партнера */}
            {!partner && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2">
                    <UserPlus className="h-5 w-5" />
                    Добавить партнера
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <form onSubmit={handleSendRequest} className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700">
                        Email партнера
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          value={partnerEmail}
                          onChange={(e) => setPartnerEmail(e.target.value)}
                          placeholder={t("partners.partnerEmailPlaceholder")}
                          className="pl-10"
                          required
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                        {error}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full bg-pink-500 hover:bg-pink-600"
                      disabled={loading}
                    >
                      {loading ? "Отправка..." : "Отправить запрос"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            )}

            {/* Информация */}
            <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md">
              <p className="font-medium mb-1">Как это работает:</p>
              <ul className="space-y-1">
                <li>• Введите email вашего партнера</li>
                <li>• Партнер получит запрос на подключение</li>
                <li>
                  • После подтверждения вы сможете создавать общие свидания и
                  призы
                </li>
              </ul>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Кнопка выхода */}
      <Button
        onClick={handleSignOut}
        variant="outline"
        size="sm"
        className="border-gray-200 text-gray-700 hover:bg-gray-50"
      >
        <LogOut className="h-4 w-4 mr-1" />
        Выйти
      </Button>
    </div>
  );
}
