import { useState, useCallback } from 'react';

const useModal = () => {
	const [isOpen, setIsOpen] = useState(false);

	const onToggle = useCallback(() => {
		setIsOpen((prevState) => !prevState);
	}, []);

	return {
		isOpen,
		onToggle,
	};
};

export default useModal;
