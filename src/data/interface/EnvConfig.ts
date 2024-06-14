type EnvKey<T> = { [key in keyof T]: string };

interface BaseEnvConfig {
  IS_PRODUCTION: boolean;
  ENVIRONMENT: string;
  MONGO_URI: string;
}


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