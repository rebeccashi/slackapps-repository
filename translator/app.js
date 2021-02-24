const { App } = require('@slack/bolt');
require('dotenv').config();
const { v2: { Translate } } = require('@google-cloud/translate');
const translator = new Translate();

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

    const languageObj = getLanguageFromReaction(reaction);

    if (!languageObj) return;
    const {countryCode, language} = languageObj

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
    // console.log(textToTranslate)

    // const translatedText = "placeholder"
    const [translatedText, ...y] = await translateText(textToTranslate, countryCode);

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

async function translateText(text, target) {
    try {
        return await translator.translate(text, target);
    } catch (e) {
      console.log(e)
    }
  }

function getLanguageFromReaction(reaction) {
    let languageObj = null;
    const reactionToLanguageMap = {
        fr: {countryCode: 'fr', language: 'French'},
        mx: {countryCode: 'es', language: 'Spanish'},
        jp: {countryCode: 'ja', language: 'Japanese'},
        ru: {countryCodecode: 'ru', language:'Russian'},
    }

    // const [prefix, emojiCode] = reaction.includes('flag-') ? reaction.split('-') : reaction
    if (reaction.includes('flag-')) {
        const [prefix, countryCode] = reaction.split('-')
        languageObj = reactionToLanguageMap[countryCode]
    } else {
        languageObj = reactionToLanguageMap[reaction]
    }
    // console.log(reaction)
    // console.log(languageObj)
    return languageObj;
}