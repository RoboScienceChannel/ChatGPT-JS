//https://platform.openai.com/docs/guides/speech-to-text
const fs = require('fs');
const request = require('request');
let express = require('express');
let app = express();
const multer = require('multer');
const OPENAI_API_KEY = require('./config.json')['OpenAIApiKey'];
// const OPENAI_API_KEY = 'Your Key Here';

//serve static files
app.use(express.static(__dirname + '/public'));

//save uploaded files to disk
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads')
    },
    filename: function (req, file, cb) {
        console.log("Received file local server:", file);
        cb(null, file.originalname + "." + file.mimetype.replace('audio/', ''))
    }
});
const upload = multer({ storage: storage })

//Local server endpoints
app.post('/upload', upload.any(), async function (req, res) {
    // req.files contain your received files
    // req.body will hold the text fields, if there were any
    console.log('Uploaded files to local server: ', req.files);

    const apiResponse = await text2SpeechGPT(req.files[0]);
    res.send(apiResponse.text);
    // res.send("Test Message");
});

app.listen(3000, function () {
    console.log("Working on port 3000");
});

//Invoke OpenAI API
async function text2SpeechGPT(file) {
    const myPromise = new Promise((resolve, reject) => {
        const options = {
            method: "POST",
            url: "https://api.openai.com/v1/audio/translations",
            port: 443,
            headers: {
                "Authorization": "Bearer " + OPENAI_API_KEY,
                "Content-Type": "multipart/form-data"
            },
            formData: {
                "file": fs.createReadStream("./uploads/" + file.originalname + "." + file.mimetype.replaceAll('audio/', '')),
                "model": "whisper-1"
            }
        };
        request(options, function (err, res, body) {
            if (err) {
                console.log(err);
                reject();
            } else {
                console.log("Received API response:", body);

                resolve(JSON.parse(body));
            }

        });
    });

    return myPromise;
}
