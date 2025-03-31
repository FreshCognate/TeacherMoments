import fs from "fs";
import getOpenAI from "./getOpenAI.js";
import getAssetUrl from '../../helpers/getAssetUrl.js';
import downloadAsset from "../../helpers/downloadAsset.js";

export default async ({ asset }) => {

  const openai = getOpenAI();

  const { assetPath } = await downloadAsset({ asset });

  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(assetPath),
    model: "whisper-1",
    prompt: "If the transcription is empty, return an empty string.",
    response_format: "verbose_json",
    timestamp_granularities: ["segment"]
  });

  return transcription;

}