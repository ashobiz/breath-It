import React from 'react';
import styles from './app.module.scss';
import SimpleBreathing from './components/simpleBreathing/simpleBreathing';

const App: React.FC = () => {
  return (
    <div className={styles.main}>
      <SimpleBreathing />
    </div>
  );
};

export default App;
