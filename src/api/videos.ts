// 视频 API - 完整视频库接口
import api from './client';

// ============ 类型定义 ============

export interface VideoItem {
  id: number;
  title: string | null;
  url: string | null;            // 免费用户为 null
  thumbnail: string | null;
  platform: string | null;
  duration: string | null;
  duration_seconds?: number | null;
  views: string | null;
  published_at: string | null;
  event: string | null;
  players: string[];
  player_ids?: number[];
  subtitles?: string | null;
  tags: string[];
  description?: string | null;
  source_type?: string;
  is_saved: boolean;
  saved_at?: string | null;
  save_count?: number;
}

export interface VideoListResponse {
  total: number;
  page: number;
  page_size: number;
  videos: VideoItem[];
}

export interface VideoStats {
  total_videos: number;
  by_platform: Record<string, number>;
  by_event: Record<string, number>;
  recent_count: number;
  total_views: string;
}

export interface SavedVideoItem {
  id: number;
  video_id: number;
  title: string;
  thumbnail: string | null;
  platform: string | null;
  duration: string | null;
  event: string | null;
  players: string[];
  tags: string[];
  url: string | null;
  saved_at: string;
}

export interface SavedVideoListResponse {
  total: number;
  page: number;
  page_size: number;
  saved_videos: SavedVideoItem[];
}

export interface ListVideosParams {
  page?: number;
  page_size?: number;
  search?: string;
  search_scope?: 'all' | 'player' | 'event' | 'hand' | 'subtitle' | 'tag';
  platform?: string;
  event?: string;
  tag?: string;
  sort_by?: 'newest' | 'oldest' | 'views';
}

export interface AddVideoParams {
  title: string;
  url: string;
  platform?: string;
  event?: string;
  players?: string[];
  tags?: string[];
  subtitles?: string;
  description?: string;
}

// ============ 接口函数 ============

/** 获取视频列表（分级访问：免费看标题/缩略图，付费看完整） */
export async function listVideos(params: ListVideosParams = {}): Promise<VideoListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.page_size) query.set('page_size', String(params.page_size));
  if (params.search) query.set('search', params.search);
  if (params.search_scope) query.set('search_scope', params.search_scope);
  if (params.platform) query.set('platform', params.platform);
  if (params.event) query.set('event', params.event);
  if (params.tag) query.set('tag', params.tag);
  if (params.sort_by) query.set('sort_by', params.sort_by);
  const qs = query.toString();
  return api.get<VideoListResponse>(`/videos${qs ? `?${qs}` : ''}`);
}

/** 获取视频详情 */
export async function getVideoDetail(videoId: number): Promise<VideoItem> {
  return api.get<VideoItem>(`/videos/${videoId}`);
}

/** 获取标签列表 */
export async function listTags(): Promise<[string, number][]> {
  return api.get<[string, number][]>('/videos/meta/tags');
}

/** 获取视频统计 */
export async function getVideoStats(): Promise<VideoStats> {
  return api.get<VideoStats>('/videos/meta/stats');
}

/** 手动添加视频（付费用户） */
export async function addVideo(data: AddVideoParams): Promise<{ message: string }> {
  return api.post<{ message: string }>('/videos', data);
}

/** 批量导入视频（付费用户） */
export async function batchImportVideos(videos: AddVideoParams[]): Promise<{ message: string }> {
  return api.post<{ message: string }>('/videos/batch', { videos });
}

/** 收藏视频（付费用户） */
export async function saveVideo(videoId: number): Promise<{ message: string }> {
  return api.post<{ message: string }>(`/videos/${videoId}/save`);
}

/** 取消收藏视频（付费用户） */
export async function unsaveVideo(videoId: number): Promise<{ message: string }> {
  return api.delete<{ message: string }>(`/videos/${videoId}/save`);
}

/** 获取我的收藏列表（付费用户） */
export async function listMySavedVideos(params: { page?: number; page_size?: number } = {}): Promise<SavedVideoListResponse> {
  const query = new URLSearchParams();
  if (params.page) query.set('page', String(params.page));
  if (params.page_size) query.set('page_size', String(params.page_size));
  return api.get<SavedVideoListResponse>(`/videos/saved/mine${query.toString() ? `?${query}` : ''}`);
}
