import {
  AuthorizationRequestsAPI,
  AuthorizationRequestType,
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
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Link } from "react-router";

export default function StaffAuthorizationRequestsPage() {
  const [search_term, setSearchTerm] = useState("");
  const [view_pending_only, setViewPendingOnly] = useState(false);
  const authorization_requests = useQuery({
    queryKey: ["authorization_requests"],
    queryFn: AuthorizationRequestsAPI,
  });
  if (authorization_requests.isLoading || !authorization_requests.data) {
    return <LoadingPage />;
  }
  if (authorization_requests.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch document requests. Please try again later."
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
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
      <Table className="w-full">
        <TableCaption>Document Requests</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Requester</TableHead>
            <TableHead>College</TableHead>
            <TableHead>Purpose</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Documents Requested</TableHead>
            <TableHead>Remarks</TableHead>
            <TableHead>Date Requested</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {authorization_requests.data
            .filter(
              (authorization_request: AuthorizationRequestType) =>
                search_term.includes(String(authorization_request.id)) ||
                authorization_request.remarks ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                authorization_request.requester
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                authorization_request.college
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                authorization_request.status
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                authorization_request.purpose
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                authorization_request.date_requested
                  .toLowerCase()
                  .includes(search_term.toLowerCase())
            )
            .filter((authorization_request: AuthorizationRequestType) =>
              view_pending_only
                ? authorization_request.status == "pending"
                : true
            )
            .map((authorization_request: AuthorizationRequestType) => (
              <TableRow key={authorization_request.id}>
                <TableCell className="text-left font-small">
                  {authorization_request.id}
                </TableCell>
                <TableCell className="text-left">
                  {authorization_request.requester}
                </TableCell>
                <TableCell className="text-left">
                  {authorization_request.college}
                </TableCell>
                <TableCell className="text-left">
                  {authorization_request.purpose}
                </TableCell>
                <TableCell className="text-left">
                  {authorization_request.status}
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
                            <TableHead className="text-left">
                              Document
                            </TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody className="overflow-y-scroll h-10">
                          {authorization_request.documents
                            .split(",")
                            .map((document) => (
                              <TableRow key={document}>
                                <TableCell className="text-left font-medium">
                                  {document}
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                        <TableFooter>
                          <TableRow>
                            <TableCell colSpan={1}>Total</TableCell>
                            <TableCell className="text-right">
                              {authorization_request.documents.split(",")
                                ? authorization_request.documents.length
                                : 0}
                            </TableCell>
                          </TableRow>
                        </TableFooter>
                      </Table>
                    </DialogContent>
                  </Dialog>
                </TableCell>
                <TableCell className="text-left">
                  {authorization_request.remarks}
                </TableCell>
                <TableCell className="text-left">
                  {authorization_request.date_requested}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex-col space-y-5">
                    <Link
                      className="w-full"
                      to="/export/CRS03/"
                      state={{ authorization_request: authorization_request }}
                    >
                      <Button className="w-full">Export to CSR-03</Button>
                    </Link>
                  </div>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={8}>Total</TableCell>
            <TableCell className="text-right">
              {authorization_requests.data
                ? authorization_requests.data
                    .filter(
                      (authorization_request: AuthorizationRequestType) =>
                        search_term.includes(
                          String(authorization_request.id)
                        ) ||
                        authorization_request.remarks ||
                        "".toLowerCase().includes(search_term.toLowerCase()) ||
                        authorization_request.requester
                          .toLowerCase()
                          .includes(search_term.toLowerCase()) ||
                        authorization_request.college
                          .toLowerCase()
                          .includes(search_term.toLowerCase()) ||
                        authorization_request.status
                          .toLowerCase()
                          .includes(search_term.toLowerCase()) ||
                        authorization_request.purpose
                          .toLowerCase()
                          .includes(search_term.toLowerCase()) ||
                        authorization_request.date_requested
                          .toLowerCase()
                          .includes(search_term.toLowerCase())
                    )
                    .filter((authorization_request: AuthorizationRequestType) =>
                      view_pending_only
                        ? authorization_request.status == "pending"
                        : true
                    ).length
                : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
