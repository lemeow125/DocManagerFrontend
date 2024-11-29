import { Page, Text, Document, StyleSheet, Image } from "@react-pdf/renderer";
import { DocumentRequestType, DocumentRequestUnitType } from "./API";
import CRS03Image from "/FM-USTP-CRS-03.png";

const styles = StyleSheet.create({
  page: {
    flexDirection: "row",
    backgroundColor: "#E4E4E4",
  },
  section: {
    margin: 10,
    padding: 10,
    flexGrow: 1,
  },
});

type props = {
  document_request: DocumentRequestType;
};

export default function CRS03Document(props: props) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "350px",
            top: "175px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.date_requested}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "355px",
            top: "185px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.requester}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "322px",
            top: "196px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.college}
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "350px",
            top: "208px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.purpose}
        </Text>

        {props.document_request.documents.map(
          (document_request_unit: DocumentRequestUnitType, index) => (
            <Text
              key={document_request_unit.id}
              style={{
                width: "768px",
                position: "absolute",
                right: "0px",
                top: 270 + index * 16 + "px",
                textAlign: "center",
                fontSize: 6,
              }}
            >
              {document_request_unit.document.name}
            </Text>
          )
        )}
        {props.document_request.documents.map(
          (document_request_unit: DocumentRequestUnitType, index) => (
            <Text
              key={document_request_unit.id}
              style={{
                width: "768px",
                position: "absolute",
                right: "-205px",
                top: 270 + index * 16 + "px",
                textAlign: "center",
                fontSize: 12,
              }}
            >
              {document_request_unit.document.number_pages}
            </Text>
          )
        )}
        {props.document_request.documents.map(
          (document_request_unit: DocumentRequestUnitType, index) => (
            <Text
              key={document_request_unit.id}
              style={{
                width: "768px",
                position: "absolute",
                right: "-295px",
                top: 270 + index * 16 + "px",
                textAlign: "center",
                fontSize: 12,
              }}
            >
              {document_request_unit.copies}
            </Text>
          )
        )}
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "360px",
            top: "648px",
            textAlign: "center",
            fontSize: 6,
          }}
        >
          (This email will serve as a valid signature within DDMS)
        </Text>
        <Text
          style={{
            width: "256px",
            position: "absolute",
            right: "360px",
            top: "636px",
            textAlign: "center",
            fontSize: 12,
          }}
        >
          {props.document_request.requester}
        </Text>
        <Image
          style={{ position: "absolute", zIndex: -1, top: 0, width: "100%" }}
          src={CRS03Image}
        />
      </Page>
    </Document>
  );
}
