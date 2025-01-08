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
import { AuthorizationRequestCreateAPI } from "@/components/API";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Separator } from "@/components/ui/separator";

interface Item {
  id: number;
  value: string;
}

export default function CreateAuthorizationRequestPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [error, setError] = useState("");
  const [college, setCollege] = useState("");
  const [purpose, setPurpose] = useState("");
  const [items, setItems] = useState<Item[]>([]);
  const [newValue, setNewValue] = useState("");

  const addItem = () => {
    if (newValue.trim()) {
      setItems((prevItems) => [
        ...prevItems,
        { id: Date.now(), value: newValue },
      ]);
      setNewValue("");
    }
  };

  const removeItem = (id: number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const editItem = (id: number, newValue: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, value: newValue } : item
      )
    );
  };

  const create_mutation = useMutation({
    mutationFn: async () => {
      const data = await AuthorizationRequestCreateAPI({
        college: college,
        purpose: purpose,
        documents: String(items.map((item) => item.value)),
      });
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["authorization_requests"] });
      setError("");
      toast(
        `Authorization request submitted successfuly,  ${
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
      <Card className="w-full h-full overflow-y-scroll">
        <CardHeader>
          <CardTitle>Create Authorization Request</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">College/Department</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setCollege(e.target.value);
                  }}
                  placeholder="College/Department of requester"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Purpose</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    setPurpose(e.target.value);
                  }}
                  placeholder="Brief description as to why you require the requested documents"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label className="text-2xl font-bold mb-4">Documents</Label>
                <Input
                  type="text"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  placeholder="Enter your Document here"
                />
                <Separator />
                <Button onClick={addItem} variant="outline">
                  Add Document
                </Button>
              </div>
              <div className="flex flex-col space-y-1.5">
                <h2 className="text-xl font-semibold">Selected Documents:</h2>
                {items.map((item) => (
                  <div key={item.id} className="item">
                    <input
                      type="text"
                      value={item.value}
                      onChange={(e) => editItem(item.id, e.target.value)}
                    />
                    <Button
                      onClick={() => removeItem(item.id)}
                      variant="outline"
                    >
                      Remove Document
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button onClick={() => navigate("/dashboard/")} variant="outline">
            Cancel
          </Button>
          <Button
            onClick={() => {
              create_mutation.mutate();
            }}
          >
            Submit
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
