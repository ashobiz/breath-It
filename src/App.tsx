import React, { useState } from 'react';
import styles from './app.module.scss';
import BoxBreathing from './components/boxBreathing/boxBreathing';
import ColorPicker from './components/colorPicker/colorPicker';
import SimpleBreathing from './components/simpleBreathing/simpleBreathing';
import {
  SIMPLE,
  BOX,
  INTRO_HEADING,
  SIMPLE_INITIAL_MESSAGE,
  BOX_INITIAL_MESSAGE,
} from './constants';

export type breathingTypes = typeof SIMPLE | typeof BOX;
type appState = {
  simple: boolean;
  box: boolean;
};

const App: React.FC = () => {
  const initialState: appState = {
    simple: false,
    box: false,
  };

  const [state, setState] = useState<appState>(initialState);

  const handleState = (type: breathingTypes): void => {
    setState({ ...state, [type]: !state[type] });
  };

  return (
    <div className={styles.main}>
      <div className={styles.simple}>
        <div className={styles.outer}>
          <div className={styles.inner}>
            {!state.simple && !state.box && (
              <div className={styles.intro}>
                <h1>{INTRO_HEADING}</h1>
                <span onClick={() => handleState(BOX)}>
                  {BOX_INITIAL_MESSAGE}
                </span>
                <span onClick={() => handleState(SIMPLE)}>
                  {SIMPLE_INITIAL_MESSAGE}
                </span>
              </div>
            )}
            {state.box && <BoxBreathing handleState={handleState} />}
            {state.simple && <SimpleBreathing handleState={handleState} />}
          </div>
        </div>
      </div>
      <ColorPicker />
    </div>
  );
};

export default App;
