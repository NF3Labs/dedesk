import { useInterval } from "@chakra-ui/react";
import { useEffect, useState } from "react";

export const useCountDown = (props) => {
  const { endTime } = props;
  const [seconds, setSeconds] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setSeconds(getTime(endTime));
    setIsLoaded(true);
  }, [endTime]);

  return {
    seconds: Math.floor(seconds % 60),
    minutes: Math.floor((seconds % (60 * 60)) / 60),
    hours: Math.floor((seconds % (60 * 60 * 24)) / (60 * 60)),
    days: Math.floor(seconds / (60 * 60 * 24)),
    isLoaded: isLoaded,
  };
};

const getTime = (endTime) => endTime - Math.round(new Date().getTime() / 1000);
