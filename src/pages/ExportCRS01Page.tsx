import { useLocation } from "react-router";
import { PDFViewer } from "@react-pdf/renderer";
import CRS01Document from "@/components/CRS01Document";

export default function ExportCRS01Page() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <PDFViewer className="flex h-screen w-full items-center justify-center p-4 overflow-y-scroll">
        <CRS01Document document_request={location.state.document_request} />
      </PDFViewer>
    </div>
  );
}
