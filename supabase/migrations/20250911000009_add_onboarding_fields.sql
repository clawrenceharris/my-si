-- Add onboarding fields to profiles table
ALTER TABLE profiles 
ADD COLUMN onboarding_complete BOOLEAN NOT NULL DEFAULT FALSE,
ADD COLUMN courses_instructed TEXT[] DEFAULT '{}';

-- Create index for onboarding queries
CREATE INDEX idx_profiles_onboarding_complete ON profiles(onboarding_complete);

-- Update existing profiles to have onboarding_complete = true if they have a role
UPDATE profiles 
SET onboarding_complete = TRUE 
WHERE role IS NOT NULL;