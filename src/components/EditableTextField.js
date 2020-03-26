import React, { useState, useEffect } from "react";
import "./EditableTextField.module.css";

const EditableTextField = ({ type, value, updateTitleFunction, chapter }) => {
  const [editable, setEditable] = useState(false);
  const [fieldValue, setFieldValue] = useState(value);
  const [fieldBackupValue, setFieldBackupValue] = useState("");

  const handleInputOnChange = event => {
    setFieldValue(event.target.value);
    updateTitleFunction(chapter.id, event.target.value);
  };

  const handleInputOnBlur = event => {
    setEditable(false);
  };

  const handleInputOnFocus = event => {
    const value = event.target.value;
    event.target.value = "";
    event.target.value = value;
    setFieldBackupValue(fieldValue);
  };

  const handleInputOnKeyUp = event => {
    if (event.key === "Escape") {
      setEditable(false);
      setFieldValue(fieldBackupValue);
      updateTitleFunction(chapter.id, fieldBackupValue)
    }
    if (event.key === "Enter") {
      setEditable(false);
    }
  };

  const handleFieldOnClick = event => {
    setEditable(editable === false);
    console.log("field clicked", editable);
  };

  return (
    <div>
      {editable ? (
        <input
          type={type}
          value={fieldValue}
          className="title-chapter-form"
          autoFocus
          onFocus={handleInputOnFocus}
          onChange={handleInputOnChange}
          onBlur={handleInputOnBlur}
          onKeyUp={handleInputOnKeyUp}
        />
      ) : (
        <span onClick={handleFieldOnClick}>{fieldValue}</span>
      )}
    </div>
  );
};

export default EditableTextField;
