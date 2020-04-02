import React, { useState, useReducer } from "react";
import Timeline from "./Timeline";
import TimelineControl from "./TimelineControl";

const videoLength = 200;

// handle scenes changes
const sceneReducer = (state, action) => {
  let updatedState = [...state];

  // delete scene
  if (action.type === "delete") {
    const updatedState = state.filter((val, idx) => {
      return !action.deleteIdx.includes(idx);
    });
    return [...updatedState];
  }

  // create stick
  if (action.sceneIdx === -1) {
    return [...state, action.scene];
  }

  // if the moved stick exceeded his brother's position in the wrong side
  if (
    action.scene.start.x >= action.scene.end.x ||
    action.scene.end.x <= action.scene.start.x
  ) {
    return [...state];
  }
  if (
    state.some((stick, idx) => {
      if (action.sceneIdx !== idx) {
        return (
          (stick.start.x <= action.scene.end.x && // if the moved stick is between another scene
            stick.end.x >= action.scene.end.x) ||
          (stick.end.x >= action.scene.start.x &&
            stick.start.x <= action.scene.start.x) ||
          (action.scene.end.x >= stick.end.x && // if the moved stick exceeded another scene
            action.scene.start.x <= stick.start.x) ||
          (action.scene.start.x <= stick.start.x &&
            action.scene.end.x >= stick.end.x)
        );
      }
      return false;
    })
  ) {
    // return the previous state
    return [...state];
  }

  // just update
  updatedState[action.sceneIdx] = action.scene; // {start: {x,y }, end: {x,y}}
  return [...updatedState];
};

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

  const [scenes, dispatchScene] = useReducer(sceneReducer, []);

  const timerDivWidth = useState(videoLength * 10)[0];

  return (
    <div style={{ marginTop: "5rem" }}>
      {/* <h1 style={{ marginTop: "0px" }}>x: {deltaPosition.x}</h1> */}

      <Timeline
        videoBoxRef={videoBoxRef}
        timerDivWidth={timerDivWidth}
        chapterTimelineRef={chapterTimelineRef}
        deltaPosition={deltaPosition}
        setDeltaPosition={setDeltaPosition}
        videoTimelineRef={videoTimelineRef}
        timelineIndicatorRef={timelineIndicatorRef}
        videoLength={videoLength}
        scenes={scenes}
        dispatchScene={dispatchScene}
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
