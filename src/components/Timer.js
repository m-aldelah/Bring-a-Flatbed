import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Props } from "react-native-image-zoom-viewer/built/image-viewer.type";
import { COLORS } from "../Styles/StyleSheet";

export default function Timer( props ) {

  /***** Utility Functions *****/
  function addDays(date, days) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  /***** Grab target date and add 7 days *****/
  var targetDate = new Date(props.creationTime);
  targetDate = addDays(targetDate, 7);

  /***** Calculates the time left: target date - current date = time left *****/
  const calculateTimeLeft = () => {
    const currentDate = new Date();

    //Get the time remaining in milliseconds
    var timeRemaining = targetDate.getTime() - currentDate.getTime() 

    //Convert the milliseconds to the appropriate unit of time
    var seconds = Math.floor(timeRemaining / 1000);
    var minutes = Math.floor(seconds / 60);
    var hours = Math.floor(minutes / 60);
    var days = Math.floor(hours / 24);

    //Remove any extra time
    seconds %= 60;
    minutes %= 60;
    hours %= 24;

    let timeLeft = {};

    //Puts all the appropriate times in the timeLeft object
    if (currentDate > 0) {
      timeLeft = {
        D: days,
        H: hours,
        M: minutes,
        S: seconds,
      };
    }

    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  //Updates the display timer every 1 second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  /* Bid Snipping */
  useEffect(() => {
    props.getTime(timeLeft)
  }, [timeLeft.M]) 

  let timerContent = (
    <Text style={[styles.timeText, props.textStyle]}>Placeholder Text</Text>
  );

  /* Check if the timer is expired */
  if (
    timeLeft.D <= 0 &&
    timeLeft.H <= 0 &&
    timeLeft.M <= 0 &&
    timeLeft.S <= 0
  ) {
    timerContent = <Text style={[props.textStyle]}>Listing Expired</Text>;
  } else if (
    timeLeft.D <= 0 &&
    timeLeft.H <= 0 &&
    timeLeft.M <= 0 &&
    timeLeft.S <= 0
  ) {
    <Text style={[props.textStyle]}>{"Expired"}</Text>;
  } else if (timeLeft.D === 0 && timeLeft.H === 0) {
    timerContent = (
      <Text
        style={[props.textStyle]}
      >{`${timeLeft.M} minutes ${timeLeft.S} seconds remaining`}</Text>
    );
  } else {
    timerContent = (
      <Text style={props.textStyle}>
        {`${[timeLeft.D]}d ${timeLeft.H}h`} {`${[timeLeft.M]}m ${timeLeft.S}s`}
      </Text>
    );
  }
  return timerContent;
}

const styles = StyleSheet.create({
  timeText: {
    color: COLORS.grey,
    marginLeft: 5,
  },
});
