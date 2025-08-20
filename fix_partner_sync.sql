-- Исправление синхронизации партнеров
-- Создаем функцию для обновления partner_id у обоих пользователей

-- Функция для установки партнерства
CREATE OR REPLACE FUNCTION set_partnership(
  partner_id UUID,
  user1_id UUID,
  user2_id UUID
) RETURNS void AS $$
BEGIN
  -- Обновляем профиль первого пользователя
  UPDATE profiles 
  SET partner_id = set_partnership.partner_id 
  WHERE id = user1_id;
  
  -- Обновляем профиль второго пользователя
  UPDATE profiles 
  SET partner_id = set_partnership.partner_id 
  WHERE id = user2_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Функция для удаления партнерства
CREATE OR REPLACE FUNCTION remove_partnership(
  user1_id UUID,
  user2_id UUID
) RETURNS void AS $$
BEGIN
  -- Удаляем partner_id у первого пользователя
  UPDATE profiles 
  SET partner_id = NULL 
  WHERE id = user1_id;
  
  -- Удаляем partner_id у второго пользователя
  UPDATE profiles 
  SET partner_id = NULL 
  WHERE id = user2_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Даем права на выполнение функций аутентифицированным пользователям
GRANT EXECUTE ON FUNCTION set_partnership(UUID, UUID, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION remove_partnership(UUID, UUID) TO authenticated;
