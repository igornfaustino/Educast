
import React, { useState } from 'react';
import * as Showdown from "showdown";
import ReactMde from "react-mde";

// import TextareaAutosize from 'react-textarea-autosize';
import style from './LabelComment.module.scss';
import './react-mde-all.css'

const LabelComment = props => {

    
    const loadSuggestions = text => {
        return new Promise((accept, reject) => {
            
        });
    }

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });

    const [profileState] = useState(props);

    
    const [value, setValue] = React.useState("**Comentário**");
    const [selectedTab, setSelectedTab] = React.useState("write");
    return (
        <div>
            <label>
                <h4> {profileState.title} </h4>

                <div className={profileState.style[1]}>

                    <ReactMde
                        className={profileState.style[0]}
                        value={value}
                        onChange={setValue}
                        selectedTab={selectedTab}
                        minEditorHeight="99px"
                        minPreviewHeight="8000px"
                        maxEditorHeight="2200px"
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={markdown =>
                            Promise.resolve(converter.makeHtml(markdown))
                        }
                        
                        childProps={{
                            writeButton: {
                                tabIndex: -1
                            }
                        }}
                        classes={{
                            reactMde: style['react-mde'],
                            textArea: style['text-area'],
                            preview: style['preview'],
                            toolbar: style['toolbar'],
                            grip: style['grip'],
                        }}
                    />
                    {/* <div className={style["img"]}></div>
                    < TextareaAutosize
                        type={profileState.type}
                        name={profileState.title}
                        defaultValue={profileState.value}
                        className={profileState.style[0]}
                        minRows={profileState.minRows}
                        maxRows={profileState.maxRows}
                    /> */}
                </div>

            </label>
        </div>

    );
};

export default LabelComment;

