import React, { useState, useEffect } from "react";
import styles from "./TimeIndicator.module.scss";
import cx from "classnames";

const TimeIndicator = ({ videoLength, timelineIndicatorRef }) => {
  // format timers
  const str_pad_left = (string, pad, length) => {
    return (Array(length + 1).join(pad) + string).slice(-length);
  };

  const generateVerticalWhiteBarsAndTimers = videoLength => {
    let arrayOfWhiteBarsAndTimers = [];

    for (let i = 0; i <= videoLength; i = i + 1) {
      // check if i is multiple of 10
      if (i !== 0 && i % 10 === 0) {
        // create the timer
        var hours = Math.floor(i / 3600);
        var minutes = Math.floor(i / 60);
        var seconds = i - minutes * 60;

        arrayOfWhiteBarsAndTimers.push(
          <span
            style={{
              bottom: 20,
              position: "absolute",
              marginLeft: i * 10 - 21 + "px",
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
            className={cx(
              styles["timer-vertical-whitebar--big"],
              styles["timer-vertical-whitebar"]
            )}
            style={{
              marginLeft: i * 10 + "px"
            }}
          ></div>
        );
      } else {
        if (i === 0) {
          arrayOfWhiteBarsAndTimers.push(
            <div
              className={cx(
                styles["timer-vertical-whitebar--big"],
                styles["timer-vertical-whitebar"]
              )}
              style={{
                marginLeft: 0 + "px"
              }}
            ></div>
          );
        } else {
          arrayOfWhiteBarsAndTimers.push(
            <div
              className={styles["timer-vertical-whitebar"]}
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
  return (
    <div
      className={styles["timeIndicator__container"]}
      // style={{ width: videoLength * 10 + "px" }}
    >
      {generateVerticalWhiteBarsAndTimers(videoLength)}
    </div>
  );
};

export default TimeIndicator;
