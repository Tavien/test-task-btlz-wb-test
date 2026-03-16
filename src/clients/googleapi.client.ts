import { google, sheets_v4 } from "googleapis";

export interface GoogleCredentials {
    client_email: string;
    private_key: string;
}

export const createGoogleSheetsClient = (credentialsBase64: string): sheets_v4.Sheets => {
    const credentialsJson = Buffer.from(credentialsBase64, "base64").toString("utf-8");
    const credentials = JSON.parse(credentialsJson) as GoogleCredentials;

    const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return google.sheets({ auth, version: "v4" });
};