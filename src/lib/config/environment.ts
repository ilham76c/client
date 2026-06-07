/**
 * Environment configuration
 */
export const env = {
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000',
  NODE_ENV: process.env.NODE_ENV as 'development' | 'production' | 'test',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
} as const;

/**
 * Validate required environment variables at startup
 */
export const validateEnv = () => {
  const required = ['NEXT_PUBLIC_API_BASE_URL'];
  const missing = required.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing environment variables: ${missing.join(', ')}`);
  }
};
