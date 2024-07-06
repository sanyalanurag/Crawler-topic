const axios = require('axios');

const kafkaProducer = require('../kafkaProducer');
const KafkaConsumer = require('../kafkaConsumer');
const {Readability} = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

class LinkService {
static async listenToLinkContentTopic() {

    const consumer = await KafkaConsumer.getConsumer({topic: 'link-content-topic', groupId: 'link-service-group'});
    await consumer.connect();
    await consumer.subscribe({ topic: 'link-content-topic', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { link, nextStage,  retryCount = 1 } = JSON.parse(message.value.toString());
            try {
                console.log(`Received message from ${topic}:`, link);
                const parsedContent = await this.fetchAndParseLink(link);
                await kafkaProducer.produceMessage('scheduling-topic', {
                    content: parsedContent,
                    nextStage: nextStage
                });
                console.log('Link processed successfully');
                } catch (error) {
                    console.error('Error processing message:', error.message);
                    const nextRetryCount = retryCount + 1;
                    await kafkaProducer.produceMessage('scheduling-topic', {
                        error: error.message,
                        nextStage: topic,
                        retryCount: nextRetryCount,
                        link,
                    });

                    console.log(`Error processed with retry count ${nextRetryCount}`);
                }
            },
        });
    }

    static async fetchAndParseLink(link) {
        try {
            const linkData = await axios.get(link);
            console.log(linkData);
            const content = linkData.data;

            const doc = new JSDOM(content);
            let reader = new Readability(doc.window.document);
            let article = reader.parse();
            const textContent = article.textContent;
            // console.log("content", content);
            return textContent;
        } catch (error) {
            throw new Error(`Failed to fetch and parse link: ${error.message}`);
        }
    }
}

module.exports = LinkService;
