
import React, { useState, useMemo } from "react";

import ChipInput from "material-ui-chip-input";
import style from "./InputChip.module.scss"

const InputChip = ({title, type, value}) => {
	

	const [tags, setTags] = useState(value);

	const handleAddChip = chip => {
		setTags([
			...tags,
			chip
		]);
	}

	const handleDeleteChip = (chip, index) => {
		console.log(tags);
		tags.splice(index, 1);
		console.log(tags);
	}

	const inputClasses = useMemo(() => ({
		inputRoot: style["input-root"],
		input: style["input"],
		root: style["textarea-tag"],
		chip: style["chip"],
		chipContainer: style["chip-container"]
	}), [])
	
	return (
		<div>
			<label className={style["label"]}>
				<h4> {title} </h4>

				<h5>
					<ChipInput
						variant="standard"
						autoFocus={false}
						name={title}
						disableUnderline={true}
						classes={inputClasses}
						value={tags}
						onAdd={(chip) => handleAddChip(chip)}
						onDelete={(chip, index) => handleDeleteChip(chip, index)}
					/>
				</h5>
			</label>
		</div>

	);
};

export default InputChip;

