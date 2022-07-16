import React, { useState } from 'react';
import { Radio, RadioGroup, Switch } from '@mantine/core';
import VehicleOptions from '../modals/VehicleOptions';

const CarrierPreferences = () => {
	const [optionsForm, showOptions] = useState(false);
	const [title, setTitle] = useState("");
	return (
		<div className='py-5 workflows-container'>
			<VehicleOptions opened={optionsForm} onClose={() => showOptions(false)} onSave={() => showOptions(false)} title={title.replace(/-/g, " ")} />
			<div className='grid grid-cols-1 gap-8'>
				<div className='flex flex-col space-y-4'>
					<div className='flex flex-col space-y-2'>
						<header className='shipment-header'>Auto Dispatch</header>
						<span className='font-normal'>Automatically create booking when the optimal carrier for a load has been identified</span>
					</div>
					<Switch onLabel='ON' offLabel='OFF' radius={0} size='xl' color='gray' />
				</div>
				<div className='flex flex-col space-y-4'>
					<div className='flex flex-col space-y-2'>
						<header className='shipment-header'>Quote Preference</header>
						<span className='font-normal'>Communicate selection criteria for provided quotes from carriers</span>
					</div>
					<div>
						<RadioGroup required orientation='vertical' color='gray'>
							<Radio value='price' label='Lowest price' />
							<Radio value='fast-delivery-eta' label='Fastest delivery time' />
							<Radio value='early-pickup-eta' label='Earliest pickup time' />
							<Radio value='late-pickup-eta' label='Latest pickup time' />
						</RadioGroup>
					</div>
				</div>
				<div className='flex flex-col space-y-4'>
					<div className='flex flex-col space-y-2'>
						<header className='shipment-header'>Vehicle Preference</header>
						<span className='font-normal'>Communicate vehicle type selection preferences</span>
					</div>
					<div>
						<RadioGroup required orientation='vertical' color='gray'>
							<Radio value='cargo-van' label='Cargo Van' onClick={() => {
								setTitle('cargo-van')
								showOptions(true)
							}} />
							<Radio value='tail-lift-truck' label='Tail-lift truck' onClick={() => {
								setTitle('tail-lift-truck')
								showOptions(true)
							}} />
							<Radio value='jumbo-trailer' label='Jumbo trailer (mega trailer) trucks' onClick={() => {
								setTitle('jumbo-trailer')
								showOptions(true)
							}} />
							<Radio value='semi-trailer-truck' label='Semi-trailer truck' onClick={() => {
								setTitle('semi-trailer-truck')
								showOptions(true)
							}} />
						</RadioGroup>
					</div>
				</div>
				<div className='flex flex-col space-y-4'>
					<div className='flex flex-col space-y-2'>
						<header className='shipment-header'>Optimization objectives</header>
						<span className='font-normal'>Control how your shipments should be optimized</span>
					</div>
					<div>
						<RadioGroup required orientation='vertical' color='gray'>
							<Radio value='mileage' label='Minimize drive time' />
							<Radio value='punctual' label='Arrive on time' />
							<Radio value='cost' label='Minimize cost' />
							<Radio value='minimize-co2e' label='Minimize CO2e' />
						</RadioGroup>
					</div>
				</div>
			</div>
		</div>
	);
};

export default CarrierPreferences;
