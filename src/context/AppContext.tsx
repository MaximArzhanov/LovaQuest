"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { DateItem, Prize, CompletedDate } from "@/types";
import { generateId } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { useAuth } from "./AuthContext";
import { usePartner } from "./PartnerContext";

interface AppState {
  dates: DateItem[];
  prizes: Prize[];
  completedDates: CompletedDate[];
  loading: boolean;
  error: string | null;
}

type AppAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string | null }
  | { type: "SET_DATES"; payload: DateItem[] }
  | { type: "SET_PRIZES"; payload: Prize[] }
  | { type: "SET_COMPLETED_DATES"; payload: CompletedDate[] }
  | { type: "ADD_DATE"; payload: DateItem }
  | { type: "UPDATE_DATE"; payload: DateItem }
  | { type: "DELETE_DATE"; payload: string }
  | { type: "ADD_PRIZE"; payload: Prize }
  | { type: "UPDATE_PRIZE"; payload: Prize }
  | { type: "DELETE_PRIZE"; payload: string }
  | { type: "ADD_COMPLETED_DATE"; payload: CompletedDate };

const initialState: AppState = {
  dates: [],
  prizes: [],
  completedDates: [],
  loading: false,
  error: null,
};

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_ERROR":
      return { ...state, error: action.payload };

    case "SET_DATES":
      return { ...state, dates: action.payload };

    case "SET_PRIZES":
      return { ...state, prizes: action.payload };

    case "SET_COMPLETED_DATES":
      return { ...state, completedDates: action.payload };

    case "ADD_DATE":
      return { ...state, dates: [...state.dates, action.payload] };

    case "UPDATE_DATE":
      return {
        ...state,
        dates: state.dates.map((d) =>
          d.id === action.payload.id ? action.payload : d
        ),
      };

    case "DELETE_DATE":
      return {
        ...state,
        dates: state.dates.filter((d) => d.id !== action.payload),
      };

    case "ADD_PRIZE":
      return { ...state, prizes: [...state.prizes, action.payload] };

    case "UPDATE_PRIZE":
      return {
        ...state,
        prizes: state.prizes.map((p) =>
          p.id === action.payload.id ? action.payload : p
        ),
      };

    case "DELETE_PRIZE":
      return {
        ...state,
        prizes: state.prizes.filter((p) => p.id !== action.payload),
      };

    case "ADD_COMPLETED_DATE":
      return {
        ...state,
        completedDates: [...state.completedDates, action.payload],
      };

    default:
      return state;
  }
}

interface AppContextType {
  state: AppState;
  addDate: (
    dateData: Omit<DateItem, "id" | "createdAt" | "completed" | "completedAt">
  ) => Promise<void>;
  updateDate: (dateId: string, updates: Partial<DateItem>) => Promise<void>;
  deleteDate: (dateId: string) => Promise<void>;
  completeDate: (dateId: string, notes?: string) => Promise<void>;
  undoCompleteDate: (dateId: string) => Promise<void>;
  addPrize: (prizeData: Omit<Prize, "id" | "createdAt">) => Promise<void>;
  updatePrize: (prizeId: string, updates: Partial<Prize>) => Promise<void>;
  deletePrize: (prizeId: string) => Promise<void>;
  claimPrize: (prizeId: string) => Promise<void>;
  checkPrizes: (userId: string, userPoints?: number) => Prize[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState);
  const { user, refreshUserProfile } = useAuth();
  const { partner } = usePartner();

  // Загрузка данных при изменении пользователя или партнера
  useEffect(() => {
    if (user) {
      loadData();
    } else {
      dispatch({ type: "SET_DATES", payload: [] });
      dispatch({ type: "SET_PRIZES", payload: [] });
      dispatch({ type: "SET_COMPLETED_DATES", payload: [] });
    }
  }, [user, partner]);

  const loadData = async () => {
    if (!user) return;

    try {
      dispatch({ type: "SET_LOADING", payload: true });
      dispatch({ type: "SET_ERROR", payload: null });

      // Загружаем свидания для обоих пользователей в паре
      let allDates: any[] = [];

      // Загружаем свидания текущего пользователя
      const { data: userDates, error: userDatesError } = await supabase
        .from("dates")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (userDatesError) throw userDatesError;
      allDates = [...(userDates || [])];

      // Если есть партнер, загружаем его свидания
      if (partner) {
        console.log(
          "Добавляем свидания партнера:",
          partner.user_id_1,
          partner.user_id_2
        );

        const partnerUserId =
          partner.user_id_1 === user.id ? partner.user_id_2 : partner.user_id_1;

        const { data: partnerDates, error: partnerDatesError } = await supabase
          .from("dates")
          .select("*")
          .eq("user_id", partnerUserId)
          .order("created_at", { ascending: false });

        if (partnerDatesError) throw partnerDatesError;
        allDates = [...allDates, ...(partnerDates || [])];
      }

      // Сортируем все свидания по дате создания
      const dates = allDates.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      console.log("Загружены свидания:", dates);
      console.log("Партнер:", partner);
      console.log("Текущий пользователь:", user);

      // Сохраняем данные в window для отладки
      (window as any).currentUser = user;
      (window as any).partnerData = partner;
      (window as any).allDates = dates;

      // Загружаем призы для обоих пользователей в паре
      let allPrizes: any[] = [];

      // Загружаем призы текущего пользователя
      const { data: userPrizes, error: userPrizesError } = await supabase
        .from("prizes")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (userPrizesError) throw userPrizesError;
      allPrizes = [...(userPrizes || [])];

      // Если есть партнер, загружаем его призы
      if (partner) {
        const partnerUserId =
          partner.user_id_1 === user.id ? partner.user_id_2 : partner.user_id_1;

        const { data: partnerPrizes, error: partnerPrizesError } =
          await supabase
            .from("prizes")
            .select("*")
            .eq("user_id", partnerUserId)
            .order("created_at", { ascending: false });

        if (partnerPrizesError) throw partnerPrizesError;
        allPrizes = [...allPrizes, ...(partnerPrizes || [])];
      }

      // Сортируем все призы по дате создания
      const prizes = allPrizes.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );

      // Загружаем выполненные свидания для обоих пользователей в паре
      let allCompletedDates: any[] = [];

      // Загружаем выполненные свидания текущего пользователя
      const { data: userCompletedDates, error: userCompletedError } =
        await supabase
          .from("completed_dates")
          .select("*")
          .eq("user_id", user.id)
          .order("completed_at", { ascending: false });

      if (userCompletedError) throw userCompletedError;
      allCompletedDates = [...(userCompletedDates || [])];

      // Если есть партнер, загружаем его выполненные свидания
      if (partner) {
        const partnerUserId =
          partner.user_id_1 === user.id ? partner.user_id_2 : partner.user_id_1;

        const { data: partnerCompletedDates, error: partnerCompletedError } =
          await supabase
            .from("completed_dates")
            .select("*")
            .eq("user_id", partnerUserId)
            .order("completed_at", { ascending: false });

        if (partnerCompletedError) throw partnerCompletedError;
        allCompletedDates = [
          ...allCompletedDates,
          ...(partnerCompletedDates || []),
        ];
      }

      // Сортируем все выполненные свидания по дате выполнения
      const completedDates = allCompletedDates.sort(
        (a, b) =>
          new Date(b.completed_at).getTime() -
          new Date(a.completed_at).getTime()
      );

      console.log("Загружены выполненные свидания:", completedDates);
      (window as any).completedDates = completedDates;

      // Преобразуем даты
      const datesWithDates =
        dates?.map((date) => ({
          ...date,
          createdAt: new Date(date.created_at),
          completedAt: date.completed_at
            ? new Date(date.completed_at)
            : undefined,
          createdBy: date.created_by, // Добавляем поле createdBy
        })) || [];

      const prizesWithDates =
        prizes?.map((prize) => ({
          ...prize,
          createdAt: new Date(prize.created_at),
          expiresAt: prize.expires_at ? new Date(prize.expires_at) : undefined,
          claimedAt: prize.claimed_at ? new Date(prize.claimed_at) : undefined,
          claimedBy: prize.claimed_by,
        })) || [];

      const completedWithDates =
        completedDates?.map((cd) => ({
          ...cd,
          completedAt: new Date(cd.completed_at),
        })) || [];

      dispatch({ type: "SET_DATES", payload: datesWithDates });
      dispatch({ type: "SET_PRIZES", payload: prizesWithDates });
      dispatch({ type: "SET_COMPLETED_DATES", payload: completedWithDates });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  };

  const addDate = async (
    dateData: Omit<DateItem, "id" | "createdAt" | "completed" | "completedAt">
  ) => {
    if (!user) return;

    try {
      console.log("Создание нового свидания:", dateData);

      const newDate: DateItem = {
        ...dateData,
        id: generateId(),
        createdAt: new Date(),
        completed: false,
        userId: user.id,
        partnerId: partner?.id,
        createdBy: user.id, // Пользователь, создавший свидание
      };

      const insertData = {
        id: newDate.id,
        title: newDate.title,
        description: newDate.description,
        tags: newDate.tags,
        location: newDate.location,
        budget: newDate.budget,
        difficulty: newDate.difficulty,
        image: newDate.image,
        completed: newDate.completed,
        user_id: newDate.userId,
        partner_id: newDate.partnerId || null,
        created_by: newDate.createdBy,
        created_at: newDate.createdAt.toISOString(),
      };

      console.log("Данные для вставки в базу:", insertData);

      const { error } = await supabase.from("dates").insert([insertData]);

      if (error) {
        console.error("Ошибка вставки в базу данных:", error);
        throw error;
      }

      console.log("Свидание успешно создано:", newDate);
      dispatch({ type: "ADD_DATE", payload: newDate });
    } catch (error: unknown) {
      console.error("Ошибка при создании свидания:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Неизвестная ошибка при создании свидания";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error; // Пробрасываем ошибку дальше для обработки в компоненте
    }
  };

  const updateDate = async (dateId: string, updates: Partial<DateItem>) => {
    try {
      console.log("Обновление свидания:", { dateId, updates });

      // Преобразуем поля для базы данных
      const dbUpdates: any = { ...updates };

      // Преобразуем completedAt в completed_at
      if ("completedAt" in updates) {
        dbUpdates.completed_at = updates.completedAt
          ? updates.completedAt.toISOString()
          : null;
        delete dbUpdates.completedAt;
      }

      // Убираем поля, которые не должны обновляться в базе
      delete dbUpdates.id;
      delete dbUpdates.createdAt;
      delete dbUpdates.userId;
      delete dbUpdates.partnerId;
      delete dbUpdates.createdBy;

      console.log("Обновления для базы данных:", dbUpdates);

      const { error } = await supabase
        .from("dates")
        .update(dbUpdates)
        .eq("id", dateId);

      if (error) {
        console.error("Ошибка обновления в базе данных:", error);
        throw error;
      }

      // Обновляем локальное состояние
      const updatedDate = state.dates.find((d) => d.id === dateId);
      if (updatedDate) {
        const newUpdatedDate = { ...updatedDate, ...updates };
        console.log("Обновленное свидание:", newUpdatedDate);
        dispatch({
          type: "UPDATE_DATE",
          payload: newUpdatedDate,
        });
      }
    } catch (error: any) {
      console.error("Ошибка при обновлении свидания:", error);
      const errorMessage =
        error.message || "Неизвестная ошибка при обновлении свидания";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error; // Пробрасываем ошибку дальше для обработки в компоненте
    }
  };

  const deleteDate = async (dateId: string) => {
    try {
      const { error } = await supabase.from("dates").delete().eq("id", dateId);

      if (error) throw error;

      dispatch({ type: "DELETE_DATE", payload: dateId });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const completeDate = async (dateId: string, notes?: string) => {
    if (!user || !partner) return;

    try {
      console.log("Завершение свидания:", { dateId, notes, userId: user.id });

      const dateToComplete = state.dates.find((d) => d.id === dateId);
      if (!dateToComplete) {
        throw new Error("Свидание не найдено");
      }

      // Обновляем свидание
      await updateDate(dateId, { completed: true, completedAt: new Date() });

      // Определяем ID партнера
      const partnerUserId =
        partner.user_id_1 === user.id ? partner.user_id_2 : partner.user_id_1;

      // Определяем очки для каждого пользователя
      const isCreator = dateToComplete.createdBy === user.id;
      const creatorPoints = dateToComplete.difficulty; // Полные очки создателю
      const partnerPoints = Math.floor(dateToComplete.difficulty / 2); // Половина очков партнеру

      console.log("Распределение очков:", {
        isCreator,
        creatorPoints,
        partnerPoints,
        creatorId: dateToComplete.createdBy,
        partnerId: isCreator ? partnerUserId : user.id,
      });

      // Обновляем очки обоих партнеров в базе данных
      const { error: pointsError } = await supabase.rpc(
        "update_partner_points",
        {
          p_creator_id: dateToComplete.createdBy,
          p_partner_id: isCreator ? partnerUserId : user.id,
          p_points_to_add: dateToComplete.difficulty,
        }
      );

      if (pointsError) {
        console.error("Ошибка обновления очков:", pointsError);
        throw pointsError;
      }

      console.log("Очки успешно обновлены");

      // Обновляем профиль пользователя, чтобы получить актуальные очки
      await refreshUserProfile();

      // Создаем запись о выполнении для текущего пользователя
      const completedDate: CompletedDate = {
        id: generateId(),
        dateId,
        completedAt: new Date(),
        points: isCreator ? creatorPoints : partnerPoints,
        notes,
        userId: user.id,
      };

      console.log("Создание записи о выполнении:", completedDate);

      const { error } = await supabase.from("completed_dates").insert([
        {
          id: completedDate.id,
          date_id: completedDate.dateId,
          completed_at: completedDate.completedAt.toISOString(),
          points: completedDate.points,
          notes: completedDate.notes,
          user_id: completedDate.userId,
        },
      ]);

      if (error) {
        console.error("Ошибка создания записи о выполнении:", error);
        throw error;
      }

      console.log("Запись о выполнении успешно создана");
      dispatch({ type: "ADD_COMPLETED_DATE", payload: completedDate });
    } catch (error: any) {
      console.error("Ошибка при завершении свидания:", error);
      const errorMessage =
        error.message || "Неизвестная ошибка при завершении свидания";
      dispatch({ type: "SET_ERROR", payload: errorMessage });
      throw error; // Пробрасываем ошибку дальше для обработки в компоненте
    }
  };

  const undoCompleteDate = async (dateId: string) => {
    try {
      // Обновляем свидание
      await updateDate(dateId, { completed: false, completedAt: null as any });

      // Удаляем запись о выполнении
      const { error } = await supabase
        .from("completed_dates")
        .delete()
        .eq("date_id", dateId);

      if (error) throw error;

      dispatch({
        type: "SET_COMPLETED_DATES",
        payload: state.completedDates.filter((cd) => cd.dateId !== dateId),
      });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const addPrize = async (prizeData: Omit<Prize, "id" | "createdAt">) => {
    if (!user) return;

    try {
      const newPrize: Prize = {
        ...prizeData,
        id: generateId(),
        createdAt: new Date(),
        userId: user.id,
        partnerId: partner?.id,
      };

      const { error } = await supabase.from("prizes").insert([
        {
          id: newPrize.id,
          title: newPrize.title,
          description: newPrize.description,
          image: newPrize.image,
          type: newPrize.type,
          conditions: newPrize.conditions,
          is_repeatable: newPrize.isRepeatable,
          expires_at: newPrize.expiresAt?.toISOString(),
          user_id: newPrize.userId,
          partner_id: newPrize.partnerId || null,
          created_at: newPrize.createdAt.toISOString(),
        },
      ]);

      if (error) throw error;

      dispatch({ type: "ADD_PRIZE", payload: newPrize });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const updatePrize = async (prizeId: string, updates: Partial<Prize>) => {
    try {
      const { error } = await supabase
        .from("prizes")
        .update(updates)
        .eq("id", prizeId);

      if (error) throw error;

      const updatedPrize = state.prizes.find((p) => p.id === prizeId);
      if (updatedPrize) {
        dispatch({
          type: "UPDATE_PRIZE",
          payload: { ...updatedPrize, ...updates },
        });
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const deletePrize = async (prizeId: string) => {
    try {
      const { error } = await supabase
        .from("prizes")
        .delete()
        .eq("id", prizeId);

      if (error) throw error;

      dispatch({ type: "DELETE_PRIZE", payload: prizeId });
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const claimPrize = async (prizeId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase.rpc("claim_prize", {
        p_prize_id: prizeId,
        p_user_id: user.id,
      });

      if (error) throw error;

      // Обновляем приз в локальном состоянии
      const updatedPrize = state.prizes.find((p) => p.id === prizeId);
      if (updatedPrize) {
        dispatch({
          type: "UPDATE_PRIZE",
          payload: {
            ...updatedPrize,
            claimedAt: new Date(),
            claimedBy: user.id,
          },
        });
      }
    } catch (error: any) {
      dispatch({ type: "SET_ERROR", payload: error.message });
    }
  };

  const checkPrizes = (userId: string, userPoints: number = 0): Prize[] => {
    const availablePrizes: Prize[] = [];
    const userCompletedDates = state.completedDates.filter(
      (cd) => cd.userId === userId
    );
    const totalPoints = userPoints; // Используем очки из профиля пользователя
    const completedCount = userCompletedDates.length;

    state.prizes.forEach((prize) => {
      let shouldAward = false;

      switch (prize.type) {
        case "specific":
          if (prize.conditions.specificDateId) {
            const completedDate = userCompletedDates.find(
              (cd) => cd.dateId === prize.conditions.specificDateId
            );
            shouldAward = !!completedDate;
          }
          break;

        case "count":
          if (prize.conditions.countThreshold) {
            shouldAward = completedCount >= prize.conditions.countThreshold;
          }
          break;

        case "points":
          if (prize.conditions.pointsThreshold) {
            shouldAward = totalPoints >= prize.conditions.pointsThreshold;
          }
          break;
      }

      if (shouldAward) {
        availablePrizes.push(prize);
      }
    });

    return availablePrizes;
  };

  return (
    <AppContext.Provider
      value={{
        state,
        addDate,
        updateDate,
        deleteDate,
        completeDate,
        undoCompleteDate,
        addPrize,
        updatePrize,
        deletePrize,
        claimPrize,
        checkPrizes,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider");
  }
  return context;
}

