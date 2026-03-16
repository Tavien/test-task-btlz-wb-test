import { SpreadsheetsRepository } from "#repositories/index.js";

import { Sheet } from "#types/index.js";

export const createSpreadsheertService = (sheetRepository: SpreadsheetsRepository) => {
    const addSheet = (sheet: Sheet) => (
        sheetRepository.addSheet(sheet)
    );

    const getSheets = () => (
        sheetRepository.getAllSheets()
    );
    
    return {
        addSheet,
        getSheets,
    }
}