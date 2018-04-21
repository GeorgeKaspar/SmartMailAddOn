import ner
from collections import defaultdict
from pymystem3 import Mystem

def normalize_mystem(text):
    text = text.lower().replace('\n', ' ')
    m = Mystem()
    lemmas = m.lemmatize(text)
    return ''.join(lemmas)

def prettify(tokens):
    top = defaultdict(set)
    rank = len(tokens)
    print(tokens)
    for elem in tokens:
        top[elem["type"]].add(elem["text"])
    res = "В письме упоминается: "
    if "ORG" in top.keys():
        res += "орг. "
        res += ", ".join(top["ORG"])
        res += "; "
        rank -= len(top["ORG"])/2
    if "PER" in top.keys():
        res += "перс. "
        res += ", ".join(top["PER"])
        res += "; "
        rank -= len(top["PER"])/2
    if "LOC" in top.keys():
        res += "местоп. "
        res += ", ".join(top["LOC"])
        res += "; "
        rank -= len(top["LOC"])/2
    return res[:-2] if len(res) > 0 else "", rank

def process_text(data):
    """ Proccesses input data, returns message of contents in letters

    Args:
        data (list of tuples): Pairs of 'url' and 'text'

    Returns:
        list of dictionaries: {"url":url, "message": message}
    """
    extractor = ner.Extractor()
    res = []
    for url, text in data:
        d = {
            'url' : url, 
        }
        tokens = []
        text = normalize_mystem(text)
        for m in extractor(text):
            tokens.append({
                'text' : ' '.join(map(lambda x : x.text, m.tokens)),
                'type' : m.type
            })
        message, rank = prettify(tokens)
        d['message'] = message
        d['rank'] = rank
        res.append(d)
    res = sorted(res, key=lambda x: x['rank'], reverse=True)
    res = list(map(lambda x: {'message': x['message'], 'url': x['url']}, res))
    return res
