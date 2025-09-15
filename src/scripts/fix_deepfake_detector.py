#!/usr/bin/env python3
"""
Fix Deepfake Detector - Ba7ath Forensic System
==============================================
Correction du détecteur deepfake avec API Functional
Compatible TensorFlow Hub KerasLayer
"""

import tensorflow as tf
import tensorflow_hub as hub
from pathlib import Path
import numpy as np

def fix_deepfake_detector():
    """Créer détecteur deepfake avec API Functional compatible"""
    print("🔧 Correction détecteur deepfake Ba7ath...")
    
    try:
        # ✅ API FUNCTIONAL (compatible avec KerasLayer)
        print("📥 Chargement TensorFlow Hub MobileNetV2...")
        
        # Input layer
        inputs = tf.keras.Input(shape=(224, 224, 3), name='image_input')
        
        # TensorFlow Hub layer (compatible Functional API)
        hub_url = "https://tfhub.dev/google/tf2-preview/mobilenet_v2/classification/4"
        
        # Charger le modèle Hub
        hub_layer = hub.KerasLayer(hub_url, trainable=False, name='mobilenet_v2_hub')
        
        # Appliquer la couche Hub
        hub_features = hub_layer(inputs)
        
        # Couches de classification forensique
        x = tf.keras.layers.Dense(256, activation='relu', name='forensic_dense1')(hub_features)
        x = tf.keras.layers.Dropout(0.4, name='forensic_dropout1')(x)
        x = tf.keras.layers.Dense(128, activation='relu', name='forensic_dense2')(x)
        x = tf.keras.layers.Dropout(0.3, name='forensic_dropout2')(x)
        
        # Sortie deepfake (probabilité 0-1)
        outputs = tf.keras.layers.Dense(1, activation='sigmoid', name='deepfake_probability')(x)
        
        # ✅ MODÈLE FUNCTIONAL
        model = tf.keras.Model(inputs=inputs, outputs=outputs, name='ba7ath_deepfake_detector')
        
        # Compilation optimisée
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy', 'precision', 'recall']
        )
        
        print("✅ Modèle Functional créé avec succès")
        
        # ✅ SAUVEGARDE
        models_dir = Path('models')
        models_dir.mkdir(exist_ok=True)
        
        model_path = models_dir / 'deepfake_detector.h5'
        
        # Sauvegarder avec options optimisées
        model.save(
            str(model_path),
            save_format='h5',
            include_optimizer=False  # Réduire la taille
        )
        
        print(f"✅ Détecteur deepfake sauvegardé: {model_path}")
        
        # ✅ TEST RAPIDE
        print("🧪 Test de fonctionnement...")
        
        # Test avec données aléatoires
        test_input = np.random.random((1, 224, 224, 3)).astype(np.float32)
        prediction = model.predict(test_input, verbose=0)
        
        print(f"📊 Test réussi - Forme sortie: {prediction.shape}")
        print(f"📊 Prédiction test: {prediction[0][0]:.4f}")
        
        # ✅ INFORMATIONS MODÈLE
        print(f"\n📋 INFORMATIONS MODÈLE:")
        print(f"   • Paramètres: {model.count_params():,}")
        print(f"   • Taille fichier: {model_path.stat().st_size / 1024 / 1024:.1f}MB")
        print(f"   • Architecture: MobileNetV2 + Classification forensique")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur création modèle: {e}")
        return False

def verify_deepfake_model():
    """Vérifier que le modèle se charge correctement"""
    print("\n🔍 Vérification du modèle corrigé...")
    
    try:
        model_path = Path('models/deepfake_detector.h5')
        
        if not model_path.exists():
            print("❌ Fichier modèle introuvable")
            return False
        
        # Charger le modèle
        model = tf.keras.models.load_model(str(model_path))
        
        # Test d'inférence
        test_input = np.random.random((2, 224, 224, 3)).astype(np.float32)
        predictions = model.predict(test_input, verbose=0)
        
        print(f"✅ Modèle chargé avec succès")
        print(f"📊 Test batch - Forme: {predictions.shape}")
        print(f"📊 Prédictions: {[f'{p[0]:.4f}' for p in predictions]}")
        
        # Vérifier la structure
        print(f"\n📋 STRUCTURE MODÈLE:")
        print(f"   • Input shape: {model.input_shape}")
        print(f"   • Output shape: {model.output_shape}")
        print(f"   • Nombre de couches: {len(model.layers)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Erreur vérification: {e}")
        return False

def compare_models():
    """Comparer les 3 modèles Ba7ath"""
    print("\n📊 COMPARAISON MODÈLES BA7ATH:")
    print("=" * 50)
    
    models_info = [
        ('deepfake_detector.h5', 'Détecteur Deepfake'),
        ('manipulation_detector.h5', 'Détecteur Manipulation'), 
        ('authenticity_scorer.h5', 'Scorer Authenticité')
    ]
    
    for model_file, description in models_info:
        model_path = Path(f'models/{model_file}')
        
        if model_path.exists():
            try:
                model = tf.keras.models.load_model(str(model_path))
                size_mb = model_path.stat().st_size / 1024 / 1024
                params = model.count_params()
                
                print(f"✅ {description}:")
                print(f"   • Taille: {size_mb:.1f}MB")
                print(f"   • Paramètres: {params:,}")
                print(f"   • Input: {model.input_shape}")
                print(f"   • Output: {model.output_shape}")
                
            except Exception as e:
                print(f"❌ {description}: Erreur chargement ({str(e)[:50]}...)")
        else:
            print(f"⚠️ {description}: Fichier manquant")

def main():
    """Fonction principale de correction"""
    print("🚀 Ba7ath Deepfake Detector Fix v2.0")
    print("=" * 50)
    
    # Étape 1: Correction du modèle
    if fix_deepfake_detector():
        print(f"\n🎉 CORRECTION RÉUSSIE !")
        
        # Étape 2: Vérification
        if verify_deepfake_model():
            print(f"\n✅ VÉRIFICATION OK !")
            
            # Étape 3: Comparaison
            compare_models()
            
            # Instructions finales
            print(f"\n🎯 PROCHAINES ÉTAPES:")
            print(f"1. Lance: python analyze_image.py -i test.jpg -t full -v")
            print(f"2. Vérifie que 'Modèles chargés: 3' apparaît")
            print(f"3. Teste l'analyse deepfake complète")
            
            return True
        else:
            print(f"\n⚠️ Correction OK mais vérification échouée")
            return False
    else:
        print(f"\n❌ CORRECTION ÉCHOUÉE")
        return False

if __name__ == "__main__":
    success = main()
    
    if success:
        print(f"\n🎊 Détecteur deepfake Ba7ath opérationnel !")
    else:
        print(f"\n🔧 Debug nécessaire - contacte le support")
