import React, { useCallback, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Center, Container, Group, Loader, Radio, Stack, Text, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dropzone, DropzoneProps, PDF_MIME_TYPE } from '@mantine/dropzone';
import { Note, Upload, X } from 'tabler-icons-react';

const Documents = props => {
	const [loading, setLoading] = useState(false);
	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);
	const form = useForm({
		initialValues: {
			documentType: '',
			file: null
		},
		validate: {
			documentType: value => (!value ? 'Please select a document type' : null)
		}
	});

	const handleSubmit = useCallback(values => {
		alert(JSON.stringify(values));
		console.log(values.file);
		/*const formData = new FormData();
		formData.append('file', values.file);
		fetch('http://MY_UPLOAD_SERVER.COM/api/upload', {
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data'
			},
			body: formData
		})
			.then(res => {
				const respJson = res.json();
				// console.log("File uploaded", respJson);
				// TODO: Update ui and states....
				// setUploads(respJson.url);
				return respJson;
			})
			.catch(err => {
				console.log('File upload error', err);
				// TODO: Update ui and states with error....
			});*/
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex flex-col h-full'>
				<header className='page-header my-6'>Upload Documents</header>
				<form onSubmit={form.onSubmit(handleSubmit)} className='w-3/4'>
					<Stack className='w-full'>
						<Radio.Group label='Select the type of document to upload' description='You must upload one of each document type before creating loads.' required className='w-full' {...form.getInputProps('documentType')}>
							<Radio value='uk-hgv-operators-license' label='UK HGV Operators Licence' />
							<Radio value='goods-in-transit-insurance' label='Goods in Transit insurance' />
							<Radio value='liability-insurance' label='Liability Insurance' />
						</Radio.Group>

						<Dropzone multiple={false} onDrop={files => console.log('accepted files', files)} onReject={files => console.log('rejected files', files)} maxSize={3 * 1024 ** 2} accept={PDF_MIME_TYPE}>
							<Group position='center' spacing='xl' style={{ minHeight: 220, pointerEvents: 'none' }}>
								<Dropzone.Accept>
									<Upload size={50} color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]} />
								</Dropzone.Accept>
								<Dropzone.Reject>
									<X size={50} color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]} />
								</Dropzone.Reject>
								<Dropzone.Idle>
									<Group>
										<Note size={50} />
										<div>
											<Text size='xl' inline>
												Drag documents here or click to select files
											</Text>
											<Text size='sm' color='dimmed' inline mt={7}>
												Each file should not exceed 5MB
											</Text>
										</div>
									</Group>
								</Dropzone.Idle>
							</Group>
						</Dropzone>

						{/*<Group position="center" mt="md">
							<Button onClick={() => openRef.current()}>Select files</Button>
						</Group>*/}
					</Stack>
					<Group my={10} py={10} position='center'>
						<Button
							type='submit'
							classNames={{
								root: 'bg-secondary hover:bg-secondary-600'
							}}
						>
							<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
							<span>Save Changes</span>
						</Button>
					</Group>
				</form>
			</Center>
		</Container>
	);
};

Documents.propTypes = {};

export default Documents;
