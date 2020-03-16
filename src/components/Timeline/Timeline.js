import React, { useState, useEffect, useMemo } from "react";
import { GiFilmStrip, GiStack } from "react-icons/gi";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { MdZoomIn, MdZoomOut } from "react-icons/md";
import Draggable from "react-draggable";

import "./Timeline.css";

const videoLength = 200;

const Timeline = () => {
  const videoBoxRef = useState(React.createRef())[0];

  const mainScrollbarRef = useState(React.createRef())[0];
  const [chapterTimelineRef, setChapterTimelineRef] = useState(
    React.createRef()
  );
  const [videoTimelineRef, setVideoTimelineRef] = useState(React.createRef());
  const [timelineIndicatorRef, setTimelineIndicatorRef] = useState(
    React.createRef()
  );

  const testRef = useState(React.createRef())[0];
  const testRef2 = useState(React.createRef())[0];

  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const [arrayOfDeltaPositions, setArrayOfDeltaPositions] = useState([]);

  const timerDivWidth = useState(videoLength * 10)[0];

  const [startWidth, setStartWidth] = useState(0); // left offset to position the first white bar

  useEffect(() => {
    // console.log(testRef.current);
    // console.log(videoBoxRef.current.getBoundingClientRect());
    // console.log(videoTimelineRef.current.getBoundingClientRect());
    setStartWidth(videoBoxRef.current.getBoundingClientRect().width);

    // listen to window resize so that the first white bar change its position based on video box width
    window.addEventListener("resize", () => {
      setStartWidth(videoBoxRef.current.getBoundingClientRect().width);
    });
  }, []);

  // handle drag of main pauzinho
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
        console.log("DENTRO DO USE MEMO");
        const idxInicio = 0;
        const idxFim = 1;

        const sceneStartBar = (
          <Draggable
            axis="x"
            handle=".handle"
            bounds=".timeline__video"
            grid={[10, 0]}
            defaultPosition={{ x: deltaPosition.x, y: 0 }}
            ref={testRef}
            onDrag={(e, ui) => {
              dynamicHandleDrag(e, ui, idxInicio, idx);
            }}
          >
            <div
              className="handle scene-limiter"
              style={{ position: "absolute", color: "blue", width: "7px" }}
            ></div>
          </Draggable>
        );

        const sceneEndBar = (
          <Draggable
            axis="x"
            handle=".handle"
            bounds=".timeline__video"
            grid={[10, 0]}
            defaultPosition={{ x: deltaPosition.x + 20, y: 0 }}
            ref={testRef2}
            onDrag={(e, ui) => {
              dynamicHandleDrag(e, ui, idxFim, idx);
            }}
          >
            <div
              className="handle scene-limiter"
              style={{ position: "absolute", color: "blue", width: "7px" }}
            ></div>
          </Draggable>
        );

        const centerDiv = (
          <div
            className="scene-content"
            style={{
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

  // useEffect(() => {
  //   for (let i = 0; i <= videoLength; i++) {
  //     // get the final margin left which is the full div's width
  //     if (i === videoLength) {
  //       setTimerDivWidth(i * 10);
  //     }
  //   }
  // }, []);

  // format timers
  const str_pad_left = (string, pad, length) => {
    return (Array(length + 1).join(pad) + string).slice(-length);
  };

  // create the timer box elements like white bars and timers
  const generateVerticalWhiteBarsAndTimers = videoLength => {
    let arrayOfWhiteBarsAndTimers = [];

    for (let i = 0; i <= videoLength; i = i + 1) {
      // check if i is multiple of 10
      if (i % 10 === 0) {
        // create the timer
        var hours = Math.floor(i / 3600);
        var minutes = Math.floor(i / 60);
        var seconds = i - minutes * 60;
        // seconds = i - hours * 3600;

        arrayOfWhiteBarsAndTimers.push(
          <span
            style={{
              bottom: 15,
              position: "absolute",
              marginLeft: i * 10 - 27 + "px",
              zIndex: 50
            }}
          >{`${str_pad_left(hours, "0", 2)}:${str_pad_left(
            minutes,
            "0",
            2
          )}:${str_pad_left(seconds, "0", 2)}`}</span>
        );

        // insert a bigger white bar
        arrayOfWhiteBarsAndTimers.push(
          <div
            className="timer-vertical-whitebar big"
            style={{
              marginLeft: i * 10 + "px"
            }}
          ></div>
        );
      } else {
        if (i === 0) {
          arrayOfWhiteBarsAndTimers.push(
            <div
              className="timer-vertical-whitebar"
              style={{
                marginLeft: 0 + "px"
              }}
            ></div>
          );
        } else {
          arrayOfWhiteBarsAndTimers.push(
            <div
              className="timer-vertical-whitebar"
              style={{
                marginLeft: i * 10 + "px"
              }}
            ></div>
          );
        }
      }
    }

    return React.Children.toArray(arrayOfWhiteBarsAndTimers);
  };

  const handleScroll = () => {
    const tmp = timelineIndicatorRef;
    const tmp2 = videoTimelineRef;
    const tmp3 = chapterTimelineRef;

    tmp.current.scrollLeft = mainScrollbarRef.current.scrollLeft;
    tmp2.current.scrollLeft = mainScrollbarRef.current.scrollLeft;
    tmp3.current.scrollLeft = mainScrollbarRef.current.scrollLeft;

    setTimelineIndicatorRef(tmp);
    setVideoTimelineRef(tmp2);
    setChapterTimelineRef(tmp3);
  };

  return (
    <div>
      <h1 style={{ marginTop: "0px" }}>x: {deltaPosition.x}</h1>

      <div className="test-header" style={{ marginTop: "100px" }}>
        <div className="timeIndicator--blackbox"> </div>
        <div className="timeline__timeIndicator" ref={timelineIndicatorRef}>
          <div style={{ display: "flex" }} className="timeIndicator__container">
            {generateVerticalWhiteBarsAndTimers(videoLength)}
          </div>
        </div>
      </div>

      <div className="test-timeline">
        <div className="btnContainer" ref={videoBoxRef}>
          <div className="btnContainer__left">
            <GiFilmStrip className="btnContainer__icon" />
            <span className="btnContainer__text">Vídeo</span>
          </div>

          <div className="btnContainer__right">
            <FaPlusSquare
              className="btnContainer__button"
              onClick={createScene}
            />
            <FaMinusSquare className="btnContainer__button" />
          </div>
        </div>

        <div className="timeline__video" ref={videoTimelineRef}>
          <div
            style={{
              height: "100%",
              width: timerDivWidth + "px",
              backgroundColor: "transparent"
            }}
            className="timeline__video-invisible"
          ></div>

          <Draggable
            axis="x"
            handle=".handle"
            onDrag={handleDrag}
            bounds=".timeline__video-invisible"
            grid={[10, 0]}
          >
            <div className="handle trecoAzul"></div>
          </Draggable>
          {scenes}
        </div>
      </div>

      <div className="test-timeline">
        <div className="btnContainer">
          <div className="btnContainer__left">
            <GiStack className="btnContainer__icon" />
            <span className="btnContainer__text---smallMargin">Capítulos</span>
          </div>

          <div className="btnContainer__right">
            <FaPlusSquare
              className="btnContainer__button"
              onClick={createScene}
            />
            <FaMinusSquare className="btnContainer__button" />
          </div>
        </div>

        <div
          className="timeline__chapter"
          ref={chapterTimelineRef}
          style={{
            position: "relative"
            // overflowY: "hidden",
            // overflowX: "auto",
            // whiteSpace: "nowrap"
          }}
        >
          <div style={{ display: "flex", opacity: 0 }}>
            {generateVerticalWhiteBarsAndTimers(videoLength)}
          </div>
        </div>
      </div>

      <div className="test-scrollbar">
        <div className="timeIndicator--blackbox"></div>

        <div className="scrollbar__container">
          <div
            className="timeline__scrollbar"
            ref={mainScrollbarRef}
            onScroll={handleScroll}
          >
            <div style={{ display: "flex", opacity: 0 }}>
              {generateVerticalWhiteBarsAndTimers(videoLength)}
            </div>
          </div>

          <div className="scrollbar__blackbox"></div>
        </div>

        <div className="zoom__bar">
          <MdZoomOut className="btnContainer__icon" />
          <div>
            <input
              type="range"
              min="1"
              max="100"
              value="50"
              class="slider"
              id="myRange"
            />
          </div>
          <MdZoomIn className="btnContainer__icon" />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
