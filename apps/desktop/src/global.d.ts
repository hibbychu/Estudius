export {};

declare global {
  interface Window {
    electronAPI?: {
      sendMessage: (channel: string, data: any) => void;
      onMessage: (channel: string, callback: (event: any, data: any) => void) => void;
    };
  }
}
