import React from 'react';
import { TextInput, Textarea, NumberInput, Select } from '@mantine/core';
import { useForm } from '@mantine/form';
import { DatePicker } from '@mantine/dates';
import { Calendar } from 'tabler-icons-react';
import { ChevronDown, ChevronLeft } from 'tabler-icons-react';
import { useRouter } from 'next/router';

const quote = () => {
	const router = useRouter();
	const form = useForm({
		initialValues: {
			internalPONumber: '',
			customerPONumber: '',
			weight: '',
			quantity: 1,
			pickupDate: null
		}
	});

	return (
		<div className='p-4 h-screen'>
			<div className='px-4'>
				<section className='flex items-center space-x-4 mb-8' role='button' onClick={() => router.back()}>
					<ChevronLeft size={48} strokeWidth={2} color={'black'} />
					<span className='page-header'>Bookings</span>
				</section>
				<form onSubmit={form.onSubmit(values => console.log(values))} className='grid grid-cols-3 lg:grid-cols-4 gap-20'>
					<div id='quote-form-container' className='flex flex-col space-y-5 col-span-3'>
						<div className='grid grid-cols-1 gap-6'>
							<header className='quote-header'>Load Type</header>
							<div className='border border-gray-300 p-4 grid lg:grid-cols-12 gap-y-4 gap-x-12 pb-12'>
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
									<NumberInput radius={0} required label='Weight' placeholder='' rightSection={<span className='text-voyage-grey pr-3'>Kg</span>} {...form.getInputProps('weight')} />
								</div>
								<div className='col-span-6'>
									<Textarea size="sm" radius={0} label='Load Description' required autosize maxRows={6} />
								</div>
								<div className='col-span-3'>
									<NumberInput size="sm" defaultValue={1} radius={0} min={1} max={100} label='Item Quantity' placeholder='Units' {...form.getInputProps('quantity')} />
								</div>
								<div className='col-span-3'>
									<Select
										size="sm"
										radius={0}
										label='Item Packaging'
										placeholder='Pick one'
										rightSection={<ChevronDown size={14} />}
										rightSectionWidth={30}
										styles={{ rightSection: { pointerEvents: 'none' } }}
										data={['Pallets', 'Crates', 'Skids', 'Containers', 'Boxes']}
									/>
								</div>
							</div>
						</div>
						<div className='grid grid-cols-2 gap-5'>
							<div className='flex flex-col space-y-6'>
								<header className='quote-header'>Pickup</header>
								<div className=''>
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
								<div className=''>
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
							</div>
							<div className='flex flex-col space-y-6'>
								<header className='quote-header'>Delivery</header>
								<div className=''>
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
								<div className=''>
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
							</div>
						</div>
						<div className='grid grid-cols-1 gap-6'>
							<header className='quote-header'>Scheduling</header>
							<div className='flex flex-col space-y-4'>
								<p className='font-normal'>Select a pickup date, and we’ll calculate a delivery date based on transit time.</p>
								<DatePicker className='w-72' radius={0} size='md' placeholder='Pickup Date' rightSection={<Calendar size={16} />} {...form.getInputProps('pickupDate')} />
							</div>
						</div>
						<div className='grid grid-cols-2 gap-5'>
							<div className='flex flex-col space-y-6'>
								<header className='quote-header'>Equipment Type</header>
								<p>Select equipment type</p>
								<Select
									radius={0}
									size="md"
									defaultValue='No preference'
									rightSection={<ChevronDown size={14} />}
									rightSectionWidth={30}
									styles={{ rightSection: { pointerEvents: 'none' } }}
									data={['No preference', 'Explosives', 'Gases', 'Flammable Items', 'Toxic & Infectious substances', 'Radioactive Material', 'Corrosives', 'Other Dangerous Goods']}
								/>
							</div>
							<div className='flex flex-col space-y-6'>
								<header className='quote-header'>Notes</header>
								<Textarea radius={0} placeholder='Notes' required autosize minRows={3} maxRows={6} />
							</div>
						</div>
					</div>
					<div id='button-container' className='flex flex-col justify-center space-y-8'>
						<button className="voyage-button">Optimize</button>
						<button className="voyage-button">Manually Book</button>
						<button className="voyage-button bg-transparent text-black hover:bg-stone-100">Cancel</button>
					</div>
				</form>
			</div>
		</div>
	);
};

export default quote;
