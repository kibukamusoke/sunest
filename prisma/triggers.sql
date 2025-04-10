-- This file contains example triggers for PostgreSQL that emit notifications
-- These triggers can be applied to your database to automatically notify your application
-- when important events occur

-- Function to emit user_created notifications
CREATE OR REPLACE FUNCTION notify_user_created()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('user_created', json_build_object(
    'id', NEW.id,
    'email', NEW.email,
    'createdAt', NEW.created_at
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user creation
CREATE TRIGGER user_created_trigger
AFTER INSERT ON "User"
FOR EACH ROW
EXECUTE FUNCTION notify_user_created();

-- Function to emit user_updated notifications
CREATE OR REPLACE FUNCTION notify_user_updated()
RETURNS TRIGGER AS $$
DECLARE
  updated_fields TEXT[] := '{}';
BEGIN
  IF OLD.email <> NEW.email THEN
    updated_fields := array_append(updated_fields, 'email');
  END IF;
  
  IF OLD.first_name <> NEW.first_name OR 
     (OLD.first_name IS NULL AND NEW.first_name IS NOT NULL) OR
     (OLD.first_name IS NOT NULL AND NEW.first_name IS NULL) THEN
    updated_fields := array_append(updated_fields, 'firstName');
  END IF;
  
  IF OLD.last_name <> NEW.last_name OR 
     (OLD.last_name IS NULL AND NEW.last_name IS NOT NULL) OR
     (OLD.last_name IS NOT NULL AND NEW.last_name IS NULL) THEN
    updated_fields := array_append(updated_fields, 'lastName');
  END IF;
  
  IF OLD.is_active <> NEW.is_active THEN
    updated_fields := array_append(updated_fields, 'isActive');
  END IF;
  
  -- Only notify if fields were actually changed
  IF array_length(updated_fields, 1) > 0 THEN
    PERFORM pg_notify('user_updated', json_build_object(
      'id', NEW.id,
      'updatedFields', updated_fields,
      'updatedAt', NEW.updated_at
    )::text);
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for user update
CREATE TRIGGER user_updated_trigger
AFTER UPDATE ON "User"
FOR EACH ROW
EXECUTE FUNCTION notify_user_updated();

-- Function to emit file_uploaded notifications
CREATE OR REPLACE FUNCTION notify_file_uploaded()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('file_uploaded', json_build_object(
    'id', NEW.id,
    'filename', NEW.filename,
    'size', NEW.size,
    'userId', NEW.user_id,
    'uploadedAt', NEW.created_at
  )::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for file upload
CREATE TRIGGER file_uploaded_trigger
AFTER INSERT ON "File"
FOR EACH ROW
EXECUTE FUNCTION notify_file_uploaded();

-- Function to emit file_deleted notifications
CREATE OR REPLACE FUNCTION notify_file_deleted()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM pg_notify('file_deleted', json_build_object(
    'id', OLD.id,
    'filename', OLD.filename,
    'userId', OLD.user_id,
    'deletedAt', now()
  )::text);
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- Trigger for file deletion
CREATE TRIGGER file_deleted_trigger
BEFORE DELETE ON "File"
FOR EACH ROW
EXECUTE FUNCTION notify_file_deleted();

-- Example of how to manually send a system event notification from SQL
-- This can be used for critical database events like low disk space, deadlocks, etc.
-- PERFORM pg_notify('system_event', '{"event":"low_disk_space","severity":"warning","message":"Database disk usage exceeds 80%","timestamp":"2023-04-10T13:45:00Z"}');

-- Example of how to use this in your application:
-- 1. Create a function that runs checks and emits system events
CREATE OR REPLACE FUNCTION check_database_health()
RETURNS void AS $$
DECLARE
  disk_usage FLOAT;
BEGIN
  -- Example: Get disk usage (this is pseudocode, actual implementation depends on your DB)
  SELECT pg_database_size(current_database()) / (1024*1024*1024) INTO disk_usage;
  
  -- Example: Alert if disk usage is high
  IF disk_usage > 80 THEN
    PERFORM pg_notify('system_event', json_build_object(
      'event', 'low_disk_space',
      'severity', 'warning',
      'message', 'Database disk usage exceeds 80%',
      'timestamp', now(),
      'metadata', json_build_object('usage_gb', disk_usage)
    )::text);
  END IF;
  
  -- Add more health checks as needed
END;
$$ LANGUAGE plpgsql;

-- 2. Schedule it to run periodically
-- This requires setting up a PostgreSQL extension like pg_cron
-- Example:
-- SELECT cron.schedule('0 * * * *', 'SELECT check_database_health()');