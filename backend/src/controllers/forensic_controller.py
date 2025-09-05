# backend/src/controllers/forensic_controller.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from services.user_service import UserService
from scripts.analyze_image import analyze_image_forensic
from common.utils.formatters import format_response, format_error_response
from common.middleware.error_handler import handle_errors

class ForensicController:
    @staticmethod
    @handle_errors
    def register_user_endpoint(request_data):
        """Endpoint d'inscription utilisateur"""
        result = UserService.create_forensic_user(request_data)
        return result
    
    @staticmethod
    @handle_errors
    def analyze_image_endpoint(request_data):
        """Endpoint d'analyse d'image"""
        
        # Vérification des crédits utilisateur (simulation)
        user_id = request_data.get('user_id')
        if not user_id:
            return format_error_response("ID utilisateur requis", 400)
        
        # Analyse de l'image
        result = analyze_image_forensic(request_data)
        
        # Déduction des crédits (simulation)
        if result.get('status') == 'success':
            # Ici vous décrémenteriez les crédits en base
            pass
        
        return result
    
    @staticmethod
    @handle_errors
    def get_analysis_history(user_id):
        """Récupère l'historique des analyses"""
        if not user_id:
            return format_error_response("ID utilisateur requis", 400)
        
        # Simulation de l'historique
        history = {
            "user_id": user_id,
            "total_analyses": 47,
            "remaining_credits": 953,
            "recent_analyses": [
                {
                    "analysis_id": "ANA_001",
                    "image_name": "evidence_01.jpg",
                    "date": "2025-09-05T01:15:00Z",
                    "result": "authentique",
                    "confidence": 0.96
                },
                {
                    "analysis_id": "ANA_002", 
                    "image_name": "suspect_photo.png",
                    "date": "2025-09-05T00:45:00Z",
                    "result": "manipulation détectée",
                    "confidence": 0.89
                }
            ]
        }
        
        return format_response(history, "Historique récupéré")
