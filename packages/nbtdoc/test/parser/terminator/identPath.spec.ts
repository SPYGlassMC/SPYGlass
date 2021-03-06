import { showWhitespaceGlyph, testParser } from '@spyglassmc/core/test-out/utils'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { identPath } from '../../../lib'

describe('identPath()', () => {
	const suites: { content: string }[] = [
		{ content: '' },
		{ content: 'foo' },
		{ content: 'foo::bar' },
		{ content: '::foo::bar' },
		{ content: 'super::foo' },
		{ content: 'super::foo::bar' },
		{ content: 'super::foo something else;' },
	]
	for (const { content } of suites) {
		it(`Parse "${showWhitespaceGlyph(content)}"`, () => {
			const parser = identPath()
			snapshot(testParser(parser, content))
		})
	}
})
