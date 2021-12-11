import type IEnv from '$/server/shared/env';
import type { ISlack } from '$/server/shared/slack';
import type { IncomingWebhookSendArguments } from '@slack/webhook';
import { IncomingWebhook } from '@slack/webhook';
import { inject, singleton } from 'tsyringe';

@singleton()
export class Slack implements ISlack {
  public constructor(
    @inject('IEnv') private env: IEnv
  ) {
  }

  private async send(args: IncomingWebhookSendArguments): Promise<void> {
    if (!this.env.isValid('SLACK_WEBHOOK_URL')) {
      return;
    }

    const webhook = new IncomingWebhook(this.env.getValue('SLACK_WEBHOOK_URL'));
    await webhook.send(args);
  }

  public async sendOk(text: string, fields?: { title: string; value: string; short?: boolean }[]): Promise<void> {
    return this.send({
      username: 'Slack Bot',
      text,
      attachments: [{
        color: 'good',
        fields,
      }],
    });
  }

  public async sendError(error: Error): Promise<void> {
    return this.send({
      username: 'Slack Bot',
      text: error.message,
      'icon_emoji': 'no_entry',
      attachments: [{
        color: 'danger',
        text: error.stack,
      }],
    });
  }
}
