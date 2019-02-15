const express = require("express")
const bodyParser = require('body-parser')
const providers = require('./providers');
const request = require('request-promise');
const app = express();
app.use(bodyParser.json());
const port = process.env.PORT || 8080;

const streams = [];

const getPostById = async postId => {
    try {
        return await request(`${process.env.POST_SERVICE_URI}/api/posts/${postId}`, { json: true });
    } catch (e) {
        console.log('Failed to get post by Id', e);
        return null;
    }
}

const tweetEvent = async (tweet, postId, tweetPostId) => {
    try {
        if (tweet.in_reply_to_status_id == tweetPostId) {
            const comment = {
                name: tweet.user.screen_name,
                message: tweet.text
            }

            await request(`${process.env.POST_SERVICE_URI}/api/posts/${postId}/comments`, {
                method: 'POST',
                body: comment,
                json: true
            });
        }
    } catch (e) {
        console.log('Failed to post comment', e);
    }
}

app.post("/api/social/share", async (req, res) => {
    try {
        const postId = req.body.postId;
        const providerName = req.body.provider;

        const post = await getPostById(postId);
        const provider = await providers[providerName];

        if (provider) {
            const result = await provider.post(post.message);

            const stream = provider.stream(result.user.id);

            stream.on('data', (tweet) => {
                tweetEvent(tweet, postId, result.id);
            });
            streams.push(stream);

            res.json(result);
        } else {
            res.status(400).send({ message: 'Provider not found.' });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`social-service listening on ${port}`)
});