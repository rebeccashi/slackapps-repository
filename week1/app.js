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
