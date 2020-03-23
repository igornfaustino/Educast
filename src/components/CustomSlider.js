import React, { useState, useEffect } from 'react';

import Carousel from 'react-multi-carousel';
import CustomCard from './CustomCard'

import 'react-multi-carousel/lib/styles.css';
import './CustomSlider.css';

// name, type, value
const CustomSlider = ({ name, customArrows, cards, deleteFunction}) => {

  const cardsToShow = () => {
    return (
      cards.map(card => 
        <CustomCard key={card.id} chapterId={card.id} deleteFunction={() => deleteFunction(card.id)}></CustomCard>
      )
    )
  }

  return (
    <Carousel
      additionalTransfrom={0}
      arrows
      // autoPlaySpeed={3000}
      centerMode={true}
      className=""
      infinite={false}
      containerClass="container"
      // customLeftArrow={<CustomLeftArrow />}
      // customRightArrow={<CustomRightArrow />}
      // dotListClass=""
      // draggable
      focusOnSelect={false}
      itemClass=""
      keyBoardControl
      // minimumTouchDrag={80}
      renderButtonGroupOutside={true}
      // renderDotsOutside={true}
      responsive={{
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
      }}
      sliderClass=""
      slidesToSlide={1}
      // swipeable={true}
    >
    {cardsToShow()}
    </Carousel>
  )
}

export default CustomSlider
