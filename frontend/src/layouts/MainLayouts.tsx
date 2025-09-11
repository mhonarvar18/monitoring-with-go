import { useEffect, useState } from "react";
import Header from "../components/Header";
import { Outlet } from "react-router";
import Aside from "../components/SideNav";
import { useUserStore } from "../store/useUserStore";
import { useHeartbeat } from "../hooks/useHeartbeat";
import { useAppSettings } from "../hooks/useAppSettings";

interface MainLoyoutsProps {
  bank?: string;
}

const MainLayouts = ({ bank }: MainLoyoutsProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const user = useUserStore((state) => state.userInfo); // Get the current user from the user store (Zustand or similar)
  const { mutate: sendHeartbeat } = useHeartbeat(); // Destructure the mutate function from the custom heartbeat hook
  const { fetchAppSettings } = useAppSettings(); // Fetch app settings using a custom hook
  const settings = fetchAppSettings.data?.data?.data; // Extract settings array from the fetched data
  const heartbeatValue = settings?.find((s) => s.key === "heartbeat")?.value; // Find the specific setting with key "heartbeat" and get its value
  const heartbeatInterval = ((heartbeatValue / 2) * 60 - 10) * 1000 || 50000; // fallback to 2 minute if undefined  

  useEffect(() => {
    if (!user?.id || heartbeatInterval == null) return;
    const interval = setInterval(
      () => {
        sendHeartbeat(user.id);
      }, heartbeatInterval);
    return () => clearInterval(interval);
  }, [user?.id, heartbeatInterval]);

  return (
    <>
      <div className="h-screen flex flex-row-reverse bg-gray-50">
        {/* ―――――――――― Desktop Sidebar (only on xl+) ―――――――――――― */}
        <aside className="hidden xl:flex xl:min-w-[16vw] bg-white">
          <Aside />
        </aside>

        {/* ―――――――――― Main Column ―――――――――――― */}
        <div className="w-full flex flex-col justify-start items-center">
          {/* ―――――――――― Top Header ―――――――――――― */}
          <header
            className="
            w-full
            min-h-[6vh]            
            bg-white
            fixed md:static     
            top-0 left-0 right-0
            z-40
          "
          >
            <Header bank={bank} onMenuClick={() => setSidebarOpen(true)} />
          </header>

          {/* ―――――――――― Content Area (fills all remaining space below the header) ―――――――――――― */}
          <div
            className="
            w-full             
            pt-[8vh]           
            md:pt-0               
            bg-main
            h-full
            p-1
            overflow-y-auto
          "
          >
            <Outlet />
          </div>
        </div>

        {/* ―――――――――― Mobile Sidebar Overlay (slides in from right) ―――――――――――― */}
        {sidebarOpen && (
          <>
            <div
              className="fixed inset-0 z-40 bg-black bg-opacity-40"
              onClick={() => setSidebarOpen(false)}
            />
            <div className="fixed right-0 top-0 bottom-0 z-50 w-64 bg-white shadow-lg">
              <Aside isMobile onClose={() => setSidebarOpen(false)} />
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MainLayouts;
