const axios = require('axios');

const C = require('../constants');
const kafkaProducer = require('../kafkaProducer');
const KafkaConsumer = require('../kafkaConsumer');
const { Readability } = require('@mozilla/readability');
const { JSDOM } = require('jsdom');

class CrawlerService {
static async listenToTopic() {

    const consumer = await KafkaConsumer.getConsumer({topic: C.FIRST_SERVICE, groupId: `${C.FIRST_SERVICE}-group`});

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { link, nextStage,  retryCount = 1 } = JSON.parse(message.value.toString());
            try {
                console.log(`Received message from ${topic}:`, link);
                const parsedContent = await this.fetchAndParseLink(link);

                await kafkaProducer.produceMessage(C.ORCHESTRATOR, {
                    content: parsedContent,
                    nextStage: nextStage
                });
                console.log('Link processed successfully');
                } catch (error) {
                    console.error('Error processing message:', error.message);
                    const nextRetryCount = retryCount + 1;
                    await kafkaProducer.produceMessage(C.ORCHESTRATOR, {
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
            const content = linkData.data;

            const doc = new JSDOM(content);
            let reader = new Readability(doc.window.document);
            let article = reader.parse();
            const textContent = article.textContent;
            return textContent;
        } catch (error) {
            throw new Error(`Failed to fetch and parse link: ${error.message}`);
        }
    }
}

module.exports = CrawlerService;
