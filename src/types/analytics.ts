export interface GAEvent {
  action: string;
  category: string;
  label?: string;
  value?: number;
}

export interface CustomEvent {
  eventName: string;
  parameters?: Record<string, any>;
}

export interface PageView {
  path: string;
  title?: string;
}