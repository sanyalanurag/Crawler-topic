const { Kafka } = require('kafkajs');

// Kafka configuration
const kafka = new Kafka({
    clientId: 'my-app',
    brokers: ['localhost:9092']
});

const admin = kafka.admin();

async function createTopics() {
    await admin.connect();
    const topics = [
        {
            topic: 'scheduling-topic',
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: 'link-content-topic',
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: 'readability-service-topic',
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: 'topic-service-topic',
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: 'dead-letter-topic',
            numPartitions: 1,
            replicationFactor: 1,
        },
    ];

    await admin.createTopics({
        topics: topics,
        waitForLeaders: true,
    });

    console.log('Topics created or already exist');
    await admin.disconnect();
}

createTopics().catch(error => {
    console.error('Error creating topics:', error);
    process.exit(1);
});
