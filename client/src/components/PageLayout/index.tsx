import React from 'react';

import styles from './styles.module.css';

interface Props {
  pdfViewer: React.ReactNode;
  form: React.ReactNode;
}

const PageLayout: React.FC<Props> = ({ pdfViewer, form }) => (
  <div className={styles.layout}>
    <div className={styles['pdf-viewer-wrapper']}>{pdfViewer}</div>
    <div className={styles['request-form-wrapper']}>{form}</div>
  </div>
);

export default React.memo(PageLayout);
