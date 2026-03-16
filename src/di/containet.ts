import * as RateLimiter from "#lib/rate-limiter.js";
import env from "#config/env/env.js";
import knex from "#postgres/knex.js";

import type { HttpAdapter, Sheet } from "#types/index.js";

import { createKnexAdapter } from "#adapters/knex.adapter.js";
import { createGoogleSheetsClient } from "#clients/googleapi.client.js";

import { 
    createSpreadsheetsRepository, 
    createTariffsRepository, 
    createWbRepository,
    createGoogleSheetRepository
} from "#repositories/index.js";

import { 
    createTariffServie,
    createSpreadsheertService
} from "#services/index.js";

import { createTariffSyncDomain } from "#domain/tariff-sync.domain.js";

export type TariffSyncDomain = ReturnType<typeof createTariffSyncDomain>;

export interface TariffSyncContainer {
    domain: TariffSyncDomain;
}

export const tariffSyncDiContainer = (): TariffSyncContainer => {
    const wbCredentials = env.WB_CREDENTIALS;
    const googleCredentials = env.GOOGLE_CREDENTIALS;

    // Rate limit
    // https://dev.wildberries.ru/docs/openapi/wb-tariffs/#tag/Tarify-na-ostatok/paths/~1api~1v1~1tariffs~1box/get
    const wbGetBoxTariffRateConfig: RateLimiter.RateLiminerConfig = {
        rate: 60,
        period: 60_000,
        tick_time: 10,
        burst: 5,
        exponent: 8,
    };

    // DB adapter
    const knexDbAdapter = createKnexAdapter(knex);

    // WB
    const rateLimiter = RateLimiter.createTokenBucketRateLimiter(wbGetBoxTariffRateConfig) as HttpAdapter;
    const wbRepository = createWbRepository(rateLimiter, wbCredentials);
    const tariffRepository = createTariffsRepository(knexDbAdapter);
    const tariffService = createTariffServie(tariffRepository, wbRepository);

    // Sheets
    const spreadsheetRepository = createSpreadsheetsRepository(knexDbAdapter);
    const googleSheetClient = createGoogleSheetsClient(googleCredentials);
    const googleSheetRepository = createGoogleSheetRepository(googleSheetClient);
    const spreadsheetService = createSpreadsheertService(spreadsheetRepository, googleSheetRepository);

    // Domain
    return {
        domain: createTariffSyncDomain(tariffService, spreadsheetService),
    };
}








