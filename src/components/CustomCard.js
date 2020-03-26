import React, {useState} from 'react';
import {makeStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { FaUpload, FaImages, FaTimes, FaChalkboardTeacher } from 'react-icons/fa';
import Box from '@material-ui/core/Box';
import EditableTextField from './EditableTextField'
import styles from './CustomCard.module.css'

const useStyles = makeStyles({
  root: {
    maxWidth: '210px',
  },
  media: {
    height: 140,
    width: '100%',
    position: 'relative',
  },
  title: {
    fontSize: 17,
  },
  deleteButton: {
    float: 'center',
    maxWidth: '25px',
    maxHeight: '25px',
    minWidth: '25px',
    minHeight: '25px',
    paddingRight: '4px',
    paddingTop: '3px',
    color: '#12AADA',
    background: 'white',
    "&:hover": {
      color: "#12AADA",
      background: "#EDD9FF"
    }
  },
  thumbnailButton: {
    maxWidth: '30px',
    maxHeight: '30px',
    minWidth: '30px',
    minHeight: '30px',
    paddingRight: '4px',
    paddingLeft: '15px',
    color: '#12AADA',
    background: 'white',
    "&:hover": {
      color: "#12AADA",
      background: "#EDD9FF"
    }
  },
  cardHeader: {
    background: '#12AADA',
    color: 'white',
    padding: '12px',
  },
  cardActions: {
    background: '#F3E9FC'
  }
});

// Temporary functions
function importAll(r) {
  return r.keys().map(r);
}
const images = importAll(require.context('../sampleImages/', false, /\.(png|jpe?g|svg)$/));

const CustomCard = ({ chapter, deleteChapterFunction, updateTitleFunction }) => {
  const [imageFile, setImageFile] = useState('');
  const classes = useStyles();

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
        image={images[1]}
        title={'burger'}
      >
        <Box
          position="absolute"
          top="5%"
          left="85%"
        >
          <Button className={classes.thumbnailButton} startIcon={<FaImages />} />
        </Box>
        <Box
          position="absolute"
          top="30%"
          left="85%"
        >
          <Button className={classes.thumbnailButton} startIcon={<FaChalkboardTeacher />} />
        </Box>
        <Box
          position="absolute"
          top="55%"
          left="85%"
        >
          <Button key={chapter.id} className={classes.thumbnailButton} startIcon={<FaUpload />} />
        </Box>
      </CardMedia>
      <div className={classes.cardActions}>
        <div className={styles['CustomCard__TimeLabel']}>
          In {chapter.initTime}::{chapter.finalTime}
        </div>
        <EditableTextField type='text'
                           value={chapter.title}
                           updateTitleFunction={updateTitleFunction}
                           chapter={chapter}
        />
      </div>
    </Card>
  );
}

export default CustomCard
