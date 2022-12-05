import { secondHalf } from "./compute-puzzle-result"
import { roundScoreDictionary } from "./rock-paper-scissors"

test('returns correct score for second player when string reversed', () => {
	expect(roundScoreDictionary['rp'.split('').reverse().join('')]).toBe(8)
	expect(roundScoreDictionary['pr'.split('').reverse().join('')]).toBe(1)
	expect(roundScoreDictionary['ss'.split('').reverse().join('')]).toBe(6)
})

test('returns correct score when given text string of rounds', () => {
	const data = `A Y
B X
C Z`

	const expectedResult = 12
	expect(secondHalf(data)).toBe(expectedResult)
})