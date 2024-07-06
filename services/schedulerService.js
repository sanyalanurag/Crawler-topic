const MessageFactory = require('../utils/messageFactory');
const KafkaProducer = require('../kafkaProducer');
const KafkaConsumer = require('../kafkaConsumer');


class SchedulerService {
    static async listenToSchedulingTopic() {
        const consumer = await KafkaConsumer.getConsumer({topic: 'scheduling-topic', groupId: 'scheduler-group'});
        
        await consumer.run({
            eachMessage: async ({ topic, partition, message }) => {
                const { content, link,  nextStage, retryCount = 0 } = JSON.parse(message.value.toString());

                console.log(content, link, nextStage);
                console.log(`Attempting to process message (retryCount: ${retryCount})`);
                console.log("Data written to DB");

                const { outputTopic, messagePayload } = MessageFactory.createMessage(nextStage, {
                    link,
                    content,
                    retryCount,
                } )

                await KafkaProducer.produceMessage(outputTopic, messagePayload);
            },
        });
    }
}

module.exports = SchedulerService;

