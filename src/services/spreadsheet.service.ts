import { match, Result, type ResultType } from "#lib/result.js";

import type { SpreadsheetsRepository, GoogleSheetsRepository } from "#repositories/index.js";

import { AppError, Sheet, Tariff } from "#types/index.js";

export interface SpreadsheetService {
    addSheet(sheet: Sheet): Promise<ResultType<Sheet, AppError>>;
    getSheets(): Promise<ResultType<Sheet[], AppError>>;
    updateAllSheets(tariffs: Tariff[]): Promise<ResultType<boolean[], AppError>[]>;
}

export const createSpreadsheertService = (sheetRepository: SpreadsheetsRepository, googleSheetsRepository: GoogleSheetsRepository)
    : SpreadsheetService => {
        const addSheet = (sheet: Sheet) => (
            sheetRepository.addSheet(sheet)
        );

        const getSheets = () => (
            sheetRepository.getAllSheets()
        );

        const updateAllSheets = async (tariffs: Tariff[]) => {
            const sheetsResult = await getSheets();

            const updatePromiseResult = match(sheetsResult)({
                onOk: (sheets) => (
                    sheets.map(sheet => (
                        googleSheetsRepository.updateSheet(sheet, tariffs)
                    ))
                ),
                onErr: (error) => Result.Err(error) as any
            });

            return Promise.all(updatePromiseResult);
        }
        
        return {
            addSheet,
            getSheets,
            updateAllSheets,
        }
    }