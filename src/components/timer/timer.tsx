import React, { useEffect, useState } from 'react';
import { TIMER_DEFAULT } from '../../constants';
import styles from './timer.module.scss';

const Timer: React.FC = () => {
  const [timer, setTimer] = useState<String>(TIMER_DEFAULT); // For clock timer
  // Creating a clock with seconds and minutes using setinterval
  let clock: NodeJS.Timer;
  const startTimer = (): void => {
    let mins: number = 0;
    let seconds: number = 0;
    clock = setInterval(() => {
      if (seconds < 60) {
        seconds++;
      } else {
        seconds = 0;
        mins++;
      }
      let finalTime: String;
      finalTime = mins < 10 ? '0' + mins.toString() : mins.toString();
      finalTime =
        finalTime +
        ':' +
        (seconds < 10 ? '0' + seconds.toString() : seconds.toString());
      setTimer(finalTime);
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      clearInterval(clock);
    };
  }, []);
  return <div className={styles.timer}>{timer}</div>;
};

export default Timer;
