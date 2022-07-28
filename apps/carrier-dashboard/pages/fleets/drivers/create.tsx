import React from 'react'
import PageNav from '../../../layout/PageNav'
import { Anchor } from '@mantine/core'
import Link from 'next/link'
import { PATHS } from '../../../utils/constants'
import Container from '../../../layout/Container'

const create = () => {
	const items = [
		{ title: 'Home', href: PATHS.HOME },
		{ title: 'Drivers', href: PATHS.DRIVERS },
		{ title: 'New Driver', href: PATHS.NEW_DRIVER }
	].map((item, index) => (
		<Anchor component={Link} href={item.href} key={index}>
			<span className='hover:text-secondary hover:underline'>{item.title}</span>
		</Anchor>
	));
	return (
		<Container>
			<PageNav items={items}/>
		</Container>
	)
}

export default create