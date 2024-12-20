import {
  DocumentRequestsAPI,
  DocumentRequestType,
  DocumentsAPI,
  DocumentType,
  QuestionnairesAPI,
  UserAPI,
} from "@/components/API";
import { useQuery } from "@tanstack/react-query";
import ErrorPage from "./ErrorPage";
import LoadingPage from "./LoadingPage";
import StatsWidget from "@/components/StatsWidget";

export default function DashboardPage() {
  const document_requests = useQuery({
    queryKey: ["client_document_requests"],
    queryFn: DocumentRequestsAPI,
  });
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });
  const questionnaires = useQuery({
    queryKey: ["questionnaires"],
    queryFn: QuestionnairesAPI,
  });
  const documents = useQuery({
    queryKey: ["client_documents"],
    queryFn: DocumentsAPI,
  });
  if (
    document_requests.isLoading ||
    documents.isLoading ||
    user.isLoading ||
    questionnaires.isLoading ||
    !document_requests.data ||
    !documents.data ||
    !user.data
  ) {
    return <LoadingPage />;
  }
  if (
    document_requests.isError ||
    documents.isError ||
    user.isError ||
    questionnaires.isError
  ) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch dashboard. Please try again later."
      />
    );
  }
  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
      {user.data && user.data.role == "planning" && !questionnaires.isError ? (
        <div className="flex flex-row gap-2">
          <StatsWidget
            title={"Questionnaires"}
            stats={[
              {
                label: "Count",
                value: questionnaires.data.length,
              },
            ]}
          />
        </div>
      ) : (
        <div className="flex flex-row gap-2">
          <StatsWidget
            title={"Documents Available by Type"}
            stats={Array.from(
              new Set(
                documents.data.map(
                  (outer_document: DocumentType) => outer_document.document_type
                )
              )
            ).map((document_type) => {
              return {
                label: document_type as string,
                value: documents.data.filter(
                  (document: DocumentType) =>
                    document.document_type === document_type
                ).length as number,
              };
            })}
          />
          <StatsWidget
            title="Document Requests"
            stats={[
              {
                label: "Pending",
                value: documents.data.filter(
                  (document_requests: DocumentRequestType) =>
                    document_requests.status === "pending"
                ).length,
              },
              {
                label: "Approved",
                value: documents.data.filter(
                  (document_requests: DocumentRequestType) =>
                    document_requests.status === "approved"
                ).length,
              },
              {
                label: "Denied",
                value: documents.data.filter(
                  (document_requests: DocumentRequestType) =>
                    document_requests.status === "denied"
                ).length,
              },
            ]}
          />
        </div>
      )}
    </div>
  );
}
