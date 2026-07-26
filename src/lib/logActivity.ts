import { createClient } from "@/lib/supabase/client";

export async function logStudyActivity(
  userId: string,
  activityType: 'quiz' | 'upload' | 'study_session'
) {
  const supabase = createClient();
  const today = new Date().toISOString().split('T')[0];
  
  const { error } = await supabase
    .from('study_activity')
    .upsert({
      user_id: userId,
      activity_date: today,
      activity_type: activityType
    }, { onConflict: 'user_id,activity_date' });

  if (error) {
    console.error(`Failed to log study activity (${activityType}):`, error.message);
    throw error;
  }
}
