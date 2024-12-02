export type AppConfig = {
  nodeEnv: string;
  isProduction: boolean;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  zipkinUrl: string;
  promethuesUrl: string;
};
