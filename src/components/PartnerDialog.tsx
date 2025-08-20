"use client";

import React, { useState } from "react";
import {
  Users,
  Mail,
  Send,
  Clock,
  CheckCircle,
  XCircle,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { usePartner } from "@/context/PartnerContext";
import { useLanguage } from "@/context/LanguageContext";
import { AvatarViewer } from "./AvatarViewer";
import { Partner, User } from "@/types";

interface PartnerRequest {
  id: string;
  user_id_1: string;
  user_id_2: string;
  status: string;
  createdAt: string;
  sender?: { id: string; name: string; email: string };
  receiver?: { id: string; name: string; email: string };
}

interface PartnerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partner: Partner | null;
  partnerUser: User | null;
}

export function PartnerDialog({
  open,
  onOpenChange,
  partner,
  partnerUser,
}: PartnerDialogProps) {
  const {
    sendPartnerRequest,
    acceptPartnerRequest,
    rejectPartnerRequest,
    removePartner,
    incomingRequests,
    outgoingRequests,
  } = usePartner();
  const { t } = useLanguage();
  const [partnerEmail, setPartnerEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAvatarViewer, setShowAvatarViewer] = useState(false);

  const handleSendRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!partnerEmail.trim()) return;

    setIsSubmitting(true);
    try {
      await sendPartnerRequest(partnerEmail.trim());
      setShowSuccess(true);
      setPartnerEmail("");
    } catch (error) {
      console.error("Ошибка при отправке запроса:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAcceptRequest = async (requestId: string) => {
    try {
      await acceptPartnerRequest(requestId);
    } catch (error) {
      console.error("Ошибка при принятии запроса:", error);
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    try {
      await rejectPartnerRequest(requestId);
    } catch (error) {
      console.error("Ошибка при отклонении запроса:", error);
    }
  };

  const handleRemovePartner = async () => {
    if (confirm(t("partners.remove"))) {
      try {
        await removePartner();
        onOpenChange(false);
      } catch (error) {
        console.error("Ошибка при удалении партнера:", error);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-xl border-0 shadow-modern-xl rounded-2xl sm:rounded-3xl p-0 animate-modal-fade-in">
        <DialogHeader className="p-6 sm:p-8 pb-4 sm:pb-6">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl font-bold text-gray-900">
            <div className="p-1.5 sm:p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg sm:rounded-xl">
              <Users className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            {t("partners.title")}
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 sm:px-8 pb-6 sm:pb-8 space-y-4 sm:space-y-6">
          {/* Информация о текущем партнере */}
          {partner && partnerUser && (
            <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {t("partners.partnerInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  <div className="relative group">
                    <div
                      className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-pink-400 to-purple-500 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl overflow-hidden cursor-pointer hover:scale-105 transition-transform duration-300"
                      onClick={() => setShowAvatarViewer(true)}
                      style={{
                        boxShadow: "0 8px 32px rgba(236, 72, 153, 0.3)",
                        border: "3px solid white",
                      }}
                    >
                      {partnerUser.avatar ? (
                        <img
                          src={partnerUser.avatar}
                          alt={partnerUser.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl object-cover"
                        />
                      ) : (
                        partnerUser.name.charAt(0).toUpperCase()
                      )}
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      {partnerUser.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 font-medium">
                      {partnerUser.email}
                    </p>
                    <div className="flex items-center justify-center sm:justify-start gap-2 mt-2 sm:mt-3">
                      <Badge className="bg-gradient-to-r from-green-400 to-emerald-500 text-white font-medium shadow-modern">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {t("partners.connected")}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={handleRemovePartner}
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto border-2 border-red-300 text-red-600 hover:border-red-400 hover:text-red-700 hover:bg-red-50 font-medium rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t("common.delete")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Входящие запросы */}
          {incomingRequests && incomingRequests.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {t("partners.incomingRequests")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(incomingRequests as unknown as PartnerRequest[]).map(
                  (request: PartnerRequest) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200 shadow-modern"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {request.sender?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.sender?.email}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleAcceptRequest(request.id)}
                          size="sm"
                          className="bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t("partners.accept")}
                        </Button>
                        <Button
                          onClick={() => handleRejectRequest(request.id)}
                          variant="outline"
                          size="sm"
                          className="border-2 border-red-300 text-red-600 hover:border-red-400 hover:text-red-700 hover:bg-red-50 font-medium rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          {t("partners.reject")}
                        </Button>
                      </div>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* Исходящие запросы */}
          {outgoingRequests && outgoingRequests.length > 0 && (
            <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
              <CardHeader className="pb-4">
                <CardTitle className="text-xl font-semibold text-gray-900">
                  {t("partners.outgoingRequests")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {(outgoingRequests as unknown as PartnerRequest[]).map(
                  (request: PartnerRequest) => (
                    <div
                      key={request.id}
                      className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200 shadow-modern"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">
                          {request.receiver?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {request.receiver?.email}
                        </p>
                      </div>
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white font-medium shadow-modern">
                        <Clock className="h-3 w-3 mr-1" />
                        {t("partners.pending")}
                      </Badge>
                    </div>
                  )
                )}
              </CardContent>
            </Card>
          )}

          {/* Добавление нового партнера */}
          {!partner && (
            <>
              {/* Как это работает */}
              <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {t("partners.howItWorks")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 leading-relaxed">
                    {t("partners.howItWorksText")}
                  </p>
                </CardContent>
              </Card>

              {/* Форма отправки запроса */}
              <Card className="bg-white/80 backdrop-blur-md rounded-2xl shadow-modern border border-white/20 hover-lift transition-all duration-300">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl font-semibold text-gray-900">
                    {t("partners.addPartner")}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={handleSendRequest}
                    className="space-y-4 sm:space-y-6"
                  >
                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-gray-900">
                        {t("partners.partnerEmail")}
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" />
                        <Input
                          type="email"
                          value={partnerEmail}
                          onChange={(e) => setPartnerEmail(e.target.value)}
                          placeholder={t("partners.partnerEmailPlaceholder")}
                          className="pl-10 input-modern focus:border-blue-400 focus:ring-2 focus:ring-blue-100"
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                    </div>

                    {/* Уведомление об успехе */}
                    {showSuccess && (
                      <div className="p-3 sm:p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl shadow-modern animate-modal-slide-in">
                        <p className="text-sm sm:text-base text-green-700 font-medium">
                          {t("partners.requestSent")}
                        </p>
                      </div>
                    )}

                    <Button
                      type="submit"
                      disabled={isSubmitting || !partnerEmail.trim()}
                      className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-medium py-2.5 sm:py-3 rounded-xl shadow-modern hover:shadow-modern-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>{t("common.loading")}</span>
                        </div>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          {t("partners.sendRequest")}
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </DialogContent>

      {/* Диалог просмотра аватара */}
      {partnerUser?.avatar && (
        <AvatarViewer
          open={showAvatarViewer}
          onOpenChange={setShowAvatarViewer}
          avatar={partnerUser.avatar}
          name={partnerUser.name}
        />
      )}
    </Dialog>
  );
}
