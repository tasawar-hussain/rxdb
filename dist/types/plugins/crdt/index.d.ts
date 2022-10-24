import type { CRDTDocumentField, CRDTEntry, CRDTOperation, HashFunction, JsonSchema, RxConflictHandler, RxDocument, RxDocumentData, RxJsonSchema, RxPlugin, RxStorageStatics, WithDeleted } from '../../types';
import { RxCollection } from '../..';
export declare function updateCRDT<RxDocType>(this: RxDocument<RxDocType>, entry: CRDTEntry<RxDocType> | CRDTEntry<RxDocType>[]): Promise<RxDocument<RxDocType, {}>>;
export declare function insertCRDT<RxDocType>(this: RxCollection<RxDocType>, entry: CRDTEntry<RxDocType> | CRDTEntry<RxDocType>[]): Promise<any>;
export declare function sortOperationComparator<RxDocType>(a: CRDTOperation<RxDocType>, b: CRDTOperation<RxDocType>): 1 | -1;
export declare function hashCRDTOperations(hashFunction: HashFunction, crdts: CRDTDocumentField<any>): string;
export declare function getCRDTSchemaPart<RxDocType>(): JsonSchema<CRDTDocumentField<RxDocType>>;
export declare function mergeCRDTFields<RxDocType>(hashFunction: HashFunction, crdtsA: CRDTDocumentField<RxDocType>, crdtsB: CRDTDocumentField<RxDocType>): CRDTDocumentField<RxDocType>;
export declare function rebuildFromCRDT<RxDocType>(storageStatics: RxStorageStatics, schema: RxJsonSchema<RxDocumentData<RxDocType>>, docData: WithDeleted<RxDocType>, crdts: CRDTDocumentField<RxDocType>): WithDeleted<RxDocType>;
export declare function getCRDTConflictHandler<RxDocType>(hashFunction: HashFunction, storageStatics: RxStorageStatics, schema: RxJsonSchema<RxDocumentData<RxDocType>>): RxConflictHandler<RxDocType>;
export declare const RX_CRDT_CONTEXT = "rx-crdt";
export declare const RxDDcrdtPlugin: RxPlugin;
