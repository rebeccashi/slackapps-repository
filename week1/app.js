const { App } = require('@slack/bolt');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
})();

const introductionsChannelId = "C01M4TFHZ3R"

app.message('hello', async ({ message, say }) => {
  await say({
    "blocks": [
      {
        "type": "actions",
        "block_id": "action_block",
        "elements": [
          {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Click Me"
            },
            "value": "click_me_123",
            "action_id": "click_me_button"
          }
        ]
      }
    ]
  });
});

app.action('click_me_button', async ({ body, ack, say }) => {
  await ack();
  // Update the message to reflect the action
  await say(`<@${body.user.id}> clicked a button!`)
})

app.event('team_join', async ({ event, client }) => {
  try {
    const result = await client.chat.postMessage({
      // token: process.env.SLACK_BOT_TOKEN,
      channel: introductionsChannelId,
      text: `Welcome to the workspace, <@${event.user.id}>!`
    });
  }
  catch (error) {
    console.error(error);
  }
});

app.command('/ticket', async ({ ack, body, client }) => {
  // Acknowledge the command request
  await ack();

  try {
    // Call views.open with the built-in client
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'view1',
        title: {
          type: 'plain_text',
          text: 'Modal title',
        },
        blocks: [
          {
            type: 'section',
            text: {
              type: 'mrkdwn',
              text: 'Welcome to a modal with _blocks_'
            },
            accessory: {
              type: 'button',
              text: {
                type: 'plain_text',
                text: 'Click me!'
              },
              action_id: 'button_abc'
            }
          },
          {
            type: 'input',
            block_id: 'input_c',
            label: {
              type: 'plain_text',
              text: 'What are your hopes and dreams?'
            },
            element: {
              type: 'plain_text_input',
              action_id: 'dreamy_input',
              multiline: true
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
      }
      }
    });
  }
   catch (error) {
    console.error(error);
  }
})
