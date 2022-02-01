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

const SimpleBreathing: React.FC = () => {
  const [started, setStarted] = useState<Boolean>(false);
  const [startMessage, setStartMessage] = useState<String | null>(
    SIMPLE_INITIAL_MESSAGE
  );
  const [breathMessage, setBreathMessage] = useState<Boolean | null>(null); // Breath in (true) & Breath out (false)
  const [textEffect, setTextEffect] = useState<Boolean | null>(null); // For text transition
  const [circleEffect, setCircleEffect] = useState<Boolean | null>(null); // For circle transition

  const handleStart = (): void => {
    setStarted(true);
  };

  let intervalId: NodeJS.Timer;

  // I am using setInterval, after every few seconds, we are running the interval function and
  // it will change our state from true to false and vice versa. Here we need use closure to let our interval function
  // know what is the current state (wheater it is true or false), so I am using the below temporary variable. When
  // we change the value of our state, we also need to change the value of the temporary variable.

  let breathTemp: Boolean = true;

  const startBreathing = (): void => {
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
      setCircleEffect(true);
    }
    if (breathMessage === false) {
      setCircleEffect(false);
    }
  }, [breathMessage]);

  // Clearing the interval on mount
  useEffect(() => {
    return clearInterval(intervalId);
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
        </div>
      </div>
    </div>
  );
};

export default SimpleBreathing;
