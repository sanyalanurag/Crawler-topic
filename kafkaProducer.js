const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const producer = kafka.producer();

class KafkaProducer {
    static async produceMessage(topic, message) {
        await producer.connect();
        await producer.send({
            topic: topic,
            messages: [
                { value: JSON.stringify(message) },
            ],
        });
        await producer.disconnect();
    }
}

module.exports = KafkaProducer;
