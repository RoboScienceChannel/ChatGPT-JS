//https://platform.openai.com/docs/guides/speech-to-text

const fs = require('fs');
const request = require('request');

const OPENAI_API_KEY = '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';
// const OPENAI_API_KEY = 'Your Key Here';

const options = {
    method: "POST",
    url: "https://api.openai.com/v1/audio/translations",
    port: 443,
    headers: {
        "Authorization": "Bearer " + OPENAI_API_KEY,
        "Content-Type": "multipart/form-data"
    },
    formData: {
        "file": fs.createReadStream("./whisper/files/test.mp3"),
        "model": "whisper-1"
    }
};
request(options, function (err, res, body) {
    if (err) console.log(err);
    console.log(body);
});

