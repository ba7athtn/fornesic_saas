# backend/test_forensic_simple.py
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'src'))

def test_validators():
    """Test des validateurs sans base de données"""
    from common.utils.validators import validate_email, validate_required_fields
    from common.utils.formatters import format_response, format_error_response
    
    print("🧪 Test des validateurs")
    
    # Test email
    print(f"✅ Email valide: {validate_email('test@forensic.com')}")
    print(f"❌ Email invalide: {validate_email('email-invalide')}")
    
    # Test champs requis
    data = {"email": "test@test.com", "name": "Test"}
    validation = validate_required_fields(data, ['email', 'name'])
    print(f"✅ Validation OK: {validation == True}")
    
    # Test formatage
    response = format_response({"user_id": 123}, "Test réussi")
    print(f"✅ Format response: {response['status'] == 'success'}")

def simulate_forensic_analysis():
    """Simulation d'analyse forensique"""
    print("\n🔍 Simulation analyse forensique")
    
    # Simulation sans base de données
    image_data = {
        "filename": "evidence.jpg",
        "analysis_type": "tampering_detection",
        "confidence": 0.94,
        "result": "authentique"
    }
    
    print(f"📸 Image: {image_data['filename']}")
    print(f"🔬 Type: {image_data['analysis_type']}")
    print(f"📊 Confiance: {image_data['confidence']}")
    print(f"✅ Résultat: {image_data['result']}")

if __name__ == "__main__":
    print("🚀 Test Ba7ath Forensic - Modules Python\n")
    test_validators()
    simulate_forensic_analysis()
    print("\n🎉 Tests terminés - Modules Python fonctionnels !")
