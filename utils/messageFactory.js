const C = require('../constants');

class MessageFactory {
    static createMessage(currStage, data) {
        let outputTopic;
        let messagePayload;

        if (data.retryCount > 3) {
            outputTopic = C.DEAD_LETTER;
            messagePayload = {link: data.link, content: data.content};
            return { outputTopic, messagePayload };
        }
        outputTopic = currStage;

        switch (currStage) {
            case C.FIRST_SERVICE:
                messagePayload = { link: data.link, nextStage: C.SECOND_SERVICE, retryCount: data.retryCount + 1};
                break;
            case C.SECOND_SERVICE:
                messagePayload = { content: data.content, nextStage: C.THIRD_SERVICE, retryCount: data.retryCount + 1 }; // Adjusted for example
                break;
            case C.THIRD_SERVICE:
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