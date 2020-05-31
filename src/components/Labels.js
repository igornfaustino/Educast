import React, { useState } from 'react';

const Labels = props => {
    const [profileState] = useState(props);
    return (
        <div>
            <label>
                <h4> {profileState.title} </h4>
                <h5>
                    < input
                        type={profileState.type}
                        name={profileState.title}
                        defaultValue={profileState.value}
                    />
                </h5>
            </label>
        </div>

    );
};

export default Labels;

