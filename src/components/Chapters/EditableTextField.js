import React, { useState, useCallback, useMemo } from 'react';

import Input from '@material-ui/core/Input';

import styles from './EditableTextField.module.scss';

const EditableTextField = ({
	type,
	value,
	updateTitleFunction,
	chapter,
	isTextFieldBeingEdited,
}) => {
	const [editable, setEditable] = useState(false);
	const [fieldValue, setFieldValue] = useState(value);
	const [fieldBackupValue, setFieldBackupValue] = useState('');

	const handleInputOnChange = useCallback((event) => {
		setFieldValue(event.target.value);
	}, []);

	const handleInputOnBlur = useCallback(() => {
		setEditable(false);
		isTextFieldBeingEdited(false);
		updateTitleFunction(chapter.id, fieldValue);
	}, [chapter.id, fieldValue, isTextFieldBeingEdited, updateTitleFunction]);

	const handleInputOnFocus = useCallback(
		(event) => {
			const value = event.target.value;
			event.target.value = '';
			event.target.value = value;
			setFieldBackupValue(fieldValue);
		},
		[fieldValue]
	);

	const handleInputOnKeyUp = useCallback(
		(event) => {
			if (event.key === 'Escape') {
				setEditable(false);
				isTextFieldBeingEdited(false);
				setFieldValue(fieldBackupValue);
				updateTitleFunction(chapter.id, fieldBackupValue);
			}
			if (event.key === 'Enter') {
				setEditable(false);
				isTextFieldBeingEdited(false);
				updateTitleFunction(chapter.id, fieldValue);
			}
		},
		[
			chapter.id,
			fieldBackupValue,
			fieldValue,
			isTextFieldBeingEdited,
			updateTitleFunction,
		]
	);

	const handleFieldOnClick = useCallback(() => {
		setEditable(editable === false);
		isTextFieldBeingEdited(editable === false);
	}, [editable, isTextFieldBeingEdited]);

	const textField = useMemo(
		() =>
			editable ? (
				<Input
					id="chapter-title"
					type={type}
					value={fieldValue}
					className={styles['editable-textField']}
					autoFocus
					multiline={true}
					onFocus={handleInputOnFocus}
					onChange={handleInputOnChange}
					onBlur={handleInputOnBlur}
					onKeyUp={handleInputOnKeyUp}
					rowsMax={2}
					inputProps={{
						'aria-label': 'title',
						maxLength: 50,
					}}
				/>
			) : (
				<div className={styles['textField-label']} onClick={handleFieldOnClick}>
					{fieldValue}
				</div>
			),
		[
			editable,
			fieldValue,
			handleFieldOnClick,
			handleInputOnBlur,
			handleInputOnChange,
			handleInputOnFocus,
			handleInputOnKeyUp,
			type,
		]
	);

	return <div>{textField}</div>;
};

export default EditableTextField;
