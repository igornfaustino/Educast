import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';

import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {
	FaUpload,
	FaImages,
	FaTimes,
	FaChalkboardTeacher,
} from 'react-icons/fa';
import Box from '@material-ui/core/Box';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';

import EditableTextField from './EditableTextField';
import styles from './CustomCard.module.scss';
import { timeFormatter } from '../../utils/formatting';

const CustomCard = ({
	order,
	chapter,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresentationScreenShot,
	getPresenterScreenShot,
	disableDraggableCarousel,
	selectChapter,
}) => {
	const [thumbnailImage, setThumbnailImage] = useState('');
	const videoInSeconds = useSelector((state) => state.video.duration);

	useEffect(() => {
		setThumbnailImage(chapter.img);
	}, [chapter.img]);

	// Changes card thumbnail.
	const handleThumbnailSelection = useCallback(
		(path) => {
			if (path === 'primary') {
				chapter.img = getPresentationScreenShot();
			} else if (path === 'secondary') {
				chapter.img = getPresenterScreenShot();
			}
			selectThumbnailFunction(chapter.id, chapter.img);
			setThumbnailImage(chapter.img);
		},
		[
			chapter,
			getPresentationScreenShot,
			getPresenterScreenShot,
			selectThumbnailFunction,
		]
	);

	// This is for image upload + generating image preview.
	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		noClick: true,
		noKeyboard: true,
		onDrop: (acceptedFiles) => {
			const acceptedFile = acceptedFiles[0];
			const image = Object.assign(acceptedFile, {
				preview: URL.createObjectURL(acceptedFile),
			});
			setThumbnailImage(image.preview);
			selectThumbnailFunction(chapter.id, image.preview);
		},
	});

	const layoutChapterSelected = useMemo(() => {
		return chapter.isSelected === true
			? { background: '#F69333' }
			: { background: '#009bff' };
	}, [chapter.isSelected]);

	return (
		<Card className={styles['root']} square={true}>
			<CardMedia
				className={styles['card-header']}
				style={layoutChapterSelected}
			>
				<Typography
					onClick={selectChapter}
					className={styles['card-title']}
					variant="h5"
					component="h5"
				>
					Capítulo {order}
				</Typography>
				<Box className={styles['delete-box']}>
					<Button
						key={chapter.id}
						className={classNames(styles['delete-button'], styles['button'])}
						onClick={deleteChapterFunction}
					>
						<FaTimes className={styles['delete-icon']} />
					</Button>
				</Box>
			</CardMedia>
			<div className={styles['unSelectable-image']}>
				<CardMedia className={styles['card-media']} image={thumbnailImage}>
					<Box
						className={classNames(styles['card-boxes'], styles['first-cardBox'])}
					>
						<Button
							className={classNames(
								styles['thumbnail-button'],
								styles['button']
							)}
							onClick={() => handleThumbnailSelection('primary')}
						>
							<FaImages className={styles['thumbnail-icons']} />
						</Button>
					</Box>
					<Box className={styles['card-boxes']}>
						<Button
							className={classNames(
								styles['thumbnail-button'],
								styles['button']
							)}
							onClick={() => handleThumbnailSelection('secondary')}
						>
							<FaChalkboardTeacher className={styles['thumbnail-icons']} />
						</Button>
					</Box>
					<Box className={styles['card-boxes']}>
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Button
								key={chapter.id}
								className={classNames(
									styles['thumbnail-button'],
									styles['button']
								)}
								onClick={open}
							>
								<FaUpload className={styles['thumbnail-icons']} />
							</Button>
						</div>
					</Box>
				</CardMedia>
			</div>
			<div className={styles['card-description']}>
				<div className={styles['time-label']}>
					In {timeFormatter(chapter.position, videoInSeconds)}
				</div>
				<EditableTextField
					type="text"
					value={chapter.title}
					updateTitleFunction={updateTitleFunction}
					chapter={chapter}
					isTextFieldBeingEdited={disableDraggableCarousel}
				/>
			</div>
		</Card>
	);
};

export default CustomCard;
