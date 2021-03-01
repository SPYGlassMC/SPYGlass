import assert from 'assert'
import { describe, it } from 'mocha'
import snapshot from 'snap-shot-it'
import { Location, Range } from '../../lib'

describe('Location', () => {
	describe('get()', () => {
		it('Should create correctly', () => {
			snapshot(Location.get({}))
			snapshot(Location.get({ uri: 'file:///home/spgoding/test' }))
			snapshot(Location.get({ range: Range.create(1, 2) }))
			snapshot(Location.get({ uri: 'file:///home/spgoding/test', range: Range.create(1, 2) }))
			snapshot(Location.get({ uri: 'file:///home/spgoding/test', range: () => ({ range: Range.create(3, 4) }) }))
		})
		it('Should create a new object from the passed-in Position', () => {
			const incoming = Location.get({ range: Range.create(1, 2) })

			const result = Location.get(incoming)
			incoming.range = Range.create(9, 9)

			assert.deepStrictEqual(result, Location.get({ range: Range.create(1, 2) }))
		})
	})
	describe('create()', () => {
		it('Should create correctly', () => {
			snapshot(Location.create('file:///home/spgoding/test', Range.create(5, 6)))
			snapshot(Location.create('file:///home/spgoding/test', { range: Range.create(7, 8) }))
			snapshot(Location.create('file:///home/spgoding/test', 9))
		})
	})
})