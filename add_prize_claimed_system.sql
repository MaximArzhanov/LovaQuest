-- Добавление системы получения призов
-- Добавляем поле claimed_at в таблицу prizes (если его нет)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'prizes' AND column_name = 'claimed_at') THEN
        ALTER TABLE prizes ADD COLUMN claimed_at TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Добавляем поле claimed_by в таблицу prizes (если его нет)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns
                   WHERE table_name = 'prizes' AND column_name = 'claimed_by') THEN
        ALTER TABLE prizes ADD COLUMN claimed_by UUID REFERENCES auth.users(id);
    END IF;
END $$;

-- Создаем функцию для подтверждения получения приза
CREATE OR REPLACE FUNCTION claim_prize(
  p_prize_id UUID,
  p_user_id UUID
) RETURNS void AS $$
BEGIN
  -- Проверяем, что приз еще не получен
  IF EXISTS (SELECT 1 FROM prizes WHERE id = p_prize_id AND claimed_at IS NOT NULL) THEN
    RAISE EXCEPTION 'Приз уже получен';
  END IF;
  
  -- Обновляем приз как полученный
  UPDATE prizes
  SET claimed_at = NOW(),
      claimed_by = p_user_id
  WHERE id = p_prize_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Даем права на выполнение функции аутентифицированным пользователям
GRANT EXECUTE ON FUNCTION claim_prize(UUID, UUID) TO authenticated;
