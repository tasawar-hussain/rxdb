import assert from 'assert';
import {
    randomBoolean,
    randomNumber,
    randomString
} from 'async-test-util';
import {
    getIndexableString,
    RxDocumentData,
    RxJsonSchema,
    getStringLengthOfIndexNumber,
    getStartIndexStringFromLowerBound
} from '../../';
import { EXAMPLE_REVISION_1 } from '../helper/revisions';
import config from './config';

config.parallel('custom-index.test.ts', () => {

    type IndexTestDocType = {
        id: string;
        num: number;
        bool: boolean;
    };
    const schema: RxJsonSchema<IndexTestDocType> = {
        primaryKey: 'id',
        version: 0,
        type: 'object',
        properties: {
            id: {
                type: 'string',
                maxLength: 100
            },
            num: {
                type: 'number',
                minimum: 10,
                maximum: 100,
                multipleOf: 0.01
            },
            bool: {
                type: 'boolean'
            }
        },
        required: [
            'id',
            'num',
            'bool'
        ],
        indexes: [
            ['id'],
            ['num'],
            ['bool'],
            [
                'bool',
                'num'
            ]
        ]
    };

    function getIndexTestDoc(partial?: Partial<IndexTestDocType>): RxDocumentData<IndexTestDocType> {
        return Object.assign({
            id: randomString(10),
            num: randomNumber(10, 100),
            bool: randomBoolean(),
            _deleted: false,
            _attachments: {},
            _meta: {
                lwt: new Date().getTime()
            },
            _rev: EXAMPLE_REVISION_1
        }, partial);
    }

    describe('.getStringLengthOfIndexNumber()', () => {
        it('should calculate the correct length', () => {
            const parsed = getStringLengthOfIndexNumber({
                type: 'number',
                minimum: 0.1,
                maximum: 110.5,
                multipleOf: 0.01
            });
            assert.strictEqual(parsed.decimals, 2);
            assert.strictEqual(parsed.nonDecimals, 3);
        });
    });
    describe('.getIndexableString()', () => {
        describe('index-type: string', () => {
            it('should get a correct string', () => {
                const index = ['id'];
                const docs = [
                    getIndexTestDoc({ id: 'bb' }),
                    getIndexTestDoc({ id: 'aa' })
                ];
                const sorted = docs.sort((a, b) => {
                    const strA = getIndexableString(
                        schema,
                        index,
                        a
                    );
                    const strB = getIndexableString(
                        schema,
                        index,
                        b
                    );
                    assert.strictEqual(strA.length, schema.properties.id.maxLength);
                    assert.strictEqual(strB.length, schema.properties.id.maxLength);
                    return strA < strB ? -1 : 1;
                });
                assert.strictEqual(sorted[0].id, 'aa');
            });
        });
        describe('index-type: boolean', () => {
            it('should get a correct string', () => {
                const index = ['bool'];
                const docs = [
                    getIndexTestDoc({ bool: true }),
                    getIndexTestDoc({ bool: false })
                ];
                const sorted = docs.sort((a, b) => {
                    const strA = getIndexableString(
                        schema,
                        index,
                        a
                    );
                    const strB = getIndexableString(
                        schema,
                        index,
                        b
                    );
                    assert.strictEqual(strA.length, 1);
                    assert.strictEqual(strB.length, 1);
                    return strA < strB ? -1 : 1;
                });
                assert.strictEqual(sorted[0].bool, false);
            });
        });
        describe('index-type: number', () => {
            it('should get a valid string', () => {
                const index = ['num'];
                const docData = getIndexTestDoc({ num: 24.02 });
                const indexString = getIndexableString(
                    schema,
                    index,
                    docData
                );
                const parsed = getStringLengthOfIndexNumber(schema.properties.num);
                assert.strictEqual(indexString.length, parsed.decimals + parsed.nonDecimals);
            });
            it('should get the correct sort order', () => {
                const index = ['num'];
                const docs = [
                    getIndexTestDoc({ num: 11 }),
                    getIndexTestDoc({ num: 10.02 })
                ];
                const sorted = docs.sort((a, b) => {
                    const strA = getIndexableString(
                        schema,
                        index,
                        a
                    );
                    const strB = getIndexableString(
                        schema,
                        index,
                        b
                    );
                    assert.strictEqual(strA.length, strB.length);
                    return strA < strB ? -1 : 1;
                });
                assert.strictEqual(sorted[0].num, 10.02);
            });
        });
    });
    describe('.getStartIndexStringFromLowerBound()', () => {
        it('should find the correct docs when comparing with the index', () => {
            const docs = new Array(100).fill(0).map(() => getIndexTestDoc());
            const index = ['bool', 'num'];

            const lowerBoundString = getStartIndexStringFromLowerBound(
                schema,
                index,
                [
                    true,
                    30
                ]
            );

            const matchingDocs = docs.filter(doc => {
                const isIndexStr = getIndexableString(
                    schema,
                    index,
                    doc
                );
                return isIndexStr >= lowerBoundString;
            });

            matchingDocs.forEach(doc => {
                assert.ok(doc.bool);
                assert.ok(doc.num >= 30);
            });
        });
    });
    describe('.getStartIndexStringFromUpperBound()', () => {
        it('should match the correct docs', () => {
            const docs = new Array(100).fill(0).map(() => getIndexTestDoc());
            const index = ['bool', 'num'];

            const upperBoundString = getStartIndexStringFromLowerBound(
                schema,
                index,
                [
                    false,
                    30
                ]
            );
            const matchingDocs = docs.filter(doc => {
                const isIndexStr = getIndexableString(
                    schema,
                    index,
                    doc
                );
                return isIndexStr <= upperBoundString;
            });

            matchingDocs.forEach(doc => {
                console.dir(doc);
                assert.strictEqual(doc.bool, false);
                assert.ok(doc.num <= 30);
            });
        });
    });
});
