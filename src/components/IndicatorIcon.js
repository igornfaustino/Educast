import React, { useMemo, useState, useCallback } from 'react';
import cx from 'classnames';
import {
	FaImages,
	FaChalkboardTeacher,
	FaEyeSlash,
	FaEye,
} from 'react-icons/fa';
import styles from './IndicatorIcon.module.scss';

const ICONS = {
	presentation: <FaImages size="1.5rem" />,
	presenter: <FaChalkboardTeacher size="1.5rem" />,
};

const IndicatorIcon = ({ className, type, onClick, visible = true }) => {
	const [isHover, setIsHover] = useState(false);

	const iconClass = useMemo(
		() => (isHover ? cx(className, styles.action) : className),
		[className, isHover]
	);

	const visibleIcon = useMemo(
		() => (visible ? <FaEyeSlash size="1.5rem" /> : <FaEye size="1.5rem" />),
		[visible]
	);

	const renderIcon = useMemo(() => (isHover ? visibleIcon : ICONS[type]), [
		isHover,
		type,
		visibleIcon,
	]);

	const handleMouseLeave = useCallback(() => setIsHover(false), []);
	const handleMouseEnter = useCallback(() => setIsHover(true), []);

	return (
		<div
			className={iconClass}
			onMouseLeave={handleMouseLeave}
			onMouseEnter={handleMouseEnter}
			onClick={onClick}
		>
			{renderIcon}
		</div>
	);
};

export default IndicatorIcon;
