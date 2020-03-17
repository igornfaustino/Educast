import React, { useState } from "react";
import TimeIndicator from "./TimeIndicator";
import Timeline from "./Timeline";
import TimelineControl from "./TimelineControl";

const videoLength = 200;

const VideoEditor = () => {
  const videoBoxRef = useState(React.createRef())[0];

  const mainScrollbarRef = useState(React.createRef())[0];
  const [chapterTimelineRef, setChapterTimelineRef] = useState(
    React.createRef()
  );
  const [videoTimelineRef, setVideoTimelineRef] = useState(React.createRef());
  const [timelineIndicatorRef, setTimelineIndicatorRef] = useState(
    React.createRef()
  );

  const [deltaPosition, setDeltaPosition] = useState({ x: 0, y: 0 });

  const [arrayOfDeltaPositions, setArrayOfDeltaPositions] = useState([]);

  const timerDivWidth = useState(videoLength * 10)[0];

  const [startWidth, setStartWidth] = useState(0); // left offset to position the first white bar

  //   useEffect(() => {
  //     // console.log(testRef.current);
  //     // console.log(videoBoxRef.current.getBoundingClientRect());
  //     // console.log(videoTimelineRef.current.getBoundingClientRect());
  //     setStartWidth(videoBoxRef.current.getBoundingClientRect().width);

  //     // listen to window resize so that the first white bar change its position based on video box width
  //     window.addEventListener("resize", () => {
  //       setStartWidth(videoBoxRef.current.getBoundingClientRect().width);
  //     });
  //   }, []);

  // handle drag of main pauzinho

  // useEffect(() => {
  //   for (let i = 0; i <= videoLength; i++) {
  //     // get the final margin left which is the full div's width
  //     if (i === videoLength) {
  //       setTimerDivWidth(i * 10);
  //     }
  //   }
  // }, []);

  // create the timer box elements like white bars and timers

  return (
    <div>
      <h1 style={{ marginTop: "0px" }}>x: {deltaPosition.x}</h1>

      <TimeIndicator
        videoLength={videoLength}
        timelineIndicatorRef={timelineIndicatorRef}
      />
      <Timeline
        videoBoxRef={videoBoxRef}
        timerDivWidth={timerDivWidth}
        chapterTimelineRef={chapterTimelineRef}
        arrayOfDeltaPositions={arrayOfDeltaPositions}
        deltaPosition={deltaPosition}
        setArrayOfDeltaPositions={setArrayOfDeltaPositions}
        setDeltaPosition={setDeltaPosition}
        videoTimelineRef={videoTimelineRef}
      />
      <TimelineControl
        chapterTimelineRef={chapterTimelineRef}
        mainScrollbarRef={mainScrollbarRef}
        setChapterTimelineRef={setChapterTimelineRef}
        setTimelineIndicatorRef={setTimelineIndicatorRef}
        setVideoTimelineRef={setVideoTimelineRef}
        timelineIndicatorRef={timelineIndicatorRef}
        timerDivWidth={timerDivWidth}
        videoTimelineRef={videoTimelineRef}
      />
    </div>
  );
};

export default VideoEditor;
