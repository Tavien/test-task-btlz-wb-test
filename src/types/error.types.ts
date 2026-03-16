import {RepositoryErrorCode} from "#constants/error-codes.js";
import { BaseErr } from "../lib/result.js";

export { RepositoryErrorCode };

export type RepositoryErr = BaseErr<RepositoryErrorCode>;