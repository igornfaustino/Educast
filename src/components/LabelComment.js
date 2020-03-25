
import React, { useState } from 'react';

import TextareaAutosize from 'react-textarea-autosize';

const LabelComment = props => {
    const [profileState] = useState(props);
    return (
        <div>
            <label>
                <h4> {profileState.title} </h4>
                <h5>
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

