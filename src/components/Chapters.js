import React, { useState, useEffect } from 'react'

import Swal from 'sweetalert2'
// import withReactContent from 'sweetalert2-react-content'
import CustomSlider from './CustomSlider'
import ImageUpload from './ImageUpload'

// import './S.css'

const Chapters = () => {
  const [chapters, setChapters] = useState([])

  const initialChapters = [
    {
      id: 1,
      initTime: 1,
      finalTime: 2,
      title: 'Chapter 1',
      thumbnail: 'primaryScreen'
    },
    {
      id: 2,
      initTime: 2,
      finalTime: 3,
      title: 'Chapter 2',
      thumbnail: 'primaryScreen'
    },
    {
      id: 3,
      initTime: 3,
      finalTime: 4,
      title: 'Chapter 3',
      thumbnail: 'primaryScreen'
    },
    {
      id: 4,
      initTime: 4,
      finalTime: 5,
      title: 'Chapter 4',
      thumbnail: 'primaryScreen'
    },
    {
      id: 5,
      initTime: 5,
      finalTime: 6,
      title: 'Chapter 5',
      thumbnail: 'primaryScreen'
    }
  ]

  useEffect(() => {
    setChapters(initialChapters)
  }, [])

  const selectThumbnail = (id, action) => {
    console.log(id,' different thumbnail selected')
    setChapters(chapters.filter(chapter => {
      if (chapter.id === id) {
        chapter.thumbnail = action
      }
      return chapter
    }))
  }

  const handleTitleChange = (event) => {
    // how should i do this
  }

  const deleteChapter = (id) => {
    const chapter = chapters.find(chapter => chapter.id === id)
    Swal.fire({
      text: 'Excluir Capítulo: ' + chapter.title + '?',
      // text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Excluir'
    }).then((result) => {
      if (result.value) {
        setChapters(chapters.filter(chapter => {
          return chapter.id !== id
        }))
        Swal.fire(
          'Capítulo Excluído!'
        )
      }
    })
  }

  return (
    <div className="sliderr">
      <CustomSlider name='slider' cards={chapters} deleteFunction={deleteChapter}></CustomSlider>
      <ImageUpload></ImageUpload>
    </div>
  )
}

export default Chapters
