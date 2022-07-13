import React, { forwardRef, useRef, useState } from 'react';
import {
	CloseButton,
	createStyles,
	Input,
	INPUT_SIZES,
	InputWrapper,
	Paper,
	Popper,
	extractSystemStyles, MantineSize, MantineTransition,
} from '@mantine/core';
import {
	useClickOutside,
	useFocusTrap,
	useMergedRef,
	useWindowEvent
} from "@mantine/hooks";
import { Calendar } from 'tabler-icons-react';

const RIGHT_SECTION_WIDTH = {
	xs: 24,
	sm: 30,
	md: 34,
	lg: 40,
	xl: 44
};

interface DateTimePickerBaseProps {
	classNames?: any,
	className?: string,
	style?: any,
	styles?: any,
	wrapperProps?: Object,
	required?: boolean,
	label?: string,
	error?: React.ReactNode,
	id?: string,
	description?: string,
	placeholder?: string,
	shadow?: string,
	transition?: MantineTransition,
	transitionDuration?: number,
	transitionTimingFunction?: string,
	closeDropdownOnScroll?: boolean ,
	radius?: number,
	size?: MantineSize,
	children?: React.ReactNode,
	inputLabel?: string,
	__staticSelector?: string,
	dropdownOpened?: boolean,
	setDropdownOpened?: Function,
	dropdownType?: string,
	clearable?: boolean,
	clearButtonLabel?: string,
	onClear?: React.MouseEventHandler<HTMLButtonElement>,
	positionDependencies?: any[],
	zIndex?: number,
	withinPortal?: boolean,
	disabled?: boolean,
	onBlur?: React.ChangeEventHandler<HTMLInputElement>,
	onFocus?:React.ChangeEventHandler<HTMLInputElement> ,
	onChange?: React.ChangeEventHandler<HTMLInputElement>,
	onKeyDown?: Function,
	name?: string,
	sx?: Object,
	others?: any
}

// @ts-ignore
const useStyles = createStyles((t, { size, invalid }) => ({
	wrapper: {
		...t.fn.fontStyles(),
		position: "relative",
		cursor: "pointer"
	},
	placeholder: {
		lineHeight: `${t.fn.size({ size, sizes: INPUT_SIZES }) - 2}px`,
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		color: invalid ? t.colors.red[7] : t.colors.gray[5]
	},
	value: { overflow: "hidden", textOverflow: "ellipsis" },
	dropdownWrapper: { position: "relative", pointerEvents: "all" },
	input: { cursor: "pointer", whiteSpace: "nowrap" },
	dropdown: {
		backgroundColor: t.white,
		border: `1px solid ${t.colors.gray[2]}`,
		padding: `${t.spacing.md}px ${t.spacing.xs}px`
	},
	arrow: { borderColor: t.colors.gray[2], background: t.white }
}));

const DateTimePickerBase = forwardRef<HTMLInputElement, DateTimePickerBaseProps>(
	(
		{
			classNames,
			className,
			style,
			styles,
			wrapperProps,
			required,
			label,
			error,
			id,
			description,
			placeholder,
			shadow = "sm",
			transition = "pop-top-left",
			transitionDuration = 200,
			transitionTimingFunction,
			closeDropdownOnScroll = false,
			radius,
			size = "sm",
			children,
			inputLabel,
			__staticSelector = "DateTimePickerBase",
			dropdownOpened,
			setDropdownOpened,
			dropdownType = "popover",
			clearable = true,
			clearButtonLabel,
			onClear,
			positionDependencies = [],
			zIndex = 300,
			withinPortal = true,
			onBlur,
			onFocus,
			onChange,
			onKeyDown,
			disabled=false,
			name = "date",
			sx,
			...others
		},
		ref
	) => {
		const { classes, cx, theme } = useStyles(
			// @ts-ignore
			{ size, invalid: !!error },
			{ classNames, styles, name: __staticSelector }
		);
		//@ts-ignore
		const { margins, rest } = extractSystemStyles(others);
		const [dropdownElement, setDropdownElement] = useState(null);
		const [rootElement, setRootElement] = useState(null);
		const [referenceElement, setReferenceElement] = useState(null);

		const focusTrapRef = useFocusTrap(dropdownOpened);
		const inputRef = useRef<HTMLElement>(null);

		const closeDropdown = () => setDropdownOpened(false);

		const closeOnEscape = (e) => {
			if (e.nativeEvent.code === "Escape") {
				closeDropdown();
				window.setTimeout(() => inputRef.current?.focus(), 0);
			}
		};

		useClickOutside(() => dropdownType === "popover" && closeDropdown(), null, [
			dropdownElement,
			rootElement
		]);

		useWindowEvent("scroll", () => closeDropdownOnScroll && closeDropdown());

		const rightSection = clearable ? (
			<CloseButton
				variant="transparent"
				aria-label={clearButtonLabel}
				onClick={onClear}
				size={size}
			/>
		) : null;

		const handleClick = () => setDropdownOpened(!dropdownOpened);

		const handleInputBlur = (e) => typeof onBlur === "function" && onBlur(e);

		const handleInputFocus = (e) => typeof onFocus === "function" && onFocus(e);

		const handleKeyDown = (e) => {
			typeof onKeyDown === "function" && onKeyDown(e);
			if (e.code === "Space" || e.code === "Enter") {
				e.preventDefault();
				setDropdownOpened(true);
			}
		};

		return (
			<InputWrapper
				required={required}
				label={label}
				error={error}
				description={description}
				className={className}
				style={style}
				classNames={classNames}
				styles={styles}
				size={size}
				__staticSelector={__staticSelector}
				sx={sx}
				ref={setReferenceElement}
				{...margins}
				{...wrapperProps}
			>
				<div ref={setRootElement}>
					<div className={classes.wrapper}>
						<Input
							icon={<Calendar/>}
							classNames={{
								...classNames,
								input: cx(classes.input, classNames?.input)
							}}
							styles={styles}
							onClick={handleClick}
							onKeyDown={handleKeyDown}
							ref={useMergedRef(ref, inputRef)}
							__staticSelector={__staticSelector}
							radius={radius}
							size={size}
							name={name}
							placeholder={placeholder}
							value={inputLabel}
							required={required}
							invalid={!!error}
							readOnly={true}
							rightSection={rightSection}
							rightSectionWidth={theme.fn.size({
								size,
								sizes: RIGHT_SECTION_WIDTH
							})}
							onBlur={handleInputBlur}
							onFocus={handleInputFocus}
							onChange={onChange}
							autoComplete="off"
							{...rest}
						/>
					</div>

					<Popper
						referenceElement={referenceElement}
						transitionDuration={transitionDuration}
						transitionTimingFunction={transitionTimingFunction}
						forceUpdateDependencies={positionDependencies}
						transition={transition}
						mounted={dropdownOpened}
						position="bottom"
						placement="start"
						gutter={10}
						withinPortal={withinPortal}
						withArrow
						arrowSize={3}
						zIndex={zIndex}
						arrowClassName={classes.arrow}
					>
						<div
							className={classes.dropdownWrapper}
							ref={setDropdownElement}
							data-mantine-stop-propagation={dropdownOpened}
							onKeyDownCapture={closeOnEscape}
							aria-hidden={undefined}
						>
							<Paper
								className={classes.dropdown}
								shadow={shadow}
								ref={focusTrapRef}
							>
								{children}
							</Paper>
						</div>
					</Popper>
				</div>
			</InputWrapper>
		);
	}
);

export default DateTimePickerBase;
