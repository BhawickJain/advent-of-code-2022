/**
 * decrypt into sensible representation
 * r rock, p paper, s scissors
 */
export const decryptionKeys: Record<string, string> = {
	"A": "r",
	"X": "r",
	"B": "p",
	"Y": "p",
	"C": "s",
	"Z": "s",
}

export const decryptionKeysPartTwo: Record<string,roundScoreTypes> = {
	"Z": "win",
	"X": "lost",
	"Y": "draw",
}

const shapeScore: Record<string, number> = {
	'r': 1,
	'p': 2,
	's': 3
}

type roundScoreTypes = 'win' | 'draw' | 'lost'
const roundScore: Record<roundScoreTypes, number> = {
	'win': 6,
	'draw': 3,
	'lost': 0
}

// outcome in relation to first letter
const roundOutcome: Record<string, roundScoreTypes> = {
	'rr': 'draw',
	'rp': 'lost',
	'rs': 'win',
	'pr': 'win',
	'pp': 'draw',
	'ps': 'lost',
	'sr': 'lost',
	'sp': 'win',
	'ss': 'draw',
}


function pivotRoundOutcome(roundOutcome: Record<string, roundScoreTypes>) {
	let pivottedRoundOutcome: Record<roundScoreTypes, Record<string, string>> = {'draw': {},
'lost': {},
'win': {}}
	for (let k in roundOutcome) {
		const outcome: roundScoreTypes = roundOutcome[k];
		pivottedRoundOutcome[outcome][k[1]] = k[0]
	}
	console.log(pivottedRoundOutcome)
	return pivottedRoundOutcome
}
/**
 * returns the move given round outcome and move of other player
 */
export const serialisedRoundOutcome = pivotRoundOutcome(roundOutcome)

function computeRoundScore(input: string): number {
	return shapeScore[input[0]] + roundScore[roundOutcome[input]]
}

// outcome in relation to first letter
// reverse input if second player's result wanted
// 'rp' where r is drawn by first player, p is drawn by second player
// 'rp' as input gives score for first player
// 'pr' as input gives score for second player
export const roundScoreDictionary: Record<string, number> = {
	'rr': computeRoundScore('rr'),
	'rp': computeRoundScore('rp'),
	'rs': computeRoundScore('rs'),
	'pr': computeRoundScore('pr'),
	'pp': computeRoundScore('pp'),
	'ps': computeRoundScore('ps'),
	'sr': computeRoundScore('sr'),
	'sp': computeRoundScore('sp'),
	'ss': computeRoundScore('ss'),
}

console.log(roundScoreDictionary['ss'.split('').reverse().join('')])