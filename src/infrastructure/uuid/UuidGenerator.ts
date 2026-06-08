/**
 * UuidGenerator — implements IUuidGenerator using the `uuid` package.
 *
 * Layer: infrastructure
 */

import { v4 as uuidv4 } from "uuid";

import type { IUuidGenerator } from "@/application/ports/IUuidGenerator";

export class UuidGenerator implements IUuidGenerator {
  generate(): string {
    return uuidv4();
  }
}
