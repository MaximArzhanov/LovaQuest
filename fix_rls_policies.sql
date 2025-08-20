-- Исправление RLS политик для таблицы profiles
-- Разрешаем пользователям видеть профили других пользователей для функциональности партнерства

-- Удаляем существующие политики для таблицы profiles (если они есть)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

-- Создаем новые политики
-- Политика для просмотра профилей (разрешаем видеть все профили)
CREATE POLICY "Users can view all profiles" ON profiles
FOR SELECT USING (true);

-- Политика для обновления собственного профиля
CREATE POLICY "Users can update own profile" ON profiles
FOR UPDATE USING (auth.uid() = id);

-- Политика для вставки собственного профиля
CREATE POLICY "Users can insert own profile" ON profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- Политика для удаления собственного профиля (если нужно)
CREATE POLICY "Users can delete own profile" ON profiles
FOR DELETE USING (auth.uid() = id);
