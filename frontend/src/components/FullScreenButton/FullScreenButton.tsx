import { RiFullscreenFill } from "react-icons/ri";
import useFullscreen from "../../hooks/useFullScreen";

const FullScreenButton: React.FC = () => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  return (
    <button onClick={toggleFullscreen} title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}>
      <RiFullscreenFill size={22} className="text-gray-700 mb-1.5" />
    </button>
  );
};

export default FullScreenButton;
