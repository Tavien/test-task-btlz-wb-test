import { match, Result, type ResultType } from "#lib/result.js";

import { SpreadsheetService } from "#services/spreadsheet.service.js";
import { TariffService } from "#services/tariff.service.js";
import { AppError } from "#types/error.types.js";

export const createTariffSyncDomain = (tariffService: TariffService, sheetService: SpreadsheetService) => {
    const today = () => new Date().toISOString().split('T')[0];

    const getFromWb = async () => {
        tariffService.updateTariffsOnDate(today());
    };

    const setToGoogleSheet = async () => {
        const tariffsResult = await tariffService.readTariffsByDate(today());

        match(tariffsResult)({
            onOk: (tariffs) => (
                sheetService.updateAllSheets(tariffs)
            ),
            onErr: (error: AppError) => {
                console.log(error);
            }
        })        
    };

    return {
        getFromWb,
        setToGoogleSheet
    }
}