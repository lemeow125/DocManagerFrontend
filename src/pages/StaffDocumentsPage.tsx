import { StaffDocumentsAPI, DocumentType } from "@/components/API";
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
export default function StaffDocumentsPage() {
  const documents = useQuery({
    queryKey: ["staff_documents"],
    queryFn: StaffDocumentsAPI,
  });
  if (documents.isLoading) {
    return <LoadingPage />;
  }
  if (documents.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch documents. Please try again later."
      />
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {"Documents (Staff View)"}
        </h1>
        <Table className="w-[640px]">
          <TableCaption>Documents Database</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>File Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Link</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.data.map((document: DocumentType) => (
              <TableRow key={document.id}>
                <TableCell className="text-left font-medium">
                  {document.id}
                </TableCell>
                <TableCell className="text-left">{document.name}</TableCell>
                <TableCell className="text-left">
                  {document.document_type}
                </TableCell>
                <TableCell className="text-right">
                  {document.file ? (
                    <a href={document.file}>Preview</a>
                  ) : (
                    <p>Not available</p>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total</TableCell>
              <TableCell className="text-right">
                {documents.data ? documents.data.length : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
