const { Kafka } = require('kafkajs');

const C = require('../constants');
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
            topic: C.ORCHESTRATOR,
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: C.FIRST_SERVICE,
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: C.SECOND_SERVICE,
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: C.THIRD_SERVICE,
            numPartitions: 1,
            replicationFactor: 1,
        },
        {
            topic: C.DEAD_LETTER,
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
