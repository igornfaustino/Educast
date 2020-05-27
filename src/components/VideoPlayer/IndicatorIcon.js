import React, { useMemo } from 'react';
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
	invisible: <FaEyeSlash size="1.5rem" />,
	visible: <FaEye size="1.5rem" />,
};

const IndicatorIcon = ({ className, type, onClick }) => {
	const iconClass = useMemo(
		() =>
			type === 'visible' || type === 'invisible'
				? cx(className, styles.action)
				: className,
		[className, type]
	);

	const renderIcon = useMemo(() => ICONS[type], [type]);

	return (
		<div className={iconClass} onClick={onClick}>
			{renderIcon}
		</div>
	);
};

export default IndicatorIcon;
