const express = require('express');

const topicController = require('./controllers/topicController');
const LinkService = require('./services/linkService');
const ReadabilityService = require('./services/readabilityService');
const SchedulerService = require('./services/schedulerService');
const TopicService = require('./services/topicService');


const app = express();
app.use(express.json());

app.use('/api', topicController);

ReadabilityService.listenToReadabilityServiceTopic();
TopicService.listenToTopicServiceTopic();
SchedulerService.listenToSchedulingTopic();
LinkService.listenToLinkContentTopic();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
