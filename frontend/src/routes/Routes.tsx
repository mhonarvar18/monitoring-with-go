import { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import MainLayouts from "../layouts";
import LoginPage from "../features/auth/pages/LoginPage";
import Events from "../pages/Events";
import Map from "../pages/Map";
import Locations from "../pages/Locations";
import Pazhonic from "../pages/Pazhonic";
import Branch from "../pages/Branch";
import Alarms from "../pages/Alarms";
import AlarmCategories from "../pages/AlarmCategories";
import ZoneTypes from "../pages/ZoneTypes";
import AuthLogs from "../pages/AuthLogs";
import ActionLogs from "../pages/ActionLogs/ActionLogs";
import Support from "../pages/Support";
import Setting from "../pages/Setting";
import Users from "../pages/Users";
import ReqRegister from "../pages/ReqRegister";
import ReqPassword from "../pages/ReqPassword";
import Profile from "../pages/Profile";
import PanelTypes from "../pages/PanelTypes";
import { RequirePermission } from "../components/RequirePermission/RequirePermission";
import BackupFiles from "../pages/BackupFiles";
import EventsReport from "../pages/EventsReport";
import CameraSetting from "../pages/CameraSetting";
import AboutUs from "../pages/AboutUs";

// const dynamicRoute = "sepah"; // This is your dynamic path

const AppRoutes: React.FC = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="flex justify-center items-center w-full h-screen">
              در حال بارگذاری...
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<LoginPage dynamicRoute="keshavarzi" />} />
            <Route path={`/:dynamicRoute/dashboard`} element={<MainLayouts bank="keshavarzi" />}>
              <Route path="events" element={<Events />} />
              <Route path="maps" element={<Map />} />
              <Route
                path="locations"
                element={
                  <RequirePermission perm="location:read">
                    <Locations />
                  </RequirePermission>
                }
              />
              <Route path="pazhonic" element={<Pazhonic />} />
              <Route
                path="branches"
                element={
                  <RequirePermission perm="branch:read">
                    <Branch />
                  </RequirePermission>
                }
              />
              <Route
                path="alarms"
                element={
                  <RequirePermission perm="alarm:read">
                    <Alarms />
                  </RequirePermission>
                }
              />
              <Route
                path="category-alarms"
                element={
                  <RequirePermission perm="alarmcategory:read">
                    <AlarmCategories />
                  </RequirePermission>
                }
              />
              <Route
                path="zone-types"
                element={
                  <RequirePermission perm="zonetype:read">
                    <ZoneTypes />
                  </RequirePermission>
                }
              />
              <Route
                path="auth-logs"
                element={
                  <RequirePermission perm="authlog:read">
                    <AuthLogs />
                  </RequirePermission>
                }
              />
              <Route
                path="action-logs"
                element={
                  <RequirePermission perm="actionlog:read">
                    <ActionLogs />
                  </RequirePermission>
                }
              />
              <Route path="support" element={<Support />} />
              <Route
                path="app-settings"
                element={
                  <RequirePermission perm="appsetting:read">
                    <Setting />
                  </RequirePermission>
                }
              />
              <Route 
                path="cctv-settings"
                element={
                  <CameraSetting />
                }
              />
              <Route
                path="users"
                element={
                  <RequirePermission perm="user:read">
                    <Users />
                  </RequirePermission>
                }
              />
              <Route path="req-registers" element={
                <RequirePermission perm="usercreate:read">
                  <ReqRegister />
                </RequirePermission>
              } />
              <Route path="req-password" element={<ReqPassword />} />
              <Route path="profile" element={<Profile />} />
              <Route path="panel-types" element={<PanelTypes />} />
              <Route path="backup-files" element={<BackupFiles />}/>
              <Route path="events-reports" element={<EventsReport />}/>
              <Route path="about-us" element={<AboutUs />}/>
            </Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default AppRoutes;
