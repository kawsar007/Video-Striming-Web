import { LocalUser, RemoteUser, useJoin, useLocalCameraTrack, useLocalMicrophoneTrack, usePublish, useRemoteAudioTracks, useRemoteUsers } from "agora-rtc-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

export const LiveVideo = () => {
  const appId = import.meta.env.VITE_AGORA_APP_ID;
  const { channelName } = useParams();

  const [activeConnection, setActiveConnection] = useState(true);
  const [micOn, setMic] = useState(true);
  const [cameraOn, setCamera] = useState(true);

  const { localMicrophoneTrack } = useLocalMicrophoneTrack(micOn);
  const { localCameraTrack } = useLocalCameraTrack(cameraOn);

  // to leave the call
  const navigate = useNavigate()

  useJoin({
    appid: appId,
    channel: channelName!,
    token: null,
  },
    activeConnection,
  );

  usePublish([localMicrophoneTrack, localCameraTrack]);

  //remote users
  const remoteUsers = useRemoteUsers();
  const { audioTracks } = useRemoteAudioTracks(remoteUsers);

  // play the remote user audio tracks
  audioTracks.forEach((track) => track.play());

  return (
    <>
      <div id='remoteVideoGrid'>
        {
          // Initialize each remote stream using RemoteUser component
          remoteUsers.map((user) => (
            <div key={user.uid} className="remote-video-container">
              <RemoteUser user={user} />
            </div>
          ))
        }
      </div>
      <div id='localVideo'>
        <LocalUser
          audioTrack={localMicrophoneTrack}
          videoTrack={localCameraTrack}
          cameraOn={cameraOn}
          micOn={micOn}
          playAudio={micOn}
          playVideo={cameraOn}
          className=''
        />
        <div>
          {/* media-controls toolbar component - UI controling mic, camera, & connection state  */}
          <div id="controlsToolbar">
            <div id="mediaControls">
              {micOn ? (
                <button className="btn" onClick={() => setMic(a => !a)}>
                  Mute
                </button>
              ) : (
                <button className="btn" onClick={() => setMic(a => !a)}>
                  Unmute
                </button>
              )}

              <button className="btn" onClick={() => setCamera(a => !a)}>
                Camera
              </button>
            </div>
            <button id="endConnection"
              onClick={() => {
                setActiveConnection(false)
                navigate('/')
              }}> Disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  )
}