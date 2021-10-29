export interface UserCreateData {
  id: string;
  githubUsername: string;
  photoUrl: string;
}

export interface UserUpdateData {
  githubUsername?: string;
  photoUrl?: string;
}
