import ner

def process_text(data):
    extractor = ner.Extractor()
    res = []
    for url, text in data:
        d = {
            'url' : url, 
            'tokens' : []
        }
        for m in extractor(text):
            d['tokens'].append({
                'text' : ' '.join(map(lambda x : x.text, m.tokens)),
                'type' : m.type
            }
        res.append(d)
    return res
