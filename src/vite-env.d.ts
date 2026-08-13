/// <reference types="vite/client" />

interface ReCaptchaV2Api {
  render(container: HTMLElement | string, parameters: { sitekey: string; callback?: () => void }): number;
  getResponse(widgetId?: number): string;
  reset(widgetId?: number): void;
}

interface Window {
  grecaptcha?: ReCaptchaV2Api;
}
