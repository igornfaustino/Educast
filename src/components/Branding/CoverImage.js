import React, { useState, useCallback, useMemo, useEffect } from 'react';

import cx from 'classnames';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import { FaUpload, FaImages, FaChalkboardTeacher } from 'react-icons/fa';
import { useDropzone } from 'react-dropzone';

import styles from './CoverImage.module.scss';

const CoverImage = ({ getPresentationScreenShot, getPresenterScreenShot }) => {
	const [coverImage, setCoverImage] = useState('');

	useEffect(() => {
		selectThumbnail('presentation');
	}, [getPresenterScreenShot]);

	const selectThumbnail = useCallback((path) => {
		let cover;
		switch (path) {
			case 'presentation':
				cover = getPresentationScreenShot();
				break;
			case 'presenter':
				cover = getPresenterScreenShot();
				break;
			default:
				cover = path;
		}
		setCoverImage(cover);
	}, [getPresentationScreenShot, getPresenterScreenShot]);

	const { getRootProps, getInputProps, open } = useDropzone({
		accept: 'image/*',
		noClick: true,
		noKeyboard: true,
		onDrop: (acceptedFiles) => {
			const acceptedFile = acceptedFiles[0];
			const image = Object.assign(acceptedFile, {
				preview: URL.createObjectURL(acceptedFile),
			});
			selectThumbnail(image.preview);
		},
	});

	const cover = useMemo(
		() =>
			coverImage !== '' && coverImage !== undefined
				? { backgroundImage: `url(${coverImage})` }
				: {
						backgroundImage:
							'url(https://kanto.legiaodosherois.com.br/w760-h398-gnw-cfill-q80/wp-content/uploads/2015/06/luffy-images.png.jpeg)',
				  },
		[coverImage]
	);

	return (
		<div {...getRootProps()}>
			<input {...getInputProps()} />
			<div className={styles.coverImage} style={cover}>
				<Box className={cx(styles.buttonBoxes, styles.firstButtonBox)}>
					<Button
						className={cx(styles.thumbnailButton, styles.button)}
						onClick={() => selectThumbnail('presentation')}
					>
						<FaImages className={styles.thumbnailIcons} />
					</Button>
				</Box>
				<Box className={styles.buttonBoxes}>
					<Button
						className={cx(styles.thumbnailButton, styles.button)}
						onClick={() => selectThumbnail('presenter')}
					>
						<FaChalkboardTeacher className={styles.thumbnailIcons} />
					</Button>
				</Box>
				<Box className={styles.buttonBoxes}>
					<Button
						className={cx(styles.thumbnailButton, styles.button)}
						onClick={open}
					>
						<FaUpload className={styles.thumbnailIcons} />
					</Button>
				</Box>
			</div>
		</div>
	);
};

export default CoverImage;
