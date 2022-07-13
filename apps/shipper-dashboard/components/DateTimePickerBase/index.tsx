import { CSSProperties, forwardRef, useEffect, useRef, useState } from 'react';
import moment from 'moment';
import { Anchor, Button, Group, MantineSize, useMantineTheme } from '@mantine/core';
import { upperFirst, useMergedRef } from '@mantine/hooks';
import { Calendar, DayModifiers, TimeInput } from '@mantine/dates';
import { Clock } from 'tabler-icons-react';
import DateTimePickerBase from './DateTimePickerBase';
import { FirstDayOfWeek } from '@mantine/dates/lib/types';
import { CalendarSharedProps } from '@mantine/dates/lib/components/CalendarBase/CalendarBase';

interface DateTimeProps extends CalendarSharedProps {
	value: Date;
	radius?: number;
	classNames?: any;
	styles?: any;
	defaultValue?: string;
	shadow?: string;
	locale?: string;
	inputFormat?: string;
	transitionDuration?: number;
	transitionTimingFunction?: Function;
	nextMonthLabel?: string;
	previousMonthLabel?: string;
	closeCalendarOnChange?: Boolean;
	labelFormat?: string;
	dayClassName?: (date: Date, modifiers: DayModifiers) => string;
	dayStyle?: (date: Date, modifiers: DayModifiers) => CSSProperties;
	disableOutsideEvents?: boolean;
	minDate?: Date;
	maxDate?: Date;
	excludeDate?: (date: Date) => boolean;
	initialMonth?: Date;
	initiallyOpened?: boolean;
	name?: string;
	size?: MantineSize;
	dropdownType?: string;
	clearable?: boolean;
	placeholder?: string;
	disabled?: boolean;
	clearButtonLabel?: string;
	fixOnBlur?: boolean;
	withinPortal?: true;
	dateParser?: Function;
	firstDayOfWeek?: FirstDayOfWeek;
	onFocus?: Function;
	onBlur?: Function;
	amountOfMonths?: number;
	allowLevelChange?: boolean;
	initialLevel?: 'date' | 'month' | 'year';
	others?: Object;
}

const DateTimePicker = forwardRef<HTMLInputElement, DateTimeProps>(
	(
		{
			value,
			onChange,
			placeholder: string,
			defaultValue,
			classNames,
			radius,
			styles,
			shadow = 'sm',
			locale,
			inputFormat,
			transitionDuration = 100,
			transitionTimingFunction,
			nextMonthLabel,
			previousMonthLabel,
			closeCalendarOnChange = false,
			labelFormat = 'MMMM YYYY',
			dayClassName,
			dayStyle,
			disableOutsideEvents,
			minDate,
			maxDate,
			excludeDate,
			initialMonth,
			initiallyOpened = false,
			name = 'date',
			size = 'sm',
			dropdownType = 'popover',
			clearable = true,
			disabled = false,
			clearButtonLabel,
			fixOnBlur = true,
			withinPortal = true,
			dateParser,
			firstDayOfWeek = 'monday',
			onFocus,
			onBlur,
			amountOfMonths,
			allowLevelChange,
			initialLevel,
			...others
		},
		ref
	) => {
		const theme = useMantineTheme();
		const finalLocale = locale || theme.datesLocale;
		const dateFormat = inputFormat || theme.other.dateTimeFormat;
		const [dropdownOpened, setDropdownOpened] = useState(initiallyOpened);
		const calendarSize = size === 'lg' || size === 'xl' ? 'md' : 'sm';
		const inputRef = useRef<HTMLElement>(null);
		const [lastValidValue, setLastValidValue] = useState(defaultValue ?? null);
		const [_value, setValue] = useState(value);
		const [calendarMonth, setCalendarMonth] = useState(_value || initialMonth || new Date());

		const [focused, setFocused] = useState(false);
		const [inputState, setInputState] = useState(_value instanceof Date ? upperFirst(moment(_value).locale(finalLocale).format(dateFormat)) : '');

		useEffect(() => {
			if (value === null && !focused) {
				setInputState('');
			}

			if (value instanceof Date && !focused) {
				setInputState(moment(value).locale(finalLocale).format(dateFormat));
			}
		}, [value, focused]);

		useEffect(() => {
			if (!dropdownOpened) {
				setValue(value);
			}
		}, [dropdownOpened]);

		const handleValueChange = date => {
			if (_value) {
				date.setHours(_value.getHours());
				date.setMinutes(_value.getMinutes());
			} else {
				const now = new Date(Date.now());
				date.setHours(now.getHours());
				date.setMinutes(now.getMinutes());
			}
			setValue(date);
			closeCalendarOnChange && setInputState(upperFirst(moment(date).locale(finalLocale).format(dateFormat)));
			closeCalendarOnChange && setDropdownOpened(false);
			window.setTimeout(() => inputRef.current?.focus(), 0);
		};

		const handleClear = () => {
			setValue(null);
			setLastValidValue(null);
			setInputState('');
			setDropdownOpened(true);
			inputRef.current?.focus();
			onChange(null);
		};

		const parseDate = date => (dateParser ? dateParser(date) : moment(date, dateFormat, finalLocale).toDate());

		const handleInputBlur = e => {
			typeof onBlur === 'function' && onBlur(e);
			setFocused(false);
		};

		const handleInputFocus = e => {
			typeof onFocus === 'function' && onFocus(e);
			setFocused(true);
		};

		const handleChange = e => {
			setDropdownOpened(true);

			const date = parseDate(e.target.value);
			if (moment(date).isValid()) {
				setValue(date);
				setLastValidValue(date);
				closeCalendarOnChange && setInputState(e.target.value);
				setCalendarMonth(date);
			} else {
				closeCalendarOnChange && setInputState(e.target.value);
			}
		};

		const handleTimeChange = date => {
			setValue(date);
			closeCalendarOnChange && setInputState(upperFirst(moment(date).locale(finalLocale).format(dateFormat)));
			closeCalendarOnChange && setDropdownOpened(false);
		};

		const handleNow = () => {
			const now = new Date(Date.now());
			setValue(now);
			setInputState(upperFirst(moment(now).locale(finalLocale).format(dateFormat)));
			setDropdownOpened(false);
			window.setTimeout(() => inputRef.current?.focus(), 0);
			onChange(now);
		};

		const handleOk = () => {
			setInputState(upperFirst(moment(_value).locale(finalLocale).format(dateFormat)));
			setDropdownOpened(false);
			window.setTimeout(() => inputRef.current?.focus(), 0);
			onChange(_value);
		};

		return (
			<DateTimePickerBase
				// @ts-ignore
				dropdownOpened={dropdownOpened}
				setDropdownOpened={setDropdownOpened}
				shadow={shadow}
				transitionDuration={transitionDuration}
				ref={useMergedRef(ref, inputRef)}
				radius={radius}
				size={size}
				styles={styles}
				classNames={classNames}
				onChange={handleChange}
				onBlur={handleInputBlur}
				onFocus={handleInputFocus}
				name={name}
				inputLabel={inputState}
				__staticSelector='DateTimePicker'
				dropdownType={dropdownType}
				clearable={clearable && !!_value && !disabled}
				clearButtonLabel={clearButtonLabel}
				onClear={handleClear}
				disabled={disabled}
				withinPortal={withinPortal}
				{...others}
			>
				<Calendar
					classNames={classNames}
					styles={styles}
					locale={finalLocale}
					nextMonthLabel={nextMonthLabel}
					previousMonthLabel={previousMonthLabel}
					month={undefined}
					initialMonth={initialMonth || (_value instanceof Date ? _value : new Date())}
					onMonthChange={setCalendarMonth}
					value={_value instanceof Date ? _value : moment(_value).toDate()}
					onChange={handleValueChange}
					labelFormat={labelFormat}
					dayClassName={dayClassName}
					dayStyle={dayStyle}
					disableOutsideEvents={disableOutsideEvents}
					minDate={minDate}
					maxDate={maxDate}
					excludeDate={excludeDate}
					__staticSelector='DateTimePicker'
					fullWidth={dropdownType === 'modal'}
					size={dropdownType === 'modal' ? 'lg' : calendarSize}
					firstDayOfWeek={firstDayOfWeek}
					preventFocus={false}
					amountOfMonths={amountOfMonths}
					allowLevelChange={allowLevelChange}
					initialLevel={initialLevel}
					mb='sm'
				/>

				<Group align='center'>
					<Anchor ml='xs' component='button' color='blue' onClick={handleNow}>
						Now
					</Anchor>
					<TimeInput sx={t => ({ flexGrow: 1 })} icon={<Clock />} styles={{ controls: { justifyContent: 'center', marginLeft: -20 } }} disabled={!_value} value={_value} onChange={handleTimeChange} />
					{!closeCalendarOnChange && (
						<Button
							mr='xs'
							disabled={!_value}
							onClick={handleOk}
							classNames={{
								root: 'bg-secondary'
							}}
							color='blue'
						>
							Ok
						</Button>
					)}
				</Group>
			</DateTimePickerBase>
		);
	}
);

export default DateTimePicker;
