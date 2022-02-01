import React from 'react';
import styles from './app.module.scss';
import ColorPicker from './components/colorPicker/colorPicker';
import SimpleBreathing from './components/simpleBreathing/simpleBreathing';

const App: React.FC = () => {
  return (
    <div className={styles.main}>
      <SimpleBreathing />
      <ColorPicker />
    </div>
  );
};

export default App;
