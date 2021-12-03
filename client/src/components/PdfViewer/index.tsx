import React, { useCallback, useRef } from 'react';
import { AreaHighlight, Highlight, IHighlight, PdfHighlighter, PdfLoader } from 'react-pdf-highlighter';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';
import AddHighlightButton from './AddHighlightButton';

import styles from './styles.module.css';

interface Props {
  pdf: string | null;
  highlights: IHighlight[];
  scrollToRef?: React.MutableRefObject<(highlight: IHighlight) => void>;
  onHighlightAdd?: (highlight: IHighlight) => void;
  onHighlightUpdate?: (index: number, highlight: IHighlight) => void;
}

const PdfViewer: React.FC<Props> = ({ pdf, highlights, scrollToRef, onHighlightAdd, onHighlightUpdate }) => {
  const onUpdateHighlightArea = useCallback(
    (image: IHighlight['content']['image'], boundingRect: IHighlight['position']['boundingRect'], index: number) => {
      const originalHighlight = highlights[index];

      onHighlightUpdate?.(index, {
        ...originalHighlight,
        content: { ...originalHighlight.content, image },
        position: { ...originalHighlight.position, boundingRect },
      });
    },
    [highlights, onHighlightUpdate],
  );

  return (
    <>
      {!pdf && <div className={styles['pdf-viewer-reminder']}>Please select a PDF file first</div>}
      {pdf && (
        <PdfLoader
          url={pdf}
          beforeLoad={
            <div className={styles['pdf-viewer-loading-wrapper']}>
              <Spin indicator={<LoadingOutlined spin />} tip="Loading PDF" />
            </div>
          }
        >
          {(pdfDocument) => (
            <PdfHighlighter
              pdfDocument={pdfDocument}
              enableAreaSelection={(event) => event.altKey}
              onScrollChange={() => undefined}
              scrollRef={(scrollTo) => {
                if (scrollToRef) {
                  scrollToRef.current = scrollTo;
                }
              }}
              onSelectionFinished={
                !onHighlightAdd
                  ? () => null
                  : (position, content, hideTipAndSelection) => (
                      <AddHighlightButton
                        onClick={() => {
                          onHighlightAdd({ content, position } as IHighlight);
                          hideTipAndSelection();
                        }}
                      />
                    )
              }
              highlightTransform={(highlight, index, setTip, hideTip, viewportToScaled, screenshot, isScrolledTo) => {
                return !Boolean(highlight.content?.image) ? (
                  <Highlight
                    key={index}
                    isScrolledTo={isScrolledTo}
                    position={highlight.position}
                    comment={highlight.comment}
                  />
                ) : (
                  <AreaHighlight
                    key={index}
                    isScrolledTo={isScrolledTo}
                    highlight={highlight}
                    onChange={(boundingRect) =>
                      onUpdateHighlightArea(screenshot(boundingRect), viewportToScaled(boundingRect), index)
                    }
                  />
                );
              }}
              highlights={highlights}
            />
          )}
        </PdfLoader>
      )}
    </>
  );
};

export default React.memo(PdfViewer);
