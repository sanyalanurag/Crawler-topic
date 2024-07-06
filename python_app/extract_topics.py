import sys
import json
import spacy
from gensim.corpora import Dictionary
from gensim.models import LdaModel

class Preprocessor:
    def __init__(self, model='en_core_web_sm'):
        self.nlp = spacy.load(model, disable=['parser', 'ner'])

    def preprocess(self, text):
        doc = self.nlp(text)
        tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.is_alpha]
        return tokens

class TopicExtractor:
    def __init__(self, num_topics=5, num_words=3):
        self.num_topics = num_topics
        self.num_words = num_words

    def extract_topics(self, tokens):
        dictionary = Dictionary([tokens])
        corpus = [dictionary.doc2bow(tokens)]
        lda = LdaModel(corpus, num_topics=self.num_topics, id2word=dictionary, passes=15)

        topics = []
        for idx, topic in lda.print_topics(-1, num_words=self.num_words):
            topics.append([word.split('*')[1].strip().strip('"') for word in topic.split(' + ')])

        return topics

def main(text):
    try:
        preprocessor = Preprocessor()
        tokens = preprocessor.preprocess(text)

        topic_extractor = TopicExtractor()
        topics = topic_extractor.extract_topics(tokens)
        
        print(json.dumps(topics))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    text = sys.argv[1]
    main(text)
