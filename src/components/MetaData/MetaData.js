import React, { useState } from 'react';

import style from './MetaData.module.scss';
import InputFields from './InputFields';
import InputComment from './InputComment';
import InputChip from './InputChip';

const MetaData = ({ title, subtitle, date, local, description, tag }) => {
	const [data] = useState({
		title: title,
		subtitle: subtitle,
		date: date,
		local: local,
		description: description,
		tag: tag,
	});

	return (
		<div className={style.metadata}>
			<form>
				<div>
					<div className={style.container}>
						<InputFields title="Título" type="text" value={data.title} />
						<InputFields title="Subtítulo" type="text" value={data.subtitle} />
						<InputFields title="Data" type="text" value={data.date} />
						<InputFields title="Local" type="text" value={data.local} />
					</div>
					<div className={style.container}>
						<InputComment
							title="Descrição"
							type="text"
							value={data.description}
						/>
						<InputChip title="Tag" type="text" value={data.tag} />
					</div>

					<div className={style.group}></div>
				</div>
			</form>
		</div>
	);
};

export default MetaData;
