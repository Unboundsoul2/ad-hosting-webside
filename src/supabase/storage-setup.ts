import { supabase } from "@/integrations/supabase/client";

export async function setupStorage() {
  // Create profiles bucket if it doesn't exist
  const { data: buckets } = await supabase.storage.listBuckets();
  
  if (!buckets?.find(bucket => bucket.name === 'profiles')) {
    await supabase.storage.createBucket('profiles', {
      public: true,
      fileSizeLimit: 2 * 1024 * 1024, // 2MB
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/gif']
    });
  }
}
