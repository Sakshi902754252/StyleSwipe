from sklearn.cluster import KMeans
import numpy as np

class StyleAnalyzer:
    def __init__(self, n_clusters=5):
        self.kmeans = KMeans(n_clusters=n_clusters)

    def analyze_style(self, features):
        features = np.array(features)
        if features.shape[0] < self.kmeans.n_clusters:
            # Adjust n_clusters to the number of available samples
            self.kmeans = KMeans(n_clusters=features.shape[0])
        self.kmeans.fit(features.reshape(features.shape[0], -1))
        return self.kmeans.labels_[0]

    def aggregate_style(self, styles):
        # Simple aggregation by taking the most common style
        return max(set(styles), key=styles.count)