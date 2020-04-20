
import React, { useState } from 'react';
<<<<<<< HEAD
import * as Showdown from "showdown";
import ReactMde from "react-mde";

import TextareaAutosize from 'react-textarea-autosize';
import style from './LabelComment.module.scss';
import 'react-mde/lib/styles/css/react-mde-all.css';

const LabelComment = props => {
    const loadSuggestions = text => {
        return new Promise((accept, reject) => {
            setTimeout(() => {
                const suggestions = [
                    {
                        preview: "Andre",
                        value: "@andre"
                    },
                    {
                        preview: "Angela",
                        value: "@angela"
                    },
                    {
                        preview: "David",
                        value: "@david"
                    },
                    {
                        preview: "Louise",
                        value: "@louise"
                    }
                ].filter(i => i.preview.toLowerCase().includes(text.toLowerCase()));
                accept(suggestions);
            }, 250);
        });
    }

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    const [profileState] = useState(props);
    const [value, setValue] = React.useState("**Hello world!!!**");
    const [selectedTab, setSelectedTab] = React.useState("write");
=======

import TextareaAutosize from 'react-textarea-autosize';
import style from './LabelComment.module.scss'

const LabelComment = props => {
    const [profileState] = useState(props);
    console.log(profileState.style);
>>>>>>> 1c433ff056756571acdcf089ce7ee5fc2a435da5
    return (
        <div>
            <label>
                <h4> {profileState.title} </h4>
<<<<<<< HEAD

                <div className={profileState.style[1]}>
                    <h5>
                        {/* <ReactMde
                            className={profileState.style[0]}
                            value={value}
                            onChange={setValue}
                            selectedTab={selectedTab}
                            onTabChange={setSelectedTab}
                            generateMarkdownPreview={markdown =>
                                Promise.resolve(converter.makeHtml(markdown))
                            }
                            loadSuggestions={loadSuggestions}
                            childProps={{
                                writeButton: {
                                    tabIndex: -1
                                }
                            }}
                        /> */}
                        <div className={style["img"]}></div>
=======
                <h5>

                    <div className={style["img"]}></div>
>>>>>>> 1c433ff056756571acdcf089ce7ee5fc2a435da5
                    < TextareaAutosize
                        type={profileState.type}
                        name={profileState.title}
                        defaultValue={profileState.value}
<<<<<<< HEAD
                        className={profileState.style[0]}
                        minRows={profileState.minRows}
                        maxRows={profileState.maxRows}
                    />
                    </h5>
                </div>

=======
                        className={profileState.style}
                        minRows={profileState.minRows}
                        maxRows={profileState.maxRows}
                    />
                </h5>
>>>>>>> 1c433ff056756571acdcf089ce7ee5fc2a435da5
            </label>
        </div>

    );
};

export default LabelComment;

