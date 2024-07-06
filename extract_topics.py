import sys
import json
import spacy
from gensim.corpora import Dictionary
from gensim.models import LdaModel

# Load spaCy model
nlp = spacy.load('en_core_web_sm', disable=['parser', 'ner'])

def preprocess(text):
    doc = nlp(text)
    tokens = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct and token.is_alpha]
    return tokens

def extract_topics(text, num_topics=5, num_words=3):
    tokens = preprocess(text)
    dictionary = Dictionary([tokens])
    corpus = [dictionary.doc2bow(tokens)]
    lda = LdaModel(corpus, num_topics=num_topics, id2word=dictionary, passes=15)

    topics = []
    for idx, topic in lda.print_topics(-1, num_words=num_words):
        topics.append([word.split('*')[1].strip().strip('"') for word in topic.split(' + ')])

    return topics

if __name__ == "__main__":
    text = sys.argv[1]
    topics = extract_topics(text)
    print(json.dumps(topics))
