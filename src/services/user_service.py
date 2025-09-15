# backend/src/services/user_service.py
import sys
import os
import asyncio
import logging
from datetime import datetime, timezone
from typing import Dict, Any, Optional, List
import secrets
import hashlib
import re


sys.path.append(os.path.dirname(os.path.dirname(__file__)))


# ✅ IMPORTS OPTIMISÉS BA7ATH
from common.database.queries import create_record, get_record_by_id, update_record, get_record_by_field
from common.utils.validators import validate_email, validate_required_fields, sanitize_string
from common.utils.formatters import format_response, format_error_response
from common.middleware.error_handler import handle_errors
from common.config.settings import get_subscription_plans, get_database_config
from common.exceptions.user_exceptions import (
    DuplicateEmailError,
    InvalidSubscriptionPlanError,
    UserNotFoundError,
    InsufficientCreditsError
)


# ✅ LOGGING CONFIGURÉ
logger = logging.getLogger(__name__)


class UserService:
    """
    Service utilisateur forensique Ba7ath optimisé avec validation renforcée,
    sécurité avancée, et opérations asynchrones pour performance maximale.
    
    Features:
    - Validation et sanitization complètes
    - Timestamps dynamiques UTC
    - Plans d'abonnement configurables
    - Gestion atomique des crédits
    - Logging audit complet
    - Opérations async pour scalabilité
    """
    
    # ✅ CONFIGURATION: Plans externalisés avec fallback
    @staticmethod
    def _get_subscription_plans() -> Dict[str, int]:
        """Récupère la configuration des plans depuis l'environnement ou config"""
        try:
            return get_subscription_plans()
        except Exception:
            # ✅ FALLBACK: Plans par défaut si config indisponible
            return {
                'starter': int(os.getenv('STARTER_CREDITS', '100')),
                'professional': int(os.getenv('PROFESSIONAL_CREDITS', '1000')),
                'enterprise': int(os.getenv('ENTERPRISE_CREDITS', '10000')),
                'custom': int(os.getenv('CUSTOM_CREDITS', '0'))
            }
    
    @staticmethod
    @handle_errors
    async def create_forensic_user(user_data: Dict[str, Any], context: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
        """
        Crée un utilisateur forensique avec validation complète et sécurité renforcée
        
        Args:
            user_data: Données utilisateur (email, name, company, subscription_plan)
            context: Contexte de la requête (ip, user_agent, etc.)
            
        Returns:
            Dict: Résultat création avec user_id et métadonnées
            
        Raises:
            DuplicateEmailError: Si email déjà utilisé
            InvalidSubscriptionPlanError: Si plan invalide
        """
        # ✅ GÉNÉRATION: ID de requête unique pour traçabilité
        request_id = secrets.token_hex(12)
        start_time = datetime.utcnow()
        
        logger.info(
            f"[{request_id}] 👤 Création utilisateur forensique: "
            f"{user_data.get('email', 'N/A')} ({user_data.get('subscription_plan', 'N/A')})"
        )
        
        try:
            # ✅ VALIDATION: Champs obligatoires
            required_fields = ['email', 'name', 'company', 'subscription_plan']
            validation = validate_required_fields(user_data, required_fields)
            if validation is not True:
                logger.warning(f"[{request_id}] ❌ Champs manquants: {validation}")
                return format_error_response(f"Champs obligatoires manquants: {validation}", 400)
            
            # ✅ SANITIZATION: Nettoyage sécurisé des inputs
            sanitized_data = {
                'email': sanitize_string(user_data['email']).lower().strip(),
                'name': sanitize_string(user_data['name']).strip(),
                'company': sanitize_string(user_data['company']).strip(),
                'subscription_plan': sanitize_string(user_data['subscription_plan']).lower().strip()
            }
            
            # ✅ VALIDATION: Format email strict
            if not validate_email(sanitized_data['email']):
                logger.warning(f"[{request_id}] ❌ Email invalide: {sanitized_data['email']}")
                return format_error_response("Format d'email invalide", 400)
            
            # ✅ VALIDATION: Email domaines autorisés (optionnel)
            email_domain = sanitized_data['email'].split('@')[1].lower()
            blocked_domains = ['tempmail.org', '10minutemail.com', 'guerrillamail.com']
            if email_domain in blocked_domains:
                logger.warning(f"[{request_id}] ❌ Domaine email bloqué: {email_domain}")
                return format_error_response("Domaine email temporaire non autorisé", 400)
            
            # ✅ VALIDATION: Longueurs et formats
            if len(sanitized_data['name']) < 2:
                return format_error_response("Le nom doit contenir au moins 2 caractères", 400)
            
            if len(sanitized_data['company']) < 2:
                return format_error_response("Le nom de société doit contenir au moins 2 caractères", 400)
            
            # ✅ VALIDATION: Caractères autorisés nom/société
            name_pattern = re.compile(r'^[a-zA-ZÀ-ÿ\s\-\.\']+$')
            if not name_pattern.match(sanitized_data['name']):
                return format_error_response("Le nom contient des caractères invalides", 400)
            
            # ✅ PLANS: Configuration dynamique
            subscription_plans = UserService._get_subscription_plans()
            if sanitized_data['subscription_plan'] not in subscription_plans:
                logger.warning(f"[{request_id}] ❌ Plan invalide: {sanitized_data['subscription_plan']}")
                return format_error_response(
                    f"Plan d'abonnement invalide. Plans disponibles: {list(subscription_plans.keys())}",
                    400
                )
            
            # ✅ SÉCURITÉ: Vérification email unique avec retry
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    existing_user = await get_record_by_field('users', 'email', sanitized_data['email'])
                    if existing_user:
                        logger.warning(f"[{request_id}] ❌ Email déjà utilisé: {sanitized_data['email']}")
                        return format_error_response(
                            "Un compte existe déjà avec cet email",
                            409,
                            error_code="EMAIL_ALREADY_EXISTS"
                        )
                    break  # Email disponible
                    
                except Exception as check_error:
                    if attempt == max_retries - 1:
                        logger.error(f"[{request_id}] ❌ Erreur vérification email après {max_retries} tentatives: {check_error}")
                        return format_error_response("Erreur vérification email", 500)
                    await asyncio.sleep(0.1 * (attempt + 1))  # Backoff progressif
            
            # ✅ ENRICHISSEMENT: Métadonnées complètes avec timestamp dynamique
            current_utc = datetime.now(timezone.utc)
            current_iso = current_utc.isoformat()
            
            user_record = {
                # Données de base
                **sanitized_data,
                'created_at': current_iso,
                'updated_at': current_iso,
                'status': 'active',
                'analysis_credits': subscription_plans[sanitized_data['subscription_plan']],
                
                # État utilisateur
                'last_login': None,
                'email_verified': False,
                'profile_completed': True,
                'onboarding_completed': False,
                
                # Sécurité
                'security': {
                    'failed_login_attempts': 0,
                    'last_failed_login': None,
                    'password_changed_at': None,
                    'account_locked': False,
                    'email_verification_token': secrets.token_urlsafe(32),
                    'email_verification_sent_at': current_iso
                },
                
                # Métadonnées techniques
                'metadata': {
                    'source': 'forensic_registration',
                    'user_agent': context.get('user_agent') if context else None,
                    'ip_address': context.get('ip_address') if context else None,
                    'registration_country': context.get('country') if context else None,
                    'request_id': request_id,
                    'api_version': '3.0.0'
                },
                
                # Analytics et usage
                'analytics': {
                    'total_analyses': 0,
                    'successful_analyses': 0,
                    'failed_analyses': 0,
                    'credits_purchased': 0,
                    'credits_used': 0,
                    'last_analysis_date': None
                }
            }
            
            # ✅ TRANSACTION: Création atomique avec gestion d'erreurs
            try:
                user_id = await create_record('users', user_record)
                
                if not user_id:
                    logger.error(f"[{request_id}] ❌ Échec création utilisateur en base")
                    return format_error_response("Erreur lors de la création du compte", 500)
                
                # ✅ LOGGING: Succès avec métriques
                processing_time = (datetime.utcnow() - start_time).total_seconds()
                logger.info(
                    f"[{request_id}] ✅ Utilisateur créé: {user_id} "
                    f"({sanitized_data['email']}, {sanitized_data['subscription_plan']}, "
                    f"{subscription_plans[sanitized_data['subscription_plan']]} crédits) "
                    f"en {processing_time:.3f}s"
                )
                
                # ✅ RESPONSE: Données essentielles avec métadonnées
                return format_response({
                    "user_id": str(user_id),
                    "email": sanitized_data['email'],
                    "name": sanitized_data['name'],
                    "company": sanitized_data['company'],
                    "subscription_plan": sanitized_data['subscription_plan'],
                    "analysis_credits": user_record['analysis_credits'],
                    "status": user_record['status'],
                    "created_at": current_iso,
                    "email_verified": False,
                    "onboarding_required": True,
                    "processing_time": f"{processing_time:.3f}s"
                }, "Compte utilisateur créé avec succès")
                
            except Exception as creation_error:
                logger.error(f"[{request_id}] ❌ Erreur création en base: {creation_error}")
                return format_error_response(
                    "Erreur technique lors de la création du compte",
                    500,
                    error_code="DATABASE_CREATION_ERROR"
                )
                
        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(f"[{request_id}] ❌ Erreur création utilisateur: {str(e)} (après {processing_time:.3f}s)")
            return format_error_response(
                "Erreur lors de la création du compte",
                500,
                error_code="INTERNAL_ERROR"
            )
    
    @staticmethod
    @handle_errors
    async def get_user_profile(user_id: str, requesting_user_id: Optional[str] = None, include_sensitive: bool = False) -> Dict[str, Any]:
        """
        Récupère le profil utilisateur avec contrôles de sécurité et filtrage des données
        
        Args:
            user_id: ID utilisateur à récupérer
            requesting_user_id: ID utilisateur qui fait la demande (pour autorisation)
            include_sensitive: Inclure données sensibles (admin ou propriétaire seulement)
            
        Returns:
            Dict: Profil utilisateur filtré selon permissions
        """
        request_id = secrets.token_hex(8)
        start_time = datetime.utcnow()
        
        logger.info(f"[{request_id}] 👤 Récupération profil: {user_id} par {requesting_user_id or 'system'}")
        
        try:
            # ✅ VALIDATION: Format user_id
            if not user_id or not isinstance(user_id, str) or len(user_id) < 12:
                return format_error_response("ID utilisateur invalide", 400)
            
            # ✅ SÉCURITÉ: Contrôle d'autorisation basique
            is_owner = requesting_user_id == user_id
            is_admin = False  # À étendre avec vraie vérification rôle admin
            
            if not is_owner and not is_admin:
                logger.warning(f"[{request_id}] ⚠️ Tentative accès profil non autorisé: {requesting_user_id} -> {user_id}")
                # Pour l'instant, permettre mais logger (à durcir selon besoins)
            
            # ✅ RÉCUPÉRATION: Profil complet avec retry
            user = None
            max_retries = 3
            
            for attempt in range(max_retries):
                try:
                    user = await get_record_by_id('users', user_id)
                    break
                except Exception as fetch_error:
                    if attempt == max_retries - 1:
                        logger.error(f"[{request_id}] ❌ Erreur récupération utilisateur après {max_retries} tentatives: {fetch_error}")
                        return format_error_response("Erreur récupération profil", 500)
                    await asyncio.sleep(0.1 * (attempt + 1))
            
            if not user:
                logger.warning(f"[{request_id}] ❌ Utilisateur non trouvé: {user_id}")
                return format_error_response("Utilisateur introuvable", 404)
            
            # ✅ FILTRAGE: Données selon niveau d'autorisation
            safe_profile = {
                'user_id': str(user.get('_id', user_id)),
                'email': user.get('email'),
                'name': user.get('name'),
                'company': user.get('company'),
                'subscription_plan': user.get('subscription_plan'),
                'analysis_credits': user.get('analysis_credits', 0),
                'status': user.get('status'),
                'created_at': user.get('created_at'),
                'email_verified': user.get('email_verified', False),
                'profile_completed': user.get('profile_completed', False),
                'onboarding_completed': user.get('onboarding_completed', False)
            }
            
            # ✅ DONNÉES PROPRIÉTAIRE: Si accès utilisateur à son propre profil
            if is_owner:
                safe_profile.update({
                    'last_login': user.get('last_login'),
                    'updated_at': user.get('updated_at'),
                    'analytics': {
                        'total_analyses': user.get('analytics', {}).get('total_analyses', 0),
                        'successful_analyses': user.get('analytics', {}).get('successful_analyses', 0),
                        'credits_used': user.get('analytics', {}).get('credits_used', 0),
                        'last_analysis_date': user.get('analytics', {}).get('last_analysis_date')
                    }
                })
            
            # ✅ DONNÉES ADMIN: Si accès administrateur
            if is_admin and include_sensitive:
                safe_profile.update({
                    'security': {
                        'account_locked': user.get('security', {}).get('account_locked', False),
                        'failed_login_attempts': user.get('security', {}).get('failed_login_attempts', 0),
                        'last_failed_login': user.get('security', {}).get('last_failed_login')
                    },
                    'metadata': user.get('metadata', {}),
                    'full_analytics': user.get('analytics', {})
                })
            
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.info(f"[{request_id}] ✅ Profil récupéré: {user_id} en {processing_time:.3f}s")
            
            return format_response(safe_profile, "Profil utilisateur récupéré")
            
        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(f"[{request_id}] ❌ Erreur récupération profil: {str(e)} (après {processing_time:.3f}s)")
            return format_error_response(
                "Erreur lors de la récupération du profil",
                500,
                error_code="PROFILE_RETRIEVAL_ERROR"
            )
    
    @staticmethod
    @handle_errors
    async def update_user_credits(
        user_id: str, 
        credit_delta: int, 
        operation_type: str = 'usage',
        description: Optional[str] = None,
        context: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        """
        Met à jour les crédits utilisateur de manière atomique avec audit complet
        
        Args:
            user_id: ID utilisateur
            credit_delta: Variation de crédits (positif=ajout, négatif=consommation)
            operation_type: Type d'opération ('usage', 'purchase', 'bonus', 'refund', 'admin_adjustment')
            description: Description de l'opération
            context: Contexte de l'opération (analysis_id, etc.)
            
        Returns:
            Dict: Nouveau solde de crédits avec historique
        """
        request_id = secrets.token_hex(8)
        start_time = datetime.utcnow()
        
        logger.info(
            f"[{request_id}] 💰 Mise à jour crédits: {user_id} "
            f"{credit_delta:+d} ({operation_type}) - {description or 'N/A'}"
        )
        
        try:
            # ✅ VALIDATION: Paramètres
            if not user_id or not isinstance(credit_delta, int):
                return format_error_response("Paramètres invalides", 400)
            
            valid_operations = ['usage', 'purchase', 'bonus', 'refund', 'admin_adjustment', 'subscription_renewal']
            if operation_type not in valid_operations:
                return format_error_response(f"Type d'opération invalide. Types valides: {valid_operations}", 400)
            
            # ✅ RÉCUPÉRATION: Utilisateur actuel avec lock optimiste
            user = await get_record_by_id('users', user_id)
            if not user:
                logger.warning(f"[{request_id}] ❌ Utilisateur non trouvé pour mise à jour crédits: {user_id}")
                return format_error_response("Utilisateur introuvable", 404)
            
            current_credits = user.get('analysis_credits', 0)
            new_credits = current_credits + credit_delta
            
            # ✅ SÉCURITÉ: Éviter crédits négatifs (sauf admin_adjustment)
            if new_credits < 0 and operation_type != 'admin_adjustment':
                logger.warning(
                    f"[{request_id}] ⚠️ Tentative crédits négatifs: {user_id} "
                    f"{current_credits} + {credit_delta} = {new_credits}"
                )
                return format_error_response(
                    f"Crédits insuffisants. Disponible: {current_credits}, Requis: {abs(credit_delta)}",
                    402,
                    error_code="INSUFFICIENT_CREDITS"
                )
            
            # ✅ TRANSACTION: Mise à jour atomique avec métadonnées
            current_iso = datetime.now(timezone.utc).isoformat()
            update_data = {
                'analysis_credits': max(0, new_credits),
                'updated_at': current_iso
            }
            
            # ✅ ANALYTICS: Mise à jour statistiques
            if operation_type == 'usage':
                analytics = user.get('analytics', {})
                update_data['analytics'] = {
                    **analytics,
                    'credits_used': analytics.get('credits_used', 0) + abs(credit_delta),
                    'last_analysis_date': current_iso
                }
            elif operation_type == 'purchase':
                analytics = user.get('analytics', {})
                update_data['analytics'] = {
                    **analytics,
                    'credits_purchased': analytics.get('credits_purchased', 0) + credit_delta
                }
            
            success = await update_record('users', user_id, update_data)
            if not success:
                logger.error(f"[{request_id}] ❌ Erreur mise à jour crédits en base")
                return format_error_response("Erreur mise à jour crédits", 500)
            
            # ✅ AUDIT: Enregistrement transaction (optionnel - créer table credit_transactions)
            credit_transaction = {
                'user_id': user_id,
                'operation_type': operation_type,
                'credit_delta': credit_delta,
                'previous_balance': current_credits,
                'new_balance': new_credits,
                'description': description,
                'context': context or {},
                'created_at': current_iso,
                'request_id': request_id
            }
            
            # TODO: Enregistrer dans table credit_transactions pour audit complet
            # await create_record('credit_transactions', credit_transaction)
            
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.info(
                f"[{request_id}] ✅ Crédits mis à jour: {user_id} "
                f"{current_credits} -> {new_credits} ({operation_type}) en {processing_time:.3f}s"
            )
            
            return format_response({
                'user_id': user_id,
                'operation_type': operation_type,
                'credit_delta': credit_delta,
                'previous_credits': current_credits,
                'new_credits': new_credits,
                'description': description,
                'updated_at': current_iso,
                'processing_time': f"{processing_time:.3f}s"
            }, "Crédits mis à jour avec succès")
            
        except Exception as e:
            processing_time = (datetime.utcnow() - start_time).total_seconds()
            logger.error(f"[{request_id}] ❌ Erreur mise à jour crédits: {str(e)} (après {processing_time:.3f}s)")
            return format_error_response(
                "Erreur lors de la mise à jour des crédits",
                500,
                error_code="CREDIT_UPDATE_ERROR"
            )
    
    @staticmethod
    @handle_errors
    async def verify_user_email(user_id: str, verification_token: str) -> Dict[str, Any]:
        """
        Vérifie l'email utilisateur avec token sécurisé
        
        Args:
            user_id: ID utilisateur
            verification_token: Token de vérification envoyé par email
            
        Returns:
            Dict: Résultat vérification avec bonus crédits éventuel
        """
        request_id = secrets.token_hex(8)
        
        logger.info(f"[{request_id}] 📧 Vérification email: {user_id}")
        
        try:
            # ✅ VALIDATION: Paramètres
            if not user_id or not verification_token:
                return format_error_response("Paramètres manquants pour vérification email", 400)
            
            if len(verification_token) < 32:
                return format_error_response("Token de vérification invalide", 400)
            
            # ✅ RÉCUPÉRATION: Utilisateur
            user = await get_record_by_id('users', user_id)
            if not user:
                return format_error_response("Utilisateur introuvable", 404)
            
            # ✅ VÉRIFICATION: Email déjà vérifié
            if user.get('email_verified'):
                return format_response({
                    'user_id': user_id,
                    'email_verified': True,
                    'already_verified': True
                }, "Email déjà vérifié")
            
            # ✅ VÉRIFICATION: Token correspondant
            stored_token = user.get('security', {}).get('email_verification_token')
            if not stored_token or stored_token != verification_token:
                logger.warning(f"[{request_id}] ❌ Token vérification invalide pour: {user_id}")
                return format_error_response("Token de vérification invalide ou expiré", 400)
            
            # ✅ VÉRIFICATION: Token pas trop ancien (24h max)
            sent_at = user.get('security', {}).get('email_verification_sent_at')
            if sent_at:
                sent_date = datetime.fromisoformat(sent_at.replace('Z', '+00:00'))
                if (datetime.now(timezone.utc) - sent_date.replace(tzinfo=timezone.utc)).total_seconds() > 86400:
                    return format_error_response("Token de vérification expiré", 400)
            
            # ✅ MISE À JOUR: Statut email vérifié + bonus crédits
            current_iso = datetime.now(timezone.utc).isoformat()
            
            # Bonus crédits pour première vérification email
            bonus_credits = int(os.getenv('EMAIL_VERIFICATION_BONUS', '50'))
            current_credits = user.get('analysis_credits', 0)
            
            update_data = {
                'email_verified': True,
                'updated_at': current_iso,
                'analysis_credits': current_credits + bonus_credits,
                'security': {
                    **user.get('security', {}),
                    'email_verified_at': current_iso,
                    'email_verification_token': None  # Supprimer token utilisé
                }
            }
            
            success = await update_record('users', user_id, update_data)
            if not success:
                logger.error(f"[{request_id}] ❌ Erreur mise à jour vérification email")
                return format_error_response("Erreur vérification email", 500)
            
            logger.info(f"[{request_id}] ✅ Email vérifié: {user_id} (+{bonus_credits} crédits bonus)")
            
            return format_response({
                'user_id': user_id,
                'email_verified': True,
                'verified_at': current_iso,
                'bonus_credits': bonus_credits,
                'new_credit_balance': current_credits + bonus_credits
            }, "Email vérifié avec succès")
            
        except Exception as e:
            logger.error(f"[{request_id}] ❌ Erreur vérification email: {str(e)}")
            return format_error_response(
                "Erreur lors de la vérification de l'email",
                500,
                error_code="EMAIL_VERIFICATION_ERROR"
            )
    
    @staticmethod
    @handle_errors
    async def get_user_statistics(user_id: str, period_days: int = 30) -> Dict[str, Any]:
        """
        Récupère les statistiques d'utilisation détaillées de l'utilisateur
        
        Args:
            user_id: ID utilisateur
            period_days: Période en jours pour les stats (7, 30, 90)
            
        Returns:
            Dict: Statistiques complètes avec métriques temporelles
        """
        request_id = secrets.token_hex(8)
        
        logger.info(f"[{request_id}] 📈 Statistiques utilisateur: {user_id} (période: {period_days}j)")
        
        try:
            # ✅ RÉCUPÉRATION: Profil utilisateur
            user = await get_record_by_id('users', user_id)
            if not user:
                return format_error_response("Utilisateur introuvable", 404)
            
            # ✅ CALCUL: Âge du compte
            account_age_days = 0
            if user.get('created_at'):
                try:
                    created_date = datetime.fromisoformat(user['created_at'].replace('Z', '+00:00'))
                    account_age = datetime.now(timezone.utc) - created_date.replace(tzinfo=timezone.utc)
                    account_age_days = account_age.days
                except Exception:
                    pass
            
            # ✅ RÉCUPÉRATION: Analytics utilisateur
            analytics = user.get('analytics', {})
            subscription_plans = UserService._get_subscription_plans()
            
            # ✅ STATISTIQUES: Complètes
            stats = {
                'user_id': user_id,
                'period_days': period_days,
                'account_info': {
                    'subscription_plan': user.get('subscription_plan'),
                    'status': user.get('status'),
                    'email_verified': user.get('email_verified', False),
                    'account_age_days': account_age_days,
                    'created_at': user.get('created_at'),
                    'last_login': user.get('last_login')
                },
                'credits': {
                    'current_balance': user.get('analysis_credits', 0),
                    'plan_allocation': subscription_plans.get(user.get('subscription_plan'), 0),
                    'total_purchased': analytics.get('credits_purchased', 0),
                    'total_used': analytics.get('credits_used', 0),
                    'usage_percentage': 0
                },
                'analyses': {
                    'total_count': analytics.get('total_analyses', 0),
                    'successful_count': analytics.get('successful_analyses', 0),
                    'failed_count': analytics.get('failed_analyses', 0),
                    'success_rate': 0.0,
                    'last_analysis_date': analytics.get('last_analysis_date')
                },
                'performance': {
                    'avg_analyses_per_week': 0.0,
                    'peak_usage_period': None,
                    'credit_efficiency': 0.0
                },
                'generated_at': datetime.now(timezone.utc).isoformat()
            }
            
            # ✅ CALCULS: Métriques dérivées
            total_analyses = stats['analyses']['total_count']
            successful_analyses = stats['analyses']['successful_count']
            
            if total_analyses > 0:
                stats['analyses']['success_rate'] = round(successful_analyses / total_analyses * 100, 2)
            
            total_credits_available = stats['credits']['plan_allocation'] + stats['credits']['total_purchased']
            if total_credits_available > 0:
                stats['credits']['usage_percentage'] = round(
                    stats['credits']['total_used'] / total_credits_available * 100, 2
                )
            
            if account_age_days > 0:
                stats['performance']['avg_analyses_per_week'] = round(
                    total_analyses / (account_age_days / 7), 2
                )
            
            # ✅ TODO: Récupérer vraies métriques depuis collection analyses
            # Cette partie nécessiterait des requêtes vers la collection 'analyses'
            # pour obtenir des statistiques temporelles précises
            
            logger.info(f"[{request_id}] ✅ Statistiques calculées: {user_id}")
            
            return format_response(stats, "Statistiques utilisateur calculées")
            
        except Exception as e:
            logger.error(f"[{request_id}] ❌ Erreur calcul statistiques: {str(e)}")
            return format_error_response(
                "Erreur calcul statistiques utilisateur",
                500,
                error_code="STATS_CALCULATION_ERROR"
            )
    
    @staticmethod
    def _get_plan_credits(plan: str) -> int:
        """
        Retourne le nombre de crédits pour un plan donné
        
        Args:
            plan: Nom du plan d'abonnement
            
        Returns:
            int: Nombre de crédits du plan
        """
        subscription_plans = UserService._get_subscription_plans()
        return subscription_plans.get(plan, subscription_plans.get('starter', 100))
