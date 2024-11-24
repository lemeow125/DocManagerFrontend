/* eslint-disable react-refresh/only-export-components */
import axios from "axios";

const debug = true;
let backendURL;

if (debug) {
  backendURL = "http://localhost:8000/";
} else {
  backendURL = "https://api.docmanagerbackend.06222001.xyz/";
}

const instance = axios.create({
  baseURL: backendURL,
});

// Token Handling
export async function getAccessToken() {
  const accessToken = await localStorage.getItem("access_token");
  return accessToken;
}

export async function getRefreshToken() {
  const refreshToken = await localStorage.getItem("refresh_token");
  return refreshToken;
}

export async function setAccessToken(access: string) {
  await localStorage.setItem("access_token", access);
  return true;
}

export async function setRefreshToken(refresh: string) {
  await localStorage.setItem("refresh_token", refresh);
  return true;
}

// Header Config Template for REST
export async function GetConfig() {
  const accessToken = await getAccessToken();
  return {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
}

export function ParseError(error: { response: { data: string } }) {
  if (error.response && error.response.data) {
    if (error.response.data.length > 50) {
      return "Error truncated (too long)";
    }
    return JSON.stringify(error.response.data)
      .replace(/[{}]/g, " ")
      .replace(/\(/g, " ")
      .replace(/\)/g, " ")
      .replace(/"/g, " ")
      .replace(/,/g, ",")
      .replace(/\[/g, "")
      .replace(/\]/g, "")
      .replace(/\./g, "")
      .replace(/non_field_errors/g, "")
      .trim();
  }
  return "Unable to reach server";
}

// User
export const staff_roles = ["head", "admin", "planning", "staff"];

export type UserType = {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  role: "head" | "admin" | "client" | "planning" | "staff";
};

export type RegisterType = {
  email: string;
  username: string;
  password: string;
  first_name: string;
  last_name: string;
};

export type LoginType = {
  email: string;
  password: string;
};

export function RegisterAPI(info: RegisterType) {
  return instance
    .post("api/v1/accounts/users/", info)
    .then(async (response) => {
      console.log(response.data);
      return [true, 0];
    })
    .catch((error) => {
      console.log("Registration failed");
      return [false, ParseError(error)];
    });
}

export function LoginAPI(user: LoginType, remember_session: boolean) {
  return instance
    .post("api/v1/accounts/jwt/create/", user)
    .then(async (response) => {
      console.log(response.data);
      setAccessToken(response.data.access);
      if (remember_session) {
        setRefreshToken(response.data.refresh);
      } else {
        setRefreshToken("");
      }

      console.log("Login Success");
      return true;
    })
    .catch((error) => {
      console.log("Login Failed", error.response.data);
      return false;
    });
}

export async function JWTRefreshAPI() {
  const refresh = await getRefreshToken();
  return instance
    .post("api/v1/accounts/jwt/refresh/", {
      refresh: refresh,
    })
    .then(async (response) => {
      setAccessToken(response.data.access);
      return true;
    })
    .catch(() => {
      console.log("Token refresh failed");
      return false;
    });
}

export async function UserAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/accounts/users/me/", config)
    .then((response) => {
      return response.data as UserType;
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

// Documents

export type DocumentType = {
  id: number;
  name: string;
  document_type: string;
  number_pages: number;
  file?: string;
  ocr_metadata: string;
  date_uploaded: string;
};

export type DocumentCreateType = {
  name: string;
  file: File | null;
  document_type: string;
  number_pages: number;
};

export async function DocumentsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/documents/list/", config)
    .then((response) => {
      return response.data as DocumentType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function StaffDocumentsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/documents/list/staff/", config)
    .then((response) => {
      return response.data as DocumentType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function DocumentCreateAPI(document: FormData) {
  const config = await GetConfig();
  return instance
    .post("api/v1/documents/upload/", document, config)
    .then((response) => {
      return [true, response.data as DocumentType];
    })
    .catch((error) => {
      console.log("Error creating document");
      console.log(error.response.data["detail"]);
      return [false, error.response.data["detail"]];
    });
}

// Document Requests

export type DocumentRequestUnitCreateType = {
  document: number;
  copies: number;
};

export type DocumentRequestCreateType = {
  college: string;
  type: "softcopy" | "hardcopy";
  purpose: string;
  documents: DocumentRequestUnitCreateType[];
};

export type DocumentRequestUnitType = {
  id: number;
  document: DocumentType;
  copies: number;
};

export type DocumentRequestType = {
  id: number;
  requester: string;
  college: string;
  status: "pending" | "approved" | "denied";
  type: "softcopy" | "hardcopy";
  purpose: string;
  documents: DocumentRequestUnitType[];
  date_requested: string;
};

export type DocumentRequestUpdateType = {
  status: "pending" | "approved" | "denied";
};

export async function HeadDocumentRequestsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/requests/list/head/", config)
    .then((response) => {
      return response.data as DocumentRequestType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function DocumentRequestsAPI() {
  const config = await GetConfig();
  return instance
    .get("api/v1/requests/list/", config)
    .then((response) => {
      return response.data as DocumentRequestType[];
    })
    .catch((error) => {
      console.log(error.message);
      return error;
    });
}

export async function DocmentRequestCreateAPI(
  document_request: DocumentRequestCreateType
) {
  const config = await GetConfig();
  return instance
    .post("api/v1/requests/create/", document_request, config)
    .then((response) => {
      return [true, response.data as DocumentType];
    })
    .catch((error) => {
      console.log("Error creating document");
      console.log(error.response.data["detail"]);
      return [false, error.response.data["detail"]];
    });
}

export async function DocmentRequestUpdateAPI(
  document_request: DocumentRequestUpdateType,
  id: number
) {
  const config = await GetConfig();
  return instance
    .patch(`api/v1/requests/update/${id}`, document_request, config)
    .then((response) => {
      return [true, response.data as DocumentType];
    })
    .catch((error) => {
      console.log("Error creating document");
      console.log(error.response.data["detail"]);
      return [false, error.response.data["detail"]];
    });
}
