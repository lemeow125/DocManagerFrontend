import {
  UpdateType,
  UserAPI,
  UserUpdateAPI,
  UserUpdatePasswordAPI,
} from "@/components/API";
import PersonIcon from "@/components/icons/personicon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "react-toastify";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { DialogClose } from "@radix-ui/react-dialog";

export default function ProfilePage() {
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });
  const [edited_user, setEditedUser] = useState<UpdateType>({
    first_name: "",
    last_name: "",
    birthday: "",
    sex: "",
  });
  const [password, setPassword] = useState({
    new_password: "",
    confirm_new_password: "",
    current_password: "",
  });
  const queryClient = useQueryClient();
  const password_mutation = useMutation({
    mutationFn: async () => {
      const data = await UserUpdatePasswordAPI(password);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      toast(`Password updated successfully`, {
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
    onError: () => {
      toast.error(`Invalid password specified`, {
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
    mutationFn: async () => {
      const data = await UserUpdateAPI(edited_user);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast(`Updated successfully`, {
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
      toast.error(`An error has occured: ${String(error)}`, {
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
  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <PersonIcon size={64} />
      <p className="text-xl text-center sm:text-left">{user.data?.full_name}</p>
      <Accordion type="single" collapsible>
        <AccordionItem value="first_name">
          <AccordionTrigger>User Information</AccordionTrigger>
          <AccordionContent>Email: {user.data?.email}</AccordionContent>
          <AccordionContent>
            First Name: {user.data?.first_name}
          </AccordionContent>
          <AccordionContent>Last Name: {user.data?.last_name}</AccordionContent>
          <AccordionContent>Sex: {user.data?.sex}</AccordionContent>
          <AccordionContent>Role: {user.data?.role}</AccordionContent>
          <AccordionContent>Age: {user.data?.age}</AccordionContent>
          <AccordionContent>Birthday: {user.data?.birthday}</AccordionContent>
        </AccordionItem>
      </Accordion>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            onClick={() => {
              setEditedUser({
                ...edited_user,
                first_name: user.data.first_name,
                last_name: user.data.last_name,
                birthday: user.data.birthday,
                sex: user.data.sex,
              });
            }}
          >
            Edit
          </Button>
        </DialogTrigger>
        <DialogContent>
          <Card className="w-[420px]">
            <CardHeader>
              <CardTitle>Update your Account</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">First Name</Label>
                    <Input
                      value={edited_user.first_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditedUser({
                          ...edited_user,
                          first_name: e.target.value,
                        })
                      }
                      id="first_name"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="name">Last Name</Label>
                    <Input
                      value={edited_user.last_name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setEditedUser({
                          ...edited_user,
                          last_name: e.target.value,
                        })
                      }
                      id="last_name"
                    />
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="framework">Sex</Label>
                    <Select
                      defaultValue={user.data?.sex}
                      value={edited_user.sex}
                      onValueChange={(value) =>
                        setEditedUser({ ...edited_user, sex: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent position="popper">
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col space-y-1.5">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[280px] justify-start text-left font-normal",
                            !user.data?.birthday && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {edited_user.birthday ? (
                            format(edited_user.birthday, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <input
                          type="date"
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            setEditedUser({
                              ...edited_user,
                              birthday: e.target.value,
                            })
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center space-x-2">
              <DialogClose asChild>
                <Button onClick={() => update_mutation.mutate()}>Save</Button>
              </DialogClose>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
      <div className="h-1" />
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline">Update Password</Button>
        </DialogTrigger>
        <DialogContent>
          <Card className="w-[420px]">
            <CardHeader>
              <CardTitle>Update Pasword</CardTitle>
            </CardHeader>
            <CardContent>
              <form>
                <div className="grid w-full items-center gap-4">
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Old Password</Label>
                      <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword({
                            ...password,
                            current_password: e.target.value,
                          })
                        }
                        type="password"
                        id="password"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Confirm New Password</Label>
                      <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword({
                            ...password,
                            new_password: e.target.value,
                          })
                        }
                        type="password"
                        id="password"
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="name">Confirm Password</Label>
                      <Input
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          setPassword({
                            ...password,
                            confirm_new_password: e.target.value,
                          })
                        }
                        type="password"
                        id="password"
                      />
                    </div>
                  </div>
                </div>
              </form>
            </CardContent>
            <CardFooter className="flex justify-center space-x-2">
              <DialogClose asChild>
                <Button
                  onClick={() => {
                    if (
                      !password.current_password ||
                      !password.new_password ||
                      !password.confirm_new_password
                    ) {
                      toast.error(`No password provided`, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    } else if (
                      password.new_password != password.confirm_new_password
                    ) {
                      toast.error(`New passwords do not match`, {
                        position: "top-right",
                        autoClose: 2000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                        theme: "light",
                      });
                    } else {
                      password_mutation.mutate();
                    }
                  }}
                >
                  Save
                </Button>
              </DialogClose>
            </CardFooter>
          </Card>
        </DialogContent>
      </Dialog>
    </div>
  );
}
