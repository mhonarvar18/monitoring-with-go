import { useEffect, useState } from "react";

const useFullscreen = () => {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = () => {
    const doc = document as any;
    const docEl = document.documentElement;

    if (
      !document.fullscreenElement &&
      !doc.webkitFullscreenElement &&
      !doc.msFullscreenElement
    ) {
      if (docEl.requestFullscreen) {
        docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        docEl.webkitRequestFullscreen();
      } else if (docEl.msRequestFullscreen) {
        docEl.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (doc.webkitExitFullscreen) {
        doc.webkitExitFullscreen();
      } else if (doc.msExitFullscreen) {
        doc.msExitFullscreen();
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      const doc = document as any;
      const isFs =
        !!document.fullscreenElement ||
        !!doc.webkitFullscreenElement ||
        !!doc.msFullscreenElement;
      setIsFullscreen(isFs);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    document.addEventListener("webkitfullscreenchange", onFullscreenChange);
    document.addEventListener("msfullscreenchange", onFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", onFullscreenChange);
      document.removeEventListener("webkitfullscreenchange", onFullscreenChange);
      document.removeEventListener("msfullscreenchange", onFullscreenChange);
    };
  }, []);

  return { isFullscreen, toggleFullscreen };
};

export default useFullscreen;
