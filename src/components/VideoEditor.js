import React, { useState, useReducer } from "react";
import Timeline from "./Timeline";
import TimelineControl from "./TimelineControl";
import { act } from "react-dom/test-utils";

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

  const [chapters, setChapters] = useState([]);

  // handle scenes changes
  const sceneReducer = (state, action) => {
    let updatedState = [...state];

    // delete scene
    if (action.type === "delete") {
      // delete chapters that are inside a deleted scene
      const deletedScenes = state.filter((val, idx) => {
        return action.deleteIdx.includes(idx);
      });

      deletedScenes.forEach((scene) => {
        // chapters that are in a scene
        const chaptersToDelete = chapters.filter((chap) => {
          return scene.start.x <= chap && scene.end.x >= chap;
        });
        if (chaptersToDelete.length > 0) {
          chaptersToDelete.forEach((element) => {
            chapters.splice(chapters.indexOf(element), 1);
          });
        }
      });

      // update the scenes correctly
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

    // check if there was a chapter between the moved scene
    if (
      chapters.some((chap) => {
        return (
          (action.scene.start.x - 10 <= chap && action.scene.end.x >= chap) ||
          (action.scene.start.x <= chap && action.scene.end.x + 10 >= chap)
        );
      })
    ) {
      const chap = chapters.filter((chap) => {
        return (
          (action.scene.start.x - 10 <= chap && action.scene.end.x >= chap) ||
          (action.scene.start.x <= chap && action.scene.end.x + 10 >= chap)
        );
      })[0];
      if (action.isStart) {
        if (action.scene.start.x > chap) {
          // drag the chapter too
          chapters[chapters.indexOf(chap)] = action.scene.start.x;
        }
      } else {
        if (action.scene.end.x < chap) {
          // delete the chapter
          chapters.splice(chapters.indexOf(chap), 1);
        }
      }
    }

    // just update
    updatedState[action.sceneIdx] = action.scene; // {start: {x,y }, end: {x,y}}

    return [...updatedState];
  };

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
        chapters={chapters}
        setChapters={setChapters}
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
