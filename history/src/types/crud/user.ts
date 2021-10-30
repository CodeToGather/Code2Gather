export type UserCreateData = {
  id: string;
  githubUsername: string;
  photoUrl: string;
  profileUrl: string;
}

export interface UserUpdateData {
  githubUsername?: string;
  photoUrl?: string;
  profileUrl?: string;
}
