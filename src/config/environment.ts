// Environment configuration

interface EnvironmentConfig {
  apiUrl: string;
  supabaseUrl: string;
  supabaseAnonKey: string;
  isProduction: boolean;
}

const devConfig: EnvironmentConfig = {
  apiUrl: 'http://localhost:3000',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  isProduction: false,
};

const prodConfig: EnvironmentConfig = {
  apiUrl: 'https://serene-symphony-backend.onrender.com',
  supabaseUrl: import.meta.env.VITE_SUPABASE_URL as string,
  supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY as string,
  isProduction: true,
};

// Select the appropriate config based on environment
const config: EnvironmentConfig = import.meta.env.PROD ? prodConfig : devConfig;

export default config; 