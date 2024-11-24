import { LoginAPI } from "@/components/API";
import { auth_toggle } from "@/components/plugins/redux/slices/AuthSlice";
import { RootState } from "@/components/plugins/redux/Store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [user, setUser] = useState({
    email: "",
    password: "",
    remember: false,
  });
  const authenticated = useSelector((state: RootState) => state.auth.value);
  useEffect(() => {
    if (authenticated) {
      navigate("/dashboard/");
      console.log("Already logged in. Redirecting to dashboard page");
    }
  }, [authenticated, navigate]);
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>Login</CardTitle>
          <CardDescription className="text-red-600">{error}</CardDescription>
        </CardHeader>
        <CardContent>
          <form>
            <div className="grid w-full items-center gap-4">
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
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center space-x-2">
          <Button
            onClick={async () => {
              const status = await LoginAPI(user, user.remember);
              if (status === true) {
                await dispatch(auth_toggle());
                navigate("/dashboard/");
                toast("Logged in", {
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
                setError("Invalid login");
              }
            }}
          >
            Login
          </Button>
          <div className="flex flex-row items-center gap-1">
            <Checkbox
              checked={user.remember}
              onClick={() => setUser({ ...user, remember: !user.remember })}
            />
            <p>Remember me</p>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
