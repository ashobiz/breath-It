import React, { useEffect, useRef, useState } from 'react';
import { BiPlay, BiStop } from 'react-icons/bi';
import {
  BOX_INITIAL_MESSAGE,
  BOX_TIMING,
  BREATH_IN,
  BREATH_OUT,
  HOLD,
  INITIAL_DELAY,
  IN_HOLD,
  OUT_HOLD,
  SIT_CONFORTABLE,
  START_MESSAGE,
  BOX_TEXT_EFFECT_TIMING,
  BREATH_IN_AUDIO,
  BREATH_OUT_AUDIO,
  HOLD_AUDIO,
  BOX,
} from '../../constants';
import styles from './boxBreathing.module.scss';
import Timer from '../timer/timer';
import { breathingTypes } from '../../App';

type boxBreathingProps = {
  handleState: (type: breathingTypes) => void;
};

const BoxBreathing: React.FC<boxBreathingProps> = ({ handleState }) => {
  const [started, setStarted] = useState<Boolean>(false);
  const [startMessage, setStartMessage] = useState<String | null>(
    BOX_INITIAL_MESSAGE
  );
  const [breathMessage, setBreathMessage] = useState<String | null>(null); // Breath in and Breath out message
  const [textEffect, setTextEffect] = useState<Boolean | null>(null); // For text transition

  const handleStart = (): void => {
    setStarted(!started);
  };

  // Setting breath message (Breath in, hold, breath out, hold,...)

  let breathTemp: String = BREATH_IN;

  let intervalIdRef = useRef<NodeJS.Timer>();

  const startBreathing = () => {
    setBreathMessage(BREATH_IN);
    const id = setInterval(() => {
      if (breathTemp === BREATH_IN) {
        setBreathMessage(IN_HOLD);
        breathTemp = IN_HOLD;
      } else if (breathTemp === IN_HOLD) {
        setBreathMessage(BREATH_OUT);
        breathTemp = BREATH_OUT;
      } else if (breathTemp === BREATH_OUT) {
        setBreathMessage(OUT_HOLD);
        breathTemp = OUT_HOLD;
      } else if (breathTemp === OUT_HOLD) {
        setBreathMessage(BREATH_IN);
        breathTemp = BREATH_IN;
      }
    }, BOX_TIMING);
    intervalIdRef.current = id;
  };

  useEffect(() => {
    // Text transition effects
    if (breathMessage !== null) {
      setTextEffect(true);
      setTimeout(() => {
        setTextEffect(false);
      }, BOX_TEXT_EFFECT_TIMING);
    }

    // For playing audio
    if (breathMessage === BREATH_IN) BREATH_IN_AUDIO.play();
    if (breathMessage === BREATH_OUT) BREATH_OUT_AUDIO.play();
    if (breathMessage === IN_HOLD || breathMessage === OUT_HOLD)
      HOLD_AUDIO.play();
  }, [breathMessage]);

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

  // For displaying different messages like breath in, hold, out,
  const breathMsg = () => {
    switch (breathMessage) {
      case BREATH_IN:
        return BREATH_IN;
      case BREATH_OUT:
        return BREATH_OUT;
      case IN_HOLD:
        return HOLD;
      case OUT_HOLD:
        return HOLD;
      default:
        return '';
    }
  };

  // For box animation
  const boxAnimate = () => {
    switch (breathMessage) {
      case BREATH_IN:
        return `${styles.box_in}`;
      case BREATH_OUT:
        return `${styles.box_out}`;
      case IN_HOLD:
        return `${styles.box_in_hold}`;
      case OUT_HOLD:
        return `${styles.box_out_hold}`;
      default:
        return '';
    }
  };

  // Clearing the interval on unmount
  useEffect(() => {
    return () => {
      if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    };
  }, []);

  const handleStop = (): void => {
    setStarted(false);
    setStartMessage(BOX_INITIAL_MESSAGE);
    setBreathMessage(null);
    setTextEffect(null);
    BREATH_IN_AUDIO.pause();
    BREATH_OUT_AUDIO.pause();
    HOLD_AUDIO.pause();
    if (intervalIdRef.current) clearInterval(intervalIdRef.current);
    handleState(BOX);
  };

  return (
    <>
      {!started ? (
        <div className={styles.play_icon} onClick={handleStart}>
          <BiPlay />
        </div>
      ) : (
        <div className={styles.breath_box}>
          {breathMessage && (
            <div
              className={`${styles.box_message} ${
                textEffect ? styles.transition_in : styles.transition_out
              }`}
            >
              {breathMsg()}
            </div>
          )}
          <div className={`${styles.box_looper} ${boxAnimate()}`}></div>
        </div>
      )}
      {/* We are displaying intitial message and breath in/out message with transition. That is why we are having many conditions */}
      <div className={styles.message}>{startMessage && startMessage}</div>
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

export default BoxBreathing;
