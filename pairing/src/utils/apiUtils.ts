import axios from 'axios';

import { Difficulty } from 'constants/difficulty';

export const getUid = async (token: string): Promise<string> => {
  return axios
    .get(`${process.env.AUTH_URL}/auth`, {
      headers: {
        authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error();
      }
      return res.data.uid as string;
    });
};

interface RatingData {
  average: number;
  count: number;
  githubUsername: string;
  photoUrl: string;
}

export const getRatingData = async (uid: string): Promise<RatingData> => {
  return axios
    .get(`${process.env.HISTORY_URL}/rating`, {
      headers: {
        authorization: uid,
      },
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error();
      }
      return {
        average: res.data.average as number,
        count: res.data.count as number,
        githubUsername: res.data.githubUsername as string,
        photoUrl: res.data.photoUrl as string,
      };
    });
};

export const createRoom = async (
  uid1: string,
  uid2: string,
  difficulty: Difficulty,
): Promise<string> => {
  return axios
    .post(`${process.env.ROOM_URL}/create`, {
      uid1,
      uid2,
      difficulty,
    })
    .then((res) => {
      if (res.status !== 200) {
        throw new Error();
      }
      return res.data.roomId as string;
    });
};
