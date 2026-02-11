
export interface User {
  id: number;
  username: string;
  role: string;
  full_name?: string;
  email?: string;
  profile_image?: string;
  is_active: boolean;
  created_at: string;
}
