import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { Button, Form, Input, Modal } from 'antd';
import PageLayout from '@/components/PageLayout';
import PdfViewer from '@/components/PdfViewer';
import { getRequest } from '@/services/api';
import { emailRule, requiredRule } from '@/utils/validation';
import ApprovalForm from './ApprovalForm';
import type { IHighlight } from 'react-pdf-highlighter';
import type { GetRequestResponse } from '@/types/api';

const transformHighlight = (highlight: GetRequestResponse['highlights'][number]): IHighlight => {
  const { content, position } = JSON.parse(highlight.details);

  return {
    id: highlight.id,
    content: {
      [highlight.type === 'AREA' ? 'image' : 'text']: content,
    },
    position: JSON.parse(position),
    comment: {
      text: '',
      emoji: '',
    },
  };
};

const ViewRequestPage: React.FC = () => {
  const scrollToRef = useRef<(highlight: IHighlight) => void>(() => undefined);
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [request, setRequest] = useState<GetRequestResponse | null>(null);
  const transformedHighlights = useMemo(() => (request?.highlights ?? []).map(transformHighlight), [request]);
  const onVerifyEmail = useCallback(async () => {
    setLoading(true);

    try {
      const { data } = await getRequest(id as string, {
        token: searchParams.get('token') as string,
        email: form.getFieldValue('email'),
      });

      setRequest(data);
    } catch (err) {
      form.setFields([{ name: 'email', errors: ['Invalid email'] }]);
    } finally {
      setLoading(false);
    }
  }, [id, searchParams]);
  const onHighlightClick = useCallback(
    (index: number) => scrollToRef.current?.(transformedHighlights[index]),
    [transformedHighlights],
  );

  useEffect(() => {
    document.title = 'View Request';
  }, []);

  return !request ? (
    <Modal title="Verify Email" closable={false} cancelButtonProps={{ disabled: true }} footer={null} visible centered>
      <Form form={form} initialValues={{ email: '' }} onFinish={onVerifyEmail}>
        <Form.Item name="email" rules={[requiredRule, emailRule]} validateFirst>
          <Input placeholder="Please enter your email" />
        </Form.Item>

        <Button type="primary" htmlType="submit" loading={loading}>
          Verify
        </Button>
      </Form>
    </Modal>
  ) : (
    <PageLayout
      pdfViewer={
        <PdfViewer
          pdf={`/api/requests/${request.pdfPath}`}
          highlights={transformedHighlights}
          scrollToRef={scrollToRef}
        />
      }
      form={<ApprovalForm request={request} email={form.getFieldValue('email')} onHighlightClick={onHighlightClick} />}
    />
  );
};

export default React.memo(ViewRequestPage);
