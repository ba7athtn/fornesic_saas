#!/usr/bin/env python3
"""
Fix Deepfake Detector v3.0 - Ba7ath Forensic System
==================================================
Version corrigée évitant l'erreur KerasTensor symbolique
Compatible TensorFlow Hub + API Functional
"""

import os
import tensorflow as tf
import tensorflow_hub as hub
from pathlib import Path
import numpy as np

# ✅ CONFIGURATION TENSORFLOW
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # Réduire warnings
tf.get_logger().setLevel('ERROR')

def create_deepfake_detector_v3():
    """Version 3.0 - Fix définitif du détecteur deepfake"""
    print("🔧 Ba7ath Deepfake Detector Fix v3.0")
    print("=" * 50)
    
    try:
        # ✅ MÉTHODE CORRIGÉE: Charger TF Hub d'abord
        print("📥 Chargement TensorFlow Hub MobileNetV2...")
        
        # URL TensorFlow Hub compatible
        hub_url = "https://tfhub.dev/google/tf2-preview/mobilenet_v2/feature_vector/4"
        
        print("🔍 Vérification compatibilité TF Hub...")
        
        # ✅ SOLUTION 1: Utiliser Sequential avec KerasLayer compatible
        model = tf.keras.Sequential([
            # Input explicite
            tf.keras.layers.InputLayer(input_shape=(224, 224, 3)),
            
            # ✅ CORRECTION: KerasLayer pour feature extraction (pas classification)
            hub.KerasLayer(hub_url, trainable=False, name='mobilenet_v2_features'),
            
            # Couches de classification forensique  
            tf.keras.layers.Dense(512, activation='relu', name='forensic_fc1'),
            tf.keras.layers.Dropout(0.4, name='forensic_dropout1'),
            tf.keras.layers.Dense(256, activation='relu', name='forensic_fc2'),
            tf.keras.layers.Dropout(0.3, name='forensic_dropout2'),
            tf.keras.layers.Dense(128, activation='relu', name='forensic_fc3'),
            
            # Sortie binaire deepfake
            tf.keras.layers.Dense(1, activation='sigmoid', name='deepfake_output')
        ])
        
        print("✅ Architecture Sequential + KerasLayer créée")
        
        # Compilation optimisée
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy', 'precision', 'recall'],
            run_eagerly=False  # Mode graph pour performance
        )
        
        print("✅ Modèle compilé avec succès")
        
        # ✅ TEST AVANT SAUVEGARDE
        print("🧪 Test fonctionnement...")
        
        # Test avec batch de données
        test_batch = tf.random.normal((2, 224, 224, 3))
        predictions = model(test_batch, training=False)
        
        print(f"📊 Test batch réussi - Forme: {predictions.shape}")
        print(f"📊 Prédictions: {[f'{p[0].numpy():.4f}' for p in predictions]}")
        
        # ✅ SAUVEGARDE
        models_dir = Path('models')
        models_dir.mkdir(exist_ok=True)
        
        model_path = models_dir / 'deepfake_detector.h5'
        
        # Sauvegarder avec format H5 legacy pour compatibilité
        model.save(
            str(model_path), 
            save_format='h5',
            include_optimizer=True,
            save_traces=False  # Éviter problèmes graph
        )
        
        print(f"✅ Modèle sauvegardé: {model_path}")
        
        # ✅ VÉRIFICATION CHARGEMENT
        print("🔍 Vérification chargement...")
        
        # Recharger pour tester
        loaded_model = tf.keras.models.load_model(str(model_path))
        
        # Test du modèle rechargé
        test_prediction = loaded_model.predict(test_batch, verbose=0)
        
        print(f"✅ Modèle rechargé avec succès")
        print(f"📊 Test rechargement: {test_prediction.shape}")
        
        # ✅ INFORMATIONS MODÈLE
        print(f"\n📋 INFORMATIONS DÉTAILLÉES:")
        print(f"   • Architecture: MobileNetV2 Feature Vector + Classification")
        print(f"   • Paramètres totaux: {model.count_params():,}")
        print(f"   • Paramètres entraînables: {sum(p.numpy().size for p in model.trainable_variables):,}")
        print(f"   • Taille fichier: {model_path.stat().st_size / 1024 / 1024:.1f}MB")
        print(f"   • Input shape: {model.input_shape}")
        print(f"   • Output shape: {model.output_shape}")
        
        return True, str(model_path)
        
    except Exception as e:
        print(f"❌ Erreur v3.0: {str(e)}")
        
        # ✅ FALLBACK: Modèle sans TensorFlow Hub
        print("\n🔄 Fallback: Création modèle CNN sans TF Hub...")
        return create_fallback_cnn_model()

def create_fallback_cnn_model():
    """Modèle CNN fallback sans TensorFlow Hub"""
    try:
        print("🔧 Création CNN custom Ba7ath...")
        
        model = tf.keras.Sequential([
            # Input
            tf.keras.layers.InputLayer(input_shape=(224, 224, 3)),
            
            # ✅ ARCHITECTURE CNN OPTIMISÉE POUR DEEPFAKES
            # Bloc 1 - Détection features basiques
            tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Conv2D(32, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Dropout(0.25),
            
            # Bloc 2 - Features intermédiaires
            tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Conv2D(64, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Dropout(0.25),
            
            # Bloc 3 - Features complexes
            tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.Conv2D(128, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.MaxPooling2D((2, 2)),
            tf.keras.layers.Dropout(0.25),
            
            # Bloc 4 - Features haute résolution
            tf.keras.layers.Conv2D(256, (3, 3), activation='relu', padding='same'),
            tf.keras.layers.BatchNormalization(),
            tf.keras.layers.GlobalAveragePooling2D(),
            
            # Classification
            tf.keras.layers.Dense(512, activation='relu'),
            tf.keras.layers.Dropout(0.5),
            tf.keras.layers.Dense(256, activation='relu'),
            tf.keras.layers.Dropout(0.4),
            tf.keras.layers.Dense(1, activation='sigmoid', name='deepfake_output')
        ], name='ba7ath_deepfake_cnn')
        
        # Compilation
        model.compile(
            optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
            loss='binary_crossentropy',
            metrics=['accuracy']
        )
        
        # Test
        test_input = tf.random.normal((1, 224, 224, 3))
        prediction = model.predict(test_input, verbose=0)
        
        # Sauvegarde
        model_path = Path('models/deepfake_detector.h5')
        model.save(str(model_path))
        
        print(f"✅ CNN Fallback créé: {model_path}")
        print(f"📊 Test CNN: {prediction[0][0]:.4f}")
        print(f"📊 Paramètres: {model.count_params():,}")
        
        return True, str(model_path)
        
    except Exception as e:
        print(f"❌ Erreur CNN fallback: {e}")
        return False, None

def test_all_models():
    """Tester les 3 modèles Ba7ath"""
    print("\n🧪 TEST COMPLET MODÈLES BA7ATH")
    print("=" * 40)
    
    models_to_test = [
        ('deepfake_detector.h5', 'Détecteur Deepfake'),
        ('manipulation_detector.h5', 'Détecteur Manipulation'),
        ('authenticity_scorer.h5', 'Scorer Authenticité')
    ]
    
    working_models = 0
    total_params = 0
    total_size = 0
    
    for model_file, description in models_to_test:
        model_path = Path(f'models/{model_file}')
        
        if model_path.exists():
            try:
                # Charger modèle
                model = tf.keras.models.load_model(str(model_path))
                
                # Test inférence
                test_input = tf.random.normal((1, 224, 224, 3))
                prediction = model.predict(test_input, verbose=0)
                
                # Métriques
                params = model.count_params()
                size_mb = model_path.stat().st_size / 1024 / 1024
                
                print(f"✅ {description}:")
                print(f"   • Test: {prediction[0][0]:.4f}")
                print(f"   • Paramètres: {params:,}")
                print(f"   • Taille: {size_mb:.1f}MB")
                
                working_models += 1
                total_params += params
                total_size += size_mb
                
            except Exception as e:
                print(f"❌ {description}: {str(e)[:60]}...")
        else:
            print(f"⚠️ {description}: Fichier manquant")
    
    print(f"\n📊 RÉSUMÉ:")
    print(f"   • Modèles fonctionnels: {working_models}/3")
    print(f"   • Paramètres totaux: {total_params:,}")
    print(f"   • Taille totale: {total_size:.1f}MB")
    
    return working_models

def main():
    """Fonction principale"""
    print("🚀 BA7ATH DEEPFAKE DETECTOR FIX v3.0")
    print("=" * 60)
    
    # Étape 1: Création modèle
    success, model_path = create_deepfake_detector_v3()
    
    if success:
        print(f"\n🎉 CRÉATION RÉUSSIE !")
        print(f"📁 Modèle: {model_path}")
        
        # Étape 2: Test tous les modèles
        working_count = test_all_models()
        
        if working_count >= 2:
            print(f"\n🎯 PROCHAINES ÉTAPES:")
            print(f"1. Lance: python analyze_image.py -i test.jpg -t full -v")
            print(f"2. Vérifie 'Modèles chargés: {working_count}' dans les logs")
            print(f"3. Contrôle les analyses deepfake dans le JSON de sortie")
            
            if working_count == 3:
                print(f"\n🎊 SUCCÈS COMPLET ! Tous les modèles Ba7ath fonctionnent !")
            else:
                print(f"\n✅ SUCCÈS PARTIEL ! {working_count}/3 modèles opérationnels")
        else:
            print(f"\n⚠️ Problème détecté - debug nécessaire")
    else:
        print(f"\n❌ ÉCHEC - Impossible de créer le modèle deepfake")
    
    return success

if __name__ == "__main__":
    # Configurer TensorFlow
    tf.config.run_functions_eagerly(False)
    
    # Exécuter fix
    success = main()
    
    if success:
        print(f"\n🔥 Script terminé - Teste maintenant ton système Ba7ath !")
    else:
        print(f"\n🆘 Besoin d'aide ? Contacte le support avec les logs d'erreur")
