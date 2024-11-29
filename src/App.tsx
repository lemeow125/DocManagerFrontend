import { createHashRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/LoginPage";
import ErrorPage from "./pages/ErrorPage";
import { SidebarProvider } from "./components/ui/sidebar";
import { Provider } from "react-redux";
import store from "./components/plugins/redux/Store";
import Header from "./components/ui/header";
import Revalidator from "./components/Revalidator";
import AppSidebar from "./components/AppSideBar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import DashboardPage from "./pages/DashboardPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfilePage from "./pages/ProfilePage";
import UploadDocumentPage from "./pages/UploadDocumentPage";
import StaffOnlyPage from "./components/StaffOnlyPage";
import StaffDocumentsPage from "./pages/StaffDocumentsPage";
import DocumentRequestsPage from "./pages/ClientDocumentRequestsPage";
import ClientDocumentsPage from "./pages/ClientDocumentsPage";
import HeadOnlyPage from "./components/HeadOnlyPage";
import HeadDocumentRequestsPage from "./pages/HeadDocumentRequestsPage";
import RegisterPage from "./pages/RegisterPage";
import ActivationPage from "./pages/ActivationPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ResetPasswordConfirmPage from "./pages/ResetPasswordConfirmPage";
import CreateDocumentRequestPage from "./pages/CreateDocumentRequestPage";
import SubmitQuestionnairePage from "./pages/SubmitQuestionnairePage";
import StaffDocumentRequestsPage from "./pages/StaffDocumentRequestsPage";
import StaffQuestionnairesPage from "./pages/StaffQuestionnairesPage";
import ExportCRS03 from "./pages/ExportCRS03";
const queryClient = new QueryClient();

const router = createHashRouter([
  {
    path: "/",
    element: (
      <>
        <Revalidator />
        <LoginPage />
      </>
    ),
  },
  {
    path: "/register/",
    element: (
      <>
        <Revalidator />
        <RegisterPage />
      </>
    ),
  },
  {
    path: "/reset_password/",
    element: (
      <>
        <Revalidator />
        <ResetPasswordPage />
      </>
    ),
  },
  {
    path: "/reset_password/confirm/:uid/:token/",
    element: (
      <>
        <Revalidator />
        <ResetPasswordConfirmPage />
      </>
    ),
  },
  {
    path: "/activation/:uid/:token/",
    element: <ActivationPage />,
  },
  {
    path: "/dashboard/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <DashboardPage />
      </>
    ),
  },
  {
    path: "/profile/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <ProfilePage />
      </>
    ),
  },
  {
    path: "/requests/create/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <CreateDocumentRequestPage />
      </>
    ),
  },
  {
    path: "/documents/list/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <ClientDocumentsPage />
      </>
    ),
  },
  {
    path: "/documents/list/staff/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <StaffDocumentsPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/requests/list/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <DocumentRequestsPage />
      </>
    ),
  },
  {
    path: "/requests/list/staff/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <StaffDocumentRequestsPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/requests/list/head/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <HeadOnlyPage>
          <HeadDocumentRequestsPage />
        </HeadOnlyPage>
      </>
    ),
  },
  {
    path: "/documents/upload",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <UploadDocumentPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/questionnaires/create/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <SubmitQuestionnairePage />
      </>
    ),
  },
  {
    path: "/questionnaires/list/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <Revalidator />
        <StaffOnlyPage>
          <StaffQuestionnairesPage />
        </StaffOnlyPage>
      </>
    ),
  },
  {
    path: "/export/CRS03/",
    element: (
      <>
        <Header />
        <AppSidebar />
        <ExportCRS03 />
      </>
    ),
  },
  {
    path: "*",
    element: <ErrorPage statusCode={404} errorMessage={"Page not found"} />,
  },
]);
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <SidebarProvider>
          <RouterProvider router={router} />
          <ToastContainer
            position={"top-right"}
            autoClose={1500}
            closeOnClick
            pauseOnHover
            draggable
            theme={"light"}
            limit={3}
          />
        </SidebarProvider>
      </Provider>
    </QueryClientProvider>
  );
}
