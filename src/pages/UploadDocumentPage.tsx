import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@radix-ui/react-label";
import { useState } from "react";
import { useNavigate } from "react-router";
import { DocumentCreateAPI, DocumentCreateType } from "@/components/API";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
export default function UploadDocumentPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [document, setDocument] = useState<DocumentCreateType>({
    name: "",
    file: null,
    document_type: "HOA",
    number_pages: 1,
  });
  const create_mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("name", document.name);
      formData.append("file", document.file!);
      formData.append("document_type", document.document_type);
      formData.append("number_pages", String(document.number_pages));
      const data = await DocumentCreateAPI(formData);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["client_documents"] });
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
      navigate("/dashboard/");
    },
    onError: (error) => {
      setError(String(error));
    },
  });

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Upload document</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Document Name</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setDocument({
                      ...document,
                      name: e.target.value,
                    });
                  }}
                  placeholder="Name of document"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Number of Pages</Label>
                  <Input
                    value={document.number_pages}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (!isNaN(parseInt(e.target.value))) {
                        console.log("test");
                        setDocument({
                          ...document,
                          number_pages: Number(e.target.value),
                        });
                      }
                    }}
                    placeholder="# of pages"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">Type</Label>
                  <Input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setDocument({
                        ...document,
                        document_type: e.target.value,
                      });
                    }}
                    placeholder="Type of document"
                  />
                </div>
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="name">File</Label>
                  <input
                    id="file"
                    type="file"
                    multiple={false}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (e.target.files) {
                        setDocument({ ...document, file: e.target.files[0] });
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => navigate("/dashboard")} variant="outline">
            Cancel
          </Button>
          <Button onClick={() => create_mutation.mutate()}>Upload</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
