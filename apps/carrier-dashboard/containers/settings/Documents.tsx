import React, { useCallback, useRef, useState } from 'react';
import { Badge, Button, Container, Group, Loader, Paper, Radio, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { Check, Note, Upload, X } from 'tabler-icons-react';
import { uploadFile } from '../../utils/functions';
import { Carrier, Document, DocumentType, NewDocument, SignupStatus } from '../../utils/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createDocument } from '../../store/feature/documentSlice';
import AccountActivation from '../../modals/AccountActivation';
import { updateCarrier } from '../../store/feature/profileSlice';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';

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

const DocumentInfo = ({ fileInfo }: { fileInfo: File | null }) => {
	return (
		<Group>
			<Text size='xl'>{fileInfo?.name}</Text>
			<Text size='md' color='dimmed'>
				({fileInfo?.size / 1000} Kb)
			</Text>
		</Group>
	);
};

interface DocumentsProps {
	carrierInfo: Carrier;
	documents: Document[];
}

const Documents = ({ carrierInfo, documents }: DocumentsProps) => {
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(false);
	const [activation, setActivation] = useState(false);
	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);
	const form = useForm<NewDocument>({
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
			.then(res => {
				console.log(res);
				dispatch(createDocument(values))
					.unwrap()
					.then(res => {
						console.log(res);
						notifySuccess('upload-document-success', 'Your document has been uploaded!', <Check size={20} />);
						setLoading(false);
						if (documents.length >= 2) {
							dispatch(updateCarrier({ ...carrierInfo, status: SignupStatus.COMPLETE }))
								.unwrap()
								.then(() => setActivation(true));
						}
					})
					.catch(err => {
						notifyError('store-document-failure', `An error occurred while saving your document, ${err.message}`, <X size={20} />);
						setLoading(false);
					});
			})
			.catch(err => {
				notifyError('upload-document-failure', `An error occurred while uploading your document, ${err.message}`, <X size={20} />);
				setLoading(false);
			});
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<AccountActivation opened={activation} onClose={() => setActivation(false)} />
			<div className='grid h-full grid-cols-3 gap-x-10 px-4 py-6'>
				<section>
					<header className='page-header mb-3'>Your Documents</header>
					<SimpleGrid>
						{documents.map((doc, index) => (
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
										<span className='capitalize'>{doc.type.replace(/_/g, ' ')}</span>
									</div>
								</Stack>
								<Group position='right' mt='xs'>
									<a href={doc.location} target='_blank' download>
										<Button variant='default' size='xs'>
											<Text color='dimmed'>Download</Text>
										</Button>
									</a>
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
							<Radio disabled={documents.some(doc => doc.type === DocumentType.UK_HGV_OPERATORS_LICENSE)} key={0} value={DocumentType.UK_HGV_OPERATORS_LICENSE} label='UK HGV Operators Licence' />
							<Radio disabled={documents.some(doc => doc.type === DocumentType.GOODS_IN_TRANSIT_INSURANCE)} key={1} value={DocumentType.GOODS_IN_TRANSIT_INSURANCE} label='Goods in Transit insurance' />
							<Radio disabled={documents.some(doc => doc.type === DocumentType.LIABILITY_INSURANCE)} key={2} value={DocumentType.LIABILITY_INSURANCE} label='Liability Insurance' />
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
								<Dropzone.Idle>{form.values.file ? <DocumentInfo fileInfo={form.values.file} /> : <Empty />}</Dropzone.Idle>
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
