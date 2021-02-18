const { App } = require('@slack/bolt');
require('dotenv').config();

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

const generalChannelId = "C01L6JPM669";

let section1, section2, section3;

(async () => {
    // Start your app
    await app.start(process.env.PORT || 3000);
  
    console.log('⚡️ Bolt app is running!');
})();

app.shortcut('time-converter', async ({body, client, ack}) => {
  await ack();

  try {
    const result = await client.views.open({
      trigger_id: body.trigger_id,
      view: {
        type: 'modal',
        callback_id: 'converter-modal',
        title: {
          type: 'plain_text',
          text: 'Time Converter'
        },
        blocks: [
          {
            "type": "section",
            "block_id": "section1",
            "text": {
              "type": "mrkdwn",
              "text": "Select the hour"
            },
            "accessory": {
              "action_id": "time_select",
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select an item"
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "*this is plain_text text*"
                  },
                  "value": "value-0"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "*this is plain_text text*"
                  },
                  "value": "value-1"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "*this is plain_text text*"
                  },
                  "value": "value-2"
                }
              ]
            }
          },
          {
            "type": "section",
            "block_id": "section2",
            "text": {
              "type": "mrkdwn",
              "text": "Converting from:"
            },
            "accessory": {
              "action_id": "time_from",
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select an item"
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PST"
                  },
                  "value": "PST"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "EST"
                  },
                  "value": "EST"
                },
              ]
            }
          },
          {
            "type": "section",
            "block_id": "section3",
            "text": {
              "type": "mrkdwn",
              "text": "Converting to:"
            },
            "accessory": {
              "action_id": "time_to",
              "type": "static_select",
              "placeholder": {
                "type": "plain_text",
                "text": "Select an item"
              },
              "options": [
                {
                  "text": {
                    "type": "plain_text",
                    "text": "PST"
                  },
                  "value": "PST"
                },
                {
                  "text": {
                    "type": "plain_text",
                    "text": "EST"
                  },
                  "value": "EST"
                }
              ]
            }
          }
        ],
        submit: {
          type: 'plain_text',
          text: 'Submit'
        }
      },
    })
    // console.log(result)

  } catch (error){
    console.log(error)
  }
})

app.view('converter-modal', async ({ ack, view, body, client}) => {
  await ack();

  // console.log("view: " + JSON.stringify(view, 0, 2))
  let values = view.state.values
  if (view.state.values) {
    section1 = values.section1;
    section2 = values.section2;
    section3 = values.section3;
  }
  console.log(client)
  try {
    const result = await client.chat.postMessage({
      channel: generalChannelId,
      text: `Time converter app`
    })
    console.log(result)
  } catch(error) {
    console.log(error)
  }

  // console.log(section3)
})

//Respond to the user selecting menu options
app.action('time_select', async({ack}) => {
  await ack();
})

app.action('time_from', async({ack}) => {
  await ack();
})

app.action('time_to', async({ack}) => {
  await ack();
})

