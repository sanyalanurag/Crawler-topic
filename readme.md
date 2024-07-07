# Crawler & Topic extraction

This repository contains both Python and Node.js code to simulate a multi-stage processing pipeline using Kafka for communication between services. The project involves several microservices that work together to process and analyze web links.

## Table of Contents

- [Installation](#installation)
  - [Python Dependencies](#python-dependencies)
  - [Node.js Dependencies](#nodejs-dependencies)
  - [Kafka and Zookeeper](#kafka-and-zookeeper)
- [Setup](#setup)
  - [Creating Kafka Topics](#creating-kafka-topics)
- [Running the Application](#running-the-application)
- [Services Overview](#services-overview)
  - [Submit-Link Route](#submit-link-route)
  - [Scheduler Service](#scheduler-service)
  - [Crawler Service](#crawler-service)
  - [Data Processing Service](#data-processing-service)
  - [Keyword Extractor Service](#keyword-extractor-service)
- [Technologies Used](#technologies-used)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Python Dependencies

1. Create a virtual environment using `venv`:
   ```sh
   python -m venv venv
   ```
2. Activate the virtual environment:
   - On Windows:
     ```sh
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```sh
     source venv/bin/activate
     ```
3. Install Python dependencies using `pip`:
   ```sh
   pip install -r requirements.txt
   ```

### Node.js Dependencies

Install Node.js dependencies using the following command:
```sh
npm install
```

### Kafka and Zookeeper

This project uses Kafka for communication between the services. To install Kafka with Zookeeper, follow these steps:

1. Pull the Docker images:
   ```sh
   docker-compose pull
   ```
2. Start the containers:
   ```sh
   docker-compose up -d
   ```
3. Verify that the containers are running:
   ```sh
   docker-compose ps
   ```

## Setup

### Creating Kafka Topics

Once Kafka is set up, create the necessary topics by running the `createKafkaTopics.js` file inside the `scripts` folder:
```sh
node scripts/createKafkaTopics.js
```

## Running the Application

Start the application by running:
```sh
node app.js
```
The app will listen on port 3000 and contains a `/app/submit-link` route that will accept a POST request with the following body:
```json
{
  "link": "www.abc.com"
}
```

## Services Overview

### Submit-Link Route

- Accepts incoming messages and writes them to the scheduler (orchestrator queue).
- The message contains the link and the next stage to which the orchestrator must send the message for further processing.

### Scheduler Service

- Acts as an orchestrator with an input queue.
- Responsible for updating the database and writing the message to the next stage from the incoming message.
- Manages retries and writes messages to a dead letter queue if retries are exhausted.

### Crawler Service

- Receives messages from the scheduler service.
- Extracts and parses HTML using the Mozilla Readability library.
- If successful, writes the message to the scheduler queue with the text content and the next stage as the data processing service.
- Handles errors and retries by incrementing the retry count.

### Data Processing Service

- Cleans up the content extracted by the crawler service.
- Includes custom logic for data processing.
- If successful, writes the message to the scheduler queue with the next stage as the keyword extractor service.
- Handles errors and retries by incrementing the retry count.

### Keyword Extractor Service

- Processes the text refined by the data processing service.
- Uses a Python script with the `spacy` and `gensim` libraries for keyword extraction.
- Steps include removing stop words, creating a bag-of-words (BoW) corpus, and extracting topics.
- Formats keywords as a list of lists, where each sublist contains the top words for a topic.
- If successful, writes the message to the database.

## Technologies Used

- **Node.js**: Backend runtime environment.
- **Python**: For text processing and keyword extraction.
- **Kafka**: Message broker for communication between services.
- **Docker**: Containerization of services.
- **spacy, gensim**: Python libraries for NLP and topic modeling.