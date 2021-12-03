import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, Input, List, Modal, Typography, Upload } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { routes } from '@/routes';
import { createRequest } from '@/services/api';
import { emailRule, requiredRule } from '@/utils/validation';
import type { UploadProps } from 'antd/lib/upload';
import type { IHighlight } from 'react-pdf-highlighter';

import styles from './styles.module.css';

interface Props {
  highlights: IHighlight[];
  onPdfSelect: (encodedPdf: string | null) => void;
  onHighlightClick: (highlight: IHighlight) => void;
  onHighlightRemove: (index: number) => void;
}

interface FormValues {
  requesterEmail: string;
  approverEmail: string;
  subject: string;
}

const initialFormValues: FormValues = {
  requesterEmail: '',
  approverEmail: '',
  subject: '',
};

const beforeUpload = () => false;

const RequestForm: React.FC<Props> = ({ highlights, onPdfSelect, onHighlightClick, onHighlightRemove }) => {
  const [form] = Form.useForm<FormValues>();
  const navigate = useNavigate();
  const [encodedPdf, setEncodedPdf] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const onPdfChange = useCallback<Exclude<UploadProps['onChange'], undefined>>(
    async (info) => {
      if (info.file.status === 'removed') {
        onPdfSelect(null);
        setEncodedPdf(null);

        return;
      }

      const fileReader = new FileReader();

      fileReader.readAsDataURL(info.file as unknown as Blob);
      fileReader.addEventListener('load', () => {
        onPdfSelect(fileReader.result as string);
        setEncodedPdf(fileReader.result as string);
      });
    },
    [onPdfSelect],
  );
  const onRemoveButtonClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => onHighlightRemove(Number(event.currentTarget.dataset.index)),
    [onHighlightRemove],
  );
  const onHighlightItemClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) =>
      onHighlightClick(highlights[Number(event.currentTarget.dataset.index)]),
    [onHighlightClick, highlights],
  );
  const onSubmit = useCallback(
    async (formValues: FormValues) => {
      try {
        setLoading(true);

        const { data } = await createRequest({
          ...formValues,
          pdf: encodedPdf as string,
          highlights: highlights.map((highlight) => ({
            type: highlight.content.image ? 'AREA' : 'TEXT',
            content: (highlight.content.image ?? highlight.content.text) as string,
            position: JSON.stringify(highlight.position),
          })),
        });
        Modal.success({
          content: 'Your request has been created',
          centered: true,
          closable: false,
          onOk: () =>
            navigate(`${routes.VIEW_REQUEST.path.replace(':id', data.id)}?token=${data.token}`, { replace: true }),
        });
      } catch (er) {
        Modal.error({ content: 'Failed to create request, please try again', centered: true });
      } finally {
        setLoading(false);
      }
    },
    [encodedPdf, highlights, navigate],
  );

  return (
    <Form
      layout="vertical"
      form={form}
      initialValues={initialFormValues}
      onFinish={onSubmit}
      validateTrigger={['onBlur']}
      requiredMark={false}
    >
      <Form.Item
        label={<Typography.Text strong>Your Email</Typography.Text>}
        name="requesterEmail"
        rules={[
          requiredRule,
          emailRule,
          {
            validator: (_, value) =>
              value === form.getFieldValue('approverEmail')
                ? Promise.reject('Should not same as approver email')
                : Promise.resolve(),
          },
        ]}
        validateFirst
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={<Typography.Text strong>Approver Email</Typography.Text>}
        name="approverEmail"
        rules={[
          requiredRule,
          emailRule,
          {
            validator: (_, value) =>
              value === form.getFieldValue('requesterEmail')
                ? Promise.reject('Should not same as requester email')
                : Promise.resolve(),
          },
        ]}
        validateFirst
      >
        <Input />
      </Form.Item>

      <Form.Item label={<Typography.Text strong>Subject</Typography.Text>} name="subject" rules={[requiredRule]}>
        <Input />
      </Form.Item>

      <Form.Item label={<Typography.Text strong>Document</Typography.Text>}>
        <Upload accept="application/pdf" beforeUpload={beforeUpload} onChange={onPdfChange} maxCount={1}>
          <Button>Select a PDF file</Button>
        </Upload>
      </Form.Item>

      <Form.Item label={<Typography.Text strong>Highlights</Typography.Text>}>
        <Typography.Text type="secondary">Select text or Press "Alt" to select area</Typography.Text>

        {highlights.length > 0 && (
          <List
            size="small"
            dataSource={highlights}
            renderItem={(highlight, index) => (
              <List.Item>
                <div className={styles['highlight-list-item-order']}>{index + 1}</div>

                <div
                  className={styles['highlight-list-item-content']}
                  onClick={onHighlightItemClick}
                  data-index={index}
                >
                  {highlight.content.text && <Typography.Text ellipsis>{highlight.content.text}</Typography.Text>}

                  {highlight.content.image && <img src={highlight.content.image} />}
                </div>

                <Button type="text" onClick={onRemoveButtonClick} data-index={index}>
                  <DeleteOutlined />
                </Button>
              </List.Item>
            )}
          />
        )}
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} disabled={highlights.length === 0}>
        Submit Request
      </Button>
    </Form>
  );
};

export default React.memo(RequestForm);
