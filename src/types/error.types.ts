import {RepositoryErrorCode, SerializerErrorCode, ServiceErrorCode} from "#constants/error-codes.js";
import { BaseErr } from "#lib/result.js";

export { RepositoryErrorCode };

export type AppError = RepositoryErr | SerializerErr | SerializerErr;

export type RepositoryErr = BaseErr<RepositoryErrorCode>;
export type SerializerErr = BaseErr<SerializerErrorCode>;
export type ServiceErr = BaseErr<ServiceErrorCode>;