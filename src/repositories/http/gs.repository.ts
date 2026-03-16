import { match, Result, type ResultType } from "#lib/result.js";

import { 
    type RepositoryErr,
    RepositoryErrorCode,
    Sheet, 
    Tariff 
} from "#types/index.js";


export interface GoogleSheetsRepository {
    ensureSheetExists(target: Sheet): Promise<ResultType<boolean, RepositoryErr>>
    updateSheet(target: Sheet, view: any): Promise<ResultType<boolean, RepositoryErr>>;
}

export const createGoogleSheetRepository = (client: any): GoogleSheetsRepository => {
    const PAGE_NAME = "Test-task";
    const headerRow = [
        "Дата тарифа",
        "Дата следующего изменения",
        "Дата максимального тарифа",
        "Склад",
        "География",
        "Коэффициент доставки",
        "База доставки",
        "Литр доставки",
        "Коэффициент доставки маркетплейса",
        "База доставки маркетплейса",
        "Литр доставки маркетплейса",
        "Коэффициент хранения",
        "База хранения",
        "Литр хранения",
        "Последнее обновление",
    ];
    
    const ensureSheetExists = (target: Sheet): Promise<ResultType<boolean, RepositoryErr>> => {
        const spreadsheetId = target.spreadsheet_id;

        

        return client.spreadsheets.get({
            fields: "sheets.properties.title",
            spreadsheetId,
        }).then((spreadsheet: any) => 
            spreadsheet.data.sheets?.some(
                (sheet: any) => sheet.properties?.title === PAGE_NAME
            )
        ).then((hasSheet: boolean) => {
            if (!hasSheet) {
                return client.spreadsheets.batchUpdate({
                    requestBody: {
                        requests: [{
                            addSheet: {
                                properties: { title: PAGE_NAME }
                            }
                        }]
                    },
                    spreadsheetId,
                })
            } 
        }).then(
            (_: any) => Result.Ok(true),
            (error: any) => Result.Err({
                code: RepositoryErrorCode.GOOGLE_SHEETS_ERROR,
                message: error.message,
                original: error    
            })
        );
    };

    const updateSheet = (target: Sheet, tariffs: Tariff[]): Promise<ResultType<boolean, RepositoryErr>> => {
        const spreadsheetId = target.spreadsheet_id;
        
        return ensureSheetExists(target)
            .then((sheetResult) => {
                match(sheetResult)({
                    onOk: (data) => ( data ),
                    onErr: (error) => {throw error} 
                })
            })
            .then((_) => (
                client.spreadsheets.values.clear({
                    range: `${PAGE_NAME}!A:O`,
                    spreadsheetId: spreadsheetId,
                })
            ))
            .then((_) => (
                client.spreadsheets.values.update({
                    range: `${PAGE_NAME}!A1`,
                    requestBody: {
                        values: [
                            headerRow,
                            ...tariffs.map(row => [
                                row.date,
                                row.dt_next_box ?? "",
                                row.dt_till_max ?? "",
                                row.warehouse_name,
                                row.geo_name ?? "",
                                String(row.box_delivery_coef_expr ?? ""),
                                String(row.box_delivery_base ?? ""),
                                String(row.box_delivery_liter ?? ""),
                                String(row.box_delivery_marketplace_coef_expr ?? ""),
                                String(row.box_delivery_marketplace_base ?? ""),
                                String(row.box_delivery_marketplace_liter ?? ""),
                                String(row.box_storage_coef_expr ?? ""),
                                String(row.box_storage_base ?? ""),
                                String(row.box_storage_liter ?? ""),
                                String(row.updated_at),
                            ])
                        ]
                    },
                    spreadsheetId: spreadsheetId,
                    valueInputOption: "USER_ENTERED",
                })
            ))
            .then(
                (_: any) => Result.Ok(true),
                (error: any) => Result.Err({
                    code: RepositoryErrorCode.GOOGLE_SHEETS_ERROR,
                    message: error.message,
                    original: error
                })
            )
    }

    return {
        ensureSheetExists,
        updateSheet,
    }
}