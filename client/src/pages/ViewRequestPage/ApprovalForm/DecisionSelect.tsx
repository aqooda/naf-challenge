import React, { useCallback } from 'react';
import { Select } from 'antd';
import { SelectProps } from 'antd/lib/select';
import { Highlight } from '@/types/api';

type ValueType = Exclude<Highlight['status'], null>;

interface Props extends Pick<SelectProps<ValueType>, 'className' | 'defaultValue' | 'value'> {
  id: string;
  onChange?: (id: string, value: ValueType) => void;
}

const DecisionSelect: React.FC<Props> = ({ id, onChange, ...restProps }) => {
  const onValueChange = useCallback((value) => onChange?.(id, value), [id, onChange]);

  return (
    <Select {...restProps} placeholder="Decision" onChange={onValueChange}>
      <Select.Option value="APPROVED">Approve</Select.Option>
      <Select.Option value="REJECTED">Reject</Select.Option>
    </Select>
  );
};

export default React.memo(DecisionSelect);
