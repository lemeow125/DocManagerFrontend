import {
  StaffDocumentsAPI,
  DocumentType,
  DocumentDeleteAPI,
  DocumentUpdateType,
  DocumentUpdateAPI,
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
export default function HeadDocumentsPage() {
  const queryClient = useQueryClient();
  const [search_term, setSearchTerm] = useState("");
  const documents = useQuery({
    queryKey: ["staff_documents"],
    queryFn: StaffDocumentsAPI,
  });
  const [selected_document, setSelectedDocument] = useState<DocumentUpdateType>(
    {
      name: "",
      document_type: "HOA",
      number_pages: 1,
      document_month: "",
      document_year: "",
      sent_from: "",
      subject: "",
    }
  );
  const delete_mutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await DocumentDeleteAPI(id);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["client_documents"] });
      queryClient.invalidateQueries({ queryKey: ["staff_documents"] });
      toast(`Document deleted successfuly`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onError: (error) => {
      toast(`An error occured. Unable to delete document ${String(error)}`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
  });
  const update_mutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await DocumentUpdateAPI(id, selected_document);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["client_documents"] });
      queryClient.invalidateQueries({ queryKey: ["staff_documents"] });
      toast(`Document updated successfuly`, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    },
    onError: (error) => {
      toast(
        `An error occured while trying to updating the document ${String(
          error
        )}`,
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
  });
  if (documents.isLoading || !documents.data) {
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
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {"Documents (Head View)"}
      </h1>
      <div className="self-start flex flex-row items-center text-center content-center">
        <Label htmlFor="name">Search</Label>
        <Input
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setSearchTerm(e.target.value)
          }
        />
      </div>
      <Table className="w-full">
        <TableCaption>Documents Database</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>File Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Link</TableHead>
            <TableHead>Sent From</TableHead>
            <TableHead>Document Month</TableHead>
            <TableHead>Document Year</TableHead>
            <TableHead>Subject</TableHead>
            <TableHead className="text-right">Date Uploaded</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.data
            .filter(
              (document: DocumentType) =>
                search_term.includes(String(document.id)) ||
                document.subject ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                document.document_month ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                document.document_year ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                document.name ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                document.document_type
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                search_term.includes(String(document.number_pages)) ||
                document.ocr_metadata ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                document.date_uploaded
                  .toLowerCase()
                  .includes(search_term.toLowerCase())
            )
            .map((document: DocumentType) => (
              <TableRow key={document.id}>
                <TableCell className="text-left font-medium">
                  {document.id}
                </TableCell>
                <TableCell className="text-left">{document.name}</TableCell>
                <TableCell className="text-left">
                  {document.document_type}
                </TableCell>
                <TableCell className="text-left">
                  <div className="flex-col">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() =>
                            setSelectedDocument({
                              name: document.name,
                              document_type: document.document_type,
                              number_pages: document.number_pages,
                              sent_from: document.sent_from,
                              document_month: document.document_month,
                              document_year: document.document_year,
                              subject: document.subject,
                            })
                          }
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] sm:max-h-[640px] overflow-y-scroll">
                        <DialogHeader>
                          <DialogTitle>Edit Document</DialogTitle>
                          <DialogDescription>
                            Make changes to the document here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            value={selected_document.name}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSelectedDocument({
                                ...selected_document,
                                name: e.target.value,
                              });
                            }}
                            placeholder={document.name}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Number of Pages</Label>
                          <Input
                            value={selected_document.number_pages}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              if (!isNaN(parseInt(e.target.value))) {
                                setSelectedDocument({
                                  ...selected_document,
                                  number_pages: Number(e.target.value),
                                });
                              }
                            }}
                            placeholder={String(document.number_pages)}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Type</Label>
                          <Input
                            value={selected_document.document_type}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSelectedDocument({
                                ...selected_document,
                                document_type: e.target.value,
                              });
                            }}
                            placeholder={document.document_type}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Sent From</Label>
                          <Input
                            value={selected_document.sent_from}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSelectedDocument({
                                ...selected_document,
                                sent_from: e.target.value,
                              });
                            }}
                            placeholder={document.sent_from}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Document Subject</Label>
                          <Input
                            value={selected_document.subject}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSelectedDocument({
                                ...selected_document,
                                subject: e.target.value,
                              });
                            }}
                            placeholder={document.subject}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Document Year</Label>
                          <Input
                            value={selected_document.document_year}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSelectedDocument({
                                ...selected_document,
                                document_year: e.target.value,
                              });
                            }}
                            placeholder={document.document_year}
                          />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Document Month</Label>
                          <Input
                            value={selected_document.document_month}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setSelectedDocument({
                                ...selected_document,
                                document_month: e.target.value,
                              });
                            }}
                            placeholder={document.document_month}
                          />
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              onClick={() =>
                                update_mutation.mutate(document.id)
                              }
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={() => delete_mutation.mutate(document.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-left">
                  {document.file ? (
                    <a href={document.file}>Preview</a>
                  ) : (
                    <p>Not available</p>
                  )}
                </TableCell>
                <TableCell className="text-left">
                  {document.sent_from}
                </TableCell>
                <TableCell className="text-left">
                  {document.document_month}
                </TableCell>
                <TableCell className="text-left">
                  {document.document_year}
                </TableCell>
                <TableCell className="text-left">{document.subject}</TableCell>
                <TableCell className="text-right">
                  {document.date_uploaded}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>Total</TableCell>
            <TableCell className="text-right">
              {documents.data
                ? documents.data.filter(
                    (document: DocumentType) =>
                      search_term.includes(String(document.id)) ||
                      document.subject ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      document.document_month ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      document.document_year ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      document.name ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      document.document_type
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      search_term.includes(String(document.number_pages)) ||
                      document.ocr_metadata ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      document.date_uploaded
                        .toLowerCase()
                        .includes(search_term.toLowerCase())
                  ).length
                : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
