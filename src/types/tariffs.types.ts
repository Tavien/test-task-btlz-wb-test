export type Tariff = {
    id: number,
    date: string,
    dt_next_box: string | null,
    dt_till_max: string,
    box_delivery_base: number | null,
    box_delivery_coef_expr: number | null,
    box_delivery_liter: number | null,
    box_delivery_marketplace_base: number | null,
    box_delivery_marketplace_coef_expr: number | null,
    box_delivery_marketplace_liter: number | null,
    box_storage_base: number | null,
    box_storage_coef_expr: number | null,
    box_storage_liter: number | null,
    warehouse_name: string,
    geo_name: string,
    created_at: number,
    updated_at: number,
}

export type WbTariffResponse = {
    response: {
        data: {
            dtNextBox:  string | null,
            dtTillMax:  string,
            warehouseList: [
                {
                    boxDeliveryBase: string | null,
                    boxDeliveryCoefExpr: string | null,
                    boxDeliveryLiter: string | null,
                    boxDeliveryMarketplaceBase: string | null,
                    boxDeliveryMarketplaceCoefExpr: string | null,
                    boxDeliveryMarketplaceLiter: string | null,
                    boxStorageBase: string | null,
                    boxStorageCoefExpr: string | null,
                    boxStorageLiter: string | null,
                    geoName: string | null,
                    warehouseName: string | null,
                }
            ]
        }
    }
}