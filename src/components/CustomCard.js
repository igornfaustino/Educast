import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
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
import EditableTextField from './EditableTextField';
import styles from './CustomCard.module.css';
import { useDropzone } from 'react-dropzone';

const useStyles = makeStyles({
	root: {
		marginTop: '3%',
		// height: '10rem',
		maxWidth: '250px',
	},
	media: {
		height: '16vh',
		width: '100%',
		position: 'relative',
	},
	title: {
		fontSize: '100%',
	},
	deleteButton: {
		borderRadius: '1px',
		maxWidth: '2vh',
		maxHeight: '2vh',
		minWidth: '2vh',
		minHeight: '2vh',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	thumbnailButton: {
		borderRadius: '1px',
		maxWidth: '3vh',
		maxHeight: '3vh',
		minWidth: '3vh',
		minHeight: '3vh',
		color: '#12AADA',
		background: 'white',
		'&:hover': {
			color: '#12AADA',
			background: '#EDD9FF',
		},
	},
	cardHeader: {
		background: '#009bff',
		color: 'white',
		cursor: 'pointer',
		padding: '1.5vh',
		maxHeight: '4vh',
		
		minHeight: '4vh',
	},
	boxes: {
	},
	cardActions: {
		background: '#F3E9FC',
		maxHeight: '10vh',
	},
	deleteIcon: {
		position: 'absolute',
		maxHeight: '1.9vh',
		minHeight: '1.9vh',
		top: '0.13vh',
		left: '0.25vh',
	},
	thumbnailIcons: {
		position: 'absolute',
		top: '0.4vh',
		left: '0.32vh',
		maxWidth: '2.5vh',
		maxHeight: '2.5vh',
		minWidth: '2.5vh',
		minHeight: '2.5vh',
	},
});

const CustomCard = ({
	chapter,
	deleteChapterFunction,
	updateTitleFunction,
	selectThumbnailFunction,
	getPresentationScreenShot,
	getPresenterScreenShot,
	isTextFieldBeingEdited,
}) => {
	const [thumbnailImage, setThumbnailImage] = useState('');
	const classes = useStyles();

	useEffect(() => {
		//select presentation snapshot by default
		setThumbnailImage(getPresentationScreenShot());
	}, []);

	const handleThumbnailSelection = (path) => {
		if (path === 'primary') {
			chapter.thumbnail = getPresentationScreenShot();
		} else if (path === 'secondary') {
			chapter.thumbnail = getPresenterScreenShot();
		}
		selectThumbnailFunction(chapter.id, chapter.thumbnail);
		setThumbnailImage(chapter.thumbnail);
	};

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

	return (
		<Card className={classes.root} square={true}>
			<CardHeader
				className={classes.cardHeader}
				title={
					<Typography className={classes.title} variant="h5" component="h5">
						Capítulo {chapter.id}
					</Typography>
				}
				action={
					<Button
						key={chapter.id}
						className={classes.deleteButton}
						startIcon={<FaTimes className={classes.deleteIcon} size="14px" />}
						onClick={() => deleteChapterFunction()}
					/>
				}
			/>
			<div className={styles["unselectable-image"]}>
				<CardMedia className={classes.media} image={thumbnailImage}>
					<Box position="absolute" className={classes.boxes} top="7%" left="85%">
						<Button
							className={classes.thumbnailButton}
							startIcon={<FaImages className={classes.thumbnailIcons} />}
							onClick={() => handleThumbnailSelection('primary')}
						/>
					</Box>
					<Box position="absolute" top="34%" left="85%">
						<Button
							className={classes.thumbnailButton}
							startIcon={
								<FaChalkboardTeacher className={classes.thumbnailIcons} />
							}
							onClick={() => handleThumbnailSelection('secondary')}
						/>
					</Box>
					<Box position="absolute" top="61%" left="85%">
						<div {...getRootProps()}>
							<input {...getInputProps()} />
							<Button
								key={chapter.id}
								className={classes.thumbnailButton}
								onClick={open}
								startIcon={<FaUpload className={classes.thumbnailIcons} />}
							/>
						</div>
					</Box>
				</CardMedia>
			</div>
			<div className={classes.cardActions}>
				<div className={styles['CustomCard__TimeLabel']}>
					In {chapter.initTime}
				</div>
				<EditableTextField
					type="text"
					value={chapter.title}
					updateTitleFunction={updateTitleFunction}
					chapter={chapter}
					isTextFieldBeingEdited={isTextFieldBeingEdited}
				/>
			</div>
		</Card>
	);
};

export default CustomCard;
