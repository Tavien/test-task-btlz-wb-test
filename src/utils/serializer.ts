import { Result, type ResultType } from "#lib/result.js";

import { SerializerErrorCode } from "#constants/error-codes.js";

import { Tariff, WbTariffResponse } from "#types/index.js";

const extractNumber = (str: string): number => {
    const match = str.match(/-?\d+\.?\d*/);
    return match ? parseFloat(match[0]) : 0;
};

export const serializeWbResponse = (rawResponse: Promise<WbTariffResponse>, date: string) => (
    // It would be nice to add a promisify wrapper here, but it would be unsafe to do so for now...
    rawResponse.then(
        (rawResponse: WbTariffResponse) => {
            const data = rawResponse.response.data;

            const dtNextBox = data.dtNextBox;
            const dtTillMax = data.dtTillMax;
            const warehouseList = data.warehouseList;

            return warehouseList.map((warehouse: any) => ({
                date,
                dt_next_box: dtNextBox,
                dt_till_max: dtTillMax,
                box_delivery_base: extractNumber(warehouse.boxDeliveryBase) || 0,
                box_delivery_coef_expr: extractNumber(warehouse.boxDeliveryCoefExpr) || 0,
                box_delivery_liter: extractNumber(warehouse.boxDeliveryLiter) || 0,
                box_delivery_marketplace_base: extractNumber(warehouse.boxDeliveryMarketplaceBase) || 0,
                box_delivery_marketplace_coef_expr: extractNumber(warehouse.boxDeliveryMarketplaceCoefExpr) || 0,
                box_delivery_marketplace_liter: extractNumber(warehouse.boxDeliveryMarketplaceLiter) || 0,
                box_storage_base: extractNumber(warehouse.boxStorageBase) || 0,
                box_storage_coef_expr: extractNumber(warehouse.boxStorageCoefExpr) || 0,
                box_storage_liter: extractNumber(warehouse.boxStorageLiter) || 0,
                warehouse_name: warehouse.warehouseName,
                geo_name: warehouse.geoName,
            })) as Tariff[];  
        }
    )
    .then(
        (tariffs: Tariff[]) => Result.Ok(tariffs),
        (error) => Result.Err({
            code: SerializerErrorCode.FAILED_SERIALIZE_WB_RESPONSE,
            message: error.message,
            original: error
        })
    )
);