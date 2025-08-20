-- Добавление системы очков
-- Добавляем поле points в таблицу profiles (если его нет)

-- Добавляем поле points в таблицу profiles (если его нет)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'points') THEN
        ALTER TABLE profiles ADD COLUMN points INTEGER DEFAULT 0;
    END IF;
END $$;

-- Удаляем старую функцию если она существует
DROP FUNCTION IF EXISTS update_partner_points(UUID, UUID, INTEGER);

-- Создаем функцию для обновления очков обоих партнеров при завершении свидания
CREATE OR REPLACE FUNCTION update_partner_points(
  p_creator_id UUID,
  p_partner_id UUID,
  p_points_to_add INTEGER
) RETURNS void AS $$
BEGIN
  -- Обновляем очки создателя свидания (полные очки)
  UPDATE profiles 
  SET points = points + p_points_to_add 
  WHERE id = p_creator_id;
  
  -- Обновляем очки партнера (половина очков)
  UPDATE profiles 
  SET points = points + (p_points_to_add / 2) 
  WHERE id = p_partner_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Даем права на выполнение функции аутентифицированным пользователям
GRANT EXECUTE ON FUNCTION update_partner_points(UUID, UUID, INTEGER) TO authenticated;
