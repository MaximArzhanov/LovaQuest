"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Partner, User } from "@/types";
import { useAuth } from "./AuthContext";

interface PartnerContextType {
  partner: Partner | null;
  partnerUser: User | null;
  incomingRequests: Partner[];
  outgoingRequests: Partner[];
  loading: boolean;
  error: string | null;
  sendPartnerRequest: (partnerEmail: string) => Promise<boolean>;
  acceptPartnerRequest: (partnerId: string) => Promise<void>;
  rejectPartnerRequest: (partnerId: string) => Promise<void>;
  removePartner: () => Promise<void>;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export function PartnerProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [partner, setPartner] = useState<Partner | null>(null);
  const [partnerUser, setPartnerUser] = useState<User | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<Partner[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Загружаем данные только если пользователь действительно изменился (не просто обновился)
      if (!partner || partnerUser?.id !== user.id) {
        loadPartnerData();
      }
    } else {
      setPartner(null);
      setPartnerUser(null);
      setLoading(false);
    }
  }, [user?.id]); // Зависим только от ID пользователя, а не от всего объекта

  const loadPartnerData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      setError(null);

      // Получаем данные пользователя с информацией о партнере
      const { data: userData, error: userError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (userError) throw userError;

      if (userData.partner_id) {
        // Получаем информацию о партнерстве
        const { data: partnerData, error: partnerError } = await supabase
          .from("partners")
          .select("*")
          .eq("id", userData.partner_id)
          .single();

        if (partnerError) throw partnerError;

        setPartner(partnerData);
        console.log("Установлен партнер:", partnerData);

        // Получаем информацию о партнере
        const partnerUserId =
          partnerData.user_id_1 === user.id
            ? partnerData.user_id_2
            : partnerData.user_id_1;

        console.log("ID партнера:", partnerUserId);

        const { data: partnerUserData, error: partnerUserError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", partnerUserId)
            .single();

        if (partnerUserError) throw partnerUserError;

        setPartnerUser(partnerUserData);
      }

      // Загружаем входящие запросы на партнерство (только если у пользователя нет партнера)
      if (!userData.partner_id) {
        console.log("Загружаем входящие запросы для пользователя:", user.id);
        const { data: incomingRequestsData, error: requestsError } =
          await supabase
            .from("partners")
            .select("*")
            .eq("user_id_2", user.id)
            .eq("status", "pending");

        if (requestsError) throw requestsError;

        console.log("Найдены входящие запросы:", incomingRequestsData);

        // Загружаем информацию о пользователях для входящих запросов
        const incomingWithUsers = await Promise.all(
          (incomingRequestsData || []).map(async (request) => {
            const { data: senderData } = await supabase
              .from("profiles")
              .select("id, name, email")
              .eq("id", (request as any).user_id_1)
              .single();

            return {
              ...request,
              sender: senderData,
            };
          })
        );

        setIncomingRequests(incomingWithUsers);

        // Загружаем исходящие запросы
        const { data: outgoingRequestsData, error: outgoingError } =
          await supabase
            .from("partners")
            .select("*")
            .eq("user_id_1", user.id)
            .eq("status", "pending");

        if (outgoingError) throw outgoingError;

        console.log("Найдены исходящие запросы:", outgoingRequestsData);

        // Загружаем информацию о пользователях для исходящих запросов
        const outgoingWithUsers = await Promise.all(
          (outgoingRequestsData || []).map(async (request) => {
            const { data: receiverData } = await supabase
              .from("profiles")
              .select("id, name, email")
              .eq("id", (request as any).user_id_2)
              .single();

            return {
              ...request,
              receiver: receiverData,
            };
          })
        );

        setOutgoingRequests(outgoingWithUsers);
      } else {
        console.log("У пользователя уже есть партнер, запросы не загружаем");
        setIncomingRequests([]);
        setOutgoingRequests([]);
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const sendPartnerRequest = async (partnerEmail: string): Promise<boolean> => {
    if (!user) return false;

    try {
      setError(null);

      // Находим пользователя по email
      const { data: partnerData, error: partnerError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", partnerEmail);

      if (partnerError) {
        throw new Error("Ошибка при поиске пользователя");
      }

      if (!partnerData || partnerData.length === 0) {
        throw new Error("Пользователь с таким email не найден");
      }

      const partnerUser = partnerData[0];

      if (partnerUser.id === user.id) {
        throw new Error("Нельзя добавить себя в качестве партнера");
      }

      // Проверяем, не отправлен ли уже запрос
      const { data: existingRequests, error: existingError } = await supabase
        .from("partners")
        .select("*")
        .or(
          `user_id_1.eq.${user.id},user_id_2.eq.${user.id},user_id_1.eq.${partnerUser.id},user_id_2.eq.${partnerUser.id}`
        );

      if (existingError) {
        throw existingError;
      }

      if (existingRequests && existingRequests.length > 0) {
        throw new Error("Запрос на партнерство уже существует");
      }

      // Создаем запрос на партнерство
      const { error: insertError } = await supabase.from("partners").insert([
        {
          user_id_1: user.id,
          user_id_2: partnerUser.id,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ]);

      if (insertError) throw insertError;

      // Добавляем новый запрос в исходящие запросы без перезагрузки всех данных
      const newRequest = {
        id: insertError ? "" : "temp-id", // Временный ID
        userId1: user.id,
        userId2: partnerUser.id,
        status: "pending",
        createdAt: new Date().toISOString(),
        receiver: {
          id: partnerUser.id,
          name: partnerUser.name,
          email: partnerUser.email,
        },
      } as any;

      setOutgoingRequests((prev) => [...prev, newRequest]);

      return true; // Успешно отправлен
    } catch (error: any) {
      setError(error.message);
      return false; // Ошибка
    }
  };

  const acceptPartnerRequest = async (partnerId: string) => {
    if (!user) return;

    try {
      setError(null);

      // Обновляем статус партнерства
      const { error: updateError } = await supabase
        .from("partners")
        .update({ status: "accepted" })
        .eq("id", partnerId);

      if (updateError) throw updateError;

      // Получаем данные о партнерстве
      const { data: partnerData, error: partnerError } = await supabase
        .from("partners")
        .select("*")
        .eq("id", partnerId)
        .single();

      if (partnerError) throw partnerError;

      if (partnerData) {
        const partnerUserId =
          partnerData.user_id_1 === user.id
            ? partnerData.user_id_2
            : partnerData.user_id_1;

        // Используем функцию базы данных для обновления обоих профилей
        const { error: updateError } = await supabase.rpc("set_partnership", {
          partner_id: partnerId,
          user1_id: user.id,
          user2_id: partnerUserId,
        });

        if (updateError) throw updateError;

        console.log("Профили обоих пользователей обновлены:", {
          userId: user.id,
          partnerUserId: partnerUserId,
          partnerId: partnerId,
        });

        // Получаем данные партнера
        const { data: partnerUserData, error: partnerUserError } =
          await supabase
            .from("profiles")
            .select("*")
            .eq("id", partnerUserId)
            .single();

        if (partnerUserError) throw partnerUserError;

        // Обновляем локальное состояние без перезагрузки
        setPartner(partnerData);
        setPartnerUser(partnerUserData);
        setIncomingRequests([]);
        setOutgoingRequests([]);
      }
    } catch (error: any) {
      setError(error.message);
      console.error("Ошибка при принятии запроса партнерства:", error);
    }
  };

  const rejectPartnerRequest = async (partnerId: string) => {
    if (!user) return;

    try {
      setError(null);

      // Удаляем запрос на партнерство
      const { error: deleteError } = await supabase
        .from("partners")
        .delete()
        .eq("id", partnerId);

      if (deleteError) throw deleteError;

      // Удаляем запрос из локального состояния
      setIncomingRequests((prev) => prev.filter((req) => req.id !== partnerId));
    } catch (error: any) {
      setError(error.message);
    }
  };

  const removePartner = async () => {
    if (!user || !partner) return;

    try {
      setError(null);

      // Удаляем партнерство
      const { error: deleteError } = await supabase
        .from("partners")
        .delete()
        .eq("id", partner.id);

      if (deleteError) throw deleteError;

      // Определяем ID партнера
      const partnerUserId =
        partner.user_id_1 === user.id ? partner.user_id_2 : partner.user_id_1;

      // Используем функцию базы данных для удаления partner_id у обоих пользователей
      const { error: updateError } = await supabase.rpc("remove_partnership", {
        user1_id: user.id,
        user2_id: partnerUserId,
      });

      if (updateError) throw updateError;

      console.log("Партнерство удалено, профили обновлены:", {
        userId: user.id,
        partnerUserId: partnerUserId,
      });

      // Сбрасываем состояние
      setPartner(null);
      setPartnerUser(null);
    } catch (error: any) {
      setError(error.message);
      console.error("Ошибка при удалении партнерства:", error);
    }
  };

  return (
    <PartnerContext.Provider
      value={{
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
      }}
    >
      {children}
    </PartnerContext.Provider>
  );
}

export function usePartner() {
  const context = useContext(PartnerContext);
  if (context === undefined) {
    throw new Error("usePartner must be used within a PartnerProvider");
  }
  return context;
}
