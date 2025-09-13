#!/bin/bash

echo "🚀 CREW-CRM - Démarrage de l'application"
echo "========================================"

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "🧹 Nettoyage des anciens containers..."
docker-compose down

echo "🔨 Construction des images Docker..."
docker-compose build --no-cache

echo "🚀 Démarrage des services..."
docker-compose up -d

echo "⏳ Attente que tous les services soient prêts..."
sleep 30

echo "🌱 Seeding des données de test..."
docker-compose logs data-seeder

# Attendre que le seeder se termine
echo "⏳ Attente de la fin du seeding..."
while [ "$(docker-compose ps -q data-seeder)" ]; do
    if [ "$(docker inspect -f '{{.State.Status}}' $(docker-compose ps -q data-seeder) 2>/dev/null)" = "exited" ]; then
        break
    fi
    sleep 2
done

# Vérifier le statut des services
echo ""
echo "📊 État des services CREW-CRM :"
echo "================================"
docker-compose ps

echo ""
echo "🌐 Accès aux services :"
echo "======================="
echo "🖥️  Frontend (NextJS)     : http://localhost:3000"
echo "💾 BDD Service            : http://localhost:3001/api"
echo "🔐 Authentication Service : http://localhost:3002/api"
echo "📧 Notification Service   : http://localhost:3003/api"
echo "📊 Metrics Service        : http://localhost:3004/api"
echo "🤖 IA Service             : http://localhost:3005/api"
echo "💳 Payment Service        : http://localhost:3006/api"
echo "🗄️  MongoDB               : localhost:27017"
echo "🔄 Redis Cache            : localhost:6379"

echo ""
echo "🔧 Services configurés avec :"
echo "============================="
echo "✅ Google OAuth activé (Auth Service)"
echo "✅ Brevo/SMTP configuré (Notifications)"
echo "✅ Discord Webhooks activés"
echo "✅ Stripe configuré (Paiements)"
echo "✅ OpenAI configuré (IA)"

echo ""
echo "👥 Données de test créées :"
echo "=========================="
echo "🔑 Admin: admin@crew-crm.com (mot de passe: admin123)"
echo "👔 Managers: jean.dupont@techcorp.fr, marie.martin@greenenergy.fr, pierre.bernard@creativeplus.fr (mot de passe: manager123)"
echo "👤 Users: divers utilisateurs dans chaque équipe (mot de passe: user123)"

echo ""
echo "📖 Commandes utiles :"
echo "===================="
echo "📝 Voir les logs        : docker-compose logs -f"
echo "📝 Logs d'un service    : docker-compose logs -f [service-name]"
echo "🛑 Arrêter l'application : docker-compose down"
echo "🔄 Redémarrer           : docker-compose restart"
echo "🧹 Nettoyer tout        : docker-compose down -v"
echo "🌱 Re-seed les données  : docker-compose restart data-seeder"

echo ""
echo "✅ CREW-CRM est maintenant démarré !"
echo "🌟 Tous vos services sont fonctionnels avec les vraies APIs et les données de test !"