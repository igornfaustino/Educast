
import React, { useState } from 'react';
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
    return (
        <div>
            <label>
                <h4> {profileState.title} </h4>

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
                    < TextareaAutosize
                        type={profileState.type}
                        name={profileState.title}
                        defaultValue={profileState.value}
                        className={profileState.style[0]}
                        minRows={profileState.minRows}
                        maxRows={profileState.maxRows}
                    />
                    </h5>
                </div>

            </label>
        </div>

    );
};

export default LabelComment;

