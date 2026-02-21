export interface MediaItem {
  uri: string;
  type: 'image'; // Only images supported
  mimeType: string;
  name: string;
  width?: number;
  height?: number;
  fileSize?: number;
}

export interface CameraPermissions {
  camera: boolean;
  mediaLibrary: boolean;
}

export interface PostData {
  title: string;
  content: string;
  isRepost: boolean;
  isDraft: boolean;
  isHighlight: boolean;
  enableComment: boolean;
  enableCommunity: boolean;
  visibility?: 'everyone' | 'followers' | 'private';
}

export interface CreatePostResponse {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  media?: MediaItem[];
}

export interface UploadMediaParams {
  postId: string;
  media: MediaItem[];
}