import React from 'react';
import styles from './colorPicker.module.scss';
import { COLORS } from '../../constants';

const ColorPicker: React.FC = () => {
  // On click we are getting color from data attribute and setting that to body
  const handleColorChange = (e: React.MouseEvent): void => {
    if (e && e.target instanceof HTMLElement) {
      document.body.style.backgroundColor = e.target.dataset.color!;
    }
  };

  return (
    <div className={styles.color_picker}>
      {COLORS.map(data => (
        <span
          data-color={data}
          key={data}
          onClick={e => handleColorChange(e)}
        ></span>
      ))}
    </div>
  );
};

export default ColorPicker;
