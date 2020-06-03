
import React, { useState } from 'react';

import TextareaAutosize from 'react-textarea-autosize';
import ChipInput from 'material-ui-chip-input';
import { makeStyles } from '@material-ui/core/styles';
import style from './LabelChip.module.scss'

const LabelChip = props => {
	const [profileState] = useState(props);

	const useStyles = makeStyles({
		input: style['textarea-tag'],
		chip: {
			backgroundColor: 'white',
			width: '100%'
		},
	});

	return (
		<div>
			<label className={style['label']}>
				<h4> {profileState.title} </h4>
				{/* <h5>
					< TextareaAutosize
						type={profileState.type}
						minRows={profileState.minRows}
						maxRows={profileState.maxRows}
					/>
				</h5> */}

				<h5>
					<ChipInput
						variant="standard"
						autoFocus={false}
						name={profileState.title}
						disableUnderline='false'
						defaultValue={profileState.value}
						classes={{
							inputRoot: style['input-root'],
							input: style['input'],
							root: style['textarea-tag'],

							chip: style['chip'],
							chipContainer: style['chip-container']
						}}
						maxRows="1"
					/>
				</h5>
			</label>
		</div>

	);
};

export default LabelChip;

