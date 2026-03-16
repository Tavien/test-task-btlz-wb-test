import { Result, type ResultType } from "../../lib/result.js";

import { 
    type RepositoryErr,
    type WbTariffResponse,
    HttpAdapter,
    RepositoryErrorCode, 
} from "#types/index.js";

export const createWbRepository = (fetchWraper: HttpAdapter) => {
    
    const getBoxTariffs = (params: {date: string, apiKey: string})
        : Promise<ResultType<WbTariffResponse, RepositoryErr>> => 
            fetchWraper.schedule(() => {
                const {date, apiKey} = params;

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