import React, { useState, useEffect, useMemo, useReducer } from "react";
import { GiFilmStrip, GiStack } from "react-icons/gi";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import Draggable from "react-draggable";
import TimeIndicator from "./TimeIndicator";

import cx from "classnames";
import styles from "./Timeline.module.scss";

const newHandleDrag = (state, action) => {
  console.log(state.x);
  return { x: state.x + action.desloc };
};

const Timeline = ({
  videoBoxRef,
  timerDivWidth,
  chapterTimelineRef,
  videoTimelineRef,
  setArrayOfDeltaPositions,
  deltaPosition,
  setDeltaPosition,
  arrayOfDeltaPositions,
  videoLength,
  timelineIndicatorRef
}) => {
  const [test, setTest] = useState({ x: 0, y: 0 });
  const [alo, dispatch] = useReducer(newHandleDrag, { x: 0, y: 0 });
  const [test2, setTest2] = useState({ x: 20, y: 0 });

  const testDrag = (e, ui) => {
    // let tmp = { ...test };
    // if (tmp.x >= 100) {
    //   console.log(tmp.x);
    //   console.log("sou maior");
    //   tmp.x = 90;
    // } else {
    //   tmp.x += ui.deltaX;
    //   console.log(tmp);
    // }
    // setTest({ ...tmp });
    // setTest(prevState => {
    //   return { ...prevState };
    // });
    dispatch({ desloc: ui.deltaX });
  };

  useEffect(() => {
    console.log(test);
  }, [test]);

  const createScene = () => {
    // create two objects to hold stick's position
    setArrayOfDeltaPositions(prevState => {
      let tmp = [...prevState];
      tmp.push([
        { x: deltaPosition.x, y: 0 },
        { x: deltaPosition.x + 20, y: 0 }
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

  // useEffect(() => {
  //   console.log(arrayOfDeltaPositions);
  //   console.log(scenes);
  // }, [arrayOfDeltaPositions]);

  const dynamicHandleDrag = (e, ui, tupleIdx, sceneIdx) => {
    // change the stick's position
    if (arrayOfDeltaPositions.length > 0) {
      setArrayOfDeltaPositions(prevState => {
        let tmpArrayDeltaPosition = [...prevState];
        const tuple = tmpArrayDeltaPosition[sceneIdx];
        // console.log(tuple);

        if (
          tmpArrayDeltaPosition.some((val, idx) => {
            if (idx !== sceneIdx) {
              return (
                tuple[tupleIdx].x + ui.deltaX >= val[0].x &&
                tuple[tupleIdx].x + ui.deltaX <= val[1].x
              );
            }
            return false;
          })
        ) {
          // console.log([...tmpArrayDeltaPosition]);
          // alert("conflito");
          return [...tmpArrayDeltaPosition];
        }

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
      arrayOfDeltaPositions.map((position, idx) => {
        const idxInicio = 0;
        const idxFim = 1;

        const sceneStartBar = (
          <Draggable
            axis="x"
            handle=".handle"
            bounds=".timeline__video-invisible"
            grid={[10, 0]}
            defaultPosition={{ x: deltaPosition.x, y: 0 }}
            position={alo}
            onDrag={testDrag}
            // onDrag={(e, ui) => {
            //   dynamicHandleDrag(e, ui, idxInicio, idx);
            // }}
          >
            <div
              className={cx("handle", styles["scene-limiter"])}
              style={{
                position: "absolute",
                color: "blue",
                width: "7px",
                top: "0",
                zIndex: 300
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
            // defaultPosition={{ x: deltaPosition.x + 20, y: 0 }}
            position={position[idxFim]}
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
              marginLeft: arrayOfDeltaPositions[idx][0].x + 7 + "px", // 7 is the scene-limiter width
              width:
                arrayOfDeltaPositions[idx][1].x -
                arrayOfDeltaPositions[idx][0].x +
                // + 20 coz of the second scene's default position
                "px"
            }}
          >
            Cena {idx + 1}
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
        <div className={styles["blackbox"]} />

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

        <div className={styles["btnContainer"]} style={{}}>
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

      <div className={styles["timeline"]} ref={videoTimelineRef}>
        <div
          style={{
            width: timerDivWidth + 34 + "px"
          }}
          className={styles["timeline__video-invisible"]}
        >
          <TimeIndicator
            timelineIndicatorRef={timelineIndicatorRef}
            videoLength={videoLength}
          />
          <div className={styles["timeline__video"]}>{scenes}</div>

          <div
            className={styles["timeline__chapter"]}
            ref={chapterTimelineRef}
          ></div>
        </div>
        <Draggable
          axis="x"
          handle=".handle"
          onDrag={handleDrag}
          bounds=".timeline__video-invisible"
          grid={[10, 0]}
        >
          <div className={cx("handle", styles["blueStick"])}></div>
        </Draggable>
      </div>
    </div>
  );
};

export default Timeline;
