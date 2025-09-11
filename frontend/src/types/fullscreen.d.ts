interface Document {
    webkitExitFullscreen?: () => Promise<void>;
    msExitFullscreen?: () => void;
    webkitFullscreenElement?: Element | null;
    msFullscreenElement?: Element | null;
  }
  
  interface HTMLElement {
    webkitRequestFullscreen?: () => void;
    msRequestFullscreen?: () => void;
  }
  