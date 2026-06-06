import { describe, it, expect, vi, beforeEach } from 'vitest';
import { setupMongo } from '../../../../tests/with-mongo.js';

const { sendEmailMock, randomIntMock } = vi.hoisted(() => ({
  sendEmailMock: vi.fn(),
  randomIntMock: vi.fn()
}));

vi.mock('#core/mailer/helpers/sendEmail.js', () => ({ default: (...args) => sendEmailMock(...args) }));
vi.mock('crypto', () => ({ default: { randomInt: (...args) => randomIntMock(...args) } }));

import signupParticipantUser from '../services/signupParticipantUser.js';

const db = setupMongo();

describe('signupParticipantUser (in-memory mongo)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    randomIntMock.mockReturnValue(123456);
    sendEmailMock.mockResolvedValue({});
  });

  it('throws 400 when username is shorter than 6 characters', async () => {
    await expect(
      signupParticipantUser({ username: 'sam', email: 'sam@example.com' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 400, message: 'Username must be at least 6 characters' });
  });

  it('throws 400 when the email is invalid', async () => {
    await expect(
      signupParticipantUser({ username: 'sammy123', email: 'not-an-email' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 400, message: 'Email is not valid' });
  });

  it('throws 400 when a user with the email or username already exists', async () => {
    await db.models.User.create({ email: 'sam@example.com', username: 'someoneelse' });

    await expect(
      signupParticipantUser({ username: 'sammy123', email: 'sam@example.com' }, {}, { models: db.models })
    ).rejects.toMatchObject({ statusCode: 400, message: 'This user already exists. Try another username or email.' });
  });

  it('creates a PARTICIPANT user with an OTP (email lowercased) and sends the signup email', async () => {
    const result = await signupParticipantUser(
      { username: 'sammy123', email: 'Sam@EXAMPLE.com' }, {}, { models: db.models }
    );

    const stored = await db.models.User.findById(result.user._id).select('+otpCode').lean();
    expect(stored.email).toBe('sam@example.com');
    expect(stored.username).toBe('sammy123');
    expect(stored.role).toBe('PARTICIPANT');
    expect(stored.otpCode).toBe('123456');
    expect(stored.isVerified).toBe(false);

    expect(sendEmailMock).toHaveBeenCalledWith({
      to: 'sam@example.com',
      templateAlias: 'signup',
      templateModel: { name: 'sammy123', otpCode: '123456', expiryMinutes: 10 }
    });
  });

  it('returns the created user wrapped under "user"', async () => {
    const result = await signupParticipantUser(
      { username: 'sammy123', email: 'sam@example.com' }, {}, { models: db.models }
    );
    expect(result.user.username).toBe('sammy123');
  });
});
