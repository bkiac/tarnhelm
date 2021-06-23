export const cssAbsoluteUnits = ["cm", "mm", "in", "px", "pt", "pc"] as const
export type CssAbsoluteUnit = typeof cssAbsoluteUnits[number]
export const cssRelativeUnits = [
	"em",
	"ex",
	"ch",
	"rem",
	"vw",
	"vh",
	"vmin",
	"vmax",
	"%",
] as const
export type CssRelativeUnit = typeof cssRelativeUnits[number]
export const cssUnits = [...cssAbsoluteUnits, ...cssRelativeUnits] as const
export type CssUnit = typeof cssUnits[number]

export type CssUnitValue = {
	value: number
	unit: CssUnit
}

export function isCssUnit(unit: string): unit is CssUnit {
	return cssUnits.includes(unit as CssUnit)
}

const cssSyntaxErrorMessage = "CSS Syntax Error"

export function toUnitValue(cssText: string): CssUnitValue {
	const match = cssText.match(/^([+-]?(?:\d+|\d*\.\d+))([a-z]*|%)$/g)
	if (match == null) {
		throw new Error(cssSyntaxErrorMessage)
	}
	const [rawValue, unit] = match
	if (!isCssUnit(unit)) {
		throw new Error(cssSyntaxErrorMessage)
	}
	const value = Number(rawValue)
	return {
		value,
		unit,
	}
}

export function toCssText(value: number, unit: CssUnit): string {
	return value.toString() + unit
}
