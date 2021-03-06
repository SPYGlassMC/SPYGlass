import assert, { fail } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocument } from 'vscode-languageserver-textdocument'
import type { SymbolAddition, SymbolTable } from '../../lib'
import { SymbolUtil, SymbolVisibility } from '../../lib'

describe('SymbolUtil', () => {
	const fileUri = 'file:///test.nbtdoc'
	const anotherFileUri = 'file:///another_test.nbtdoc'
	const doc = TextDocument.create(fileUri, 'nbtdoc', 0, 'use ::minecraft::util::InventoryItem;')
	const symbol: SymbolAddition = {
		category: 'nbtdoc',
		identifier: 'test',
		usage: 'definition',
		range: 1,
		visibility: SymbolVisibility.Public,
	}
	describe('enter()', () => {
		it('Should enter multiple symbols', () => {
			const symbols = new SymbolUtil({})
			symbols.pushBlock(fileUri)
			symbols.pushBlock(fileUri)
			symbols.enter(doc, { ...symbol })
			symbols.enter(doc, { ...symbol, usage: 'reference', range: 2 })
			symbols.enter(doc, { ...symbol, usage: 'reference', range: 3 })
			symbols.enter(doc, { ...symbol, range: 4, visibility: SymbolVisibility.Block })
			symbols.enter(doc, { ...symbol, range: 5, visibility: SymbolVisibility.File })
			symbols.enter(doc, { ...symbol, range: 6, visibility: SymbolVisibility.Restricted, visibilityRestriction: ['spgoding:**'] })
			symbols.enter(doc, { ...symbol, identifier: 'test2', range: 7 })
			snapshot(symbols.getStack(fileUri))
			snapshot(symbols.global)
		})
	})
	describe('pushBlock()', () => {
		it('Should push a new object', () => {
			const symbols = new SymbolUtil({})
			symbols.pushBlock(fileUri)
			assert.deepStrictEqual(symbols.getStack(fileUri), [{}, {}])
		})
	})
	describe('popBlock()', () => {
		it('Should throw error when it is the last element in the stack', () => {
			const symbols = new SymbolUtil({})
			try {
				symbols.popBlock(fileUri)
			} catch (e) {
				assert.strictEqual(e.message, 'Unable to pop a block out as it is the last element in this stack')
				return
			}
			fail()
		})
		it('Should pop out correctly', () => {
			const symbols = new SymbolUtil({})
			symbols.pushBlock(fileUri)
			symbols.popBlock(fileUri)
			assert.deepStrictEqual(symbols.getStack(fileUri), [{}])
		})
	})
	describe('lookup()', () => {
		const global = {
			nbtdoc: {
				Foo: {
					category: 'nbtdoc',
					identifier: 'Foo',
					visibility: SymbolVisibility.Public,
					members: {
						Bar: {
							category: 'nbtdoc',
							identifier: 'Bar',
							visibility: SymbolVisibility.Public,
						},
					},
				},
			},
		} as const
		it('Should return null when there is no such category', () => {
			const symbols = new SymbolUtil({})
			const actual = symbols.lookup('nbtdoc', ['Foo'])
			assert.strictEqual(actual, null)
		})
		it('Should return null when there is no such symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup('nbtdoc', ['NonExistent'])
			assert.strictEqual(actual, null)
		})
		it('Should return null when there is no such member of a symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup('nbtdoc', ['Foo', 'NonExistent'])
			assert.strictEqual(actual, null)
		})
		it('Should return the selected symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup('nbtdoc', ['Foo'])
			assert.deepStrictEqual(actual, {
				symbol: global.nbtdoc.Foo,
				visible: true,
			})
		})
		it('Should return the selected member of a symbol', () => {
			const symbols = new SymbolUtil(global)
			const actual = symbols.lookup('nbtdoc', ['Foo', 'Bar'])
			assert.deepStrictEqual(actual, {
				symbol: global.nbtdoc.Foo.members.Bar,
				visible: true,
			})
		})
	})
	describe('clear()', () => {
		const global: SymbolTable = {
			nbtdoc: {
				ShouldBeRemoved1: {
					category: 'nbtdoc',
					identifier: 'ShouldBeRemoved1',
					definition: [
						{ uri: fileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
					],
					members: {
						ShouldBeRemoved2: {
							category: 'nbtdoc',
							identifier: 'ShouldBeRemoved2',
							definition: [
								{ uri: fileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
							],
						},
						ShouldBeRemoved3: {
							category: 'nbtdoc',
							identifier: 'ShouldBeRemoved3',
							definition: [
								{ uri: fileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
								{ uri: anotherFileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
							],
						},
					},
				},
				ShouldBeKept1: {
					category: 'nbtdoc',
					identifier: 'ShouldBeKept1',
					definition: [
						{ uri: anotherFileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
					],
					members: {
						ShouldBeRemoved4: {
							category: 'nbtdoc',
							identifier: 'ShouldBeRemoved4',
							definition: [
								{ uri: fileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
							],
						},
						ShouldBeKept2: {
							category: 'nbtdoc',
							identifier: 'ShouldBeKept2',
							reference: [
								{ uri: anotherFileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
							],
						},
						ShouldBeKept3: {
							category: 'nbtdoc',
							identifier: 'ShouldBeKept3',
							definition: [
								{ uri: fileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
								{ uri: anotherFileUri, posRange: { start: { line: 0, character: 0 }, end: { line: 0, character: 0 } }, range: { start: 0, end: 0 } },
							],
						},
					},
				},
			},
		}
		it('Should clear all', () => {
			const symbols = new SymbolUtil(global)
			symbols.clear(fileUri)
			snapshot(global)
		})
	})
})
