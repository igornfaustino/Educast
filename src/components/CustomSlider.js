import React from 'react';
import Carousel from 'react-multi-carousel';
import CustomCard from './CustomCard'
import 'react-multi-carousel/lib/styles.css';
import './CustomSlider.module.css';

const CustomSlider = ({ chapters, deleteChapterFunction, updateTitleFunction, selectThumbnailFunction }) => {
  const cardsToShow = () => {
    return (
      chapters.map(chapter => 
        <CustomCard key={chapter.id}
                    chapter={chapter} 
                    deleteChapterFunction={() => deleteChapterFunction(chapter.id)}
                    updateTitleFunction={updateTitleFunction}
                    selectThumbnailFunction={selectThumbnailFunction}
        >
        </CustomCard>
      )
    )
  }

  const responsive = {
    desktop: {
      breakpoint: {
        max: 3000,
        min: 1024
      },
      items: 4,
      partialVisibilityGutter: 40
    },
    mobile: {
      breakpoint: {
        max: 464,
        min: 0
      },
      items: 1,
      partialVisibilityGutter: 30
    },
    tablet: {
      breakpoint: {
        max: 1024,
        min: 464
      },
      items: 2,
      partialVisibilityGutter: 30
    }
  }

  return (
    <Carousel
      additionalTransfrom={0}
      arrows
      centerMode={true}
      className=""
      infinite={false}
      containerClass="container"
      focusOnSelect={false}
      itemClass=""
      keyBoardControl
      renderButtonGroupOutside={true}
      responsive={responsive}
      sliderClass=""
      slidesToSlide={1}
    >
    {cardsToShow()}
    </Carousel>
  )
}

export default CustomSlider
