import { createClient } from "@supabase/supabase-js";

// Create a custom supabase client that injects the Clerk Supabase token into the request headers
export default function createClerkSupabaseClient({
  getTokenFn,
}: {
  getTokenFn: () => Promise<string | null>;
}) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      // Session accessed from Clerk SDK, either as Clerk.session (vanilla
      // JavaScript) or useSession (React)

      accessToken: async () => {
        return (await getTokenFn()) ?? null;
      },
    }
  );
}
