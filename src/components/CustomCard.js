import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import {
  FaUpload,
  FaImages,
  FaTimes,
  FaChalkboardTeacher,
  FaImage
} from "react-icons/fa";
import Box from "@material-ui/core/Box";
import EditableTextField from "./EditableTextField";
import styles from "./CustomCard.module.css";
import videojs from "video.js";

const useStyles = makeStyles({
  root: {
    maxWidth: "210px"
  },
  media: {
    height: 140,
    width: "100%",
    position: "relative"
  },
  title: {
    fontSize: 17
  },
  deleteButton: {
    float: "center",
    maxWidth: "25px",
    maxHeight: "25px",
    minWidth: "25px",
    minHeight: "25px",
    paddingRight: "4px",
    paddingTop: "3px",
    color: "#12AADA",
    background: "white",
    "&:hover": {
      color: "#12AADA",
      background: "#EDD9FF"
    }
  },
  thumbnailButton: {
    maxWidth: "30px",
    maxHeight: "30px",
    minWidth: "30px",
    minHeight: "30px",
    paddingRight: "4px",
    paddingLeft: "15px",
    color: "#12AADA",
    background: "white",
    "&:hover": {
      color: "#12AADA",
      background: "#EDD9FF"
    }
  },
  cardHeader: {
    background: "#12AADA",
    color: "white",
    padding: "12px"
  },
  cardActions: {
    background: "#F3E9FC"
  }
});

// Temporary functions
function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(
  require.context("../sampleImages/", false, /\.(png|jpe?g|svg)$/)
);

const CustomCard = ({
  chapter,
  deleteChapterFunction,
  updateTitleFunction,
  selectThumbnailFunction
}) => {
  const [imageFile, setImageFile] = useState("");
  const [thumbnailImage, setThumbnailImage] = useState("");
  const classes = useStyles();
  const [video, setVideo] = useState('');
  // const video = document.querySelector("video");
  // const canvas = document.querySelector("canvas");
  // const context = canvas.getContext("2d");
  // var w, h, ratio;
  // //add loadedmetadata which will helps to identify video attributes......
  // video.addEventListener(
  //   "loadedmetadata",
  //   function() {
  //     ratio = video.videoWidth / video.videoHeight;
  //     w = video.videoWidth - 100;
  //     h = parseInt(w / ratio, 10);
  //     canvas.width = w;
  //     canvas.height = h;
  //     console.log(w);
  //   },
  //   false
  // );

  useEffect(() => {
    setThumbnailImage(images[0]); //select presentation snapshot by default
    const video = document.querySelector('video');
    const vv = videojs(video, function onPlayerReady() {
      console.log('onPlayerReady')
    });
    
    setVideo(vv);
  }, []);

  const handleThumbnailSelection = path => {
    selectThumbnailFunction(chapter.id, path);
    if (path === "primary") {
      chapter.thumbnail = "primary";
      setThumbnailImage(images[0]); //extract snapshot
    } else if (path === "secondary") {
      chapter.thumbnail = "secondary";
      setThumbnailImage(images[1]); //extract snapshot
    } else {
      chapter.thumbnail = path;
      setThumbnailImage(images[2]); //upload function/import image in path
    }
  };

  const extractVideoSnapshot = () => {
    //us
    console.log("snapshoted");
    // context.fillRect(0, 0, w, h);
    // context.drawImage(video, 0, 0, w, h);
  };

  return (
    <Card className={classes.root} square={true}>
      <CardHeader
        className={classes.cardHeader}
        title={
          <Typography className={classes.title} variant="h5" component="h5">
            Capítulo {chapter.id}
          </Typography>
        }
        action={
          <Button
            key={chapter.id}
            variant="contained"
            color="secondary"
            className={classes.deleteButton}
            startIcon={<FaTimes />}
            onClick={deleteChapterFunction}
          />
        }
      />
      <CardMedia
        className={classes.media}
        image={thumbnailImage}
        title={"burger"}
      >
        <Box position="absolute" top="5%" left="85%">
          <Button
            className={classes.thumbnailButton}
            startIcon={<FaImages />}
            onClick={() => handleThumbnailSelection("primary")}
          />
        </Box>
        <Box position="absolute" top="30%" left="85%">
          <Button
            className={classes.thumbnailButton}
            startIcon={<FaChalkboardTeacher />}
            onClick={() => handleThumbnailSelection("secondary")}
          />
        </Box>
        <Box position="absolute" top="55%" left="85%">
          <Button
            key={chapter.id}
            className={classes.thumbnailButton}
            startIcon={<FaUpload />}
            onClick={() => handleThumbnailSelection("upload")}
          />
        </Box>
        <Box position="absolute" top="80%" left="85%">
          <Button
            key={chapter.id}
            className={classes.thumbnailButton}
            startIcon={<FaImage />}
            onClick={() => extractVideoSnapshot()}
          />
        </Box>
      </CardMedia>
      <div className={classes.cardActions}>
        <div className={styles["CustomCard__TimeLabel"]}>
          In {chapter.initTime}::{chapter.finalTime}
        </div>
        <EditableTextField
          type="text"
          value={chapter.title}
          updateTitleFunction={updateTitleFunction}
          chapter={chapter}
        />
      </div>
    </Card>
  );
};

export default CustomCard;
