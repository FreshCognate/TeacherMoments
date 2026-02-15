import fs from 'fs';
import getGemini from './getGemini.js';
import downloadAsset from '../../helpers/downloadAsset.js';

export default async ({ asset }) => {

  const ai = getGemini();

  const { assetPath } = await downloadAsset({ asset });

  const mimeType = asset.mimetype || 'audio/mpeg';
  const base64Audio = fs.readFileSync(assetPath, { encoding: 'base64' });

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-lite',
    contents: [
      {
        text: `Transcribe the following audio file. If the audio is empty or contains no speech, return an empty string for the text field and an empty array for segments.

Return the transcription in the following JSON format:
{
  "language": "The detected language code (e.g., 'en')",
  "duration": <total duration in seconds as a number>,
  "text": "The complete transcription text",
  "segments": [
    {
      "start": <start time in seconds as a number>,
      "end": <end time in seconds as a number>,
      "text": "The text for this segment"
    }
  ]
}`
      },
      {
        inlineData: {
          mimeType,
          data: base64Audio
        }
      }
    ],
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: 'object',
        properties: {
          language: { type: 'string' },
          duration: { type: 'number' },
          text: { type: 'string' },
          segments: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                start: { type: 'number' },
                end: { type: 'number' },
                text: { type: 'string' }
              },
              required: ['start', 'end', 'text']
            }
          }
        },
        required: ['language', 'duration', 'text', 'segments']
      }
    }
  });

  const transcription = JSON.parse(response.text);

  return transcription;

}
