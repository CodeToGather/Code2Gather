export interface Rating {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  rating: number;
  ratingUserId: string | null;
  ratedUserId: string;
}
