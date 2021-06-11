import isNil from "lodash/isNil"
import React, {useCallback, useMemo, useState} from "react"
import styled from "@emotion/styled"
import {css} from "@emotion/react"
import {createGlitch} from "../styles/keyframes"

const glitchLength = "0.06em"
const glitch = createGlitch(glitchLength)

const Root = styled.div`
	position: relative;
	text-align: right;
	width: 8rem;
	white-space: pre;
`

const Control = styled.div(
	(props) => css`
		display: flex;
		justify-content: space-between;
		align-items: center;
		position: relative;
		overflow: hidden;
		background-color: ${props.theme.palette.background};
		box-sizing: border-box;
		color: ${props.theme.palette.foreground};
		cursor: pointer;
		outline: none;
		transition: all 200ms ease;
		margin-bottom: 8px;
	`,
)

const Arrow = styled.span<{isOpen: boolean}>(
	(props) => css`
		margin-right: 8px;
		border-color: ${props.isOpen
			? `transparent transparent ${props.theme.palette.foreground}`
			: `${props.theme.palette.foreground} transparent transparent`};
		border-style: solid;
		border-width: ${props.isOpen ? "0 5px 5px" : "5px 5px 0px"};
	`,
)

const Menu = styled.ul(
	(props) => css`
		/* Reset list styles */
		list-style-type: none;
		counter-reset: none;
		margin-block-start: 0;
		margin-block-end: 0;
		padding-inline-start: 0;

		/* Component */
		background-color: ${props.theme.palette.background};
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

const Option = styled.li<{content: string}>(
	(props) => css`
		box-sizing: border-box;
		cursor: pointer;
		display: block;
		padding-bottom: 8px;
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
				color: ${props.theme.palette.secondary};
				z-index: 1;
			}

			&:after {
				color: ${props.theme.palette.tertiary};
				z-index: 2;
			}
		}

		&:hover,
		&:focus {
			span:nth-child(2) {
				&:before {
					animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) normal
						both infinite;
				}
				&:after {
					animation: ${glitch} 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) reverse
						both infinite;
				}
			}
		}

		&:focus {
			border: 1px solid ${props.theme.palette.tertiary};
		}
	`,
)

type Props<V extends React.ReactText> = {
	options: {value: V; label?: string}[]
	onChange: (newValue: V) => void
	value: V
}

export function Select<V extends React.ReactText>({
	options: rawOptions,
	onChange,
	value,
}: React.PropsWithChildren<Props<V>>): React.ReactElement {
	const options = useMemo(
		() =>
			rawOptions.map((option) => ({
				value: option.value,
				label: option.label ?? option.value.toString(),
			})),
		[rawOptions],
	)

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
				<Menu>
					{options.map((option) => (
						<Option
							key={option.value}
							content={option.label}
							onClick={createClickChangeHandler(option.value)}
							onKeyPress={createEnterChangeHandler(option.value)}
							role="option"
							aria-selected={value === option.value}
						>
							<span>{option.label}</span>
							<span />
						</Option>
					))}
				</Menu>
			)}
		</Root>
	)
}
