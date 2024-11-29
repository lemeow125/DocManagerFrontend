import {
  StaffDocumentRequestsAPI,
  DocumentRequestType,
  DocumentRequestUnitType,
  DocumentRequestUpdateAPI,
  DocumentRequestUpdateType,
} from "@/components/API";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router";
import { Separator } from "@/components/ui/separator";

export default function HeadDocumentRequestsPage() {
  const [error, setError] = useState("");
  const queryClient = useQueryClient();
  const update_mutation = useMutation({
    mutationFn: async ({
      document_request,
      id,
    }: {
      document_request: DocumentRequestUpdateType;
      id: number;
    }) => {
      const data = await DocumentRequestUpdateAPI(document_request, id);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["client_document_requests"] });
      queryClient.invalidateQueries({
        queryKey: ["staff_document_requests"],
      });
      setError("");
      toast(
        `Document uploaded successfuly,  ${
          typeof data[1] == "object" ? "ID:" + data[1].id : ""
        }`,
        {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        }
      );
    },
    onError: (error) => {
      setError(String(error));
    },
  });
  const [search_term, setSearchTerm] = useState("");
  const [view_pending_only, setViewPendingOnly] = useState(false);
  const document_requests = useQuery({
    queryKey: ["staff_document_requests"],
    queryFn: StaffDocumentRequestsAPI,
  });
  if (document_requests.isLoading || !document_requests.data) {
    return <LoadingPage />;
  }
  if (document_requests.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch document requests. Please try again later."
      />
    );
  }

  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {"Document Requests (Head View)"}
        </h1>
        <div className="self-start flex flex-row items-center text-center content-center">
          <Label htmlFor="name">Search</Label>
          <Input
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
          />
        </div>
        <div className="self-start flex flex-row items-center text-center content-center gap-1">
          <Checkbox
            checked={view_pending_only}
            onClick={() => setViewPendingOnly(!view_pending_only)}
          />
          <Label htmlFor="name">Show Pending Only</Label>
        </div>
        <Label className="text-red-600 w-max">{error}</Label>
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
              <TableHead>Date Requested</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {document_requests.data
              .filter(
                (document_request: DocumentRequestType) =>
                  search_term.includes(String(document_request.id)) ||
                  document_request.requester
                    .toLowerCase()
                    .includes(search_term.toLowerCase()) ||
                  document_request.college
                    .toLowerCase()
                    .includes(search_term.toLowerCase()) ||
                  document_request.status
                    .toLowerCase()
                    .includes(search_term.toLowerCase()) ||
                  document_request.type
                    .toLowerCase()
                    .includes(search_term.toLowerCase()) ||
                  document_request.purpose
                    .toLowerCase()
                    .includes(search_term.toLowerCase()) ||
                  document_request.date_requested
                    .toLowerCase()
                    .includes(search_term.toLowerCase())
              )
              .filter((document_request: DocumentRequestType) =>
                view_pending_only ? document_request.status == "pending" : true
              )
              .map((document_request: DocumentRequestType) => (
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
                    <Dialog>
                      <DialogTitle hidden={true}>View</DialogTitle>
                      <DialogTrigger asChild>
                        <Button variant="outline">View</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-left">ID</TableHead>
                              <TableHead className="text-left">
                                File Name
                              </TableHead>
                              <TableHead className="text-left">Type</TableHead>
                              <TableHead
                                className={
                                  document_request.status == "approved"
                                    ? "text-left"
                                    : "text-right"
                                }
                              >
                                Copies
                              </TableHead>
                              {document_request.status == "approved" ? (
                                <TableHead className="text-right">
                                  Link
                                </TableHead>
                              ) : (
                                <></>
                              )}
                            </TableRow>
                          </TableHeader>
                          <TableBody className="overflow-y-scroll h-10">
                            {document_request.documents.map(
                              (
                                document_request_unit: DocumentRequestUnitType
                              ) => (
                                <TableRow key={document_request_unit.id}>
                                  <TableCell className="text-left font-medium">
                                    {document_request_unit.id}
                                  </TableCell>
                                  <TableCell className="text-left font-medium">
                                    {document_request_unit.document.name}
                                  </TableCell>
                                  <TableCell className="text-left font-medium">
                                    {
                                      document_request_unit.document
                                        .document_type
                                    }
                                  </TableCell>
                                  <TableCell
                                    className={
                                      document_request.status == "approved"
                                        ? "text-left font-medium"
                                        : "text-right font-medium"
                                    }
                                  >
                                    {document_request_unit.copies}
                                  </TableCell>
                                  {document_request.status == "approved" ? (
                                    <TableCell className="text-right font-medium">
                                      <a
                                        href={
                                          document_request_unit.document.file
                                        }
                                      >
                                        Preview
                                      </a>
                                    </TableCell>
                                  ) : (
                                    <></>
                                  )}
                                </TableRow>
                              )
                            )}
                          </TableBody>
                          <TableFooter>
                            <TableRow>
                              <TableCell
                                colSpan={
                                  document_request.status == "approved" ? 4 : 3
                                }
                              >
                                Total
                              </TableCell>
                              <TableCell className="text-right">
                                {document_request.documents
                                  ? document_request.documents.length
                                  : 0}
                              </TableCell>
                            </TableRow>
                          </TableFooter>
                        </Table>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.type}
                  </TableCell>
                  <TableCell className="text-left">
                    {document_request.date_requested}
                  </TableCell>
                  <TableCell className="text-right">
                    {document_request.status == "pending" ? (
                      <div className="flex-col space-y-5">
                        <Button
                          onClick={() =>
                            update_mutation.mutate({
                              document_request: { status: "approved" },
                              id: document_request.id,
                            })
                          }
                          className="w-full"
                        >
                          Approve
                        </Button>
                        <Button
                          onClick={() =>
                            update_mutation.mutate({
                              document_request: { status: "denied" },
                              id: document_request.id,
                            })
                          }
                          className="w-full"
                        >
                          Deny
                        </Button>
                      </div>
                    ) : (
                      <div className="flex-col space-y-5">
                        <Link
                          to="/export/CRS01/"
                          state={{ document_request: document_request }}
                        >
                          <Button>Export to CSR-01</Button>
                        </Link>
                        <Separator />
                        <Link
                          to="/export/CRS03/"
                          state={{ document_request: document_request }}
                        >
                          <Button>Export to CSR-03</Button>
                        </Link>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={8}>Total</TableCell>
              <TableCell className="text-right">
                {document_requests.data
                  ? document_requests.data
                      .filter(
                        (document_request: DocumentRequestType) =>
                          search_term.includes(String(document_request.id)) ||
                          document_request.requester
                            .toLowerCase()
                            .includes(search_term.toLowerCase()) ||
                          document_request.college
                            .toLowerCase()
                            .includes(search_term.toLowerCase()) ||
                          document_request.status
                            .toLowerCase()
                            .includes(search_term.toLowerCase()) ||
                          document_request.type
                            .toLowerCase()
                            .includes(search_term.toLowerCase()) ||
                          document_request.purpose
                            .toLowerCase()
                            .includes(search_term.toLowerCase()) ||
                          document_request.date_requested
                            .toLowerCase()
                            .includes(search_term.toLowerCase())
                      )
                      .filter((document_request: DocumentRequestType) =>
                        view_pending_only
                          ? document_request.status == "pending"
                          : true
                      ).length
                  : 0}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </div>
  );
}
