import { QuestionnairesAPI, QuestionnaireType } from "@/components/API";
import { useQuery } from "@tanstack/react-query";
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
import { Link } from "react-router";
export default function StaffQuestionnairesPage() {
  const [search_term, setSearchTerm] = useState("");
  const questionnaires = useQuery({
    queryKey: ["questionnaires"],
    queryFn: QuestionnairesAPI,
  });
  if (questionnaires.isLoading || !questionnaires.data) {
    return <LoadingPage />;
  }
  if (questionnaires.isError) {
    return (
      <ErrorPage
        statusCode={400}
        errorMessage="Failed to fetch questionnaires. Please try again later."
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        {"Questionnaires (Staff View)"}
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
        <TableCaption>Questionnaires Database</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead className="text-left">Date Uploaded</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {questionnaires.data
            .filter(
              (questionnaire: QuestionnaireType) =>
                search_term.includes(String(questionnaire.id)) ||
                questionnaire.client_type
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                questionnaire.date_submitted
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                questionnaire.sex
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                questionnaire.region_of_residence
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                questionnaire.service_availed
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                questionnaire.i_am_a
                  .toLowerCase()
                  .includes(search_term.toLowerCase()) ||
                questionnaire.extra_suggestions
                  .toLowerCase()
                  .includes(search_term.toLowerCase())
            )
            .map((questionnaire: QuestionnaireType) => (
              <TableRow key={questionnaire.id}>
                <TableCell className="text-left font-medium">
                  {questionnaire.id}
                </TableCell>
                <TableCell className="text-left">
                  {questionnaire.date_submitted}
                </TableCell>
                <TableCell className="text-right">
                  <Link
                    to="/export/0061/"
                    state={{ questionnaire: questionnaire }}
                  >
                    <Button>Export to 006-1</Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">
              {questionnaires.data
                ? questionnaires.data.filter(
                    (questionnaire: QuestionnaireType) =>
                      search_term.includes(String(questionnaire.id)) ||
                      questionnaire.client_type
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      questionnaire.date_submitted
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      questionnaire.sex
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      questionnaire.region_of_residence
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      questionnaire.service_availed
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      questionnaire.i_am_a
                        .toLowerCase()
                        .includes(search_term.toLowerCase()) ||
                      questionnaire.extra_suggestions
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
