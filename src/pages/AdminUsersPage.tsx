import {
  AdminUserUpdateType,
  UserDeleteAPI,
  UsersAPI,
  UserType,
  AdminUserUpdateAPI,
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
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function AdminUsersPage() {
  const [search_term, setSearchTerm] = useState("");
  const queryClient = useQueryClient();
  const users = useQuery({
    queryKey: ["users"],
    queryFn: UsersAPI,
  });
  const [selected_user, setSelectedUser] = useState<AdminUserUpdateType>({
    role: "",
  });
  const delete_mutation = useMutation({
    mutationFn: async (id: number) => {
      const data = await UserDeleteAPI(id);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast(`User deleted successfuly`, {
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
      toast(`An error occured. Unable to delete user ${String(error)}`, {
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
      const data = await AdminUserUpdateAPI(id, selected_user);
      if (data[0] != true) {
        return Promise.reject(new Error(JSON.stringify(data[1])));
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
      toast(`User updated successfuly`, {
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
        `An error occured while trying to updating the user ${String(error)}`,
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
  if (users.isLoading || !users.data) {
    return <LoadingPage />;
  }
  if (users.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch users. Please try again later."
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {"Users (Admin View)"}
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
        <TableCaption>Users Database</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Sex</TableHead>
            <TableHead>Birthday</TableHead>
            <TableHead className="text-right">Age</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.data
            .filter(
              (user: UserType) =>
                search_term.includes(String(user.id)) ||
                user.username ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.email ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.first_name ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.last_name ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.full_name
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                user.role ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                user.sex ||
                "".toLowerCase().includes(search_term.toLowerCase()) ||
                search_term.includes(String(user.age))
            )
            .map((user: UserType) => (
              <TableRow key={user.id}>
                <TableCell className="text-left font-medium">
                  {user.id}
                </TableCell>
                <TableCell className="text-left">{user.email}</TableCell>
                <TableCell className="text-left">{user.full_name}</TableCell>
                <TableCell className="text-left">
                  <div className="flex-col">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() =>
                            setSelectedUser({
                              role: user.role,
                            })
                          }
                        >
                          Edit
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-[425px] sm:max-h-[640px] overflow-y-scroll">
                        <DialogHeader>
                          <DialogTitle>Edit User</DialogTitle>
                          <DialogDescription>
                            Make changes to the user here. Click save when
                            you're done.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">Role</Label>
                          <Select
                            defaultValue={selected_user.role}
                            value={selected_user.role}
                            onValueChange={(value) =>
                              setSelectedUser({
                                ...selected_user,
                                role: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent position="popper">
                              <SelectItem value="client">Client</SelectItem>
                              <SelectItem value="planning">Planning</SelectItem>
                              <SelectItem value="staff">Staff</SelectItem>
                              <SelectItem value="head">Head</SelectItem>
                              <SelectItem value="admin">Admin</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <DialogFooter>
                          <DialogClose asChild>
                            <Button
                              onClick={() => update_mutation.mutate(user.id)}
                              type="submit"
                            >
                              Save changes
                            </Button>
                          </DialogClose>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>

                    <Button onClick={() => delete_mutation.mutate(user.id)}>
                      Delete
                    </Button>
                  </div>
                </TableCell>
                <TableCell className="text-left">{user.role}</TableCell>
                <TableCell className="text-left">{user.sex}</TableCell>
                <TableCell className="text-left">{user.birthday}</TableCell>
                <TableCell className="text-right">{user.age}</TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={9}>Total</TableCell>
            <TableCell className="text-right">
              {users.data
                ? users.data.filter(
                    (user: UserType) =>
                      search_term.includes(String(user.id)) ||
                      user.username ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.email ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.first_name ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.last_name ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.full_name
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      user.role ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      user.sex ||
                      "".toLowerCase().includes(search_term.toLowerCase()) ||
                      search_term.includes(String(user.age))
                  ).length
                : 0}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}
