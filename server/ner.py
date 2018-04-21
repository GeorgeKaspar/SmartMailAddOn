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
    for elem in tokens:
        top[elem["type"]].add(elem["text"])
    res = "В письме упоминается: "
    if "ORG" in top.keys():
        res += "орг. "
        res += ", ".join(top["ORG"])
        res += "; "
    if "PER" in top.keys():
        res += "перс. "
        res += ", ".join(top["PER"])
        res += "; "
    if "LOC" in top.keys():
        res += "местоп. "
        res += ", ".join(top["LOC"])
        res += "; "
    return res[:-2] if len(res) > 0 else ""

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
            'url' : url
        }
        tokens = []
        for m in extractor(text):
            tokens.append({
                'text' : ' '.join(map(lambda x : x.text, m.tokens)),
                'type' : m.type
            })
        d['message'] = prettify(tokens)
        res.append(d)
    return res
