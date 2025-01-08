import getOpenAI from './getOpenAI.js';
const DEFAULTS = { quality: 'medium', stream: false, format: 'json' };

export default (options) => {
  class Chat {
    constructor(options = {}) {
      this.options = { ...DEFAULTS, ...options };
      this.messages = [];
    }

    run = async () => {
      const openai = getOpenAI();

      const { stream, format, quality } = this.options;
      const createObject = {
        stream,
        messages: this.messages,
        model: quality === 'medium' ? "gpt-3.5-turbo" : "gpt-4o",
      };

      if (format === 'json') {
        createObject.response_format = { type: "json_object" };
      }

      try {
        const completion = await openai.chat.completions.create(createObject);

        this.messages.push(completion.choices[0].message);

        if (format === 'json') {
          return JSON.parse(completion.choices[0].message.content);
        } else {
          return completion.choices[0].message.content;
        }

      } catch (error) {
        console.log(error);
      }
    };

    addSystemMessage = (message) => {
      this.messages.push({
        'role': 'system',
        'content': message.trim()
      });
    };

    addAssistantMessage = (message) => {
      this.messages.push({
        'role': 'assistant',
        'content': message.trim()
      });
    };

    addUserMessage = (message) => {
      this.messages.push({
        'role': 'user',
        'content': message.trim()
      });
    };

    getLastMessage = () => {
      return this.messages[this.messages.length - 1];
    };

    getMessages = () => {
      return this.messages;
    };

  }

  return new Chat(options);
}