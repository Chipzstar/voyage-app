import React, { forwardRef, useRef, useState } from 'react';
import {
	CloseButton,
	createStyles,
	DefaultProps,
	extractSystemStyles,
	Input,
	INPUT_SIZES,
	InputSharedProps,
	InputStylesNames,
	InputWrapperBaseProps,
	InputWrapperStylesNames,
	MantineShadow,
	MantineSize,
	MantineTransition,
	Modal,
	ModalProps,
	Popover,
	Selectors
} from '@mantine/core';
import { useClickOutside, useId, useMergedRef, useWindowEvent } from '@mantine/hooks';
import { CalendarBaseStylesNames } from '@mantine/dates';

const RIGHT_SECTION_WIDTH = {
	xs: 24,
	sm: 30,
	md: 34,
	lg: 40,
	xl: 44
};

const defaultTransition: MantineTransition = {
	in: { opacity: 1, transform: 'translateY(0) scale(1)' },
	out: { opacity: 0, transform: 'translateY(-25px) scale(0.93)' },
	common: { transformOrigin: 'top left' },
	transitionProperty: 'opacity, transform'
};

export type DatePickerStylesNames = Selectors<typeof useStyles> | CalendarBaseStylesNames | InputStylesNames | InputWrapperStylesNames | 'dropdown';

export interface DatePickerBaseSharedProps extends InputSharedProps, InputWrapperBaseProps, DefaultProps<DatePickerStylesNames>, Omit<React.ComponentPropsWithoutRef<'input'>, 'value' | 'defaultValue' | 'placeholder' | 'size'> {
	/** Props spread to root element */
	wrapperProps?: React.ComponentPropsWithoutRef<'div'>;

	/** Placeholder, displayed when date is not selected */
	placeholder?: string;

	/** Dropdown appear/disappear transition */
	transition?: MantineTransition;

	/** Dropdown appear/disappear transition duration */
	transitionDuration?: number;

	/** Dropdown appear/disappear transition timing function, defaults to theme.transitionTimingFunction */
	transitionTimingFunction?: string;

	/** Dropdown shadow from theme or css value for custom box-shadow */
	shadow?: MantineShadow;

	/** Input name, useful fon uncontrolled variant to capture data with native form */
	name?: string;

	/** Input size */
	size?: MantineSize;

	/** Where to show calendar in modal or popover */
	dropdownType?: 'popover' | 'modal';

	/** Dropdown positioning behavior */
	dropdownPosition?: 'bottom-start' | 'top-start' | 'flip';

	/** Allow to clear value */
	clearable?: boolean;

	/** aria-label for clear button */
	clearButtonLabel?: string;

	/** useEffect dependencies to force update dropdown position */
	positionDependencies?: any[];

	/** Dropdown zIndex */
	zIndex?: React.CSSProperties['zIndex'];

	/** call onChange with last valid value onBlur */
	fixOnBlur?: boolean;

	/** Whether to render the dropdown in a Portal */
	withinPortal?: boolean;

	/** Called when dropdown opens */
	onDropdownOpen?(): void;

	/** Called when dropdown closes */
	onDropdownClose?(): void;

	/** Events that should trigger outside clicks */
	clickOutsideEvents?: string[];

	/** Props spread to Modal component */
	modalProps?: Partial<ModalProps>;

	/** Modal z-index */
	modalZIndex?: React.CSSProperties['zIndex'];

	/** Set the clear button tab index to disabled or default after input field */
	clearButtonTabIndex?: -1 | 0;
}

interface DateTimePickerBaseProps extends DatePickerBaseSharedProps {
	classNames?: any;
	className?: string;
	style?: any;
	styles?: any;
	wrapperProps?: Object;
	required?: boolean;
	id?: string;
	shadow?: string;
	transition?: MantineTransition;
	transitionDuration?: number;
	transitionTimingFunction?: string;
	closeDropdownOnScroll?: boolean;
	size?: MantineSize;
	inputLabel?: string;
	__staticSelector?: string;
	dropdownOpened: boolean;

	setDropdownOpened(opened: boolean): void;

	clearable?: boolean;
	clearButtonLabel?: string;

	onClear(): void;

	/** Allow free input */
	allowFreeInput?: boolean;
	/** Amount of months */
	amountOfMonths?: number;
	positionDependencies?: any[];
	withinPortal?: boolean;
	disabled?: boolean;
	onBlur?: React.ChangeEventHandler<HTMLInputElement>;
	onFocus?: React.ChangeEventHandler<HTMLInputElement>;
	onChange?: React.ChangeEventHandler<HTMLInputElement>;
	name?: string;
	others?: any;
}

// @ts-ignore
const useStyles = createStyles((t, { size, invalid }) => ({
	wrapper: {
		...t.fn.fontStyles(),
		position: 'relative',
		cursor: 'pointer'
	},
	placeholder: {
		lineHeight: `${t.fn.size({ size, sizes: INPUT_SIZES }) - 2}px`,
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		textOverflow: 'ellipsis',
		color: invalid ? t.colors.red[7] : t.colors.gray[5]
	},
	value: { overflow: 'hidden', textOverflow: 'ellipsis' },
	dropdownWrapper: { position: 'relative', pointerEvents: 'all' },
	input: { cursor: 'pointer', whiteSpace: 'nowrap' },
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
			allowFreeInput = false,
			label,
			error,
			id,
			description,
			placeholder,
			shadow = 'sm',
			transition = 'pop-top-left',
			transitionDuration = 200,
			transitionTimingFunction,
			closeDropdownOnScroll = false,
			size = 'sm',
			children,
			inputLabel,
			__staticSelector = 'DateTimePickerBase',
			dropdownOpened,
			setDropdownOpened,
			dropdownType = 'popover',
			dropdownPosition = 'flip',
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
			onDropdownClose,
			onDropdownOpen,
			clickOutsideEvents = ['mousedown', 'touchstart'],
			modalZIndex,
			modalProps,
			amountOfMonths = 1,
			disabled = false,
			name = 'date',
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
		const { systemStyles, rest } = extractSystemStyles(others);
		const uuid = useId(id);
		const inputRef = useRef<HTMLButtonElement>();

		const [dropdownElement, setDropdownElement] = useState(null);
		const [rootElement, setRootElement] = useState(null);

		const closeDropdown = () => {
			setDropdownOpened(false);
			onDropdownClose?.();
		};

		const openDropdown = () => {
			setDropdownOpened(true);
			onDropdownOpen?.();
		};

		const closeOnEscape = (e: React.KeyboardEvent<HTMLDivElement>) => {
			if (e.key === 'Escape') {
				closeDropdown();
				window.setTimeout(() => inputRef.current?.focus(), 0);
			}
		};

		// @ts-ignore
		useClickOutside(() => dropdownType === 'popover' && closeDropdown(), null, [dropdownElement, rootElement]);

		useWindowEvent('scroll', () => closeDropdownOnScroll && closeDropdown());

		const rightSection = clearable ? <CloseButton variant='transparent' aria-label={clearButtonLabel} onClick={onClear} size={size} /> : null;

		// @ts-ignore
		const toggleDropdown = () => {
			setDropdownOpened(!dropdownOpened);
			!dropdownOpened ? onDropdownOpen?.() : onDropdownOpen?.();
		};

		const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
			typeof onBlur === 'function' && onBlur(event);
			if (allowFreeInput) {
				closeDropdown();
			}
		};

		const handleInputFocus = (event: React.FocusEvent<HTMLInputElement>) => {
			typeof onFocus === 'function' && onFocus(event);
			if (allowFreeInput) {
				openDropdown();
			}
		};

		const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
			typeof onKeyDown === 'function' && onKeyDown(event);
			if ((event.key === 'Space' || event.key === 'Enter') && !allowFreeInput) {
				event.preventDefault();
				openDropdown();
			}
		};

		return (
			<Input.Wrapper
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
				{...systemStyles}
				{...wrapperProps}
			>
				<Popover
					__staticSelector={__staticSelector}
					withinPortal={withinPortal}
					offset={10}
					opened={dropdownOpened}
					transitionDuration={transitionDuration}
					transition={transition}
					positionDependencies={positionDependencies}
					middlewares={{ flip: dropdownPosition === 'flip', shift: false }}
					position={dropdownPosition === 'flip' ? 'bottom-start' : dropdownPosition}
					shadow={shadow}
					onClose={closeDropdown}
					trapFocus={!allowFreeInput}
					withRoles={false}
					clickOutsideEvents={clickOutsideEvents}
					zIndex={zIndex}
					classNames={classNames}
					styles={styles}
				>
					<Popover.Target>
						<div className={classes.wrapper}>
							<Input<'input'>
								classNames={{
									...classNames,
									input: cx(classes.input, classNames?.input)
								}}
								data-free-input={allowFreeInput || undefined}
								styles={styles}
								onClick={() => (!allowFreeInput ? toggleDropdown() : openDropdown())}
								onKeyDown={handleKeyDown}
								id={uuid}
								// @ts-ignore
								ref={useMergedRef(ref, inputRef)}
								__staticSelector={__staticSelector}
								size={size}
								name={name}
								placeholder={placeholder}
								value={inputLabel}
								required={required}
								invalid={!!error}
								readOnly={!allowFreeInput}
								rightSection={rightSection}
								rightSectionWidth={theme.fn.size({ size, sizes: RIGHT_SECTION_WIDTH })}
								onBlur={handleInputBlur}
								onFocus={handleInputFocus}
								onChange={onChange}
								autoComplete='off'
								{...rest}
							/>
						</div>
					</Popover.Target>

					{dropdownType === 'popover' ? (
						<Popover.Dropdown>
							<div data-mantine-stop-propagation={dropdownOpened} onKeyDownCapture={closeOnEscape} aria-hidden={allowFreeInput || undefined}>
								{children}
							</div>
						</Popover.Dropdown>
					) : (
						<Modal {...modalProps} opened={dropdownOpened} onClose={closeDropdown} withCloseButton={false} size={amountOfMonths * 400} zIndex={modalZIndex}>
							{children}
						</Modal>
					)}
				</Popover>
			</Input.Wrapper>
		);
	}
);

export default DateTimePickerBase;
