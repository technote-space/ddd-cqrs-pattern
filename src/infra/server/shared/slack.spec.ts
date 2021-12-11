import { IncomingWebhook } from '@slack/webhook';
import TestEnv from '^/__mocks__/env';
import { Slack } from './slack';

jest.mock('@slack/webhook');

describe('Slack', () => {
  it('should send ok', async () => {
    const sendMock = jest.fn();
    (IncomingWebhook as jest.Mock).mockReturnValue({
      send: sendMock,
    });

    const slack = new Slack(new TestEnv({ SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/aaaaa/bbbbb/ccccc' }));
    await slack.sendOk('test message');

    expect(sendMock).toBeCalledWith({
      attachments: [{
        color: 'good',
        fields: undefined,
      }],
      text: 'test message',
      username: 'Slack Bot',
    });
  });

  it('should send ok with fields', async () => {
    const sendMock = jest.fn();
    (IncomingWebhook as jest.Mock).mockReturnValue({
      send: sendMock,
    });

    const slack = new Slack(new TestEnv({ SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/aaaaa/bbbbb/ccccc' }));
    await slack.sendOk('test message', [
      { title: 'title1', value: 'value1' },
      { title: 'title2', value: 'value2', short: true },
    ]);

    expect(sendMock).toBeCalledWith({
      attachments: [{
        color: 'good',
        fields: [
          { title: 'title1', value: 'value1' },
          { title: 'title2', value: 'value2', short: true },
        ],
      }],
      text: 'test message',
      username: 'Slack Bot',
    });
  });

  it('should send error', async () => {
    const sendMock = jest.fn();
    (IncomingWebhook as jest.Mock).mockReturnValue({
      send: sendMock,
    });

    const slack = new Slack(new TestEnv({ SLACK_WEBHOOK_URL: 'https://hooks.slack.com/services/aaaaa/bbbbb/ccccc' }));
    await slack.sendError(new Error('test message'));

    expect(sendMock).toBeCalledWith({
      attachments: [{
        color: 'danger',
        text: expect.stringMatching(/^Error: test message/),
      }],
      text: 'test message',
      'icon_emoji': 'no_entry',
      username: 'Slack Bot',
    });
  });

  it('should do nothing if not set webhookUrl', async () => {
    const sendMock = jest.fn();
    (IncomingWebhook as jest.Mock).mockReturnValue({
      send: sendMock,
    });

    const slack = new Slack(new TestEnv({}));
    await slack.sendOk('test message', [
      { title: 'title1', value: 'value1' },
      { title: 'title2', value: 'value2', short: true },
    ]);

    expect(sendMock).not.toBeCalled();
  });
});
