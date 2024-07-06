const C = require('../constants');
const express = require('express');
const kafkaProducer = require('../kafkaProducer');

const router = express.Router();

router.post('/submit-link', async (req, res) => {
    try {
        console.log("Request received:", req.body);
        const link = req.body.link;

        await kafkaProducer.produceMessage(C.ORCHESTRATOR, { link, nextStage: C.FIRST_SERVICE });

        res.json({
            success: true,
            message: 'Link scheduled for processing'
        });
    } catch (error) {
        console.error("Error scheduling link processing:", error);
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
