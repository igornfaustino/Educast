import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ButtonToggle, ButtonGroup } from 'reactstrap';
import './Tabs.scss';
import { FaTags, FaBuffer, FaImage } from 'react-icons/fa';
import { FiScissors } from 'react-icons/fi';
import { IoIosFolderOpen } from 'react-icons/io';
import { MdChat } from 'react-icons/md';
import RouteContentArea from './ContentArea';
import { useHistory } from 'react-router-dom';

function Tabs({
	step,
	setStep,
	getPresenterScreenShot,
	getPresentationScreenShot,
}) {
	let history = useHistory();
	const [buttons, setButtons] = useState([
		{
			title: 'Metadados',
			icon: <FaTags className="icon-btn" size="1.25rem" />,
			active: true,
			path: '/',
		},
		{
			title: 'Edição',
			icon: <FiScissors className="icon-btn" size="1.25rem" />,
			active: false,
			path: '/editor',
		},
		{
			title: 'Capítulos',
			icon: <FaBuffer className="icon-btn" size="1.25rem" />,
			active: false,
			path: '/chapters',
		},
		{
			title: 'Documentos',
			icon: <IoIosFolderOpen className="icon-btn" size="1.25rem" />,
			active: false,
			path: '/documents',
		},
		{
			title: 'Branding',
			icon: <FaImage className="icon-btn" size="1.25rem" />,
			active: false,
			path: '/branding',
		},
		{
			title: 'Legendas',
			icon: <MdChat className="icon-btn" size="1.25rem" />,
			active: false,
			path: '/subtitles',
		},
	]);

	const updateActiveButton = useCallback(
		(path) => {
			let _path = path;
			let index = buttons.findIndex((b) => b.path === _path);
			if (index === -1) {
				index = 0;
				_path = '/'; // update unexpected path for one that is expected
			}
			setStep(index);
			setButtons(
				buttons.map((b) =>
					b.path === _path ? { ...b, active: true } : { ...b, active: false }
				)
			);
		},
		[buttons, setStep]
	);

	useEffect(() => {
		const path = window.location.pathname;
		updateActiveButton(path);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []); // must not put the dependencies here to avoid infinite loop

	const onButtonClick = useCallback(
		(element) => {
			const index =
				typeof element == 'object'
					? buttons.findIndex((e) => e.title === element.title)
					: element;
			const path = buttons[index].path;
			history.push(buttons[index].path);
			updateActiveButton(path);
		},
		[buttons, history, updateActiveButton]
	);

	const renderTabButtons = useMemo(
		() =>
			buttons.map((element) => {
				return (
					<ButtonToggle
						key={element.title}
						active={element.active}
						className="btn-tab app-buttons"
						onClick={() => onButtonClick(element)}
					>
						{element.icon}
						<span>{element.title}</span>
					</ButtonToggle>
				);
			}),
		[buttons, onButtonClick]
	);

	return (
		<div className="full tabs">
			<ButtonGroup className="container-buttons-tab">
				{renderTabButtons}
			</ButtonGroup>
			<ButtonGroup></ButtonGroup>
			<div className="container-tabs-content">
				<RouteContentArea
					getPresenterScreenShot={getPresenterScreenShot}
					getPresentationScreenShot={getPresentationScreenShot}
				/>
			</div>
		</div>
	);
}

export default Tabs;
