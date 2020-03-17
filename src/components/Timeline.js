import React, { useState, useEffect, useMemo } from "react";
import { GiFilmStrip, GiStack } from "react-icons/gi";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import Draggable from "react-draggable";

import cx from "classnames";
import styles from "./Timeline.module.scss";

const Timeline = ({
  videoBoxRef,
  timerDivWidth,
  chapterTimelineRef,
  videoTimelineRef,
  setArrayOfDeltaPositions,
  deltaPosition,
  setDeltaPosition,
  arrayOfDeltaPositions
}) => {
  const createScene = () => {
    // create two objects to hold stick's position
    setArrayOfDeltaPositions(prevState => {
      let tmp = [...prevState];
      tmp.push([
        { x: 0, y: 0 },
        { x: 0, y: 0 }
      ]);
      return [...tmp];
    });
  };

  const handleDrag = (e, ui) => {
    const { x, y } = deltaPosition;

    setDeltaPosition({
      x: x + ui.deltaX,
      y: y + ui.deltaY
    });
  };

  const dynamicHandleDrag = (e, ui, tupleIdx, sceneIdx) => {
    console.log("calling dynamic handle drag");
    // console.log(arrayOfDeltaPositions);
    // console.log(idx);

    if (arrayOfDeltaPositions.length > 0) {
      setArrayOfDeltaPositions(prevState => {
        let tmpArrayDeltaPosition = [...prevState];
        const tuple = tmpArrayDeltaPosition[sceneIdx];
        console.log(tuple);
        tmpArrayDeltaPosition[sceneIdx][tupleIdx] = {
          x: tuple[tupleIdx].x + ui.deltaX,
          y: tuple[tupleIdx].y + ui.deltaY
        };
        return [...tmpArrayDeltaPosition];
      });
    }
  };

  const scenes = useMemo(
    () =>
      arrayOfDeltaPositions.map((scene, idx) => {
        const idxInicio = 0;
        const idxFim = 1;

        const sceneStartBar = (
          <Draggable
            axis="x"
            handle=".handle"
            bounds=".timeline__video-invisible"
            grid={[10, 0]}
            defaultPosition={{ x: deltaPosition.x, y: 0 }}
            onDrag={(e, ui) => {
              dynamicHandleDrag(e, ui, idxInicio, idx);
            }}
          >
            <div
              className={cx("handle", styles["scene-limiter"])}
              style={{
                position: "absolute",
                color: "blue",
                width: "7px",
                top: "0"
              }}
            ></div>
          </Draggable>
        );

        const sceneEndBar = (
          <Draggable
            axis="x"
            handle=".handle"
            bounds=".timeline__video-invisible"
            grid={[10, 0]}
            defaultPosition={{ x: deltaPosition.x + 20, y: 0 }}
            onDrag={(e, ui) => {
              dynamicHandleDrag(e, ui, idxFim, idx);
            }}
          >
            <div
              className={cx("handle", styles["scene-limiter"])}
              style={{
                position: "absolute",
                color: "blue",
                width: "7px",
                top: "0"
              }}
            ></div>
          </Draggable>
        );

        const centerDiv = (
          <div
            className={styles["scene-content"]}
            style={{
              top: "0",
              marginLeft: deltaPosition.x + "px",
              width: arrayOfDeltaPositions[idx]
                ? arrayOfDeltaPositions[idx].x -
                  arrayOfDeltaPositions[idx].x +
                  "px"
                : "20px"
            }}
          >
            Cena 1
          </div>
        );

        return (
          <>
            {sceneStartBar}
            {centerDiv}
            {sceneEndBar}
          </>
        );
      }),
    [arrayOfDeltaPositions]
  );
  return (
    <div className={styles["timeline__wrapper"]}>
      <div className={styles["buttonsWrapper"]}>
        <div className={styles["btnContainer"]} ref={videoBoxRef}>
          <div className={styles["btnContainer__left"]}>
            <GiFilmStrip className={styles["btnContainer__icon"]} />
            <span className={styles["btnContainer__text"]}>Vídeo</span>
          </div>

          <div className={styles["btnContainer__right"]}>
            <FaPlusSquare
              className={styles["btnContainer__button"]}
              onClick={createScene}
            />
            <FaMinusSquare className={styles["btnContainer__button"]} />
          </div>
        </div>

        <div className={styles["btnContainer"]}>
          <div className={styles["btnContainer__left"]}>
            <GiStack className={styles["btnContainer__icon"]} />
            <span className={styles["btnContainer__text--smallMargin"]}>
              Capítulos
            </span>
          </div>

          <div className={styles["btnContainer__right"]}>
            <FaPlusSquare
              className={styles["btnContainer__button"]}
              onClick={createScene}
            />
            <FaMinusSquare className={styles["btnContainer__button"]} />
          </div>
        </div>
      </div>

      <div className={styles["timeline"]}>
        <div
          style={{
            width: timerDivWidth + "px"
          }}
          className={styles["timeline__video-invisible"]}
        >
          <Draggable
            axis="x"
            handle=".handle"
            onDrag={handleDrag}
            bounds=".timeline__video-invisible"
            grid={[10, 0]}
          >
            <div className={cx("handle", styles["blueStick"])}></div>
          </Draggable>
          <div className={styles["timeline__video"]} ref={videoTimelineRef}>
            {scenes}
          </div>

          <div
            className={styles["timeline__chapter"]}
            ref={chapterTimelineRef}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default Timeline;
