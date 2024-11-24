import AppIcon from "../icons/appicon";
import DashboardIcon from "../icons/dashboardicon";
import { Button } from "./button";
import { useSidebar } from "./sidebar";

interface HeaderProps {
  text?: string;
  children?: React.ReactNode;
}

export default function Header({ text, children }: HeaderProps) {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="flex items-center justify-between absolute top-0 bg-gray-500 w-full">
      <Button onClick={() => toggleSidebar()} className="rounded-none">
        <DashboardIcon />
      </Button>
      <div className="grid gap-1">
        <AppIcon size={32} color={"#FFFFFF"} />
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
