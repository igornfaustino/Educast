import React, { useMemo } from 'react';

import { FaVolumeUp, FaVolumeDown, FaVolumeMute } from 'react-icons/fa';

const VolumeButton = ({ volume, className, ...props }) => {
	const volumeIcon = useMemo(() => {
		if (volume > 0.5) return <FaVolumeUp {...props} />;
		if (volume > 0) return <FaVolumeDown {...props} />;
		return <FaVolumeMute {...props} />;
	}, [props, volume]);

	return <span className={className}>{volumeIcon}</span>;
};

export default VolumeButton;
