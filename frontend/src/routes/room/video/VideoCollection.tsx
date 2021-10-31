/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { FC, useEffect, useState } from 'react';
import {
  AgoraVideoPlayer,
  createClient,
  createMicrophoneAndCameraTracks,
} from 'agora-rtc-react';
import {
  ClientConfig,
  IAgoraRTCRemoteUser,
  ICameraVideoTrack,
  IMicrophoneAudioTrack,
} from 'agora-rtc-sdk-ng';

import VideoApi from 'lib/videoService';

import './VideoCollection.scss';

const config: ClientConfig = {
  mode: 'rtc',
  codec: 'vp8',
};

const appId = process.env.REACT_APP_AGORA_APP_ID ?? '';

const useClient = createClient(config);
const useMicrophoneAndCameraTracks = createMicrophoneAndCameraTracks();

const Videos = (props: {
  users: IAgoraRTCRemoteUser[];
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
}) => {
  const { users, tracks } = props;

  return (
    <div>
      <div className={users.length < 1 ? 'videos-single' : 'videos-double'}>
        <AgoraVideoPlayer className="vid" videoTrack={tracks[1]} />
        {users.length > 0 &&
          users.map((user) => {
            if (user.videoTrack) {
              return (
                <AgoraVideoPlayer
                  className="vid"
                  key={user.uid}
                  videoTrack={user.videoTrack}
                />
              );
            } else {
              return null;
            }
          })}
      </div>
    </div>
  );
};

export const Controls = (props: {
  tracks: [IMicrophoneAudioTrack, ICameraVideoTrack];
  setStart: React.Dispatch<React.SetStateAction<boolean>>;
  setInCall: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { tracks } = props;
  const [trackState, setTrackState] = useState({ video: true, audio: true });

  const toggle = async (type: 'audio' | 'video') => {
    if (type === 'audio') {
      await tracks[0].setEnabled(!trackState.audio);
      setTrackState((ps) => {
        return { ...ps, audio: !ps.audio };
      });
    } else if (type === 'video') {
      await tracks[1].setEnabled(!trackState.video);
      setTrackState((ps) => {
        return { ...ps, video: !ps.video };
      });
    }
  };

  /*
  const leaveChannel = async () => {
    await client.leave();
    client.removeAllListeners();
    tracks[0].close();
    tracks[1].close();
    setStart(false);
    setInCall(false);
  };
  */

  return (
    <div className="controls">
      {trackState.audio ? (
        <i className="fa fa-volume-off" onClick={() => toggle('audio')} />
      ) : (
        <i className="fa fa-volume-up" onClick={() => toggle('audio')} />
      )}

      {trackState.video ? (
        <i className="fa fa-stop" onClick={() => toggle('video')} />
      ) : (
        <i className="fa fa-play" onClick={() => toggle('video')} />
      )}
    </div>
  );
};

const VideoCollection: FC = () => {
  const [inCall, setInCall] = useState(true);
  const [channelName] = useState('c2g');
  const [users, setUsers] = useState<IAgoraRTCRemoteUser[]>([]);
  const [start, setStart] = useState<boolean>(false);
  const [hasInitialised, setHasInitialised] = useState<boolean>(false);
  const client = useClient();
  const { ready, tracks } = useMicrophoneAndCameraTracks();

  const getToken = async (roomId: string): Promise<string> => {
    try {
      const response = await VideoApi.getToken(roomId);
      return response.token;
    } catch (error) {
      return '';
    }
  };

  useEffect(() => {
    // function to initialise the SDK
    if (!appId) {
      return;
    }

    const init = async (channelName: string) => {
      client.on('user-published', async (user, mediaType) => {
        await client.subscribe(user, mediaType);
        if (mediaType === 'video') {
          setUsers((prevUsers) => {
            return [...prevUsers, user];
          });
        }
        if (mediaType === 'audio') {
          user.audioTrack?.play();
        }
      });

      client.on('user-unpublished', (user, type) => {
        if (type === 'audio') {
          user.audioTrack?.stop();
        }
        if (type === 'video') {
          setUsers((prevUsers) => {
            return prevUsers.filter((User) => User.uid !== user.uid);
          });
        }
      });

      client.on('user-left', (user) => {
        setUsers((prevUsers) => {
          return prevUsers.filter((User) => User.uid !== user.uid);
        });
      });

      const token = await getToken(channelName);
      await client.join(appId, channelName, token, null);
      setInCall(true);
      if (tracks) await client.publish([tracks[0], tracks[1]]);
      setStart(true);
    };

    if (ready && tracks && !hasInitialised) {
      setHasInitialised(true);
      init(channelName);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channelName, client, ready, tracks]);

  if (!client) {
    return <div></div>;
  }

  return (
    <div className="video-call-container">
      {inCall && (
        <div
          className={
            users.length < 1 ? 'video-call-single' : 'video-call-double'
          }
        >
          {ready && tracks && (
            <Controls
              setInCall={setInCall}
              setStart={setStart}
              tracks={tracks}
            />
          )}
          {start && tracks && <Videos tracks={tracks} users={users} />}
        </div>
      )}
    </div>
  );
};

export default VideoCollection;
