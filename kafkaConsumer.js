const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});


class KafkaConsumer {
    static async  getConsumer({topic, groupId}) {
        const consumer = kafka.consumer({ groupId });
        await consumer.connect();
        await consumer.subscribe({ topic, fromBeginning: true });
        return consumer;
    }
}


module.exports = KafkaConsumer;
