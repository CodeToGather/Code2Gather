import { VideoApiResponse } from 'types/api/video';

import BaseApi from './baseApi';

class VideoApi extends BaseApi {
  async getToken(channelName: string): Promise<VideoApiResponse> {
    return this.get(
      `video/access_token?channelName=${channelName}`,
      (res: VideoApiResponse) => res,
    );
  }
}

export default new VideoApi();
