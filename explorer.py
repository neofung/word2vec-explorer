
import gensim
import numpy as np
from tsne import bh_sne
from sklearn.cluster import KMeans

class Exploration(dict):

    def __init__(self, query, labels=[], vectors=[]):
        print('new Exploration')
        self.query = query
        self.labels = labels
        self.vectors = vectors
        self.reduction = []
        self.clusters = []

    def reduce(self):
        print('reducing tSNE on {} vectors'.format(len(self.vectors)))
        self.reduction = bh_sne(np.array(self.vectors, dtype=np.float64))

    def cluster(self, n_clusters=30):
        clustering = KMeans(n_clusters=n_clusters)
        clustering.fit(self.vectors)
        self.clusters = clustering.labels_

    def serialize(self):
        result = {
            'query': self.query,
            'labels': self.labels
        }
        if len(self.reduction) > 0:
            result['reduction'] = self.reduction.tolist()
        if len(self.clusters) > 0:
            result['clusters'] = self.clusters.tolist()
        return result

class Model(object):

    def __init__(self, filename):
        self.model = gensim.models.Word2Vec.load(filename)

    def explore(self, query, limit=1000):
        print('Model#explore query={}, limit={}'.format(query, limit))
        results = self.model.most_similar(query, topn=limit)
        print('Got {} results'.format(len(results)))
        exploration = Exploration(query)
        exploration.labels = []
        exploration.vectors = []
        for key, vector in results:
            exploration.labels.append(key)
            exploration.vectors.append(self.model[key])
        return exploration
