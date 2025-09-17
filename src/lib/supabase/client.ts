import { createClient } from "@supabase/supabase-js";

// Create a custom supabase client that injects the Clerk Supabase token into the request headers
export default function createClerkSupabaseClient({
  getTokenFn,
}: {
  getTokenFn: () => Promise<string | null>;
}) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_KEY!,
    {
      global: {
        // Get the custom Supabase token from Clerk
        fetch: async (url, options = {}) => {
          const token = (await getTokenFn())?.trim();

          // Insert the Clerk Supabase token into the headers
          const headers = new Headers(options?.headers);

          if (token) {
            headers.set("Authorization", `Bearer ${token}`);
          }
          // Call the default fetch
          return fetch(url, {
            ...options,

            headers,
          });
        },
      },
    }
  );
}
