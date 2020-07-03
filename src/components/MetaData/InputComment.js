import React, { useMemo, useCallback } from "react";
import * as Showdown from "showdown";
import ReactMde from "react-mde";

import style from "./InputComment.module.scss";
import "./react-mde-all.scss";

const InputComment = ({ title, type, value }) => {

    const converter = new Showdown.Converter({
        tables: true,
        simplifiedAutoLink: true,
        strikethrough: true,
        tasklists: true
    });


    const inputClasses = useMemo(() => ({
        reactMde: style["react-mde"],
        textArea: style["text-area"],
        preview: style["preview"],
        toolbar: style["toolbar"],
        grip: style["grip"],
    }), []);


    const childProps = useMemo(() => ({
        writeButton: {
            tabIndex: -1
        }
    }), []);

    const handlerMarkdownPreview = useCallback(
        markdown =>
            Promise.resolve(converter.makeHtml(markdown))
    );

    const [description, setDescription] = React.useState(value);
    const [selectedTab, setSelectedTab] = React.useState("write");
    return (
        <div>
            <label>
                <h4> {title} </h4>

                <div className={style["contentarea-comment"]}>

                    <ReactMde
                        className={style["textarea-comment"]}
                        value={description}
                        onChange={setDescription}
                        selectedTab={selectedTab}
                        minEditorHeight="5%"
                        minPreviewHeight="5%"
                        onTabChange={setSelectedTab}
                        generateMarkdownPreview={handlerMarkdownPreview}
                        childProps={childProps}
                        classes={inputClasses}
                    />
                </div>
            </label>
        </div>

    );
};

export default InputComment;

