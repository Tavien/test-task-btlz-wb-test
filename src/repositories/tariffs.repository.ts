import { Result, type ResultType } from "../lib/result.js";

import { 
    type Tariff, 
    type RepositoryErr,
    RepositoryErrorCode, 
    DbAdapter
} from "#types/index.js";

import { TablesName } from "#constants/index.js";

export const createTariffsRepository = (dba: DbAdapter) => {
    const createOrUpdateDailyTariffs = (tariffs: Tariff[]): Promise<ResultType<number, RepositoryErr>> => (
        dba.queryBuilder<Tariff>(TablesName.tariff)
            .insert(tariffs)
            .onConflict(["date", "warehouse_name"])
            .merge([
                "dt_next_box", 
                "dt_till_max",
                "box_delivery_base",
                "box_delivery_coef_expr",
                "box_delivery_liter",
                "box_delivery_marketplace_base",
                "box_delivery_marketplace_coef_expr",
                "box_delivery_marketplace_liter",
                "box_storage_base",
                "box_storage_coef_expr",
                "box_storage_liter",
            ])
            .returning("*")
            .then(
                (affectedRows: Tariff[]) => {
                    return Result.Ok(affectedRows.length)
                },
                (error: any) => Result.Err({
                    code: RepositoryErrorCode.CREATE_UPDATE_TARIFFS_FAILED,
                    message: error.message,
                    original: error
                })
            )
    )

    const getTariffsByDate = (date: string): Promise<ResultType<Tariff[], RepositoryErr>> => (
        dba.queryBuilder<Tariff>(TablesName.tariff)
            .select("*")
            .where({date})
            .then(
                (rows: Tariff[]) => {
                    if (!rows.length) {
                        return Result.Err({
                            code: RepositoryErrorCode.TARIFFS_NOT_FOUND,
                            message: "No tariffs found",
                            original: null
                        });
                    }
                    return Result.Ok(rows);
                },
                (error: any) => Result.Err({
                    code: RepositoryErrorCode.GET_TARIFFS_FAILED,
                    message: error.message,
                    original: error
                })
            )
    )

    return {
        createOrUpdateDailyTariffs,
        getTariffsByDate,
    }
}