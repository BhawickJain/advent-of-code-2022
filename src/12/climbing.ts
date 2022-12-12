import { readFileSync } from 'fs'

export type Pos = {row: number, col: number}
export type serPos = string // serialised position
export type ElMap = string[][]
export function parseInput(input?: string): ElMap {
	if (!input) input = readFileSync("./src/12/input.txt", "utf-8")
	const rows = input.split(/\n/g)
	const elMap: ElMap = rows.map((r) => r.split(''))
	return elMap
}

export function getPosForLetter(elMap: ElMap, letter: string): Pos[] {
	let positionList: Pos[] = []
	for (let rowIdx=0; rowIdx < elMap.length; rowIdx++) {
		for (let colIdx=0; colIdx < elMap[0].length; colIdx++) {
			if (elMap[rowIdx][colIdx] === letter) {positionList.push({row: rowIdx, col: colIdx})}
		}
	}
	return positionList
}

export function serialisePosition(pos: Pos): serPos {
	return `r${pos.row}c${pos.col}`
}

export function parsePosition(serialisedPosition: serPos): Pos {
	const split = serialisedPosition.split('r')[1].split('c')
	return {row: parseInt(split[0]), col: parseInt(split[1])}

}

export function invertLetters(letter: string): string {
	return String.fromCharCode('z'.charCodeAt(0) - (letter.charCodeAt(0) - 'a'.charCodeAt(0)))
}

type NextStepMap = string[][]
type node = {posKey: string, steps: number}

export function shortestPath(elMapSE: ElMap, start: string, end?: string, print?: boolean): {[posKey: string]: number} {

	const nodes: node[] = []
	const distances: {[posKey: string]: number} = {}
	const previous: {[posKey: string]: string } = {}
	const finalPath: string[] = []

	const startPos = serialisePosition(getPosForLetter(elMapSE, 'S')[0])
	const endPos = end ? serialisePosition(getPosForLetter(elMapSE, 'E')[0]) : null
	const elMap = JSON.parse(JSON.stringify([...elMapSE]))

	let parsePos = parsePosition(startPos)
	elMap[parsePos.row][parsePos.col] = 'a'

	if(endPos) {
		let parseEndPos = parsePosition(endPos)
		elMap[parseEndPos.row][parseEndPos.col] = 'z'
	}

	for (let rowIdx=0; rowIdx < elMap.length; rowIdx++) {
		for (let colIdx=0; colIdx < elMap[0].length; colIdx++) {
			const serPos = `r${rowIdx}c${colIdx}`
			if (startPos === serPos) {
				distances[startPos] = 0;
				nodes.push({posKey: startPos, steps: 0})
			} else {
				distances[serPos] = Infinity;
				nodes.push({posKey: serPos, steps: Infinity})
			}
		}
	}

	
	while (nodes.length) {

		let smallestNode = nodes.sort((a, b) => b.steps - a.steps).pop()
		if (!smallestNode) {console.error("smallest Node undefined!"); break}
		let smallest = smallestNode.posKey

		if (end && smallest === endPos) {
			while(previous[smallest]) {
				finalPath.push(smallest)
				smallest = previous[smallest]
			}
			break
		}

		if (distances[smallest] !== Infinity) {
			let adjacentPositions = getAdjecent(parsePosition(smallest), elMap)
			for (const adj of adjacentPositions) {
				let serPos = serialisePosition(adj)
				let candidate = distances[smallest] + 1
				if (candidate < distances[serPos]) {
					distances[serPos] = candidate
					previous[serPos] = smallest
					nodes.push({posKey: serPos, steps: candidate})
				}
			}
		} else {
		}
	}

	finalPath.reverse()
	if (endPos && print) prettyPrint(elMap, finalPath, parsePosition(startPos))

	return distances
}

export function prettyPrint(elMap: ElMap, path: string[], startPos: Pos): void {
	const prettyMap: ElMap = [...Array(elMap.length)].map((r) => [...Array(elMap[0].length)].map((c) => '.'))

	const currentPos = startPos

	for (const serPos of path) {
		const nextStep = parsePosition(serPos)
		const rowDiff = currentPos.row - nextStep.row
		const colDiff = currentPos.col - nextStep.col
		if (rowDiff < 0) { prettyMap[currentPos.row][currentPos.col] = 'v'; currentPos.row = nextStep.row; currentPos.col = nextStep.col; continue}
		if (rowDiff > 0) { prettyMap[currentPos.row][currentPos.col] = '^'; currentPos.row = nextStep.row; currentPos.col = nextStep.col; continue}
		if (colDiff < 0) { prettyMap[currentPos.row][currentPos.col] = '>'; currentPos.row = nextStep.row; currentPos.col = nextStep.col; continue}
		if (colDiff > 0) { prettyMap[currentPos.row][currentPos.col] = '<'; currentPos.row = nextStep.row; currentPos.col = nextStep.col; continue}
	}

	prettyMap.forEach((r) => console.log(r.join('')))
}

export function getAdjecent(pos: Pos, elMap: ElMap): Pos[] {
	const up: Pos = {row: pos.row - 1, col: pos.col}
	const down: Pos = {row: pos.row + 1, col: pos.col}
	const left: Pos = {row: pos.row, col: pos.col - 1}
	const right: Pos = {row: pos.row, col: pos.col + 1}
	const adjacentPos: Pos[] = [up, right, down, left]
	const validPos: Pos[] = []
	let targetEl = elMap[pos.row][pos.col]

	for (const a of adjacentPos) {
		if (a.col < 0 || a.col >= elMap[0].length) continue
		if (a.row < 0 || a.row >= elMap.length) continue
		let pEl = elMap[a.row][a.col]
		const asciiAdj = pEl.charCodeAt(0)
		const asciiTarget= targetEl.charCodeAt(0)
		if (!asciiAdj || !asciiTarget) throw new Error(`ascii value undefined! asciiAdj: ${asciiAdj} asciiTarget${asciiTarget}`)
		if (asciiTarget - asciiAdj >= -1)  validPos.push(a); continue
	}

	return validPos
}

