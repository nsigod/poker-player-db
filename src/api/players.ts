// 选手 API
import api from './client';

export interface PlayerBasic {
  id: number;
  slug: string;
  name: string;
  country: string | null;
  flag: string | null;
  titles: number;
  cashes: number;
  total_earnings: string | null;
}

export interface PlayerResultItem {
  year: number | null;
  location: string | null;
  event_name: string | null;
  buy_in: string | null;
  prize: string | null;
  placing: string | null;
  players_count: number | null;
}

export interface PlayerFull extends PlayerBasic {
  nickname: string | null;
  image: string | null;
  best_cash: string | null;
  bio: string | null;
  tags: string[];
  other_series: string[];
}

export interface PlayerListResponse {
  total: number;
  page: number;
  page_size: number;
  players: PlayerBasic[];
}

export interface PlayerDetailResponse {
  player: PlayerBasic | PlayerFull;
  results: PlayerResultItem[];
}

export interface CountryInfo {
  country: string;
  flag: string;
  count: number;
}

export interface ListPlayersParams {
  page?: number;
  page_size?: number;
  search?: string;
  sort_by?: 'name' | 'earnings' | 'titles' | 'cashes' | 'country';
  sort_order?: 'asc' | 'desc';
  country?: string;
}

export async function listPlayers(params: ListPlayersParams = {}): Promise<PlayerListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.page_size) query.set('page_size', String(params.page_size));
  if (params.search) query.set('search', params.search);
  if (params.sort_by) query.set('sort_by', params.sort_by);
  if (params.sort_order) query.set('sort_order', params.sort_order);
  if (params.country) query.set('country', params.country);
  const qs = query.toString();
  return api.get<PlayerListResponse>(`/players?${qs}`);
}

export async function getPlayerDetail(id: number): Promise<PlayerDetailResponse> {
  return api.get<PlayerDetailResponse>(`/players/${id}`);
}

export async function listCountries(): Promise<CountryInfo[]> {
  return api.get<CountryInfo[]>('/players/countries');
}
