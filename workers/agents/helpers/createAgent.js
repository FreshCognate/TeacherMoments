import getGemini from './getGemini.js';

const DEFAULTS = { quality: 'medium', stream: false, format: 'json' };

export default (options) => {
  class Chat {
    constructor(options = {}) {
      this.options = { ...DEFAULTS, ...options };
      this.messages = [];
    }

    run = async () => {
      const ai = getGemini();

      const { format, quality } = this.options;
      const model = quality === 'medium' ? 'gemini-2.5-flash-lite' : 'gemini-3-flash-preview';

      const systemMessage = this.messages.find(m => m.role === 'system');
      const nonSystemMessages = this.messages.filter(m => m.role !== 'system');

      const config = {};

      if (systemMessage) {
        config.systemInstruction = systemMessage.content;
      }

      if (format === 'json') {
        config.responseMimeType = 'application/json';
      }

      const lastMessage = nonSystemMessages[nonSystemMessages.length - 1];
      const historyMessages = nonSystemMessages.slice(0, -1);

      const history = historyMessages.map(m => ({
        role: m.role === 'assistant' ? 'model' : m.role,
        parts: [{ text: m.content }]
      }));

      try {
        const chat = ai.chats.create({
          model,
          config,
          history
        });

        const response = await chat.sendMessage({ message: lastMessage.content });

        this.messages.push({
          role: 'assistant',
          content: response.text
        });

        if (format === 'json') {
          return JSON.parse(response.text);
        } else {
          return response.text;
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
