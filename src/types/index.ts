export interface DateItem {
  id: string;
  title: string;
  description?: string;
  tags: string[];
  location?: string;
  budget?: number;
  difficulty: 1 | 2 | 3; // 1-3 очка
  image?: string;
  completed: boolean;
  completedAt?: Date;
  createdAt: Date;
  userId: string; // ID пользователя, создавшего свидание
  partnerId?: string; // ID партнера (если свидание для пары)
  createdBy: string; // ID пользователя, который создал свидание
}

export interface Prize {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: "specific" | "count" | "points";
  conditions: {
    specificDateId?: string;
    countThreshold?: number;
    pointsThreshold?: number;
  };
  isRepeatable: boolean;
  expiresAt?: Date;
  createdAt: Date;
  userId: string; // ID пользователя, создавшего приз
  partnerId?: string; // ID партнера (если приз для пары)
  claimedAt?: Date; // Дата получения приза
  claimedBy?: string; // ID пользователя, получившего приз
}

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: Date;
  partnerId?: string; // ID партнера
  isInitiator: boolean; // Роль в паре
}

export interface Partner {
  id: string;
  user_id_1: string;
  user_id_2: string;
  createdAt: Date;
  status: "pending" | "accepted" | "rejected";
}

export interface CompletedDate {
  id: string;
  dateId: string;
  completedAt: Date;
  points: number;
  notes?: string;
  prizeId?: string;
  userId: string; // ID пользователя, выполнившего свидание
}

export interface AuthUser {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  points?: number;
}

export interface AuthState {
  user: AuthUser | null;
  loading: boolean;
  error: string | null;
}
