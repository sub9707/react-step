export interface CodeSandboxProps {
  code?: string;
  language?: 'javascript' | 'jsx' | 'typescript' | 'tsx';
  title?: string;
  editable?: boolean;
  hideCode?: boolean;
  minHeight?: number;
  maxHeight?: number;
  autoHeight?: boolean;
}

export interface CodeEditorProps {
  code: string;
  language: string;
  editable: boolean;
  onChange: (code: string) => void;
}

export interface PreviewFrameProps {
  code: string;
  isReactCode: boolean;
  onHeightChange?: (height: number) => void;
  minHeight: number;
  maxHeight: number;
}

export interface ControlBarProps {
  language: string;
  isReactCode: boolean;
  isLoading: boolean;
  hideCode: boolean;
  editable: boolean;
  onRun: () => void;
}