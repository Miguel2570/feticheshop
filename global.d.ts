export {};

declare global {
  interface Window {
    openCookieSettings?: () => void;
  }
}