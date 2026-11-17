export type AppMode = 'demo' | 'production';

const configuredMode = import.meta.env.VITE_APP_MODE;

// Production menjadi mode default yang aman.
export const APP_MODE: AppMode =
  configuredMode === 'demo' ? 'demo' : 'production';

export const IS_DEMO_MODE = APP_MODE === 'demo';
