import React, { useState } from 'react';
import Input from '@material-ui/core/Input';
import styles from './EditableTextField.module.css';

const EditableTextField = ({ type, value, updateTitleFunction, chapter, isTextFieldBeingEdited }) => {
	const [editable, setEditable] = useState(false);
	const [fieldValue, setFieldValue] = useState(value);
	const [fieldBackupValue, setFieldBackupValue] = useState('');

	const handleInputOnChange = (event) => {
		setFieldValue(event.target.value);
		updateTitleFunction(chapter.id, event.target.value);
	};

	const handleInputOnBlur = (event) => {
		setEditable(false);
		isTextFieldBeingEdited(false);
	};

	const handleInputOnFocus = (event) => {
		const value = event.target.value;
		event.target.value = '';
		event.target.value = value;
		setFieldBackupValue(fieldValue);
	};

	const handleInputOnKeyUp = (event) => {
		if (event.key === 'Escape') {
			setEditable(false);
			isTextFieldBeingEdited(false);
			setFieldValue(fieldBackupValue);
			updateTitleFunction(chapter.id, fieldBackupValue);
		}
		if (event.key === 'Enter') {
			setEditable(false);
			isTextFieldBeingEdited(false);
		}
	};

	const handleFieldOnClick = (event) => {
		setEditable(editable === false);
		isTextFieldBeingEdited(editable === false);
		console.log('field clicked', editable);
	};

	return (
		<div>
			{editable ? (
				<Input
					id="chapter-title"
					type={type}
					value={fieldValue}
					className={styles['editable-textfield']}
					autoFocus
					multiline={true}
					onFocus={handleInputOnFocus}
					onChange={handleInputOnChange}
					onBlur={handleInputOnBlur}
					onKeyUp={handleInputOnKeyUp}
					rowsMax={2}
					// value={values.weight}
					// onChange={handleChange('weight')}
					// endAdornment={<InputAdornment position="end">Kg</InputAdornment>}
					inputProps={{
						'aria-label': 'title',
					}}
				/>
			) : (
				<div className={styles['textfield-label']} onClick={handleFieldOnClick}>
					{fieldValue}
				</div>
			)}
		</div>
	);
};

export default EditableTextField;
