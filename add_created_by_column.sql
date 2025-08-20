-- Добавление поля created_by в таблицу dates
ALTER TABLE dates ADD COLUMN created_by UUID REFERENCES auth.users(id);

-- Обновляем существующие записи, устанавливая created_by равным user_id
UPDATE dates SET created_by = user_id WHERE created_by IS NULL;

-- Делаем поле created_by обязательным
ALTER TABLE dates ALTER COLUMN created_by SET NOT NULL;
