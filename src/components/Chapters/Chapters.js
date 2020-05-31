import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import CustomSlider from './CustomSlider';
import { useDispatch, useSelector } from 'react-redux';
import { useTimeline } from '../../hooks/useTimeline';

const Chapters = ({ getPresenterScreenShot, getPresentationScreenShot }) => {
	const [chapters, setChapters] = useState([]);
	const { deleteChapter, handleChapterSelectedSelect } = useTimeline();
	const chs = useSelector((state) => state.sceneChapters.chapters);

	useEffect(() => {
		const c = chs.map(ch => {
			const temp = {
				id: ch.id,
				img: ch.img,
				position: ch.position,
				title: 'Title',
			};
			return temp;
		});
		setChapters(c);
		console.log(chs);
	}, []);

	const selectThumbnailFunction = (chapterId, path) => {
		// console.log(chapterId, path);
		setChapters(
			chapters.filter((chapter) => {
				if (chapter.id === chapterId) {
					chapter.img = path;
				}
				return chapter;
			})
		);
	};

	const updateTitleFunction = (id, newTitle) => {
		setChapters(
			chapters.filter((chapter) => {
				if (chapter.id === id) {
					chapter.thumbnail = newTitle;
				}
				console.log('title changed', newTitle);
				return chapter;
			})
		);
	};

	const deleteChapterFunction = async (id) => {
		const chapter = chapters.find((chapter) => chapter.id === id);
		let deleted = false;
		await Swal.fire({
			text: 'Excluir Capítulo: ' + chapter.title + '?',
			icon: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'Excluir',
			cancelButtonText: 'Cancelar',
		}).then((result) => {
			if (result.value) {
				deleted = true;
				setChapters(
					chapters.filter((chapter) => {
						return chapter.id !== id;
					})
				);
				handleChapterSelectedSelect(id);
				deleteChapter();
			}
		});
		return deleted;
	};

	return (
		<CustomSlider
			chapters={chapters}
			deleteChapterFunction={deleteChapterFunction}
			updateTitleFunction={updateTitleFunction}
			selectThumbnailFunction={selectThumbnailFunction}
			getPresenterScreenShot={getPresenterScreenShot}
			getPresentationScreenShot={getPresentationScreenShot}
		/>
	);
};

export default Chapters;
