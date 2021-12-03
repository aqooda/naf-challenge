import axios from 'axios';
import type { CreateRequestData, CreateRequestResponse, GetRequestResponse, UpdateRequestData } from '@/types/api';

const axiosInstance = axios.create({ baseURL: '/api' });

export const createRequest = (data: CreateRequestData) => axiosInstance.post<CreateRequestResponse>('/requests', data);

export const getRequest = (id: string, params: Record<'token' | 'email', string>) =>
  axiosInstance.get<GetRequestResponse>(`/requests/${id}`, { params });

export const updateRequest = (id: string, data: UpdateRequestData) => axiosInstance.patch(`/requests/${id}`, data);
