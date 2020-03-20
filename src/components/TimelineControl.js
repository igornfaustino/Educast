import React, { useState, useEffect } from "react";
import { MdZoomIn, MdZoomOut } from "react-icons/md";

import styles from "./TimelineControl.module.scss";

const TimelineControl = ({
  timelineIndicatorRef,
  videoTimelineRef,
  chapterTimelineRef,
  mainScrollbarRef,
  setTimelineIndicatorRef,
  setVideoTimelineRef,
  setChapterTimelineRef,
  timerDivWidth
}) => {
  const handleScroll = () => {
    // const tmp = timelineIndicatorRef;
    const tmp2 = videoTimelineRef;
    // const tmp3 = chapterTimelineRef;

    // tmp.current.scrollLeft = mainScrollbarRef.current.scrollLeft;
    tmp2.current.scrollLeft = mainScrollbarRef.current.scrollLeft;
    // tmp3.current.scrollLeft = mainScrollbarRef.current.scrollLeft;

    // setTimelineIndicatorRef(tmp);
    setVideoTimelineRef(tmp2);
    // setChapterTimelineRef(tmp3);
  };

  return (
    <div className={styles["scrollbar"]}>
      <div className={styles["blackbox"]}></div>

      <div className={styles["scrollbar__container"]}>
        <div
          className={styles["timeline__scrollbar"]}
          ref={mainScrollbarRef}
          onScroll={handleScroll}
        >
          <div
            style={{
              height: "100%",
              width: timerDivWidth + "px",
              backgroundColor: "transparent"
            }}
            className="timeline__video-invisible"
          />
        </div>

        <div className={styles["scrollbar__blackbox"]}></div>
      </div>

      <div className={styles["zoom__bar"]}>
        <MdZoomOut className={styles["btnContainer__icon"]} />
        <div>
          <input
            type="range"
            min="1"
            max="100"
            value="50"
            className={styles["slider"]}
            id="myRange"
          />
        </div>
        <MdZoomIn className={styles["btnContainer__icon"]} />
      </div>
    </div>
  );
};

export default TimelineControl;
