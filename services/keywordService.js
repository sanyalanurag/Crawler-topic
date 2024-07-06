const C = require('../constants');
const TopicUtils = require('../utils/topicUtils');
const kafkaProducer = require('../kafkaProducer');
const KafkaConsumer = require('../kafkaConsumer');

class KeywordService {
    static async listenToTopic() {
        const consumer = await KafkaConsumer.getConsumer({topic: C.THIRD_SERVICE, groupId: `${C.THIRD_SERVICE}-group`});

        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const { content, nextStage, retryCount = 1 } = JSON.parse(message.value.toString());
                
                try {
                    console.log(`Processing message in TopicService (Retrycount ${retryCount}):`, content);
                    const topics = TopicUtils.extractTopics(content);
                    console.log('Topic extracted successfully', topics);
                } catch (error) {
                    console.error('Error processing message:', error.message);
                    const nextRetryCount = retryCount + 1;

                    await kafkaProducer.produceMessage(C.ORCHESTRATOR, {
                        error: error.message,
                        nextStage: topic,
                        retryCount: nextRetryCount,
                        content
                    });

                    console.log(`Error processed with retry count ${nextRetryCount}`);
                }
            },
        });
    }
}

module.exports = KeywordService;
