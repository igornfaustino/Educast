import React, { useState } from "react";
import ImageUploader from "react-images-upload";

const ImageUpload = ({ props }) => {
  const [pictures, setPictures] = useState([]);

  const onDrop = (picture) => {
    setPictures(pictures.concat(picture));
    console.log(pictures)
  };

  return (
    <ImageUploader
      {...props}
      withIcon={true}
      onChange={onDrop}
      imgExtension={[".jpg", ".gif", ".png", ".gif"]}
      maxFileSize={10000000}
    />
  );
};

export default ImageUpload;
