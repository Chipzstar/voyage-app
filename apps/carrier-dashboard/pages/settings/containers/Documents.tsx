import React, { useCallback, useRef, useState } from 'react';
import { ActionIcon, Button, Center, Container, Group, Loader, Radio, Stack, Text, useMantineTheme } from '@mantine/core';
import { useForm, UseFormReturnType } from '@mantine/form';
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone';
import { Check, Note, Trash, Upload, X } from 'tabler-icons-react';
import { notifyError, notifySuccess, uploadFile } from '../../../utils/functions';
import { DocumentType } from '../../../utils/types';

interface FormValues {
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
			<Text size='md'>{fileInfo?.size / 1000} Kb</Text>
		</Group>
	);
};

const Documents = props => {
	const [loading, setLoading] = useState(false);
	const theme = useMantineTheme();
	const openRef = useRef<() => void>(null);
	const form = useForm<FormValues>({
		initialValues: {
			documentType: '',
			file: null
		},
		validate: {
			documentType: value => (!value ? 'Please select a document type' : null)
		}
	});

	const handleSubmit = useCallback(values => {
		setLoading(true);
		console.log(values.file);
		uploadFile(values.file)
			.then(() => {
				notifySuccess('upload-document-success', 'Your document has been uploaded!', <Check size={20} />);
				setLoading(false);
			})
			.catch(err => {
				notifyError('upload-document-error', `Failed to upload document ${err.message}`, <X size={20} />);
				setLoading(false);
			});
	}, []);

	return (
		<Container fluid className='tab-container bg-voyage-background'>
			<Center className='flex flex-col h-full'>
				<header className='page-header my-6'>Upload Documents</header>
				<form onSubmit={form.onSubmit(handleSubmit)} className='w-3/4'>
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
			</Center>
		</Container>
	);
};

Documents.propTypes = {};

export default Documents;
