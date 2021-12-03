import React from 'react';
import { Result } from 'antd';

const NotFoundPage: React.FC = () => (
  <Result status="404" title="Page Not Found" subTitle="Sorry, the page you visited does not exist." />
);

export default React.memo(NotFoundPage);
