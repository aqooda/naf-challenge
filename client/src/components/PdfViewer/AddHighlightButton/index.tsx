import React from 'react';
import styles from './styles.module.css';

interface Props {
  onClick: () => void;
  onUpdate?: () => void; // PDF highlighter will inject this prop;
}

const AddHighlightButton: React.FC<Props> = ({ onClick }) => (
  <button className={styles['add-highlight-button']} onClick={onClick}>
    Add Highlight
  </button>
);

export default React.memo(AddHighlightButton);
