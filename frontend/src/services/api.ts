import axios from 'axios';
import type { BoardStatus, LeadershipUpdate } from '../types';

const API_BASE = '/api';

export const fetchBoardStatus = async (): Promise<BoardStatus> => {
  const response = await axios.get<BoardStatus>(`${API_BASE}/boards/status`);
  return response.data;
};

export const sendChatMessage = async (message: string): Promise<any> => {
  const response = await axios.post(`${API_BASE}/chat`, { message });
  return response.data;
};

export const fetchLeadershipUpdate = async (): Promise<LeadershipUpdate> => {
  const response = await axios.get<LeadershipUpdate>(`${API_BASE}/leadership-update`);
  return response.data;
};
