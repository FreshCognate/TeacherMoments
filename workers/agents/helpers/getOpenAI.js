import { OpenAI } from 'openai';

export default () => {
  const key = process.env.OPENAI_KEY;

  const openai = new OpenAI({
    organization: "",
    apiKey: key
  });

  return openai;
};