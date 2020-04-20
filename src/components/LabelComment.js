
import React, { useState } from 'react';

import TextareaAutosize from 'react-textarea-autosize';
import style from './LabelComment.module.scss'

const LabelComment = props => {
    const [profileState] = useState(props);
    console.log(profileState.style);
    return (
        <div>
            <label>
                <h4> {profileState.title} </h4>
                <h5>

                    <div className={style["img"]}></div>
                    < TextareaAutosize
                        type={profileState.type}
                        name={profileState.title}
                        defaultValue={profileState.value}
                        className={profileState.style}
                        minRows={profileState.minRows}
                        maxRows={profileState.maxRows}
                    />
                </h5>
            </label>
        </div>

    );
};

export default LabelComment;

