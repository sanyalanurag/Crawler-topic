const C = require('../constants');
const kafkaProducer = require('../kafkaProducer');
const KafkaConsumer = require('../kafkaConsumer');

class DataProcessingService {
    static async listenToTopic() {
        const consumer = await KafkaConsumer.getConsumer({topic: C.SECOND_SERVICE, groupId: `${C.SECOND_SERVICE}-group`});
        
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const { content, nextStage, retryCount = 1 } = JSON.parse(message.value.toString());
                
                try {
                    console.log('simulation readability processing');

                    await kafkaProducer.produceMessage(C.ORCHESTRATOR, {
                        content: content,
                        nextStage: nextStage,
                    });
                    console.log('Link processed successfully');
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

module.exports = DataProcessingService;