export interface RatingCreateData {
  rating: number;
  ratingUserId: string;
  ratedUserId: string;
}

export interface RatingUpdateData {
  rating: number;
}
