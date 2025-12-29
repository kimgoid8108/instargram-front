export interface User {
  id: number;
  email: string;
  nickname: string;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface SignupRequest {
  email: string;
  hashed_password: string;
  nickname: string;
  profile_image_url?: string;
}

export interface UpdateProfileRequest {
  nickname?: string;
  profile_image_url?: string;
}
