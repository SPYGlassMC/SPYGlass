import assert = require('power-assert')
import NbtdocHelper from '../../utils/NbtdocHelper'
import { describe, it } from 'mocha'
import { fail } from 'power-assert'
import { constructContext } from '../../types/ParsingContext'
import { nbtdoc } from '../../types/nbtdoc'
import NbtCompoundNode from '../../types/nodes/map/NbtCompoundNode'
import NbtStringNode from '../../types/nodes/nbt/NbtStringNode'
import { constructConfig } from '../../types/Config'
import NbtByteNode from '../../types/nodes/nbt/NbtByteNode'
import NbtByteArrayNode from '../../types/nodes/nbt/NbtByteArrayNode'
import Registry from '../../types/Registry'
import { CompletionItemKind, DiagnosticSeverity } from 'vscode-languageserver'
import { ClientCache } from '../../types/ClientCache'
import { NodeRange, NodeDescription } from '../../types/nodes/ArgumentNode'
import ParsingError, { ActionCode } from '../../types/ParsingError'
import NbtIntArrayNode from '../../types/nodes/nbt/NbtIntArrayNode'
import NbtLongArrayNode from '../../types/nodes/nbt/NbtLongArrayNode'
import NbtIntNode from '../../types/nodes/nbt/NbtIntNode'
import NbtDoubleNode from '../../types/nodes/nbt/NbtDoubleNode'
import NbtFloatNode from '../../types/nodes/nbt/NbtFloatNode'
import NbtLongNode from '../../types/nodes/nbt/NbtLongNode'
import NbtShortNode from '../../types/nodes/nbt/NbtShortNode'
import NbtListNode from '../../types/nodes/nbt/NbtListNode'
import { Keys } from '../../types/nodes/map/MapNode'
import NbtCompoundKeyNode from '../../types/nodes/map/NbtCompoundKeyNode'

export const TestNbtdoc: nbtdoc.Root = {
    registries: {
        'minecraft:block': [{
            'minecraft:one_boolean_field': 1
        }, 4],
        'minecraft:item': [{
            'minecraft:boolean': 7,
            'minecraft:complex': 8
        }, 4]
    },
    compound_arena: [
        {
            /* 0 */
            description: ' An empty compound',
            fields: {},
            supers: null
        },
        {
            /* 1 */
            description: ' A compound with a boolean field',
            fields: {
                foo: {
                    description: ' The only field of this compound',
                    nbttype: 'Boolean'
                }
            },
            supers: null
        },
        {
            /* 2 */
            description: ' A compound with a boolean field and a compound supers',
            fields: {
                bar: {
                    description: ' The only field of this compound',
                    nbttype: 'Boolean'
                }
            },
            supers: { Compound: 1 }
        },
        {
            /* 3 */
            description: ' A compound with a boolean field and a registry supers',
            fields: {
                bar: {
                    description: ' The only field of this compound',
                    nbttype: 'Boolean'
                }
            },
            supers: {
                Registry: {
                    target: 'minecraft:block',
                    path: ['Super', { Child: 'Id' }]
                }
            }
        },
        {
            /* 4 */
            description: ' The fallback compound for minecraft:block',
            fields: {},
            supers: null
        },
        {
            /* 5 */
            description: ' A compound with some crazy keys and a compound supers',
            fields: {
                normal: {
                    description: ' This is a normal key',
                    nbttype: 'Boolean'
                },
                'double"quote': {
                    description: ' This is a crazy key with a double quotation mark',
                    nbttype: 'Boolean'
                }
            },
            supers: { Compound: 1 }
        },
        {
            /* 6 */
            description: ' The base of item tag',
            fields: {
                CustomModelData: {
                    description: ' The custom model data for this item',
                    nbttype: { Int: { range: null } }
                }
            },
            supers: null
        },
        {
            /* 7 */
            description: ' The tag for item minecraft:boolean',
            fields: {
                addition: {
                    description: ' The additional boolean',
                    nbttype: 'Boolean'
                }
            },
            supers: { Compound: 6 }
        },
        {
            /* 8 */
            description: ' The tag for item minecraft:complex',
            fields: {
                addition: {
                    description: ' The additional complex compound',
                    nbttype: { Compound: 1 }
                }
            },
            supers: { Compound: 6 }
        }
    ],
    enum_arena: [
        {
            /* 0 */
            description: ' A simple string enum',
            et: {
                String: {
                    Red: {
                        description: '',
                        value: 'red'
                    },
                    Green: {
                        description: '',
                        value: 'green'
                    },
                    Blue: {
                        description: '',
                        value: 'blue'
                    }
                }
            }
        },
        {
            /* 1 */
            description: ' A simple byte enum',
            et: {
                Byte: {
                    One: {
                        description: ' The first positive integer',
                        value: 1
                    },
                    Two: {
                        description: ' The second positive integer',
                        value: 2
                    },
                    Three: {
                        description: ' The third positive integer',
                        value: 3
                    }
                }
            }
        }
    ],
    module_arena: [{ parent: null, children: {} }],
    root_modules: {},
    unresolved_inject: []
}

export const TestRegistry: Registry = {
    'minecraft:block': {
        protocol_id: NaN,
        entries: {
            'minecraft:one_boolean_field': { protocol_id: NaN }
        }
    }
}

const TestCache: ClientCache = {
    tags: {
        fooTag: { def: [], ref: [] }
    }
}

describe('NbtdocHelper Tests', () => {
    describe('clone() Tests', () => {
        it('Should clone correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper.clone()
            assert(actual.compoundIndex === helper.compoundIndex)
            assert(actual.enumIndex === helper.enumIndex)
            assert(actual.moduleIndex === helper.moduleIndex)
            assert(actual.tag === helper.tag)
        })
    })
    describe('goCompound() Tests', () => {
        it('Should go to compound correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            helper.goCompound(123)
            assert(helper.compoundIndex === 123)
        })
    })
    describe('goEnum() Tests', () => {
        it('Should go to enum correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            helper.goEnum(123)
            assert(helper.enumIndex === 123)
        })
    })
    describe('goModule() Tests', () => {
        it('Should go to module correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            helper.goModule(123)
            assert(helper.moduleIndex === 123)
        })
    })
    describe('withTag() Tests', () => {
        it('Should set tag correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const tag = new NbtCompoundNode(null)
            helper.withTag(tag)
            assert(helper.tag === tag)
        })
    })
    describe('readCompound() Tests', () => {
        it('Should read null', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper.readCompound()
            assert(actual === null)
        })
        it('Should read correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goCompound(0)
                .readCompound()
            assert(actual === TestNbtdoc.compound_arena[0])
        })
    })
    describe('readEnum() Tests', () => {
        it('Should read correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goEnum(0)
                .readEnum()
            assert(actual === TestNbtdoc.enum_arena[0])
        })
    })
    describe('readModule() Tests', () => {
        it('Should read correctly', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goModule(0)
                .readModule()
            assert(actual === TestNbtdoc.module_arena[0])
        })
    })
    describe('goRegistryCompound() Tests', () => {
        it('Should go null for wrong registries', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper.goRegistryCompound('asdfghjkl', null)
            assert(actual.compoundIndex === null)
        })
        it('Should go fallback for null IDs', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper.goRegistryCompound('minecraft:block', null)
            assert(actual.compoundIndex === 4)
        })
        it('Should go fallback for unknown IDs', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper.goRegistryCompound('minecraft:block', 'asdfghjkl')
            assert(actual.compoundIndex === 4)
        })
        it('Should go correctly for correct IDs', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper.goRegistryCompound('minecraft:block', 'minecraft:one_boolean_field')
            assert(actual.compoundIndex === 1)
        })
    })
    describe('readCompoundKeys() Tests', () => {
        it('Should read the keys of a simple compound', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goCompound(1)
                .readCompoundKeys()
            assert.deepEqual(actual, ['foo'])
        })
        it('Should read the keys of a compound with a compound supers', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goCompound(2)
                .readCompoundKeys()
            assert.deepEqual(actual, ['bar', 'foo'])
        })
        it('Should read the keys of a compound with a registry supers', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const superNode = new NbtCompoundNode(null)
            const compoundNode = new NbtCompoundNode(superNode)
            const idNode = new NbtStringNode(superNode, 'minecraft:one_boolean_field', 'minecraft:one_boolean_field', [])
            superNode.Id = idNode
            const actual = helper
                .withTag(compoundNode)
                .goCompound(3)
                .readCompoundKeys()
            assert.deepEqual(actual, ['bar', 'foo'])
        })
        it('Should read the keys of a compound with a registry supers when the path field does not exist', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const superNode = new NbtCompoundNode(null)
            const compoundNode = new NbtCompoundNode(superNode)
            const actual = helper
                .withTag(compoundNode)
                .goCompound(3)
                .readCompoundKeys()
            assert.deepEqual(actual, ['bar'])
        })
    })
    describe('readField() Tests', () => {
        it('Should return null when no compound is selected', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper.readField('foo')
            assert(actual === null)
        })
        it('Should return null when the key does not exist', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goCompound(2)
                .readField('asdfghjkl')
            assert(actual === null)
        })
        it('Should read the field from current compound', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goCompound(2)
                .readField('bar')
            assert(actual === TestNbtdoc.compound_arena[2].fields.bar)
        })
        it('Should read the field from the supers compound', () => {
            const helper = new NbtdocHelper(TestNbtdoc)
            const actual = helper
                .goCompound(2)
                .readField('foo')
            assert(actual === TestNbtdoc.compound_arena[1].fields.foo)
        })
    })
    describe('completeField() Tests', () => {
        const tag = new NbtCompoundNode(null)
        const isPredicate = false
        const description = ''
        describe('Boolean Tests', () => {
            const doc: nbtdoc.NbtValue = 'Boolean'
            it('Should complete true/false when the config is null', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({
                    lint: {
                        nbtBoolean: null
                    }
                })
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: 'false' },
                    { label: 'true' }
                ])
            })
            it('Should complete true/false when the config is true', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({
                    lint: {
                        nbtBoolean: ['warning', true]
                    }
                })
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: 'false' },
                    { label: 'true' }
                ])
            })
            it('Should complete nothing when the config is false', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({
                    lint: {
                        nbtBoolean: ['warning', false]
                    }
                })
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [])
            })
        })
        describe('ByteArray Tests', () => {
            const doc: nbtdoc.NbtValue = { ByteArray: { length_range: null, value_range: null } }
            it('Should complete correctly', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '[B;]' }
                ])
            })
        })
        describe('Compound Tests', () => {
            const doc: nbtdoc.NbtValue = { Compound: 0 }
            it('Should complete correctly', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '{}' }
                ])
            })
        })
        describe('Enum Tests', () => {
            it('Should complete correctly for string enum', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 0 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '"red"', detail: 'Red' },
                    { label: '"green"', detail: 'Green' },
                    { label: '"blue"', detail: 'Blue' }
                ])
            })
            it('Should complete correctly for byte enum', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 1 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '1b', detail: 'One', documentation: 'The first positive integer' },
                    { label: '2b', detail: 'Two', documentation: 'The second positive integer' },
                    { label: '3b', detail: 'Three', documentation: 'The third positive integer' }
                ])
            })
        })
        describe('Id Tests', () => {
            it('Should complete correctly', async () => {
                const doc: nbtdoc.NbtValue = { Id: 'minecraft:block' }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config, registry: TestRegistry })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '"minecraft"', kind: CompletionItemKind.Module, commitCharacters: [':'] },
                    { label: '"one_boolean_field"', kind: CompletionItemKind.Field, commitCharacters: [' '] }
                ])
            })
        })
        describe('IntArray Tests', () => {
            const doc: nbtdoc.NbtValue = { IntArray: { length_range: null, value_range: null } }
            it('Should complete correctly', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '[I;]' }
                ])
            })
        })
        describe('List Tests', () => {
            const doc: nbtdoc.NbtValue = { List: { length_range: null, value_type: { Or: [] } } }
            it('Should complete correctly', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '[]' }
                ])
            })
        })
        describe('LongArray Tests', () => {
            const doc: nbtdoc.NbtValue = { LongArray: { length_range: null, value_range: null } }
            it('Should complete correctly', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '[L;]' }
                ])
            })
        })
        describe('String Tests', () => {
            const doc: nbtdoc.NbtValue = 'String'
            it('Should complete correctly', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config, cache: TestCache })
                const description = ' The tags on the entity'

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.completeField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.completions, [
                    { label: '"fooTag"' }
                ])
            })
        })
    })
    describe('completeCompoundFieldKeys() Tests', () => {
        const doc: nbtdoc.NbtValue = { Compound: 5 }
        it('Should return all keys', async () => {
            const ans = { cache: {}, completions: [], errors: [] }
            const config = constructConfig({})
            const ctx = await constructContext({ config })
            const inQuote = null
            const tag = new NbtCompoundNode(null)

            const helper = new NbtdocHelper(TestNbtdoc)
            helper.completeCompoundFieldKeys(ans, ctx, tag, doc, inQuote)

            assert.deepEqual(ans.completions, [
                { label: 'normal', insertText: 'normal', kind: CompletionItemKind.Property, documentation: 'This is a normal key' },
                { label: 'double"quote', insertText: `'double"quote'`, kind: CompletionItemKind.Property, documentation: 'This is a crazy key with a double quotation mark' },
                { label: 'foo', insertText: 'foo', kind: CompletionItemKind.Property, documentation: 'The only field of this compound' }
            ])
        })
        it('Should not include existing keys', async () => {
            const ans = { cache: {}, completions: [], errors: [] }
            const config = constructConfig({})
            const ctx = await constructContext({ config })
            const inQuote = null
            const tag = new NbtCompoundNode(null)
            tag.foo = new NbtByteNode(null, 1, 'true')

            const helper = new NbtdocHelper(TestNbtdoc)
            helper.completeCompoundFieldKeys(ans, ctx, tag, doc, inQuote)

            assert.deepEqual(ans.completions, [
                { label: 'normal', insertText: 'normal', kind: CompletionItemKind.Property, documentation: 'This is a normal key' },
                { label: 'double"quote', insertText: `'double"quote'`, kind: CompletionItemKind.Property, documentation: 'This is a crazy key with a double quotation mark' }
            ])
        })
        it('Should return correctly for in-double-quote cases', async () => {
            const ans = { cache: {}, completions: [], errors: [] }
            const config = constructConfig({})
            const ctx = await constructContext({ config })
            const inQuote = 'double'
            const tag = new NbtCompoundNode(null)

            const helper = new NbtdocHelper(TestNbtdoc)
            helper.completeCompoundFieldKeys(ans, ctx, tag, doc, inQuote)

            assert.deepEqual(ans.completions, [
                { label: 'normal', insertText: 'normal', kind: CompletionItemKind.Property, documentation: 'This is a normal key' },
                { label: 'double"quote', insertText: 'double\\"quote', kind: CompletionItemKind.Property, documentation: 'This is a crazy key with a double quotation mark' },
                { label: 'foo', insertText: 'foo', kind: CompletionItemKind.Property, documentation: 'The only field of this compound' }
            ])
        })
        it('Should return correctly for in-single-quote cases', async () => {
            const ans = { cache: {}, completions: [], errors: [] }
            const config = constructConfig({})
            const ctx = await constructContext({ config })
            const inQuote = 'single'
            const tag = new NbtCompoundNode(null)

            const helper = new NbtdocHelper(TestNbtdoc)
            helper.completeCompoundFieldKeys(ans, ctx, tag, doc, inQuote)

            assert.deepEqual(ans.completions, [
                { label: 'normal', insertText: 'normal', kind: CompletionItemKind.Property, documentation: 'This is a normal key' },
                { label: 'double"quote', insertText: 'double"quote', kind: CompletionItemKind.Property, documentation: 'This is a crazy key with a double quotation mark' },
                { label: 'foo', insertText: 'foo', kind: CompletionItemKind.Property, documentation: 'The only field of this compound' }
            ])
        })
    })
    describe('validateField() Tests', () => {
        const isPredicate = false
        const description = ''
        describe('Boolean Tests', () => {
            const doc: nbtdoc.NbtValue = 'Boolean'
            it('Should report errors for non-byte tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({
                    lint: {
                        nbtBoolean: null
                    }
                })
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a byte tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({
                    lint: {
                        nbtBoolean: null
                    }
                })
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 0, 'false')
                tag[NodeRange] = { start: 0, end: 5 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report errors when expecting byte numbers', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({
                    lint: {
                        nbtBoolean: ['warning', false]
                    }
                })
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 0, 'false')
                tag[NodeRange] = { start: 0, end: 5 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 5 },
                    'Expected a byte tag but got ‘false’',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtByteToNumber
                )])
            })
            it('Should report errors when expecting boolean literals', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({
                    lint: {
                        nbtBoolean: ['warning', true]
                    }
                })
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected ‘false’ or ‘true’',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtByteToLiteral
                )])
            })
        })
        describe('ByteArray Tests', () => {
            const doc: nbtdoc.NbtValue = { ByteArray: { length_range: null, value_range: null } }
            it('Should report errors for non-byte-array tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a byte array tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should include action codes for similar tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'Expected a byte array tag but got an int array tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToByteArray
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report errors when the collection length is too large', async () => {
                const doc: nbtdoc.NbtValue = { ByteArray: { length_range: [1, 2], value_range: null } }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'Expected a collection with more than or equal to 1 element(s)',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors when the collection length is too small', async () => {
                const doc: nbtdoc.NbtValue = { ByteArray: { length_range: [1, 2], value_range: null } }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }
                tag.push(new NbtByteNode(null, 0, '0'))
                tag.push(new NbtByteNode(null, 0, '0'))
                tag.push(new NbtByteNode(null, 0, '0'))

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'Expected a collection with less than or equal to 2 element(s)',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors when the value range is incorrect', async () => {
                const doc: nbtdoc.NbtValue = { ByteArray: { length_range: null, value_range: [0, 1] } }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteArrayNode(null)
                tag[NodeRange] = { start: 0, end: 6 }
                const eleTag = new NbtByteNode(null, 2, '2')
                eleTag[NodeRange] = { start: 3, end: 5 }
                tag.push(eleTag)

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 3, end: 5 },
                    'Expected a number smaller than or equal to 1 but got 2',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
        })
        describe('Byte Tests', () => {
            const doc: nbtdoc.NbtValue = { Byte: { range: null } }
            it('Should report errors for non-byte tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a byte tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors for loosely-matched tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 1 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 1 },
                    'Expected a byte tag but got an int tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToByte
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report errors when the value range is too small', async () => {
                const doc: nbtdoc.NbtValue = { Byte: { range: [1, 2] } }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a number greater than or equal to 1 but got 0',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors when the value range is too large', async () => {
                const doc: nbtdoc.NbtValue = { Byte: { range: [1, 2] } }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 3, '3')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a number smaller than or equal to 2 but got 3',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
        })
        describe('Compound Tests', () => {
            const doc: nbtdoc.NbtValue = { Compound: 0 }
            it('Should report errors for non-compound tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtListNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a compound tag but got a list tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct empty tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report nothing for correct filled tags', async () => {
                const doc: nbtdoc.NbtValue = { Compound: 7 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 21 }
                const customModelDataKey = new NbtCompoundKeyNode(null, 'CustomModelData', 'CustomModelData', [])
                customModelDataKey[NodeRange] = { start: 1, end: 16 }
                tag[Keys].CustomModelData = customModelDataKey
                const customModelDataTag = new NbtIntNode(null, 1, '1')
                customModelDataTag[NodeRange] = { start: 19, end: 20 }
                tag.CustomModelData = customModelDataTag

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(customModelDataKey[NodeDescription] === '(Int) The custom model data for this item')
                assert.deepEqual(ans.errors, [])
            })
            it('Should report nothing for unknown tags in ItemBase', async () => {
                const doc: nbtdoc.NbtValue = { Compound: 7 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 15 }
                const asdfghjklKey = new NbtCompoundKeyNode(null, 'asdfghjkl', 'asdfghjkl', [])
                asdfghjklKey[NodeRange] = { start: 1, end: 10 }
                tag[Keys].asdfghjkl = asdfghjklKey
                const asdfghjklTag = new NbtIntNode(null, 1, '1')
                asdfghjklTag[NodeRange] = { start: 13, end: 14 }
                tag.asdfghjkl = asdfghjklTag

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(asdfghjklKey[NodeDescription] === undefined)
                assert.deepEqual(ans.errors, [])
            })
            it('Should report errors for unknown tags in non-ItemBase compounds', async () => {
                const doc: nbtdoc.NbtValue = { Compound: 1 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 15 }
                const asdfghjklKey = new NbtCompoundKeyNode(null, 'asdfghjkl', 'asdfghjkl', [])
                asdfghjklKey[NodeRange] = { start: 1, end: 10 }
                tag[Keys].asdfghjkl = asdfghjklKey
                const asdfghjklTag = new NbtIntNode(null, 1, '1')
                asdfghjklTag[NodeRange] = { start: 13, end: 14 }
                tag.asdfghjkl = asdfghjklTag

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(asdfghjklKey[NodeDescription] === undefined)
                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 1, end: 10 },
                    'Unknown key ‘asdfghjkl’',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
        })
        describe('Double Tests', () => {
            const doc: nbtdoc.NbtValue = { Double: { range: null } }
            it('Should report errors for non-double tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a double tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors for loosely-matched tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 1 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 1 },
                    'Expected a double tag but got an int tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToDouble
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtDoubleNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('Enum Tests', () => {
            it('Should report errors for non-string tags', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 0 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(tag[NodeDescription] === '(String) A simple string enum')
                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a string tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors for out-of-range values', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 0 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtStringNode(null, 'asdfghjkl', '"asdfghjkl"', [1, 2, 3])
                tag[NodeRange] = { start: 0, end: 11 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(tag[NodeDescription] === '(String) A simple string enum')
                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 11 },
                    'Expected ‘red’, ‘green’, or ‘blue’ but got ‘asdfghjkl’',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct string tags', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 0 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtStringNode(null, 'red', '"red"', [1, 2, 3])
                tag[NodeRange] = { start: 0, end: 5 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(tag[NodeDescription] === '(String) A simple string enum\n\nRed')
                assert.deepEqual(ans.errors, [])
            })
            it('Should report errors for non-byte tags', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 1 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(tag[NodeDescription] === '(Byte) A simple byte enum')
                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a byte tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors for out-of-range values', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 1 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 5, '5b')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(tag[NodeDescription] === '(Byte) A simple byte enum')
                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected ‘1’, ‘2’, or ‘3’ but got ‘5’',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct byte tags', async () => {
                const doc: nbtdoc.NbtValue = { Enum: 1 }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 2, '2b')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert(tag[NodeDescription] === '(Byte) A simple byte enum\n\nTwo - The second positive integer')
                assert.deepEqual(ans.errors, [])
            })
        })
        describe('Float Tests', () => {
            const doc: nbtdoc.NbtValue = { Float: { range: null } }
            it('Should report errors for non-float tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a float tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors for loosely-matched tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 1 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 1 },
                    'Expected a float tag but got an int tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToFloat
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtFloatNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('Id Tests', () => {
            const doc: nbtdoc.NbtValue = { Id: 'minecraft:block' }
            it('Should report errors for non-string tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a string tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should remap range indexes', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config, registry: TestRegistry })
                const tag = new NbtStringNode(null, 'minecraft:asdfghjklqwertyui', '"minecraft:asdfghjklqwertyui"', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27])
                tag[NodeRange] = { start: 0, end: 29 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 1, end: 28 },
                    'Failed to resolve namespaced ID ‘minecraft:asdfghjklqwertyui’ in registry ‘minecraft:block’',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config, registry: TestRegistry })
                const tag = new NbtStringNode(null, 'minecraft:one_boolean_field', '"minecraft:one_boolean_field"', [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27])
                tag[NodeRange] = { start: 0, end: 29 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('Index Tests', () => {
            const doc: nbtdoc.NbtValue = { Index: { target: 'minecraft:block', path: ['Super', { Child: 'Id' }] } }
            const superTag = new NbtCompoundNode(null)
            superTag.Id = new NbtStringNode(superTag, 'minecraft:one_boolean_field', '"minecraft:one_boolean_field"', [])
            it('Should report errors for non-compound tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtListNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a compound tag but got a list tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct empty tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(superTag)
                tag[NodeRange] = { start: 0, end: 20 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report nothing for correctly filled tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(superTag)
                tag[NodeRange] = { start: 0, end: 20 }
                tag.foo = new NbtByteNode(superTag, 0, 'false')
                tag.foo[NodeRange] = { start: 7, end: 12 }
                tag[Keys].foo = new NbtCompoundKeyNode(null, 'foo', 'foo', [])
                tag[Keys].foo[NodeRange] = { start: 3, end: 6 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report errors for unexpected child types', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(superTag)
                tag[NodeRange] = { start: 0, end: 20 }
                tag.foo = new NbtCompoundNode(superTag)
                tag.foo[NodeRange] = { start: 7, end: 9 }
                tag[Keys].foo = new NbtCompoundKeyNode(null, 'foo', 'foo', [])
                tag[Keys].foo[NodeRange] = { start: 3, end: 6 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 7, end: 9 },
                    'Expected a byte tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
        })
        describe('IntArray Tests', () => {
            const doc: nbtdoc.NbtValue = { IntArray: { length_range: null, value_range: null } }
            it('Should report errors for non-int-array tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected an int array tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should include action codes for similar tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'Expected an int array tag but got a byte array tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToIntArray
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('Int Tests', () => {
            const doc: nbtdoc.NbtValue = { Int: { range: null } }
            it('Should report errors for non-int tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected an int tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 1 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('List Tests', () => {
            const doc: nbtdoc.NbtValue = { List: { length_range: null, value_type: 'Boolean' } }
            it('Should report errors for non-list tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a list tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should include action codes for similar tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'Expected a list tag but got an int array tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToList
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtListNode(null)
                tag[NodeRange] = { start: 0, end: 7 }
                const childTag = new NbtByteNode(null, 0, 'false')
                tag[NodeRange] = { start: 1, end: 6 }
                tag.push(childTag)

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('LongArray Tests', () => {
            const doc: nbtdoc.NbtValue = { LongArray: { length_range: null, value_range: null } }
            it('Should report errors for non-long-array tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a long array tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should include action codes for similar tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 4 },
                    'Expected a long array tag but got an int array tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToLongArray
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtLongArrayNode(null)
                tag[NodeRange] = { start: 0, end: 4 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('Long Tests', () => {
            const doc: nbtdoc.NbtValue = { Long: { range: null } }
            it('Should report errors for non-long tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a long tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors for loosely-matched tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 1 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 1 },
                    'Expected a long tag but got an int tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToLong
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtLongNode(null, BigInt(0), '0')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('Or Tests', () => {
            const doc: nbtdoc.NbtValue = { Or: ['Boolean', 'String'] }
            it('Should report errors when the length of OR is zero', async () => {
                const doc: nbtdoc.NbtValue = { Or: [] }
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    "This tag doesn't exist here",
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for tags that match the first doc', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtByteNode(null, 0, 'false')
                tag[NodeRange] = { start: 0, end: 5 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report nothing for tags that match the second doc', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtStringNode(null, 'foo', '"foo"', [1, 2, 3])
                tag[NodeRange] = { start: 0, end: 5 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
            it('Should report errors for the second doc if the tag matches none of them', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a string tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
        })
        describe('Short Tests', () => {
            const doc: nbtdoc.NbtValue = { Short: { range: null } }
            it('Should report errors for non-short tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a short tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report errors for loosely-matched tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtIntNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 1 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 1 },
                    'Expected a short tag but got an int tag',
                    undefined, DiagnosticSeverity.Warning, ActionCode.NbtTypeToShort
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtShortNode(null, 0, '0')
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
        describe('String Tests', () => {
            const doc: nbtdoc.NbtValue = 'String'
            it('Should report errors for non-string tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config })
                const tag = new NbtCompoundNode(null)
                tag[NodeRange] = { start: 0, end: 2 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [new ParsingError(
                    { start: 0, end: 2 },
                    'Expected a string tag but got a compound tag',
                    undefined, DiagnosticSeverity.Warning
                )])
            })
            it('Should report nothing for correct tags', async () => {
                const ans = { cache: {}, completions: [], errors: [] }
                const config = constructConfig({})
                const ctx = await constructContext({ config, registry: TestRegistry })
                const tag = new NbtStringNode(null, 'foo', '"foo"', [1, 2, 3])
                tag[NodeRange] = { start: 0, end: 5 }

                const helper = new NbtdocHelper(TestNbtdoc)
                helper.validateField(ans, ctx, tag, doc, isPredicate, description)

                assert.deepEqual(ans.errors, [])
            })
        })
    })
    describe('static isRegistrySupers() Tests', () => {
        it('Should return true', () => {
            const supers = { Registry: { target: 'minecraft:block', path: [{ Child: 'Id' }] } }
            const actual = NbtdocHelper.isRegistrySupers(supers)
            assert(actual === true)
        })
        it('Should return false', () => {
            const supers = { Compound: 0 }
            const actual = NbtdocHelper.isRegistrySupers(supers)
            assert(actual === false)
        })
    })
    describe('static isBooleanDoc() Tests', () => {
        it('Should return true', () => {
            const doc = 'Boolean'
            const actual = NbtdocHelper.isBooleanDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isBooleanDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isByteDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Byte: { range: null } }
            const actual = NbtdocHelper.isByteDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isByteDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isShortDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Short: { range: null } }
            const actual = NbtdocHelper.isShortDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isShortDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isIntDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Int: { range: null } }
            const actual = NbtdocHelper.isIntDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isIntDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isLongDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Long: { range: null } }
            const actual = NbtdocHelper.isLongDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isLongDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isFloatDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Float: { range: null } }
            const actual = NbtdocHelper.isFloatDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isFloatDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isDoubleDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Double: { range: null } }
            const actual = NbtdocHelper.isDoubleDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isDoubleDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isStringDoc() Tests', () => {
        it('Should return true', () => {
            const doc = 'String'
            const actual = NbtdocHelper.isStringDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isStringDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isByteArrayDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { ByteArray: { length_range: null, value_range: null } }
            const actual = NbtdocHelper.isByteArrayDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isByteArrayDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isIntArrayDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { IntArray: { length_range: null, value_range: null } }
            const actual = NbtdocHelper.isIntArrayDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isIntArrayDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isLongArrayDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { LongArray: { length_range: null, value_range: null } }
            const actual = NbtdocHelper.isLongArrayDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isLongArrayDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isCompoundDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isCompoundDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = 'Boolean'
            const actual = NbtdocHelper.isCompoundDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isEnumDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Enum: 0 }
            const actual = NbtdocHelper.isEnumDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isEnumDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isListDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { List: { value_type: { Or: [] }, length_range: null } }
            const actual = NbtdocHelper.isListDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isListDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isIndexDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Index: { target: 'minecraft:block', path: [{ Child: 'Id' }] } }
            const actual = NbtdocHelper.isIndexDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isIndexDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isIdDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Id: 'minecraft:block' }
            const actual = NbtdocHelper.isIdDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isIdDoc(doc)
            assert(actual === false)
        })
    })
    describe('static isOrDoc() Tests', () => {
        it('Should return true', () => {
            const doc = { Or: [] }
            const actual = NbtdocHelper.isOrDoc(doc)
            assert(actual === true)
        })
        it('Should return false', () => {
            const doc = { Compound: 0 }
            const actual = NbtdocHelper.isOrDoc(doc)
            assert(actual === false)
        })
    })
})