# backend/src/services/user_service.py
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from common.database.queries import create_record, get_record_by_id, update_record
from common.utils.validators import validate_email, validate_required_fields
from common.utils.formatters import format_response, format_error_response
from common.middleware.error_handler import handle_errors

class UserService:
    @staticmethod
    @handle_errors
    def create_forensic_user(user_data):
        """Crée un utilisateur pour le SaaS forensique"""
        
        # Validation des champs obligatoires
        required_fields = ['email', 'name', 'company', 'subscription_plan']
        validation = validate_required_fields(user_data, required_fields)
        if validation != True:
            return format_error_response(validation, 400)
        
        # Validation email
        if not validate_email(user_data['email']):
            return format_error_response("Format d'email invalide", 400)
        
        # Validation du plan d'abonnement
        valid_plans = ['starter', 'professional', 'enterprise']
        if user_data['subscription_plan'] not in valid_plans:
            return format_error_response("Plan d'abonnement invalide", 400)
        
        # Ajout de métadonnées
        user_data['created_at'] = '2025-09-05T02:30:00Z'
        user_data['status'] = 'active'
        user_data['analysis_credits'] = UserService._get_plan_credits(user_data['subscription_plan'])
        
        # Création en base
        user_id = create_record('users', user_data)
        
        return format_response({
            "user_id": user_id,
            "plan": user_data['subscription_plan'],
            "credits": user_data['analysis_credits']
        }, "Compte utilisateur créé avec succès")
    
    @staticmethod
    def _get_plan_credits(plan):
        """Retourne le nombre de crédits selon le plan"""
        credits_map = {
            'starter': 100,
            'professional': 1000,
            'enterprise': 10000
        }
        return credits_map.get(plan, 100)
    
    @staticmethod
    @handle_errors
    def get_user_profile(user_id):
        """Récupère le profil complet d'un utilisateur"""
        user = get_record_by_id('users', user_id)
        if not user:
            return format_error_response("Utilisateur introuvable", 404)
        
        return format_response(user)
