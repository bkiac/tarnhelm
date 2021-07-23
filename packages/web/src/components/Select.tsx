import isNil from "lodash/isNil"
import React, {useCallback, useMemo, useState} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {glitch} from "../styles/animations"

const glitchArgs = {
	width: "0.06em",
	duration: 0.3,
}

const Root = styled.div`
	position: relative;
	text-align: right;
	white-space: pre;
`

const Control = styled.div(
	(props) => css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		overflow: hidden;
		background-color: ${props.theme.colors.background};
		box-sizing: border-box;
		color: ${props.theme.colors.foreground};
		cursor: pointer;
		outline: none;
		transition: all 200ms ease;
	`,
)

const Arrow = styled.span<{isOpen: boolean}>(
	(props) => css`
		margin-right: ${props.theme.space["2"]};
		border-style: solid;
		${props.isOpen
			? css`
					border-color: transparent transparent ${props.theme.colors.foreground};
					border-width: 0 5px 5px;
			  `
			: css`
					border-color: ${props.theme.colors.foreground} transparent transparent;
					border-width: 5px 5px 0px;
			  `}
	`,
)

const List = styled.ul(
	(props) => css`
		/* Reset list styles */
		list-style-type: none;
		counter-reset: none;
		margin-block-start: 0;
		margin-block-end: 0;
		padding-inline-start: 0;

		/* Component */
		background-color: ${props.theme.colors.background};
		box-sizing: border-box;
		margin-top: -1px;
		max-height: 100px;
		overflow-y: auto;
		position: absolute;
		top: 100%;
		width: 100%;
		z-index: 1000;
	`,
)

const ListItem = styled.li<{content: string}>(
	(props) => css`
		box-sizing: border-box;
		cursor: pointer;
		display: block;
		padding-bottom: ${props.theme.space["0.5"]};

		&:focus {
			border: 1px solid ${props.theme.colors.tertiary};
		}

		/** Animation */
		position: relative;
		span:first-child {
			position: relative;
			color: inherit;
			z-index: 3;
		}

		span:nth-child(2) {
			position: absolute;

			&:before,
			&:after {
				content: "${props.content}";
				position: absolute;
				right: 0;
			}

			&:before {
				color: ${props.theme.colors.secondary};
				z-index: 1;
			}

			&:after {
				color: ${props.theme.colors.tertiary};
				z-index: 2;
			}
		}

		&:hover,
		&:focus {
			span:nth-child(2) {
				${glitch(glitchArgs)}
			}
		}
	`,
)

type OptionType<V extends React.ReactText> = {
	value: V
	label?: string
}

function Option<TValue extends React.ReactText>({
	value,
	label,
	...liProps
}: OptionType<TValue> &
	Omit<React.HTMLProps<HTMLLIElement>, "children" | "as">): React.ReactElement {
	return (
		<ListItem content={label ?? value.toString()} {...liProps}>
			<span>{label}</span>
			<span /> {/* Second span is required for the animation to work */}
		</ListItem>
	)
}

type Props<V extends React.ReactText> = {
	options: OptionType<V>[]
	onChange: (newValue: V) => void
	value: V
}

export function Select<V extends React.ReactText>({
	options,
	onChange,
	value,
}: React.PropsWithChildren<Props<V>>): React.ReactElement {
	const cursor = useMemo(() => {
		const index = options.findIndex((option) => option.value === value)
		const prev = index > 0 ? index - 1 : undefined
		const next = index !== options.length - 1 ? index + 1 : undefined
		return {
			prev,
			current: index,
			next,
		}
	}, [options, value])

	const [isOpen, setIsOpen] = useState(false)
	const toggle = useCallback(() => setIsOpen((prevOpen) => !prevOpen), [])
	const close = useCallback(() => setIsOpen(false), [])

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent) => {
			const {key} = event
			if (key === "Enter") {
				toggle()
			} else if (
				isOpen &&
				!isNil(cursor.next) &&
				(key === "ArrowRight" || key === "ArrowDown")
			) {
				event.stopPropagation()
				onChange(options[cursor.next].value)
			} else if (
				isOpen &&
				!isNil(cursor.prev) &&
				(key === "ArrowLeft" || key === "ArrowUp")
			) {
				event.stopPropagation()
				onChange(options[cursor.prev].value)
			}
		},
		[toggle, isOpen, cursor, onChange, options],
	)

	const createClickChangeHandler = useCallback(
		(newValue: V) => () => onChange(newValue),
		[onChange],
	)
	const createEnterChangeHandler = useCallback(
		(newValue: V) => (event: React.KeyboardEvent) => {
			if (event.key === "Enter") {
				onChange(newValue)
			}
		},
		[onChange],
	)

	return (
		<Root
			onClick={toggle}
			onBlur={close}
			onKeyDown={handleKeyDown}
			role="button"
			aria-haspopup
			tabIndex={0}
		>
			<Control>
				<Arrow isOpen={isOpen} />
				<span>{options[cursor.current].label}</span>
			</Control>

			{isOpen && (
				<List>
					{options.map((option) => (
						<Option
							key={option.value}
							{...option}
							onClick={createClickChangeHandler(option.value)}
							onKeyPress={createEnterChangeHandler(option.value)}
							role="option"
							aria-selected={value === option.value}
						/>
					))}
				</List>
			)}
		</Root>
	)
}
