import React, { useEffect, useRef, useState } from 'react';
import ContentContainer from '../../../layout/ContentContainer';
import { ActionIcon, Group, Switch, TextInput, Text, Avatar } from '@mantine/core';
import { Pencil, Search, Trash } from 'tabler-icons-react';
import { PATHS } from '../../../utils/constants';
import { useRouter } from 'next/router';
import DataGrid from '../../../components/DataGrid';
import { Empty } from '@voyage-app/shared-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { removeDriver, useDrivers } from '../../../store/feature/driverSlice';
import { useModals } from '@mantine/modals';
import _ from 'lodash';

const drivers = () => {
	const modals = useModals();
	const dispatch = useDispatch();
	const router = useRouter();
	const drivers = useSelector(useDrivers);
	const [filteredDrivers, setFilter] = useState([...drivers]);

	const openConfirmModal = (id: string, name) =>
		modals.openConfirmModal({
			title: 'Delete Driver',
			children: (
				<Text size='md'>
					You have selected <strong>{name}</strong>
					<br />
					Are you sure you want to delete this driver?
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			onConfirm: () => dispatch(removeDriver(id)),
			onCancel: () => console.log('Cancel'),
			classNames: {
				title: 'modal-header'
			},
			confirmProps: {
				color: 'red',
				classNames: {
					root: 'bg-red-500'
				}
			},
			closeOnCancel: true,
			closeOnConfirm: true
		});

	const debouncedSearch = useRef(
		_.debounce(value => {
			setFilter(prevState => (value.length >= 2 ? drivers.filter(({ fullName, email, defaultPhone }) => fullName.includes(value) || email.includes(value) || defaultPhone.includes(value)) : drivers));
		}, 300)
	).current;

	useEffect(() => {
		return () => {
			debouncedSearch.cancel();
		};
	}, [debouncedSearch]);

	const rows = filteredDrivers.map((element, index) => {
		return (
			<tr key={index}>
				<td colSpan={1}>
					<Group spacing='sm'>
						<Avatar
							size={40}
							radius={40}
							classNames={{
								placeholder: 'bg-transparent'
							}}
						/>
						<Text weight={500}>
							{element.firstname} {element.lastname}
						</Text>
					</Group>
				</td>
				<td colSpan={1}>
					<span className='text-base font-normal'>{element.email}</span>
				</td>
				<td colSpan={1}>
					<span>{element.defaultPhone}</span>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.city}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<span>{element.postcode}</span>
					</div>
				</td>
				<td colSpan={1}>
					<div className='flex flex-col flex-shrink'>
						<Switch checked={element.isActive} onChange={() => console.log('')} />
					</div>
				</td>
				<td>
					<Group spacing='md' position='left'>
						<ActionIcon
							size='sm'
							onClick={() =>
								router.push({
									pathname: `${PATHS.NEW_DRIVER}`,
									query: { driverId: element.driverId }
								})
							}
						>
							<Pencil />
						</ActionIcon>
						<ActionIcon size='sm' color='red' onClick={() => openConfirmModal(element.driverId, element.fullName)}>
							<Trash />
						</ActionIcon>
					</Group>
				</td>
			</tr>
		);
	});

	return (
		<ContentContainer classNames='py-4 px-8 h-screen'>
			<div className='flex justify-between items-center mt-2 mb-6'>
				<TextInput className='w-96' size='md' radius={0} icon={<Search size={18} />} onChange={e => debouncedSearch(e.target.value)} placeholder='Search for name, email or phone' />
				<button className='voyage-button' onClick={() => router.push(PATHS.NEW_DRIVER)}>
					<span className='text-base'>Add Driver</span>
				</button>
			</div>
			<DataGrid
				rows={rows}
				spacingY='md'
				headings={['Driver Name', 'Email', 'Phone', 'City', 'Postcode', 'Status', 'Actions']}
				emptyContent={
					<Empty
						message={
							<span className='text-center text-2xl'>
								You have no drivers
								<br />
								Click the 'Add Driver' button to add one
							</span>
						}
					/>
				}
			/>
		</ContentContainer>
	);
};

export default drivers
