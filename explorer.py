
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
        clustering.fit(self.reduction)
        self.clusters = clustering.labels_
        clustermatrix = []
        reduction = self.reduction.tolist()
        for cluster_id in range(n_clusters):
            clustermatrix.append([reduction[i] for i in range(len(self.vectors)) if self.clusters[i] == cluster_id])
        self.cluster_centroids = clustering.cluster_centers_.tolist()
        self.cluster_centroids_closest_nodes = []
        for cluster_id in range(n_clusters):
            nodes_for_cluster = clustermatrix[cluster_id]
            closest_node_to_centroid = self._closest_node(self.cluster_centroids[cluster_id], nodes_for_cluster)
            coords = nodes_for_cluster[closest_node_to_centroid]
            node_id = reduction.index(coords)
            self.cluster_centroids_closest_nodes.append(node_id)

    def serialize(self):
        result = {
            'query': self.query,
            'labels': self.labels
        }
        if len(self.reduction) > 0:
            result['reduction'] = self.reduction.tolist()
        if len(self.clusters) > 0:
            result['clusters'] = self.clusters.tolist()
            result['cluster_centroids'] = self.cluster_centroids
            result['cluster_centroids_closest_nodes'] = self.cluster_centroids_closest_nodes
        return result

    def _closest_node(self, node, nodes):
        nodes = np.asarray(nodes)
        dist_2 = np.sum((nodes - node)**2, axis=1)
        return np.argmin(dist_2)

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
