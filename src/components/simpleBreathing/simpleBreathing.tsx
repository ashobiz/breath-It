import React, { useEffect, useState } from 'react';
import styles from './simpleBreathing.module.scss';
import { BiPlay } from 'react-icons/bi';
import {
  BREATH_IN,
  BREATH_OUT,
  INITIAL_DELAY,
  SIMPLE_INITIAL_MESSAGE,
  SIMPLE_TIMING,
  SIT_CONFORTABLE,
  START_MESSAGE,
  TEXT_EFFECT_TIMING,
} from '../../constants';

// Audio files
var breath_in = new Audio(require('./../../audio/breath-in.mp3'));
var breath_out = new Audio(require('./../../audio/breath-out.mp3'));

const SimpleBreathing: React.FC = () => {
  const [started, setStarted] = useState<Boolean>(false);
  const [startMessage, setStartMessage] = useState<String | null>(
    SIMPLE_INITIAL_MESSAGE
  );
  const [breathMessage, setBreathMessage] = useState<Boolean | null>(null); // Breath in (true) & Breath out (false)
  const [textEffect, setTextEffect] = useState<Boolean | null>(null); // For text transition
  const [circleEffect, setCircleEffect] = useState<Boolean | null>(null); // For circle transition
  const [timer, setTimer] = useState<String>('00:00'); // For circle transition

  const handleStart = (): void => {
    setStarted(true);
  };

  let clock: NodeJS.Timer;

  // Creating a clock with seconds and minutes using setinterval
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

  let intervalId: NodeJS.Timer;

  // I am using setInterval, after every few seconds, we are running the interval function and
  // it will change our state from true to false and vice versa. Here we need use closure to let our interval function
  // know what is the current state (wheater it is true or false), so I am using the below temporary variable. When
  // we change the value of our state, we also need to change the value of the temporary variable.

  let breathTemp: Boolean = true;

  const startBreathing = (): void => {
    startTimer(); // For clock
    setBreathMessage(true);
    intervalId = setInterval(() => {
      if (breathTemp) {
        setBreathMessage(false);
        breathTemp = false;
      } else {
        setBreathMessage(true);
        breathTemp = true;
      }
    }, SIMPLE_TIMING);
  };

  // Text transition effects
  useEffect(() => {
    if (breathMessage !== null) {
      setTextEffect(true);
      setTimeout(() => {
        setTextEffect(false);
      }, TEXT_EFFECT_TIMING);
    }
  }, [breathMessage]);

  // Circle transition effects
  useEffect(() => {
    if (breathMessage === true) {
      breath_in.play();
      setCircleEffect(true);
    }
    if (breathMessage === false) {
      breath_out.play();
      setCircleEffect(false);
    }
  }, [breathMessage]);

  // Clearing the interval on unmount
  useEffect(() => {
    return () => {
      clearInterval(intervalId);
      clearInterval(clock);
    };
  });

  useEffect(() => {
    // After clicking start button, I am showing different message one after the other. At the end it will become 'null'.
    // After setting the initial message to 'null', calling the start breathing function.
    if (started) {
      setTimeout(() => {
        setStartMessage(SIT_CONFORTABLE);
        setTimeout(() => {
          setStartMessage(START_MESSAGE);
          setTimeout(() => {
            setStartMessage(null);
            startBreathing();
          }, INITIAL_DELAY);
        }, INITIAL_DELAY);
      }, 0);
    }
  }, [started]);

  return (
    <div className={styles.simple}>
      <div className={styles.outer}>
        <div className={styles.inner}>
          {!started ? (
            <div className={styles.play_icon} onClick={handleStart}>
              <BiPlay />
            </div>
          ) : (
            <div className={styles.breath_circle}>
              <div
                className={`${styles.breath_circle_inner} ${
                  circleEffect ? styles.circle_large : styles.circle_small
                }`}
              ></div>
            </div>
          )}
          {/* We are displaying intitial message and breath in/out message with transition. That is why we are having many conditions */}
          <div className={styles.message}>
            {startMessage ? (
              startMessage
            ) : breathMessage ? (
              <div
                className={
                  textEffect ? styles.transition_in : styles.transition_out
                }
              >
                {BREATH_IN}
              </div>
            ) : (
              <div
                className={
                  textEffect ? styles.transition_in : styles.transition_out
                }
              >
                {BREATH_OUT}
              </div>
            )}
          </div>
          {/* Timer */}
          {!startMessage && <div className={styles.timer}>{timer}</div>}
        </div>
      </div>
    </div>
  );
};

export default SimpleBreathing;
