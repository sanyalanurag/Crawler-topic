const { Kafka } = require('kafkajs');

const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});


class KafkaConsumer {
    static async  getConsumer({topic, groupId}) {
        const consumer = kafka.consumer({ groupId });
        return consumer;
    }
}


module.exports = KafkaConsumer;
