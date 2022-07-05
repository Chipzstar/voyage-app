import React from 'react';
import { TextInput, Checkbox, Button, Group, Box, Textarea, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { ChevronDown, ChevronLeft } from 'tabler-icons-react';
import { useRouter } from 'next/router';

const quote = () => {
	const router = useRouter()
	const form = useForm({
		initialValues: {
			internalPONumber: '',
			customerPONumber: '',
			weight: ''
		}
	});

	return (
		<div className='p-4 h-screen'>
			<div className="px-4">
				<section className="flex items-center space-x-4 mb-8" role="button" onClick={() => router.back()}>
					<ChevronLeft
						size={48}
						strokeWidth={2}
						color={'black'}
					/>
					<span className="text-4xl">Bookings</span>
				</section>
				<form onSubmit={form.onSubmit(values => console.log(values))} className='grid grid-cols-3 lg:grid-cols-4 gap-20'>
					<div id='quote-form-container' className='flex flex-col space-y-12 col-span-3'>
						<div className='grid grid-cols-1 gap-5'>
							<header className='text-4xl font-light'>Load Type</header>
							<div className='border border-gray-300 p-4 grid lg:grid-cols-12 gap-y-4 gap-x-12'>
								<div className='col-span-4'>
									<TextInput
										radius={0}
										label={
											<span>
												Internal PO No. <span className='text-voyage-grey'>(optional)</span>
											</span>
										}
										placeholder=''
										{...form.getInputProps('internalPONumber')}
									/>
								</div>
								<div className='col-span-4'>
									<TextInput
										radius={0}
										label={
											<span>
												Customer PO No. <span className='text-voyage-grey'>(optional)</span>
											</span>
										}
										placeholder=''
										{...form.getInputProps('customerPONumber')}
									/>
								</div>
								<div className='col-span-4'>
									<TextInput radius={0} required label='Weight' placeholder='' rightSection={<span className='text-voyage-grey'>Kg</span>} {...form.getInputProps('weight')} />
								</div>
								<div className='col-span-6'>
									<Textarea radius={0} label='Load Description' required autosize minRows={3} maxRows={6} />
								</div>
								<div className='col-span-3'>
									<Select
										radius={0}
										label='Item Quantity'
										placeholder='Pick one'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={['React', 'Angular', 'Svelte', 'Vue']}
									/>
								</div>
								<div className='col-span-3'>
									<Select
										radius={0}
										label='Item Packaging'
										placeholder='Pick one'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={['React', 'Angular', 'Svelte', 'Vue']}
									/>
								</div>
							</div>
						</div>
						{/*<div className='grid grid-cols-2 gap-5'>
							<div>
							<header>Pickup</header>
							</div>
							<div>
								<header>Delivery</header>
							</div>
						</div>*/}
						<div>
							<header></header>
						</div>
						<div>
							<header></header>
						</div>
					</div>
					<div id='button-container' className=''></div>
				</form>
			</div>
		</div>
	);
};

export default quote;
