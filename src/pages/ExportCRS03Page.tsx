import { useLocation } from "react-router";
import { PDFViewer } from "@react-pdf/renderer";
import CRS03Document from "@/components/CRS03Document";

export default function ExportCRS03Page() {
  const location = useLocation();

  return (
    <div className="flex flex-col h-screen w-full overflow-y-scroll justify-center items-center p-4 bg-white mt-8">
      <PDFViewer className="flex h-screen w-full items-center justify-center p-4 overflow-y-scroll">
        <CRS03Document
          authorization_request={location.state.authorization_request}
        />
      </PDFViewer>
    </div>
  );
}
