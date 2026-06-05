import { IDatabaseClient } from './IDatabaseClient';
import { SupabaseDbClient } from './SupabaseDbClient';
import { LocalStorageDbClient } from './LocalStorageDbClient';

class DbClientFactory {
  private static instance: IDatabaseClient | null = null;

  public static getClient(): IDatabaseClient {
    if (this.instance) return this.instance;

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const useSupabase = !!(url && key);

    if (useSupabase) {
      if (typeof window !== 'undefined') {
        console.log("[DbClientFactory] Initializing Cloud Mode (Supabase)");
      }
      this.instance = new SupabaseDbClient();
    } else {
      if (typeof window !== 'undefined') {
        console.log("[DbClientFactory] Initializing Local Mode (LocalStorage fallback)");
      }
      this.instance = new LocalStorageDbClient();
    }

    return this.instance;
  }
}

export const dbClient = DbClientFactory.getClient();
export const isCloudMode = (): boolean => {
  if (typeof window === 'undefined') return false;
  return !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && 
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
