import { useLocation } from "react-router";
import { PDFViewer } from "@react-pdf/renderer";
import CRS03Document from "@/components/CRS03Document";

export default function ExportCRS03Page() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-full items-center justify-center p-4 overflow-y-scroll">
      <PDFViewer className="flex h-screen w-full items-center justify-center p-4 overflow-y-scroll">
        <CRS03Document document_request={location.state.document_request} />
      </PDFViewer>
    </div>
  );
}
