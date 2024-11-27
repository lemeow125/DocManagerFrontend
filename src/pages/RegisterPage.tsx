import { RegisterAPI } from "@/components/API";
import { auth_toggle } from "@/components/plugins/redux/slices/AuthSlice";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    confirm_password: "",
  });
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle>Create an Account</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">First Name</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, first_name: e.target.value })
                  }
                  id="first_name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Last Name</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, last_name: e.target.value })
                  }
                  id="last_name"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Email</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, email: e.target.value })
                  }
                  id="username"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Password</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, password: e.target.value })
                  }
                  type="password"
                  id="password"
                />
              </div>
              <div className="flex flex-col space-y-1.5">
                <Label htmlFor="name">Confirm Password</Label>
                <Input
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setUser({ ...user, confirm_password: e.target.value })
                  }
                  type="password"
                  id="password"
                />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button onClick={() => navigate("/")}>Cancel</Button>
          <Button
            onClick={async () => {
              if (user.password != user.confirm_password) {
                setError("Passwords do not match");
                return;
              }
              const status = await RegisterAPI(user);
              if (status[0] === true) {
                await dispatch(auth_toggle());
                navigate("/");
                toast(
                  "Registration success! Please check your email to activate",
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
              } else {
                setError(String(status[1]));
              }
            }}
          >
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
