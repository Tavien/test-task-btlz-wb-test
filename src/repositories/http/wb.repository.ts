import { Result, type ResultType } from "#lib/result.js";

import { 
    type RepositoryErr,
    type WbTariffResponse,
    RepositoryErrorCode, 
    HttpAdapter,
} from "#types/index.js";

export interface WbRepository {
    getBoxTariffs(date: string): Promise<ResultType<WbTariffResponse, RepositoryErr>>;
}

export const createWbRepository = (fetchWraper: HttpAdapter, apiKey: string): WbRepository => {
    
    const getBoxTariffs = (date: string)
        : Promise<ResultType<WbTariffResponse, RepositoryErr>> => 
            fetchWraper.schedule(() => {
  
                const url = new URL("https://common-api.wildberries.ru/api/v1/tariffs/box");
                url.searchParams.append("date", date);

                return fetch(url, {
                    method: "GET",
                    headers: {
                        Accept: "application/json",
                        Authorization: apiKey,
                    },
                })
                .then(res => res.ok ? res.json() : Promise.reject(res))
                .then(
                    (tariffs: WbTariffResponse) => Result.Ok(tariffs),
                    (error: any) => Result.Err({
                        code: RepositoryErrorCode.FETCH_TARIFFS_FAILED,
                        message: error.message,
                        original: error
                    })
                );
            });

    return {
        getBoxTariffs,
    }
}