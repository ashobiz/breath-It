import React, { useEffect, useRef, useState } from "react";
import styles from "./simpleBreathing.module.scss";
import { BiPlay, BiStop } from "react-icons/bi";
import {
  BREATH_IN,
  BREATH_IN_AUDIO,
  BREATH_OUT,
  BREATH_OUT_AUDIO,
  INITIAL_DELAY,
  SIMPLE_INITIAL_MESSAGE,
  SIMPLE_TIMING,
  SIT_CONFORTABLE,
  START_MESSAGE,
  SIMPLE_TEXT_EFFECT_TIMING,
  SIMPLE,
} from "../../constants";
import Timer from "../timer/timer";
import { breathingTypes } from "../../App";

type simpleBreathingProps = {
  handleState: (type: breathingTypes) => void;
};

const SimpleBreathing: React.FC<simpleBreathingProps> = ({ handleState }) => {
  const [started, setStarted] = useState<Boolean>(false);
  const [startMessage, setStartMessage] = useState<String | null>(
    SIMPLE_INITIAL_MESSAGE
  );
  const [breathMessage, setBreathMessage] = useState<Boolean | null>(null); // Breath in (true) & Breath out (false)
  const [textEffect, setTextEffect] = useState<Boolean | null>(null); // For text transition
  const [circleEffect, setCircleEffect] = useState<Boolean | null>(null); // For circle transition
  const [inhaleTiming, setInhaleTiming] = useState<number>(SIMPLE_TIMING);
  const [exhaleTiming, setExhaleTiming] = useState<number>(SIMPLE_TIMING);

  const handleStart = (): void => {
    setStarted(true);
  };

  // I am using setInterval, after every few seconds, we are running the interval function and
  // it will change our state from true to false and vice versa. Here we need use closure to let our interval function
  // know what is the current state (wheater it is true or false), so I am using the below temporary variable. When
  // we change the value of our state, we also need to change the value of the temporary variable.

  let breathTemp: Boolean = true;

  let intervalIdRefs = useRef<(NodeJS.Timer | undefined)[]>();

  const startBreathing = (): void => {
    setBreathMessage(true);
    const inhaleId = setInterval(() => {
      setBreathMessage(true);
      breathTemp = true;
    }, inhaleTiming + exhaleTiming);
    let exhaleId: NodeJS.Timer | undefined;
    setTimeout(() => {
      setBreathMessage(false);
      breathTemp = false;
      exhaleId = setInterval(() => {
        setBreathMessage(false);
        breathTemp = false;
      }, inhaleTiming + exhaleTiming);
    }, inhaleTiming);
    intervalIdRefs.current = [inhaleId, exhaleId];
  };

  // Text transition effects
  useEffect(() => {
    if (breathMessage !== null) {
      setTextEffect(true);
      setTimeout(() => {
        setTextEffect(false);
      }, SIMPLE_TEXT_EFFECT_TIMING);
    }
  }, [breathMessage]);

  // Circle transition effects
  useEffect(() => {
    if (breathMessage === true) {
      BREATH_IN_AUDIO.play();
      setCircleEffect(true);
    }
    if (breathMessage === false) {
      BREATH_OUT_AUDIO.play();
      setCircleEffect(false);
    }
  }, [breathMessage]);

  // Clearing the interval on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRefs.current)
        intervalIdRefs.current.forEach(
          (timer) => timer && clearInterval(timer)
        );
    };
  }, []);

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

  // Stopping the exercise by setting everytying to original value
  const handleStop = (): void => {
    setStarted(false);
    setStartMessage(SIMPLE_INITIAL_MESSAGE);
    setBreathMessage(null);
    setTextEffect(null);
    setCircleEffect(null);
    BREATH_IN_AUDIO.pause();
    BREATH_OUT_AUDIO.pause();
    if (intervalIdRefs.current)
      intervalIdRefs.current.forEach((timer) => timer && clearInterval(timer));
    handleState(SIMPLE);
  };

  return (
    <>
      {!started ? (
        <>
          <div className={styles.play_icon} onClick={handleStart}>
            <BiPlay />
          </div>
          <label className={styles.message}>Inhale seconds</label>
          <input
            name="inhaleTiming"
            id="inhaleTiming"
            value={inhaleTiming === 0 ? "" : inhaleTiming / 1000}
            type="number"
            onChange={(e) => setInhaleTiming(Number(e.target.value) * 1000)}
            className={styles.input}
          />
          <label className={styles.message}>Exhale seconds</label>
          <input
            name="exhaleTiming"
            value={exhaleTiming === 0 ? "" : exhaleTiming / 1000}
            type="number"
            onChange={(e) => setExhaleTiming(Number(e.target.value) * 1000)}
            className={styles.input}
          />
        </>
      ) : (
        <div className={styles.breath_circle}>
          <div
            className={`${styles.breath_circle_inner} ${
              circleEffect ? styles.circle_large : styles.circle_small
            }`}
            style={{
              transition: circleEffect
                ? `all ${inhaleTiming / 1000}s ease-in`
                : `all ${exhaleTiming / 1000}s ease-in`,
            }}
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
      {!startMessage && <Timer />}
      {!startMessage && (
        <div className={styles.stop} onClick={handleStop}>
          <span>
            <BiStop />
          </span>
        </div>
      )}
    </>
  );
};

export default SimpleBreathing;
