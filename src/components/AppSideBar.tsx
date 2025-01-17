"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
// import { Button } from "./ui/button";
import { useSidebar } from "@/components/ui/sidebar";
// import { useNavigate } from "react-router";
import { Separator } from "./ui/separator";
import { useQuery } from "@tanstack/react-query";
import {
  planning_roles,
  setAccessToken,
  setRefreshToken,
  staff_roles,
  head_roles,
  UserAPI,
  admin_roles,
} from "./API";
import BookIcon from "./icons/bookicon";
import DashboardIcon from "./icons/dashboardicon";
import { Button } from "./ui/button";
import AppIcon from "./icons/appicon";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./plugins/redux/Store";
import PersonIcon from "./icons/personicon";
import LogoutIcon from "./icons/logouticon";
import { toast } from "react-toastify";
import { auth_toggle } from "./plugins/redux/slices/AuthSlice";
import PostIcon from "./icons/posticon";

export default function AppSidebar() {
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });
  const dispatch = useDispatch();
  const authenticated = useSelector((state: RootState) => state.auth.value);
  const { toggleSidebar } = useSidebar();
  const navigate = useNavigate();
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex flex-row gap-2 items-center">
          <AppIcon size={64} />
          <div className="flex flex-col gap-2 items-start">
            <p className="text-sm text-center sm:text-left font-bold">DDMS</p>
            <div className="flex flex-row gap-2 items-start justify-center">
              <PersonIcon size={24} />
              <p className="text-sm text-center sm:text-left">
                {user.data?.full_name}
              </p>
            </div>
          </div>
        </div>
        <Button onClick={() => toggleSidebar()}>
          <DashboardIcon />
        </Button>
        <Separator />
        <div className="flex flex-row items-center gap-1">
          <BookIcon />
          <p className="text-sm text-center sm:text-left font-bold">
            Role: {user.data?.role}
          </p>
        </div>
        <Separator />
      </SidebarHeader>
      <SidebarContent className="space-y-1">
        {authenticated ? (
          <>
            <Button onClick={() => navigate("/dashboard/")} className="w-full">
              <div className="flex flex-row items-center w-full gap-1">
                <DashboardIcon />
                <span>Dashboard</span>
              </div>
            </Button>
            <Button onClick={() => navigate("/profile/")} className="w-full">
              <div className="flex flex-row items-center w-full gap-1">
                <PersonIcon />
                <span>Profile</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
        {authenticated ? (
          <>
            <Button
              onClick={async () => {
                navigate("/");
                await dispatch(auth_toggle());
                await setAccessToken("");
                await setRefreshToken("");
                toast("Logged out", {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
              }}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <LogoutIcon />
                <span>Logout</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
        {user.data && user.data.role == "client" ? (
          <>
            <p className="text-sm text-center sm:text-left font-bold">
              Client Actions
            </p>
            <Button
              onClick={() => navigate("/requests/list")}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <BookIcon />
                <span>View Document Requests (Client)</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/authorization_requests/list")}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <BookIcon />
                <span>View Authorization Requests (Client)</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/requests/create")}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <BookIcon />
                <span>New Document Request</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/authorization_requests/create")}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <BookIcon />
                <span>New Authorization Request</span>
              </div>
            </Button>
            <Button
              onClick={() => navigate("/questionnaires/create/")}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <PostIcon />
                <span>Feedback (Survey)</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
        {user.data && staff_roles.includes(user.data.role) ? (
          <>
            <p className="text-sm text-center sm:text-left font-bold">
              Staff Actions
            </p>
            {admin_roles.includes(user.data.role) ? (
              <Button
                onClick={() => navigate("/users/list/")}
                className="w-full"
              >
                <div className="flex flex-row items-center w-full gap-1">
                  <BookIcon />
                  <span>Users (Admin)</span>
                </div>
              </Button>
            ) : (
              <></>
            )}
            {head_roles.includes(user.data.role) ? (
              <>
                <Button
                  onClick={() => navigate("/documents/list/head/")}
                  className="w-full"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>Documents (Head)</span>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate("/requests/list/head/")}
                  className="w-full"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>Document Requests (Head)</span>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate("/authorization_requests/list/head/")}
                  className="w-full"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>Authorization Requests (Head)</span>
                  </div>
                </Button>
              </>
            ) : (
              <>
                <Button
                  onClick={() => navigate("/requests/list/staff/")}
                  className="w-full"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>Document Requests (Staff)</span>
                  </div>
                </Button>
                <Button
                  onClick={() =>
                    navigate("/authorization_requests/list/staff/")
                  }
                  className="w-full"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>Authorization Requests (Staff)</span>
                  </div>
                </Button>
                <Button
                  onClick={() => navigate("/documents/list/staff/")}
                  className="w-full"
                >
                  <div className="flex flex-row items-center w-full gap-1">
                    <BookIcon />
                    <span>View Documents (Staff)</span>
                  </div>
                </Button>
              </>
            )}
            <Button
              onClick={() => navigate("/documents/upload/")}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <BookIcon />
                <span>Upload Document (Staff)</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
        {user.data && planning_roles.includes(user.data.role) ? (
          <>
            <Button
              onClick={() => navigate("/questionnaires/list/")}
              className="w-full"
            >
              <div className="flex flex-row items-center w-full gap-1">
                <PostIcon />
                <span>View Questionnaires (Planning)</span>
              </div>
            </Button>
          </>
        ) : (
          <></>
        )}
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
