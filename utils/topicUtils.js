const { execSync } = require('child_process');

class TopicUtils {
    static extractTopics(content) {
        const PYTHON_SCRIPT_PATH = './extract_topics.py';
        const filteredContent = content.replace(/[^0-9a-zA-Z\s]/g, '');
        const result = execSync(`python3 ${PYTHON_SCRIPT_PATH} "${filteredContent}"`);
        const topics = JSON.parse(result.toString());
        const topicSet = new Set(topics.flat());
        return topicSet;
    }
}

module.exports = TopicUtils;
