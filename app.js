const express = require('express');

const topicController = require('./controllers/topicController');
const CrawlerService = require('./services/crawlerService');
const DataProcessingService = require('./services/dataProcessingService');
const SchedulerService = require('./services/schedulerService');
const TopicService = require('./services/keywordService');


const app = express();
app.use(express.json());

app.use('/api', topicController);

SchedulerService.listenToTopic();
CrawlerService.listenToTopic();
DataProcessingService.listenToTopic();
TopicService.listenToTopic();

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
