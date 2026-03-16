import { Result, type ResultType } from "../lib/result.js";

import { 
    type Sheet, 
    type RepositoryErr,
    RepositoryErrorCode, 
    DbAdapter
} from "#types/index.js";

import { TablesName } from "#constants/index.js";

export const createSpreadsheetsRepository = (dba: DbAdapter) => {

    const addSheet = (sheet: Sheet): Promise<ResultType<Sheet, RepositoryErr>> => (
        dba.queryBuilder<Sheet>(TablesName.spreadsheet)
            .insert(sheet)
            .returning('*')
            .then(
                (rows: Sheet[]) => {
                    if (!rows.length) {
                        return Result.Err({
                            code: RepositoryErrorCode.SHEET_NOT_CREATED,
                            message: "Failed to create sheet",
                            original: null
                        });
                    }

                    return Result.Ok(rows[0]);
                },
                (error: any) => Result.Err({
                    code: RepositoryErrorCode.ADD_SHEET_FAILED,
                    message: error.message,
                    original: error
            })
        )        
    );

    const getAllSheets = (): Promise<ResultType<Sheet[], RepositoryErr>> => (
        dba.queryBuilder<Sheet>(TablesName.spreadsheet)
            .select("*")
            .then( 
                (rows: Sheet[]) => {
                    if (!rows.length) {
                        return Result.Err({
                            code: RepositoryErrorCode.SHEETS_NOT_FOUND,
                            message: "No sheets found",
                            original: null
                        });
                    }

                    return Result.Ok(rows);
                },
                (error: any) => Result.Err({
                    code: RepositoryErrorCode.GET_SHEETS_FAILED,
                    message: error.message,
                    original: error,
            })
        )        
    );
    
    return {
        addSheet,
        getAllSheets,
    }
}