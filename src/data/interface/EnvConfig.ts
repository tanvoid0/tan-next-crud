function getConfig<T extends BaseEnvConfig>(key: keyof T): string {
  const value = process.env[key as string];
  
  if (!value) {
    throw new Error(`Environment variable ${key as string} is not defined`);
  }
  return value;
}

const ENVIRONMENT = getConfig('ENVIRONMENT') == 'production' ? "production" : "development" as string;
export const env: BaseEnvConfig = {
  ENVIRONMENT: ENVIRONMENT,
  IS_PRODUCTION: ENVIRONMENT === 'production',
  MONGO_URI: getConfig('MONGO_URI') as string
};