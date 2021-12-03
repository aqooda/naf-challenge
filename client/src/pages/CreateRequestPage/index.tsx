import React, { useCallback, useEffect, useRef, useState } from 'react';
import PdfViewer from '@/components/PdfViewer';
import PageLayout from '@/components/PageLayout';
import RequestForm from './RequestForm';
import type { IHighlight } from 'react-pdf-highlighter';

const CreateRequestPage: React.FC = () => {
  const scrollToRef = useRef<(highlight: IHighlight) => void>(() => undefined);
  const [pdf, setPdf] = useState<string | null>(null);
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  const onPdfSelect = useCallback((pdf: string | null) => {
    setPdf(pdf);
    setHighlights([]);
  }, []);
  const onHighlightAdd = useCallback(
    (highlight: IHighlight) => setHighlights((prevHighlights) => [...prevHighlights, highlight]),
    [],
  );
  const onHighlightRemove = useCallback(
    (index: number) =>
      setHighlights((prevHighlights) => [...prevHighlights.slice(0, index), ...prevHighlights.slice(index + 1)]),
    [],
  );
  const onHighlightUpdate = useCallback(
    (index: number, highlight: IHighlight) =>
      setHighlights((prevHighlights) => [
        ...prevHighlights.slice(0, index),
        highlight,
        ...prevHighlights.slice(index + 1),
      ]),
    [],
  );

  useEffect(() => {
    document.title = 'Create New Request';
  }, []);

  return (
    <PageLayout
      pdfViewer={
        <PdfViewer
          pdf={pdf}
          highlights={highlights}
          scrollToRef={scrollToRef}
          onHighlightAdd={onHighlightAdd}
          onHighlightUpdate={onHighlightUpdate}
        />
      }
      form={
        <RequestForm
          highlights={highlights}
          onHighlightClick={scrollToRef.current}
          onHighlightRemove={onHighlightRemove}
          onPdfSelect={onPdfSelect}
        />
      }
    />
  );
};

export default React.memo(CreateRequestPage);
