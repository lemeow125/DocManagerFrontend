import { UserAPI } from "@/components/API";
import PersonIcon from "@/components/icons/personicon";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useQuery } from "@tanstack/react-query";

export default function ProfilePage() {
  const user = useQuery({ queryKey: ["user"], queryFn: UserAPI });
  return (
    <div className="flex h-screen w-full items-center justify-center p-4">
      <div className="flex flex-col items-center justify-center text-center h-full">
        <PersonIcon size={64} />
        <p className="text-xl text-center sm:text-left">
          {user.data?.full_name}
        </p>
        <Accordion type="single" collapsible>
          <AccordionItem value="first_name">
            <AccordionTrigger>User Information</AccordionTrigger>
            <AccordionContent>Email: {user.data?.email}</AccordionContent>
            <AccordionContent>
              First Name: {user.data?.first_name}
            </AccordionContent>
            <AccordionContent>
              Last Name: {user.data?.last_name}
            </AccordionContent>
            <AccordionContent>Role: {user.data?.role}</AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
}
