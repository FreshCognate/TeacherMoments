import AUDIO from "../audio"

export default (isRecordingAudio: boolean) => {
  AUDIO.isRecordingAudio = !!isRecordingAudio;
}