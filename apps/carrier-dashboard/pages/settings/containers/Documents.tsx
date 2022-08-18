import React, { useCallback, useRef, useState } from 'react';
import { Badge, Button, Card, Center, Container, Group, Loader, Paper, Radio, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { Check, Note, Upload, X } from 'tabler-icons-react';
import { notifySuccess, uploadFile } from '../../../utils/functions';
import { DocumentType, Document } from '../../../utils/types';
import { SAMPLE_DOCUMENTS } from '../../../utils/constants';

interface FormValues {
	id: string;
	documentType: string;
	file: File | null;
}

const Empty = () => {
	return (
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
	);
};

const DocumentInfo = ({ form, fileInfo }: { form: UseFormReturnType<FormValues>; fileInfo: File | null }) => {
	return (
		<Group>
			<Text size='xl'>{fileInfo?.name}</Text>
			<Text size='md' color='dimmed'>
				({fileInfo?.size / 1000} Kb)
			</Text>
		</Group>
	);
};

const Documents = ({ carrierInfo }) => {
	const [loading, setLoading] = useState(false);
	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);
	const form = useForm<FormValues>({
		initialValues: {
			id: carrierInfo?.id ?? '',
			documentType: '',
			file: null
		},
		validate: {
			documentType: value => (!value ? 'Please select a document type' : null)
		}
	});

	const handleSubmit = useCallback(values => {
		setLoading(true);
		uploadFile(values)
			.then((res) => {
				notifySuccess('upload-document-success', 'Your document has been uploaded!', <Check size={20} />);
				console.log(res)
				setLoading(false);
			})
			.catch(err => {
				notifySuccess('upload-document-success', 'Your document has been uploaded!', <Check size={20} />);
				setLoading(false);
			});
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<div className='grid grid-cols-3 h-full px-4 py-6 gap-x-10'>
				<section>
					<header className='page-header mb-3'>Your Documents</header>
					<SimpleGrid>
						{SAMPLE_DOCUMENTS.map((doc, index) => (
							<Paper key={index} shadow='md' p='md' withBorder className='w-full bg-transparent'>
								<Stack>
									<Group position='apart'>
										<div>
											<Text color='dimmed' weight={600}>
												Filename
											</Text>
											<span>{doc.filename}</span>
										</div>
										<Badge variant='gradient' gradient={{ from: 'grey', to: 'black' }}>
											Verifying
										</Badge>
									</Group>
									<div>
										<Text color='dimmed' weight={600}>
											Document Type
										</Text>
										<span className='capitalize'>{doc.type.replace(/_/g, ' ').toLowerCase()}</span>
									</div>
								</Stack>
								<Group position='right' mt='xs'>
									<Button variant='default' size='xs'>
										<Text color='dimmed'>Download</Text>
									</Button>
									<Button variant='outline' color='red' size='xs'>
										Remove
									</Button>
								</Group>
							</Paper>
						))}
					</SimpleGrid>
				</section>
				<form encType='multipart/form-data' onSubmit={form.onSubmit(handleSubmit)} className='col-span-2'>
					<header className='page-header mb-6'>Upload Documents</header>
					<Stack className='w-full'>
						<Radio.Group label='Select the type of document to upload' description='You must upload one of each document type before creating loads.' required className='w-full' {...form.getInputProps('documentType')}>
							<Radio key={0} value={DocumentType.UK_HGV_OPERATORS_LICENSE} label='UK HGV Operators Licence' />
							<Radio key={1} value={DocumentType.GOODS_IN_TRANSIT_INSURANCE} label='Goods in Transit insurance' />
							<Radio key={2} value={DocumentType.LIABILITY_INSURANCE} label='Liability Insurance' />
						</Radio.Group>

						<Dropzone
							classNames={{
								root: `${form.values.file} && 'z-0'`
							}}
							loading={loading}
							multiple={false}
							onDrop={files => {
								console.log('accepted files', files);
								form.setFieldValue('file', files[0]);
							}}
							onReject={files => console.log('rejected files', files)}
							maxSize={3 * 1024 ** 2}
							accept={PDF_MIME_TYPE}
						>
							<Group position='center' spacing='xl' style={{ minHeight: 220, pointerEvents: 'none' }}>
								<Dropzone.Accept>
									<Upload size={50} color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]} />
								</Dropzone.Accept>
								<Dropzone.Reject>
									<X size={50} color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]} />
								</Dropzone.Reject>
								<Dropzone.Idle>{form.values.file ? <DocumentInfo form={form} fileInfo={form.values.file} /> : <Empty />}</Dropzone.Idle>
							</Group>
						</Dropzone>
					</Stack>
					<Group my={10} py={10} position='center'>
						<Button
							disabled={!form.values.file}
							type='submit'
							classNames={{
								root: `bg-secondary ${form.values.file && 'hover:bg-secondary-600'}`
							}}
						>
							<Loader size='sm' className={`mr-3 ${!loading && 'hidden'}`} />
							<span>Upload</span>
						</Button>
					</Group>
				</form>
			</div>
		</Container>
	);
};

Documents.propTypes = {};

export default Documents;
