import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router';
import { Button, Form, List, Modal, Typography } from 'antd';
import dayjs from 'dayjs';
import { routes } from '@/routes';
import { updateRequest } from '@/services/api';
import DecisionSelect from './DecisionSelect';
import type { GetRequestResponse, Highlight } from '@/types/api';

import styles from './styles.module.css';

type HighlightStatuses = Record<string, Highlight['status']>;

interface Props {
  request: GetRequestResponse;
  email: string;
  onHighlightClick: (index: number) => void;
}

const DATE_FORMAT = 'YYYY-MM-DD HH:mm:ss';

const ApprovalForm: React.FC<Props> = ({ request, email, onHighlightClick }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [highlightStatuses, setHighlightStatuses] = useState<HighlightStatuses>(
    request.highlights.reduce((statuses, { id }) => ({ ...statuses, [id]: null }), {}),
  );
  const onHighlightItemClick = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => onHighlightClick(Number(event.currentTarget.dataset.index)),
    [onHighlightClick],
  );
  const onHighlightDecisionChange = useCallback(
    (id: string, status: Highlight['status']) =>
      setHighlightStatuses((prevHighlightStatuses) => ({ ...prevHighlightStatuses, [id]: status })),
    [],
  );
  const onSubmit = useCallback(async () => {
    try {
      setLoading(true);

      const { data } = await updateRequest(request.id, {
        highlights: Object.entries(highlightStatuses).map(([id, status]) => ({ id, status })),
      });
      Modal.success({
        content: 'Your request review has been submitted',
        centered: true,
        closable: false,
        onOk: () =>
          navigate(`${routes.VIEW_REQUEST.path.replace(':id', data.id)}?token=${data.token}`, { replace: true }),
      });
    } catch (er) {
      Modal.error({ content: 'Failed to submit request review, please try again', centered: true });
    } finally {
      setLoading(false);
    }
  }, [request.id, highlightStatuses, navigate]);
  const isApprover = email === request.approverEmail;

  return (
    <Form layout="vertical">
      <Form.Item>
        <Typography.Title level={3}>{`${isApprover ? 'Review' : 'View'} Request`}</Typography.Title>
      </Form.Item>

      {isApprover ? (
        <>
          <Form.Item label={<Typography.Text strong>Requester</Typography.Text>}>
            <div>{request.requesterEmail}</div>
          </Form.Item>

          <Form.Item label={<Typography.Text strong>Requested At</Typography.Text>}>
            <div>{dayjs(request.requestedAt).format(DATE_FORMAT)}</div>
          </Form.Item>
        </>
      ) : (
        <>
          <Form.Item label={<Typography.Text strong>Approver</Typography.Text>}>
            <div>{request.approverEmail}</div>
          </Form.Item>

          <Form.Item label={<Typography.Text strong>Reviewed At</Typography.Text>}>
            <div>{!request.reviewedAt ? '-' : dayjs(request.reviewedAt).format(DATE_FORMAT)}</div>
          </Form.Item>
        </>
      )}

      <Form.Item label={<Typography.Text strong>Subject</Typography.Text>}>
        <div>{request.subject}</div>
      </Form.Item>

      <Form.Item label={<Typography.Text strong>Highlights</Typography.Text>}>
        <List
          size="small"
          dataSource={request.highlights}
          renderItem={(highlight, index) => {
            const { content } = JSON.parse(highlight.details);

            return (
              <List.Item>
                <div className={styles['highlight-list-item-order']}>{index + 1}</div>

                <div
                  className={styles['highlight-list-item-content']}
                  onClick={onHighlightItemClick}
                  data-index={index}
                >
                  {highlight.type === 'TEXT' ? (
                    <Typography.Text ellipsis>{content}</Typography.Text>
                  ) : (
                    <img src={content} />
                  )}
                </div>

                {isApprover && !request.reviewedAt && (
                  <DecisionSelect
                    id={highlight.id}
                    className={styles['highlight-list-item-select']}
                    onChange={onHighlightDecisionChange}
                  />
                )}
                {request.reviewedAt && (
                  <Typography.Text type={highlight.status === 'APPROVED' ? 'success' : 'danger'}>
                    {`${highlight.status?.slice(0, 1)}${highlight.status?.slice(1).toLowerCase()}`}
                  </Typography.Text>
                )}
              </List.Item>
            );
          }}
        />
      </Form.Item>

      {isApprover && !request.reviewedAt && (
        <Button
          type="primary"
          onClick={onSubmit}
          loading={loading}
          disabled={Object.values(highlightStatuses).some((status) => status === null)}
        >
          Submit Request Review
        </Button>
      )}
    </Form>
  );
};

export default React.memo(ApprovalForm);
