const { link } = require("../controllers/topicController");

class MessageFactory {
    static createMessage(currStage, data) {
        let outputTopic;
        let messagePayload;

        if (data.retryCount > 3) {
            outputTopic = 'dead-letter-topic';
            messagePayload = {link: data.link, content: data.content};
            return { outputTopic, messagePayload };
        }
        outputTopic = currStage;

        switch (currStage) {
            case 'link-content-topic':
                messagePayload = { link: data.link, nextStage: 'readability-service-topic', retryCount: data.retryCount + 1};
                break;
            case 'readability-service-topic':
                messagePayload = { content: data.content, nextStage: 'topic-service-topic', retryCount: data.retryCount + 1 }; // Adjusted for example
                break;
            case 'topic-service-topic':
                messagePayload = { content: data.content, nextStage: '', retryCount: data.retryCount + 1 };
                break;
            default:
                console.error('Unknown nextStage:', nextStage);
                break;
        }

        return { outputTopic, messagePayload };
    }
}

module.exports = MessageFactory;