import type { Rule } from 'antd/lib/form';

export const requiredRule: Rule = { required: true, message: 'This is a required field.' };

export const emailRule: Rule = { type: 'email', message: 'Invalid email format.' };
