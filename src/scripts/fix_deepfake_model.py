# fix_deepfake_model.py
import tensorflow as tf
import tensorflow_hub as hub

def fix_deepfake_detector():
    """Fix du détecteur deepfake avec Functional API"""
    
    # Input layer
    inputs = tf.keras.layers.Input(shape=(224, 224, 3))
    
    # TensorFlow Hub layer (compatible avec Functional API)
    hub_url = "https://tfhub.dev/google/tf2-preview/mobilenet_v2/classification/4"
    hub_layer = hub.KerasLayer(hub_url, trainable=False)(inputs)
    
    # Classification layers
    x = tf.keras.layers.Dense(128, activation='relu')(hub_layer)
    x = tf.keras.layers.Dropout(0.3)(x)
    outputs = tf.keras.layers.Dense(1, activation='sigmoid')(x)
    
    # Model
    model = tf.keras.Model(inputs=inputs, outputs=outputs)
    model.compile(optimizer='adam', loss='binary_crossentropy', metrics=['accuracy'])
    
    # Sauvegarder
    model.save('models/deepfake_detector.h5')
    print("✅ Détecteur deepfake fixé !")

if __name__ == "__main__":
    fix_deepfake_detector()
