import {
  DocumentRequestsAPI,
  DocumentRequestType,
  DocumentRequestUnitType,
} from "@/components/API";
import { useQuery } from "@tanstack/react-query";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import {
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
  Table,
  TableCaption,
  TableFooter,
} from "@/components/ui/table";
export default function DocumentRequestsPage() {
  const document_requests = useQuery({
    queryKey: ["document_requests"],
    queryFn: DocumentRequestsAPI,
  });
  if (document_requests.isLoading) {
    return <LoadingPage />;
  }
  if (document_requests.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch document_requests. Please try again later."
      />
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {"Document Requests (Client View)"}
        </h1>
        <Table className="w-[840px]">
          <TableCaption>Document Requests</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Requester</TableHead>
              <TableHead>College</TableHead>
              <TableHead>Purpose</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Documents Requested</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Date Requested</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {document_requests.data.map(
              (document_request: DocumentRequestType) => (
                <TableRow key={document_request.id}>
                  <TableCell className="text-left font-small">
                    {document_request.id}
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.requester}
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.college}
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.purpose}
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.status}
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.status == "approved" ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="text-left">ID</TableHead>
                            <TableHead className="text-left">
                              File Name
                            </TableHead>
                            <TableHead className="text-left">Type</TableHead>
                            <TableHead className="text-right">Link</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="overflow-y-scroll h-10">
                          {document_request.documents.map(
                            (
                              document_request_unit: DocumentRequestUnitType
                            ) => (
                              <TableRow key={document_request.id}>
                                <TableCell className="text-left font-medium">
                                  {document_request.id}
                                </TableCell>
                                <TableCell className="text-left font-medium">
                                  {document_request_unit.document.name}
                                </TableCell>
                                <TableCell className="text-left font-medium">
                                  {document_request_unit.document.document_type}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                  <a href={document_request_unit.document.file}>
                                    Preview
                                  </a>
                                </TableCell>
                              </TableRow>
                            )
                          )}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={3}>Total</TableCell>
                            <TableCell className="text-right">
                              {document_request.documents
                                ? document_request.documents.length
                                : 0}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    ) : (
                      "N/A (Request not approved)"
                    )}
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.type}
                  </TableCell>
                  <TableCell className="text-right">
                    {document_request.date_requested}
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={7}>Total</TableCell>
              <TableCell className="text-right">
                {document_requests.data ? document_requests.data.length : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
