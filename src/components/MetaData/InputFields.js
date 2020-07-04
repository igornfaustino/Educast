import React from 'react';

const InputFields = ({ title, type, value }) => {
	return (
		<div>
			<label>
				<h4> {title} </h4>
				<h5>
					<input
						type={type}
						name={title}
						defaultValue={value}
						onChange={value}
					/>
				</h5>
			</label>
		</div>
	);
};

export default InputFields;
