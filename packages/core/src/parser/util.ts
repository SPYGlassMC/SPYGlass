import type { AstNode } from '../node'
import { SequenceUtil } from '../node'
import { ErrorReporter, ParserContext } from '../service'
import type { ErrorSeverity, Source } from '../source'
import { Range } from '../source'
import type { InfallibleParser, Parser, Result, Returnable } from './Parser'
import { Failure } from './Parser'

export type AttemptResult<N extends Returnable = AstNode> = {
	result: Result<N>,
	updateSrcAndCtx: () => void,
	endCursor: number,
	errorAmount: number,
}

/**
 * Attempts to parse using the given `parser`.
 * @returns
 * - `result`: The result returned by the `parser`.
 * - `updateSrcAndCtx`: A function that will update the passed-in `src` and `ctx` to the state where `parser` has been executed.
 */
export function attempt<N extends Returnable = AstNode>(parser: Parser<N>, src: Source, ctx: ParserContext): AttemptResult<N> {
	const tmpSrc = src.clone()
	const tmpCtx = ParserContext.create({
		...ctx,
		err: new ErrorReporter(),
	})

	const result = parser(tmpSrc, tmpCtx)

	return {
		result,
		endCursor: tmpSrc.cursor,
		errorAmount: tmpCtx.err.errors.length,
		updateSrcAndCtx: () => {
			src.cursor = tmpSrc.cursor
			ctx.err.absorb(tmpCtx.err)
		},
	}
}

type SP<CN extends AstNode> = Parser<CN | SequenceUtil<CN> | null>
type SIP<CN extends AstNode> = InfallibleParser<CN | SequenceUtil<CN> | null>
/**
 * @template CN Child node.
 * 
 * @param parseGap A parser that parses gaps between nodes in the sequence.
 * 
 * @returns A parser that takes a sequence built with the passed-in parsers.
 * 
 * `Failure` when any of the `parsers` returns a `Failure`.
 */
export function sequence<CN extends AstNode>(parsers: SIP<CN>[], parseGap?: InfallibleParser<CN[]>): InfallibleParser<SequenceUtil<CN>>
export function sequence<CN1 extends AstNode>(parsers: [SIP<CN1>]): InfallibleParser<SequenceUtil<CN1>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>]): InfallibleParser<SequenceUtil<CN1 | CN2>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3 | CN4>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>, SIP<CN8>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>, SIP<CN8>, SIP<CN9>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode, CN10 extends AstNode>(parsers: [SIP<CN1>, SIP<CN2>, SIP<CN3>, SIP<CN4>, SIP<CN5>, SIP<CN6>, SIP<CN7>, SIP<CN8>, SIP<CN9>, SIP<CN10>]): InfallibleParser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9 | CN10>>
export function sequence<CN extends AstNode>(parsers: SP<CN>[], parseGap?: InfallibleParser<CN[]>): Parser<SequenceUtil<CN>>
export function sequence<CN1 extends AstNode>(parsers: [SP<CN1>]): Parser<SequenceUtil<CN1>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode>(parsers: [SP<CN1>, SP<CN2>]): Parser<SequenceUtil<CN1 | CN2>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>]): Parser<SequenceUtil<CN1 | CN2 | CN3>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>]): Parser<SequenceUtil<CN1 | CN2 | CN3 | CN4>>        
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>]): Parser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>]): Parser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>]): Parser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>, SP<CN8>]): Parser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>, SP<CN8>, SP<CN9>]): Parser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9>>
export function sequence<CN1 extends AstNode, CN2 extends AstNode, CN3 extends AstNode, CN4 extends AstNode, CN5 extends AstNode, CN6 extends AstNode, CN7 extends AstNode, CN8 extends AstNode, CN9 extends AstNode, CN10 extends AstNode>(parsers: [SP<CN1>, SP<CN2>, SP<CN3>, SP<CN4>, SP<CN5>, SP<CN6>, SP<CN7>, SP<CN8>, SP<CN9>, SP<CN10>]): Parser<SequenceUtil<CN1 | CN2 | CN3 | CN4 | CN5 | CN6 | CN7 | CN8 | CN9 | CN10>>
export function sequence<CN extends AstNode>(parsers: SP<CN>[], parseGap?: InfallibleParser<CN[]>): Parser<SequenceUtil<CN>> {
	return (src: Source, ctx: ParserContext): Result<SequenceUtil<CN>> => {
		const ans: SequenceUtil<CN> = {
			isSequenceUtil: true,
			nodes: [],
			range: Range.create(src),
		}

		for (const parser of parsers) {
			if (parseGap) {
				ans.nodes.push(...parseGap(src, ctx))
			}

			const result = parser(src, ctx)
			if (result === Failure) {
				return Failure
			} else if (result === null) {
				continue
			} else if (SequenceUtil.is(result)) {
				ans.nodes.push(...result.nodes)
			} else {
				ans.nodes.push(result)
			}
		}

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * @template CN Child node.
 * 
 * @param parser Must be fallible, as an infallible parser being repeated will result in an infinite loop.
 * @param parseGap A parser that parses gaps between nodes in the sequence.
 * 
 * @returns A parser that takes a sequence with the passed-in parser being repeated zero or more times.
 */
export function repeat<CN extends AstNode>(parser: InfallibleParser<CN | SequenceUtil<CN>>, parseGap?: InfallibleParser<CN[]>): void
export function repeat<CN extends AstNode>(parser: Parser<CN | SequenceUtil<CN>>, parseGap?: InfallibleParser<CN[]>): InfallibleParser<SequenceUtil<CN>>
export function repeat<CN extends AstNode>(parser: Parser<CN | SequenceUtil<CN>>, parseGap?: InfallibleParser<CN[]>): InfallibleParser<SequenceUtil<CN>> {
	return (src: Source, ctx: ParserContext): SequenceUtil<CN> => {
		const ans: SequenceUtil<CN> = {
			isSequenceUtil: true,
			nodes: [],
			range: Range.create(src),
		}

		while (src.canRead()) {
			if (parseGap) {
				ans.nodes.push(...parseGap(src, ctx))
			}

			const { result, updateSrcAndCtx } = attempt(parser, src, ctx)

			if (result === Failure) {
				break
			}

			updateSrcAndCtx()
			if (SequenceUtil.is(result)) {
				ans.nodes.push(...result.nodes)
			} else {
				ans.nodes.push(result)
			}
		}

		ans.range.end = src.cursor

		return ans
	}
}

/**
 * @returns A parser that returns the result of the passed-in parser which produces the least amount of error.
 * If there are more than one `parsers` produced the same amount of errors, it then takes the parser that went the furthest in `Source`.
 * If there is still a tie, it takes the one closer to the beginning of the `parsers` array.
 * 
 * `Failure` when all of the `parsers` failed.
 */
export function any<N extends Returnable>(parsers: [...Parser<N>[], InfallibleParser<N>]): InfallibleParser<N>
export function any<N1 extends Returnable>(parsers: [InfallibleParser<N1>]): InfallibleParser<N1>
export function any<N1 extends Returnable, N2 extends Returnable>(parsers: [Parser<N1>, InfallibleParser<N2>]): InfallibleParser<N1 | N2>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, InfallibleParser<N3>]): InfallibleParser<N1 | N2 | N3>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, InfallibleParser<N4>]): InfallibleParser<N1 | N2 | N3 | N4>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, InfallibleParser<N5>]): InfallibleParser<N1 | N2 | N3 | N4 | N5>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, InfallibleParser<N6>]): InfallibleParser<N1 | N2 | N3 | N4 | N5 | N6>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, InfallibleParser<N7>]): InfallibleParser<N1 | N2 | N3 | N4 | N5 | N6 | N7>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable, N8 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, Parser<N7>, InfallibleParser<N8>]): InfallibleParser<N1 | N2 | N3 | N4 | N5 | N6 | N7 | N8>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable, N8 extends Returnable, N9 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, Parser<N7>, Parser<N8>, InfallibleParser<N9>]): InfallibleParser<N1 | N2 | N3 | N4 | N5 | N6 | N7 | N8 | N9>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable, N8 extends Returnable, N9 extends Returnable, N10 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, Parser<N7>, Parser<N8>, Parser<N9>, InfallibleParser<N10>]): InfallibleParser<N1 | N2 | N3 | N4 | N5 | N6 | N7 | N8 | N9 | N10>
export function any<N extends Returnable>(parsers: Parser<N>[]): Parser<N>
export function any<N1 extends Returnable>(parsers: [Parser<N1>]): Parser<N1>
export function any<N1 extends Returnable, N2 extends Returnable>(parsers: [Parser<N1>, Parser<N2>]): Parser<N1 | N2>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>]): Parser<N1 | N2 | N3>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>]): Parser<N1 | N2 | N3 | N4>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>]): Parser<N1 | N2 | N3 | N4 | N5>        
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>]): Parser<N1 | N2 | N3 | N4 | N5 | N6>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, Parser<N7>]): Parser<N1 | N2 | N3 | N4 | N5 | N6 | N7>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable, N8 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, Parser<N7>, Parser<N8>]): Parser<N1 | N2 | N3 | N4 | N5 | N6 | N7 | N8>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable, N8 extends Returnable, N9 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, Parser<N7>, Parser<N8>, Parser<N9>]): Parser<N1 | N2 | N3 | N4 | N5 | N6 | N7 | N8 | N9>
export function any<N1 extends Returnable, N2 extends Returnable, N3 extends Returnable, N4 extends Returnable, N5 extends Returnable, N6 extends Returnable, N7 extends Returnable, N8 extends Returnable, N9 extends Returnable, N10 extends Returnable>(parsers: [Parser<N1>, Parser<N2>, Parser<N3>, Parser<N4>, Parser<N5>, Parser<N6>, Parser<N7>, Parser<N8>, Parser<N9>, Parser<N10>]): Parser<N1 | N2 | N3 | N4 | N5 | N6 | N7 | N8 | N9 | N10>
export function any<N extends Returnable>(parsers: Parser<N>[]): Parser<N> {
	return (src: Source, ctx: ParserContext): Result<N> => {
		const attempts: AttemptResult<N>[] = parsers
			.map(parser => attempt(parser, src, ctx))
			.filter(att => att.result !== Failure)
			.sort((a, b) => (a.errorAmount - b.errorAmount) || (b.endCursor - a.endCursor))
		if (attempts.length === 0) {
			return Failure
		}
		attempts[0].updateSrcAndCtx()
		return attempts[0].result
	}
}

/**
 * @returns A parser that takes an optional syntax component.
 */
export function optional<N extends Returnable>(parser: InfallibleParser<N>): void
export function optional<N extends Returnable>(parser: Parser<N>): InfallibleParser<N | null>
export function optional<N extends Returnable>(parser: Parser<N>): InfallibleParser<N | null> {
	// return any<N | null>([
	// 	parser,
	// 	empty,
	// ])
	return (src: Source, ctx: ParserContext): N | null => {
		const { result, updateSrcAndCtx } = attempt(parser, src, ctx)
		if (result === Failure) {
			return null
		} else {
			updateSrcAndCtx()
			return result
		}
	}
}

/**
 * @param parser Must be fallible.
 * 
 * @returns A parser that returns the return value of the `parser`, or the return value of `defaultValue` it it's a `Failure`.
 */
export function recover<N extends Returnable>(parser: InfallibleParser<N>, defaultValue: (src: Source, ctx: ParserContext) => N): void
export function recover<N extends Returnable>(parser: Parser<N>, defaultValue: (src: Source, ctx: ParserContext) => N): InfallibleParser<N>
export function recover<N extends Returnable>(parser: Parser<N>, defaultValue: (src: Source, ctx: ParserContext) => N): InfallibleParser<N> {
	return (src: Source, ctx: ParserContext): N => {
		const result = parser(src, ctx)
		if (result === Failure) {
			const ans = defaultValue(src, ctx)
			return ans
		}
		return result
	}
}

/**
 * @returns A parser that returns the return value of `fn`.
 * 
 * `Failure` when the `parser` returns a `Failure`.
 */
export function map<NA extends Returnable, NB extends Returnable>(parser: InfallibleParser<NA>, fn: (res: NA, src: Source, ctx: ParserContext) => NB): InfallibleParser<NB>
export function map<NA extends Returnable, NB extends Returnable>(parser: Parser<NA>, fn: (res: NA, src: Source, ctx: ParserContext) => NB): Parser<NB>
export function map<NA extends Returnable, NB extends Returnable>(parser: Parser<NA>, fn: (res: NA, src: Source, ctx: ParserContext) => NB): Parser<NB> {
	return (src: Source, ctx: ParserContext): Result<NB> => {
		const result = parser(src, ctx)
		if (result === Failure) {
			return Failure
		}
		const ans = fn(result, src, ctx)
		return ans
	}
}

/**
 * Checks if the result of `parser` is valid, and reports an error if it's not.
 * 
 * `Failure` when the `parser` returns a `Failure`.
 */
export function validate<N extends AstNode>(parser: InfallibleParser<N>, validator: (res: N, src: Source, ctx: ParserContext) => boolean, message: string, severity?: ErrorSeverity): InfallibleParser<N>
export function validate<N extends AstNode>(parser: Parser<N>, validator: (res: N, src: Source, ctx: ParserContext) => boolean, message: string, severity?: ErrorSeverity): Parser<N>
export function validate<N extends AstNode>(parser: Parser<N>, validator: (res: N, src: Source, ctx: ParserContext) => boolean, message: string, severity?: ErrorSeverity): Parser<N> {
	return map(
		parser,
		(res, src, ctx) => {
			const isLegal = validator(res, src, ctx)
			if (!isLegal) {
				ctx.err.report(message, res.range, severity)
			}
			return res
		}
	)
}
