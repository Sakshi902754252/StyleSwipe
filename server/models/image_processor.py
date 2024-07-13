import numpy as np
import tensorflow as tf
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.preprocessing import image
from PIL import Image
import requests

class ImageProcessor:
    def __init__(self):
        self.model = ResNet50(weights='imagenet', include_top=False)

    def process_image(self, image_url):
        img = Image.open(requests.get(image_url, stream=True).raw)
        img = img.resize((224, 224))
        img_array = image.img_to_array(img)
        img_array = np.expand_dims(img_array, axis=0)
        img_array = tf.keras.applications.resnet50.preprocess_input(img_array)
        features = self.model.predict(img_array)
        return features.flatten()