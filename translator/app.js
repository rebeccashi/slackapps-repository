const { App } = require('@slack/bolt');
require('dotenv').config();

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

app.event('reaction_added', async( {event, client} ) => {
    // console.log('event: ' + JSON.stringify(event, 0, 2))
    // console.log('event: ' + event)
    //regular console.log just shows Object object

    const { item: {channel, ts}, reaction } = event;

    const language = getLanguageFromReaction(reaction);

    if (!language) return;

    //get the message with the ts from channel history
    const historyResult = await client.conversations.history({
        channel: channel,
        oldest: ts,
        latest: ts,
        inclusive: true,
        limit: 1
    })
    if (historyResult.messages.length <= 0) return;
    const {text: textToTranslate } = historyResult.messages[0];
    console.log(textToTranslate)

    const translatedText = await translate(textToTranslate, language);

    try {
        const result = await client.chat.postMessage({
            channel,
            thread_ts: ts,
            text: `Translation for :${reaction}:\n${translatedText}`
        })
        // console.log('result: ' + JSON.stringify(result, 0, 2));
    } catch {
        console.log(error)
    }
})

function getLanguageFromReaction(reaction) {
    let language;
    const reactionToLanguageMap = {
        fr: {code: 'fr', name: 'French'},
        mx: {code: 'es', name: 'Spanish'},
        jp: {code: 'ja', name: 'Japanese'},
        ru: {code: 'ru', name:'Russian'},
    }

    // const [prefix, emojiCode] = reaction.includes('flag-') ? reaction.split('-') : reaction
    if (reaction.includes('flag-')) {
        const [prefix, emojiCode] = reaction.split('-')
        language = reactionToLanguageMap[emojiCode]
    } else {
        language = reactionToLanguageMap[reaction]
    }

    console.log(reaction)
    return language;
}