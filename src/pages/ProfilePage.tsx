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
    </div>
  );
}
