import React, { useCallback, useRef, useState } from 'react';
import { Badge, Button, Container, Group, Loader, Paper, Radio, ScrollArea, SimpleGrid, Stack, Text, useMantineTheme } from '@mantine/core';
import { useForm } from '@mantine/form';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { Check, Note, Upload, X } from 'tabler-icons-react';
import { uploadFile } from '../../utils/functions';
import { Carrier, Document, DocumentType, NewDocument, ActivationStatus } from '../../utils/types';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createDocument, deleteDocument } from '../../store/feature/documentSlice';
import AccountActivation from '../../modals/AccountActivation';
import { updateCarrier } from '../../store/feature/profileSlice';
import { notifyError, notifySuccess } from '@voyage-app/shared-utils';
import { useModals } from '@mantine/modals';
import { useViewportSize } from '@mantine/hooks';

const ONE_GB = 1073741824; // in bytes units

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
	const modals = useModals();
	const dispatch = useDispatch<AppDispatch>();
	const [loading, setLoading] = useState(false);
	const [activation, setActivation] = useState(false);
	const theme = useMantineTheme();
	const { height } = useViewportSize()
	const dropzoneRef = useRef<HTMLDivElement>(null);

	const openConfirmModal = (doc: Document) =>
		modals.openConfirmModal({
			title: 'Delete Document',
			children: (
				<Text size='md'>
					You have selected <strong>{doc.filename}</strong>
					<br />
					Are you sure you want to delete this document?
				</Text>
			),
			labels: { confirm: 'Delete', cancel: 'Cancel' },
			onConfirm: () =>
				dispatch(deleteDocument(doc))
					.unwrap()
					.then(res => notifySuccess('delete-document-success', `${doc.filename} has been removed!`, <Check size={20} />))
					.catch(err => notifyError('delete-document-failure', `An error occurred while deleting your document, ${err.message}`, <X size={20} />)),
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

	const handleSubmit = useCallback(
		values => {
			setLoading(true);
			uploadFile(values)
				.then(res => {
					dispatch(createDocument(values))
						.unwrap()
						.then(res => {
							form.reset();
							notifySuccess('upload-document-success', 'Your document has been uploaded!', <Check size={20} />);
							setLoading(false);
							// if all 3 document types are uploaded and user account still not fully activated
							if (documents.length >= 2 && carrierInfo.status !== ActivationStatus.COMPLETE) {
								// set carrier activation status to "COMPLETE"
								dispatch(updateCarrier({ ...carrierInfo, status: ActivationStatus.COMPLETE }))
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
		},
		[documents, carrierInfo]
	);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<AccountActivation opened={activation} onClose={() => setActivation(false)} />
			<div className='grid h-full grid-cols-3 gap-x-10 px-4 py-6'>
				<section>
					<header className='page-header mb-3'>Your Documents</header>
					<ScrollArea.Autosize maxHeight={height - 150}>
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
											<Badge
												variant='gradient'
												gradient={
													doc.verified
														? {
																from: 'teal',
																to: 'lime',
																deg: 105
														  }
														: { from: 'grey', to: 'black' }
												}
											>
												{doc.status}
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
										<Button variant='outline' color='red' size='xs' onClick={() => openConfirmModal(doc)}>
											Remove
										</Button>
									</Group>
								</Paper>
							))}
						</SimpleGrid>
					</ScrollArea.Autosize>
				</section>
				<form encType='multipart/form-data' onSubmit={form.onSubmit(handleSubmit)} className='col-span-2'>
					<header className='page-header mb-6'>Upload Documents</header>
					<Stack className='w-full'>
						<Radio.Group label='Select the type of document to upload' description='You must upload one of each document type before creating loads.' required className='w-full' {...form.getInputProps('documentType')}>
							<Radio
								disabled={documents.some(doc => doc.type === DocumentType.UK_HGV_OPERATORS_LICENSE)}
								key={0}
								value={DocumentType.UK_HGV_OPERATORS_LICENSE}
								label='UK HGV Operators Licence'
							/>
							<Radio
								disabled={documents.some(doc => doc.type === DocumentType.GOODS_IN_TRANSIT_INSURANCE)}
								key={1}
								value={DocumentType.GOODS_IN_TRANSIT_INSURANCE}
								label='Goods in Transit insurance'
							/>
							<Radio
								disabled={documents.some(doc => doc.type === DocumentType.LIABILITY_INSURANCE)}
								key={2}
								value={DocumentType.LIABILITY_INSURANCE}
								label='Liability Insurance'
							/>
						</Radio.Group>

						<Dropzone
							ref={dropzoneRef}
							classNames={{
								root: `${form.values.file} && 'z-0'`
							}}
							loading={loading}
							multiple={false}
							onDrop={files => {
								console.log('accepted files', files);
								form.setFieldValue('file', files[0]);
							}}
							onReject={files => {
								console.log('rejected files', files);
								notifyError('rejected-file', 'This file is too large for upload. Please make sure you document is < 1GB in size', <X size={20} />);
							}}
							maxSize={ONE_GB} // 1 GB
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
							size="md"
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
