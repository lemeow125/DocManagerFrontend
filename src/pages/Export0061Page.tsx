import { useLocation } from "react-router";
import { PDFViewer } from "@react-pdf/renderer";
import QuestionnaireDocument from "@/components/QuestionnaireDocument";

export default function Export0061Page() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center p-4 overflow-y-scroll">
      <PDFViewer className="flex h-screen w-full items-center justify-center p-4 overflow-y-scroll">
        <QuestionnaireDocument questionnaire={location.state.questionnaire} />
      </PDFViewer>
    </div>
  );
}
