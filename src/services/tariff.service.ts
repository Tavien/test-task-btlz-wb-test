import { match, Result, type ResultType } from "#lib/result.js";

import type { TariffsRepository, WbRepository } from "#repositories/index.js";

import type { AppError, Tariff } from "#types/index.js";

import { serializeWbResponse } from "#utils/serializer.js"


export const createTariffServie = (tariffRepository: TariffsRepository, wbRepository: WbRepository) => {
    const updateTariffsOnDate = async (date: string): Promise<ResultType<number, AppError>> => {
        
        const wbRepoResult = await wbRepository.getBoxTariffs(date)

        const tariffsResult = match(wbRepoResult)({
            onOk: (data) => (
                serializeWbResponse(data, date)
            ),
            onErr: (error) => Result.Err(error) as any
        }) as ResultType<Tariff[], AppError>;

        return match(tariffsResult)({
            onOk: (data) => (
                tariffRepository.createOrUpdateDailyTariffs(data)
            ),
            onErr: (error) => Result.Err(error) as any
        });
    }

    const readTariffsByDate = async (date: string): Promise<ResultType<Tariff[], AppError>> => {
        
        const tariffsResult = await tariffRepository.getTariffsByDate(date);

        return match(tariffsResult)({
            onOk: (data) => ( data ),
            onErr: (error) => Result.Err(error) as any
        })
    }

    return {
        updateTariffsOnDate,
        readTariffsByDate,
    }
}