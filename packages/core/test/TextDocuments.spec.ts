import assert, { fail } from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { TextDocuments } from '../lib'
import { FileServiceImpl } from '../lib/service/FileService'

describe('TextDocuments', () => {
	const testFileService = new class extends FileServiceImpl {
		/** @override */
		async readFile(uri: string): Promise<string> {
			switch (uri) {
				case Uris.foo_mcfunction:
					return '# foo\n'
				default:
					throw new Error(`URI does not exists: '${uri}'`)
			}
		}
	}
	const Uris = {
		pack_mcmeta: 'file:///pack.mcmeta',
		foo_mcfunction: 'file:///foo.mcfunction',
		_mcfunction: 'file:///.mcfunction',
		nonexistent_mcfunction: 'file:///nonexistent.mcfunction',
	}

	describe('onDidOpen(), onDidChange(), onDidClose(), get()', () => {
		it('Should handle a cycle of file operations correctly', () => {
			const docs = new TextDocuments({ fs: testFileService })
			assert.strictEqual(docs.get(Uris.foo_mcfunction), undefined)

			docs.onDidOpen(Uris.foo_mcfunction, 'mcfunction', 0, '# foo\n')
			snapshot(docs.get(Uris.foo_mcfunction)!)

			docs.onDidChange(Uris.foo_mcfunction, [{ range: { start: { line: 0, character: 5 }, end: { line: 0, character: 5 } }, text: 'bar' }], 1)
			snapshot(docs.get(Uris.foo_mcfunction)!)

			docs.onDidClose(Uris.foo_mcfunction)
			assert.strictEqual(docs.get(Uris.foo_mcfunction), undefined)
		})
	})
	describe('onDidChange()', () => {
		it("Should throw an error if the file hasn't been opened yet", () => {
			const docs = new TextDocuments({ fs: testFileService })
			try {
				docs.onDidChange(Uris.foo_mcfunction, [], 1)
			} catch (e) {
				snapshot((e as Error).message)
				return
			}
			fail()
		})
	})
	describe('read()', () => {
		it('Should return the cached result', async () => {
			const docs = new TextDocuments({ fs: testFileService })

			docs.onDidOpen(Uris.foo_mcfunction, 'mcfunction', 3, '# foo\n')

			snapshot(await docs.read(Uris.foo_mcfunction))
		})
		it('Should construct the TextDocument from the actual file', async () => {
			const docs = new TextDocuments({ fs: testFileService })

			snapshot(await docs.read(Uris.foo_mcfunction))
		})
		it("Should throw an error if the URI doesn't exist", async () => {
			const docs = new TextDocuments({ fs: testFileService })
			try {
				await docs.read(Uris.nonexistent_mcfunction)
			} catch (e) {
				snapshot((e as Error).message)
				return
			}
			fail()
		})
	})
})