import {
  BinaryReader,
  BinaryReaderState,
  IImportEntry,
  ExternalKind,
  ISectionInformation,
  SectionCode,
  ITypeEntry,
} from "wasmparser";
import { ImportFunctionInfo } from "../interface.js";
import assert from "node:assert";

export function parseImportFunctionInfo(buf: Uint8Array) {
  const reader = new BinaryReader();
  const types: ITypeEntry[] = [];
  const result: ImportFunctionInfo[] = [];
  reader.setData(buf, 0, buf.length);
  // eslint-disable-next-line no-constant-condition
  while (true) {
    if (!reader.read()) {
      return result;
    }
    switch (reader.state) {
      case BinaryReaderState.END_WASM: {
        break;
      }
      case BinaryReaderState.ERROR: {
        throw reader.error;
      }
      case BinaryReaderState.END_SECTION: {
        break;
      }
      case BinaryReaderState.BEGIN_SECTION: {
        const sectionInfo = reader.result as ISectionInformation;
        switch (sectionInfo.id) {
          case SectionCode.Type:
          case SectionCode.Import: {
            break;
          }
          default: {
            reader.skipSection();
            break;
          }
        }
        break;
      }
      case BinaryReaderState.TYPE_SECTION_ENTRY: {
        const typeEntry = reader.result as ITypeEntry;
        types.push(typeEntry);
        break;
      }
      case BinaryReaderState.IMPORT_SECTION_ENTRY: {
        const importInfo = reader.result as IImportEntry;
        const decoder = new TextDecoder("utf8");
        if (importInfo.kind === ExternalKind.Function) {
          const typeIdx = importInfo.funcTypeIndex;
          assert(typeIdx !== undefined, "ImportFunction must have a typeIndex");
          const typeItem = types[typeIdx];
          assert(typeItem !== undefined, "ImportFunction must have a typeItem");
          assert(typeItem.params !== undefined);
          assert(typeItem.returns !== undefined);
          const returnValue = typeItem.returns.length === 0 ? undefined : typeItem.returns[0];
          result.push({
            module: decoder.decode(importInfo.module),
            name: decoder.decode(importInfo.field),
            args: typeItem.params,
            return: returnValue,
          });
        }
        break;
      }
      default: {
        break;
      }
    }
  }
}
