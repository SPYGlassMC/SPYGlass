import * as assert from 'power-assert'
import { describe, it } from 'mocha'
import { isDefinitionType, combineCache, getCategoryKey, trimCache, getCompletions, getSafeCategory, ClientCache } from '../../types/ClientCache'

describe('ClientCache Tests', () => {
    describe('isDefinitionType() Tests', () => {
        it('Should return true', () => {
            const value = 'entity'
            const actual = isDefinitionType(value)
            assert(actual === true)
        })
        it('Should return false', () => {
            const value = 'whatIsThis'
            const actual = isDefinitionType(value)
            assert(actual === false)
        })
    })
    describe('combineCache() Tests', () => {
        it('Should combine when base is undefiend', () => {
            const override: ClientCache = { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }
            const actual = combineCache(undefined, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should combine when override is undefiend', () => {
            const base: ClientCache = { entities: { foo: { def: [{ start: 0, end: 3 }], ref: [] } } }
            const actual = combineCache(base, undefined)
            assert.deepStrictEqual(actual, base)
        })
        it('Should combine when both arguments are undefiend', () => {
            const actual = combineCache(undefined, undefined)
            assert.deepStrictEqual(actual, {})
        })
        it('Should load def in override cache', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [{ start: 0, end: 3 }],
                        ref: []
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, override)
        })
        it('Should load ref in override cache', () => {
            const base: ClientCache = {}
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            }
            const actual = combineCache(base, override)
            assert.deepStrictEqual(actual, override)
        })
        // it('Should remove elements with the same location as the override ones in ClientCache', () => {
        //     const base: ClientCache = {
        //         advancements: {
        //             foo: {
        //                 def: [],
        //                 ref: [{ start: 0, end: 3 }]
        //             }
        //         }
        //     }
        //     const override: ClientCache = {
        //         entities: {
        //             foo: {
        //                 def: [],
        //                 ref: [{ start: 0, end: 3 }]
        //             }
        //         }
        //     }
        //     const actual = combineCache(base, override)
        //     trimCache(actual)
        //     assert.deepStrictEqual(actual, override)
        // })
        // it('Should remove elements with the same location as the override ones in ClientCache', () => {
        //     const base: ClientCache = {
        //         advancements: {
        //             foo: {
        //                 def: [],
        //                 ref: [{ line: { rel: 'test', number: 0 } }]
        //             }
        //         }
        //     }
        //     const override: ClientCache = {
        //         entities: {
        //             foo: {
        //                 def: [],
        //                 ref: [{ line: { rel: 'test', number: 0 } }]
        //             }
        //         }
        //     }
        //     const actual = combineCache(base, override)
        //     trimCache(actual)
        //     assert.deepStrictEqual(actual, override)
        // })
        it('Should complete base object', () => {
            const base1: ClientCache = {}
            const base2: ClientCache = {
                entities: {}
            }
            const base3: ClientCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: []
                    }
                }
            }
            const override: ClientCache = {
                entities: {
                    foo: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            }
            const actual1 = combineCache(base1, override)
            const actual2 = combineCache(base2, override)
            const actual3 = combineCache(base3, override)
            assert.deepStrictEqual(actual1, override)
            assert.deepStrictEqual(actual2, override)
            assert.deepStrictEqual(actual3, override)
        })
    })
    describe('getSafeCategory() Tests', () => {
        it('Should return category', () => {
            const cache = { tags: {} }
            const actual = getSafeCategory(cache, 'tags')
            assert(actual === cache.tags)
        })
        it('Should return an empty object if the category does not exist', () => {
            const cache = {}
            const actual = getSafeCategory(cache, 'tags')
            assert.deepStrictEqual(actual, {})
        })
        it('Should return an empty object if the cache does not exist', () => {
            const cache = undefined
            const actual = getSafeCategory(cache, 'tags')
            assert.deepStrictEqual(actual, {})
        })
    })
    describe('getCompletions() Tests', () => {
        it('Should return completions', () => {
            const actual = getCompletions({
                tags: {
                    foo: { def: [], ref: [] },
                    bar: {
                        doc: 'Documentation for **bar**',
                        def: [{ rel: '', line: 0, start: 0, end: 0 }],
                        ref: []
                    }
                }
            }, 'tags')
            assert.deepStrictEqual(actual, [
                { label: 'foo' },
                { label: 'bar', documentation: 'Documentation for **bar**' }
            ])
        })
    })
    describe('getCategoryKey() Tests', () => {
        it('Should return "bossbars" for "bossbar"', () => {
            const type = 'bossbar'
            const actual = getCategoryKey(type)
            assert(actual === 'bossbars')
        })
        it('Should return "entities" for "entity"', () => {
            const type = 'entity'
            const actual = getCategoryKey(type)
            assert(actual === 'entities')
        })
        it('Should return "objectives" for "objective"', () => {
            const type = 'objective'
            const actual = getCategoryKey(type)
            assert(actual === 'objectives')
        })
        it('Should return "storages" for "storage"', () => {
            const type = 'storage'
            const actual = getCategoryKey(type)
            assert(actual === 'storages')
        })
        it('Should return "teams" for "team"', () => {
            const type = 'team'
            const actual = getCategoryKey(type)
            assert(actual === 'teams')
        })
        it('Should return "tags" for "tag"', () => {
            const type = 'tag'
            const actual = getCategoryKey(type)
            assert(actual === 'tags')
        })
    })
    describe('trimCache() Tests', () => {
        it('Should not trim units with content', () => {
            const cache: ClientCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    }
                }
            }
            const actual = JSON.parse(JSON.stringify(cache))
            trimCache(actual)
            assert.deepStrictEqual(actual, cache)
        })
        it('Should trim units', () => {
            const actual: ClientCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ start: 0, end: 3 }]
                    },
                    test2: {
                        def: [],
                        ref: []
                    }
                }
            }
            trimCache(actual)
            assert.deepStrictEqual(actual, {
                advancements: {
                    test: {
                        def: [],
                        ref: [{ range: { start: 0, end: 3 } }]
                    }
                }
            })
        })
        it('Should trim categories', () => {
            const actual: ClientCache = {
                advancements: {
                    test: {
                        def: [],
                        ref: []
                    }
                }
            }
            trimCache(actual)
            assert.deepStrictEqual(actual, {})
        })
    })
})
