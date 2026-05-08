import { describe, it, expect, vi, beforeEach } from 'vitest';

const { getGeminiMock, sendMessageMock, createChatMock } = vi.hoisted(() => ({
  getGeminiMock: vi.fn(),
  sendMessageMock: vi.fn(),
  createChatMock: vi.fn()
}));

vi.mock('../helpers/getGemini.js', () => ({
  default: (...args) => getGeminiMock(...args)
}));

import createAgent from '../helpers/createAgent.js';

const mockResponse = (text) => {
  sendMessageMock.mockResolvedValue({ text });
};

beforeEach(() => {
  vi.clearAllMocks();
  createChatMock.mockReturnValue({ sendMessage: sendMessageMock });
  getGeminiMock.mockReturnValue({ chats: { create: createChatMock } });
});

describe('createAgent', () => {
  describe('message helpers', () => {
    it('trims and stores system, user, and assistant messages', () => {
      const agent = createAgent();

      agent.addSystemMessage('  You are helpful.  ');
      agent.addUserMessage('  Hi there  ');
      agent.addAssistantMessage('  Hello  ');

      expect(agent.getMessages()).toEqual([
        { role: 'system', content: 'You are helpful.' },
        { role: 'user', content: 'Hi there' },
        { role: 'assistant', content: 'Hello' }
      ]);
    });

    it('getLastMessage returns the last appended message', () => {
      const agent = createAgent();
      agent.addUserMessage('first');
      agent.addUserMessage('second');

      expect(agent.getLastMessage()).toEqual({ role: 'user', content: 'second' });
    });
  });

  describe('run', () => {
    it('uses gemini-2.5-flash-lite for medium quality (the default)', async () => {
      mockResponse('{"answer":"ok"}');

      const agent = createAgent();
      agent.addUserMessage('hi');

      await agent.run();

      expect(createChatMock).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gemini-2.5-flash-lite'
      }));
    });

    it('uses gemini-3-flash-preview when quality is not medium', async () => {
      mockResponse('{"answer":"ok"}');

      const agent = createAgent({ quality: 'high' });
      agent.addUserMessage('hi');

      await agent.run();

      expect(createChatMock).toHaveBeenCalledWith(expect.objectContaining({
        model: 'gemini-3-flash-preview'
      }));
    });

    it('extracts the system message into config.systemInstruction and excludes it from history', async () => {
      mockResponse('{"answer":"ok"}');

      const agent = createAgent();
      agent.addSystemMessage('Be terse');
      agent.addUserMessage('history-1');
      agent.addAssistantMessage('reply-1');
      agent.addUserMessage('latest');

      await agent.run();

      const callArgs = createChatMock.mock.calls[0][0];

      expect(callArgs.config).toEqual({
        systemInstruction: 'Be terse',
        responseMimeType: 'application/json'
      });

      // history excludes the system message AND the last user message (which is sent separately)
      expect(callArgs.history).toEqual([
        { role: 'user', parts: [{ text: 'history-1' }] },
        { role: 'model', parts: [{ text: 'reply-1' }] }
      ]);

      // last message is sent via chat.sendMessage
      expect(sendMessageMock).toHaveBeenCalledWith({ message: 'latest' });
    });

    it('omits responseMimeType when format is text', async () => {
      mockResponse('plain text reply');

      const agent = createAgent({ format: 'text' });
      agent.addUserMessage('hi');

      await agent.run();

      const callArgs = createChatMock.mock.calls[0][0];
      expect(callArgs.config.responseMimeType).toBeUndefined();
    });

    it('parses the response as JSON when format is json (default)', async () => {
      mockResponse('{"answer":"42"}');

      const agent = createAgent();
      agent.addUserMessage('What?');

      const result = await agent.run();

      expect(result).toEqual({ answer: '42' });
    });

    it('returns the raw text when format is text', async () => {
      mockResponse('hello world');

      const agent = createAgent({ format: 'text' });
      agent.addUserMessage('greet');

      const result = await agent.run();

      expect(result).toBe('hello world');
    });

    it('appends the assistant response to the message history', async () => {
      mockResponse('{"answer":"ok"}');

      const agent = createAgent();
      agent.addUserMessage('hi');

      await agent.run();

      expect(agent.getLastMessage()).toEqual({ role: 'assistant', content: '{"answer":"ok"}' });
    });
  });
});
