import {
  DocumentRequestsAPI,
  DocumentRequestType,
  DocumentsAPI,
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
  const documents = useQuery({
    queryKey: ["client_documents"],
    queryFn: DocumentsAPI,
  });
  if (
    document_requests.isLoading ||
    documents.isLoading ||
    !document_requests.data ||
    !documents.data
  ) {
    return <LoadingPage />;
  }
  if (document_requests.isError || documents.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch dashboard. Please try again later."
      />
    );
  }
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Dashboard</h1>
        <div className="flex flex-row gap-2">
          <StatsWidget
            title={"Documents"}
            stats={[{ label: "Available", value: documents.data.length }]}
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
      </div>
    </div>
  );
}
