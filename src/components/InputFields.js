import React, { useState } from "react";

const InputFields = ({ title, type, value, fowardedRef }) => {


    const [inputValue, setInputValue] = useState(value);

    return (
        <div>
            <label>
                <h4> {title} </h4>
                <h5>
                    < input
                        type={type}
                        name={title}
                        defaultValue={inputValue}
                        onChange={e => { setInputValue(e.target.value); console.log(inputValue) }}
                        ref={fowardedRef}
                    />
                </h5>
            </label>
        </div>

    );
};

export default InputFields;

