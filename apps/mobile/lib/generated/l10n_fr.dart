// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for French (`fr`).
class AppLocalizationsFr extends AppLocalizations {
  AppLocalizationsFr([String locale = 'fr']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => 'Tableau de bord';

  @override
  String get manageProperties => 'Gérer les propriétés';

  @override
  String get quickAccess => 'Accès rapide';

  @override
  String get properties => 'Propriétés';

  @override
  String get tenants => 'Locataires';

  @override
  String get payments => 'Paiements';

  @override
  String get tasks => 'Tâches';

  @override
  String get summaryStatistics => 'Statistiques récapitulatives';

  @override
  String get totalProperties => 'Total des propriétés';

  @override
  String occupancyRate(Object rate) {
    return 'Taux d\'occupation : $rate';
  }

  @override
  String get monthlyCashflow => 'Flux de trésorerie mensuel';

  @override
  String pendingPayments(Object count) {
    return 'Paiements en attente : $count';
  }

  @override
  String get pendingTasks => 'Tâches en attente';

  @override
  String tasksThisWeek(Object count) {
    return '$count cette semaine';
  }

  @override
  String get propertyDetailTitle => 'Détails de la propriété';

  @override
  String get propertyDetailOverviewTab => 'Aperçu';

  @override
  String get propertyDetailFeaturesTab => 'Caractéristiques';

  @override
  String get propertyDetailLocationTab => 'Localisation';

  @override
  String get propertyDetailGalleryTab => 'Galerie';

  @override
  String get propertyDetailId => 'ID';

  @override
  String get propertyDetailNumber => 'Numéro de propriété';

  @override
  String get propertyDetailTitleField => 'Titre';

  @override
  String get propertyDetailDescription => 'Description';

  @override
  String get propertyDetailType => 'Type';

  @override
  String get propertyDetailStatus => 'Statut';

  @override
  String get propertyDetailCategory => 'Catégorie';

  @override
  String get propertyDetailCondition => 'Condition';

  @override
  String get propertyDetailMarketValue => 'Valeur marchande';

  @override
  String get propertyDetailBedrooms => 'Chambres';

  @override
  String get propertyDetailBathrooms => 'Salles de bain';

  @override
  String get propertyDetailYearBuilt => 'Année de construction';

  @override
  String get propertyDetailFeatures => 'Caractéristiques';

  @override
  String get propertyDetailAmenities => 'Équipements';

  @override
  String get propertyDetailAddress => 'Adresse';

  @override
  String get propertyDetailCity => 'Ville';

  @override
  String get propertyDetailState => 'État/Province';

  @override
  String get propertyDetailCountry => 'Pays';

  @override
  String get propertyDetailZipCode => 'Code postal';

  @override
  String get propertyDetailCoordinates => 'Coordonnées';

  @override
  String get propertyDetailNoFeatures =>
      'Aucune caractéristique ou équipement disponible';

  @override
  String get propertyDetailNoLocation =>
      'Aucune information de localisation disponible';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'Vue Galerie (à implémenter avec GridView d\'images)';

  @override
  String get propertyDetailDeleteConfirm =>
      'Êtes-vous sûr de vouloir supprimer cette propriété ?';

  @override
  String get propertyDetailDeleteSuccess => 'Propriété supprimée avec succès';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'Échec de la suppression de la propriété : $error';
  }

  @override
  String get propertyDetailContactAgent => 'Contacter l\'agent';

  @override
  String get propertyDetailPrice => 'Prix';

  @override
  String get propertyDetailLoading =>
      'Chargement des détails de la propriété...';

  @override
  String get propertyDetailNotFound => 'Propriété introuvable.';

  @override
  String get totalTenants => 'Total des locataires';

  @override
  String newTenants(Object count) {
    return 'Nouveaux locataires : $count';
  }

  @override
  String get homeLabel => 'Accueil';

  @override
  String get favoritesEmpty => 'Aucun favori pour l\'instant';

  @override
  String get favoritesError => 'Erreur lors du chargement des favoris';

  @override
  String get favoritesRetry => 'Réessayer';

  @override
  String get emptyStateRetry => 'Réessayer';

  @override
  String get listings => 'Mes propriétés';

  @override
  String get listingsEmpty => 'Aucune annonce pour l\'instant';

  @override
  String get listingsRetry => 'Réessayer';

  @override
  String get filterPropertiesTitle => 'Filtrer les propriétés';

  @override
  String get filterPropertiesApply => 'Appliquer';

  @override
  String get filterPropertiesCancel => 'Annuler';

  @override
  String get messagesLabel => 'Messages';

  @override
  String get notificationsLabel => 'Notifications';

  @override
  String get notificationsEmpty => 'Aucune notification pour l\'instant';

  @override
  String get paymentsLabel => 'Paiements';

  @override
  String get settingsLabel => 'Paramètres';

  @override
  String get settingsAppearance => 'Apparence';

  @override
  String get settingsDarkMode => 'Mode sombre';

  @override
  String get filterTasksTitle => 'Filtrer les tâches';

  @override
  String get filterTasksStatus => 'Statut';

  @override
  String get filterTasksPriority => 'Priorité';

  @override
  String get filterTasksType => 'Type';

  @override
  String get filterTasksDueDate => 'Date d\'échéance';

  @override
  String get filterTasksApply => 'Appliquer';

  @override
  String get filterTasksCancel => 'Annuler';

  @override
  String get profileLabel => 'Profil';

  @override
  String get logoutLabel => 'Déconnexion';

  @override
  String get loggingout => 'Déconnexion en cours...';

  @override
  String get sitetitle => 'RentalProc';

  @override
  String get nav_home => 'Accueil';

  @override
  String get nav_properties => 'Propriétés';

  @override
  String get nav_payments => 'Paiements';

  @override
  String get nav_tasks => 'Tâches';

  @override
  String get nav_messages => 'Messages';

  @override
  String get nav_notifications => 'Notifications';

  @override
  String get nav_helpdesk => 'Service d\'assistance';

  @override
  String get nav_subscription => 'Abonnement';

  @override
  String get nav_settings => 'Paramètres';

  @override
  String get nav_tenants => 'Locataires';

  @override
  String get nav_expenses => 'Dépenses';

  @override
  String get nav_facilities => 'Installations';

  @override
  String get nav_analytics => 'Analytique';

  @override
  String get nav_help => 'Aide';

  @override
  String get nav_logout => 'Déconnexion';

  @override
  String get nav_profile => 'Profil';

  @override
  String get nav_viewAll => 'Tout afficher';

  @override
  String get indexTitle => 'Bienvenue sur Menem';

  @override
  String get indexDescription => 'Votre solution de gestion immobilière';

  @override
  String get indexPropertyManagementTitle => 'Gestion immobilière';

  @override
  String get indexPropertyManagementDescription =>
      'Gérez vos propriétés efficacement grâce à notre suite complète d\'outils.';

  @override
  String get indexWaterManagementTitle => 'Gestion de l\'eau';

  @override
  String get indexWaterManagementDescription =>
      'Suivez et optimisez la consommation d\'eau dans vos propriétés.';

  @override
  String get authSignIn => 'Se connecter avec Google';

  @override
  String get authSignOut => 'Se déconnecter';

  @override
  String get createPropertyTitle => 'Créer une nouvelle propriété';

  @override
  String get propertyCreatedSuccess => 'Propriété créée avec succès';

  @override
  String get propertyCreatedError => 'Échec de la création de la propriété';

  @override
  String get registerAlreadyHaveAccount =>
      'Vous avez déjà un compte ? Connectez-vous';

  @override
  String get registerForgotPassword => 'Mot de passe oublié ?';

  @override
  String get propertyViewingEventsTitle => 'Événements de visite';

  @override
  String get propertyViewingSchedule => 'Planifier une visite';

  @override
  String authWelcomeBack(Object name) {
    return 'Bienvenue de retour, $name';
  }

  @override
  String get postsCreate => 'Créer une publication';

  @override
  String get postsTitle => 'Titre';

  @override
  String get postsContent => 'Contenu';

  @override
  String get postsLoading => 'Chargement des publications...';

  @override
  String get postsSave => 'Enregistrer';

  @override
  String get postsCancel => 'Annuler';

  @override
  String get postsEdit => 'Modifier';

  @override
  String get postsDelete => 'Supprimer';

  @override
  String get postsNoPostsYet => 'Aucune publication pour l\'instant';

  @override
  String get postsErrorUnauthorized =>
      'Vous devez être connecté pour effectuer cette action';

  @override
  String get postsErrorCreatePost => 'Échec de la création de la publication';

  @override
  String get postsErrorUpdatePost =>
      'Échec de la mise à jour de la publication';

  @override
  String get postsErrorDeletePost =>
      'Échec de la suppression de la publication';

  @override
  String get chatMessages => 'Messages';

  @override
  String chatChattingWith(Object name) {
    return 'Discussion avec $name';
  }

  @override
  String get chatConnectWithUsers =>
      'Connectez-vous avec les utilisateurs et obtenez de l\'aide';

  @override
  String get chatBackToList => 'Retour à la liste';

  @override
  String get chatWelcomeToChat => 'Bienvenue dans le chat';

  @override
  String get chatWelcomeDescription =>
      'Démarrez une conversation avec d\'autres utilisateurs ou contactez le support pour obtenir de l\'aide';

  @override
  String get chatNewMessage => 'Nouveau message';

  @override
  String get chatContactSupport => 'Contacter le support';

  @override
  String get chatBack => 'Retour';

  @override
  String get chatSearchUsers => 'Rechercher des utilisateurs...';

  @override
  String get chatTypeMessage => 'Tapez votre message...';

  @override
  String get chatSend => 'Envoyer';

  @override
  String get chatErrorUnauthorized =>
      'Vous devez être connecté pour effectuer cette action';

  @override
  String get chatErrorSendMessage => 'Échec de l\'envoi du message';

  @override
  String get chatErrorMarkAsRead => 'Échec du marquage des messages comme lus';

  @override
  String get chatError => 'Erreur';

  @override
  String get chatConnectionError =>
      'Échec de la connexion au serveur de chat. Veuillez réessayer.';

  @override
  String get chatMessageSendError =>
      'Échec de l\'envoi de votre message. Veuillez réessayer plus tard.';

  @override
  String get notifications_placeholder => 'Aucune notification pour l\'instant';

  @override
  String get notificationsPlaceholder => 'Aucune notification pour l\'instant';

  @override
  String commonTimeAgo(Object time) {
    return 'il y a $time';
  }

  @override
  String get commonSuccess => 'Succès';

  @override
  String get commonError => 'Erreur';

  @override
  String propertiesFound(Object count) {
    return '$count propriétés trouvées';
  }

  @override
  String get errorScreenTitle => 'Erreur';

  @override
  String get errorScreenGoBack => 'Retour';

  @override
  String get dateRangeSelectTitle => 'Sélectionner une plage de dates';

  @override
  String get dateRangeSelectApply => 'Appliquer';

  @override
  String get dateRangeSelectCancel => 'Annuler';

  @override
  String get commonWarning => 'Avertissement';

  @override
  String get commonInfo => 'Information';

  @override
  String get commonLoading => 'Chargement...';

  @override
  String get commonSave => 'Enregistrer';

  @override
  String get commonCancel => 'Annuler';

  @override
  String get commonDelete => 'Supprimer';

  @override
  String get commonEdit => 'Modifier';

  @override
  String get commonCreate => 'Créer';

  @override
  String get commonView => 'Voir';

  @override
  String get commonPrevious => 'Précédent';

  @override
  String get commonNext => 'Suivant';

  @override
  String get commonBack => 'Retour';

  @override
  String get commonConfirm => 'Confirmer';

  @override
  String get commonActions => 'Actions';

  @override
  String get commonSearch => 'Rechercher';

  @override
  String get commonFilter => 'Filtrer';

  @override
  String get commonSort => 'Trier';

  @override
  String get commonNoData => 'Aucune donnée disponible';

  @override
  String get editAgentTooltip => 'Modifier l\'agent';

  @override
  String get agentContactInformationTitle => 'Informations de contact';

  @override
  String get agentEmailLabel => 'E-mail';

  @override
  String get agentPhoneLabel => 'Téléphone';

  @override
  String get agentAddressLabel => 'Adresse';

  @override
  String get agentWebsiteLabel => 'Site web';

  @override
  String get agentProfessionalInformationTitle =>
      'Informations professionnelles';

  @override
  String get agentStatusLabel => 'Statut';

  @override
  String get agentAgencyLabel => 'Agence';

  @override
  String get agentSpecialitiesLabel => 'Spécialités';

  @override
  String get agentActivityTitle => 'Activité récente';

  @override
  String get agentLastActiveLabel => 'Dernière activité';

  @override
  String get agentIsActiveLabel => 'Est actif';

  @override
  String get agentCreatedAtLabel => 'Créé le';

  @override
  String get agentAdditionalInformationTitle => 'Informations supplémentaires';

  @override
  String get agentBioLabel => 'Biographie';

  @override
  String get agentExternalIdLabel => 'ID externe';

  @override
  String get agentSettingsLabel => 'Paramètres';

  @override
  String get agentIntegrationLabel => 'Intégration';

  @override
  String get agentOwnerIdLabel => 'ID du propriétaire';

  @override
  String get agentAgencyIdLabel => 'ID de l\'agence';

  @override
  String get agentDeletedAtLabel => 'Supprimé le';

  @override
  String get amenitiesSectionTitle => 'Équipements';

  @override
  String get noAmenitiesListed => 'Aucun équipement listé';

  @override
  String get locationSectionTitle => 'Localisation';

  @override
  String get getDirectionsButton => 'Obtenir l\'itinéraire';

  @override
  String get messageStatusRead => 'Lu';

  @override
  String get messageStatusDelivered => 'Livré';

  @override
  String get messageStatusSent => 'Envoyé';

  @override
  String get defaultUser => 'Utilisateur par défaut';

  @override
  String get unknownTime => 'Heure inconnue';

  @override
  String get commonNotAvailable => 'Non disponible';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count comptes trouvés',
      one: '1 compte trouvé',
      zero: 'Aucun compte trouvé',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => 'Propriétés';

  @override
  String get actionCardTenants => 'Locataires';

  @override
  String get actionCardAnalytics => 'Analytique';

  @override
  String get actionCardPayments => 'Paiements';

  @override
  String get actionCardTasks => 'Tâches';

  @override
  String get actionCardMessages => 'Messages';

  @override
  String get actionCardHelpDesk => 'Service d\'assistance';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'Gérez votre portefeuille immobilier';

  @override
  String get actionCardManageTenantInformation =>
      'Gérer les informations des locataires';

  @override
  String get actionCardViewReportsAndAnalytics =>
      'Afficher les rapports et les analyses';

  @override
  String get actionCardTrackFinancialRecords =>
      'Suivre les enregistrements financiers';

  @override
  String get actionCardManageMaintenanceTasks =>
      'Gérer les tâches de maintenance';

  @override
  String get actionCardCommunicateWithTenants =>
      'Communiquer avec les locataires';

  @override
  String get actionCardGetAssistanceWhenNeeded =>
      'Obtenir de l\'aide si nécessaire';

  @override
  String get actionCardAddProperty => 'Ajouter une propriété';

  @override
  String get actionCardCreateANewPropertyListing =>
      'Créer une nouvelle annonce immobilière';

  @override
  String get actionCardAddTenant => 'Ajouter un locataire';

  @override
  String get actionCardRegisterANewTenant => 'Enregistrer un nouveau locataire';

  @override
  String get actionCardRecordPayment => 'Enregistrer un paiement';

  @override
  String get actionCardRecordARentPayment => 'Enregistrer un paiement de loyer';

  @override
  String get actionCardAddTask => 'Ajouter une tâche';

  @override
  String get actionCardCreateAMaintenanceTask =>
      'Créer une tâche de maintenance';

  @override
  String get actionCardScheduleEvent => 'Planifier un événement';

  @override
  String get actionCardCreateAPropertyEvent =>
      'Créer un événement de propriété';

  @override
  String get actionCardComposeMessage => 'Composer un message';

  @override
  String get actionCardSendAMessageToTenants =>
      'Envoyer un message aux locataires';

  @override
  String get actionCardCreateDocument => 'Créer un document';

  @override
  String get actionCardGenerateANewDocument => 'Générer un nouveau document';

  @override
  String get actionCardGetStarted => 'Commencer';

  @override
  String get actionCardNewThisMonth => 'Nouveau ce mois-ci';

  @override
  String get tenantsTitle => 'Locataires';

  @override
  String get tenantsDescription =>
      'Gérez les informations des locataires et les baux de vos propriétés';

  @override
  String get tenantsAddTenant => 'Ajouter un locataire';

  @override
  String get tenantsPropertyFilter => 'Propriété';

  @override
  String get tenantsAllProperties => 'Toutes les propriétés';

  @override
  String get tenantsPaymentStatusFilter => 'Statut du paiement';

  @override
  String get tenantsAllStatuses => 'Tous les statuts';

  @override
  String get tenantsTenantColumn => 'Locataire';

  @override
  String get tenantsStatusColumn => 'Statut';

  @override
  String get tenantsPropertyUnitColumn => 'Propriété / Unité';

  @override
  String get tenantsContactColumn => 'Contact';

  @override
  String get tenantsLeasePeriodColumn => 'Période de location';

  @override
  String get tenantsActionsColumn => 'Actions';

  @override
  String get tenantsIdLabel => 'ID';

  @override
  String get tenantsNotAssigned => 'Non attribué';

  @override
  String get tenantsNotAvailable => 'N/A';

  @override
  String get tenantsLeaseFrom => 'Du';

  @override
  String get tenantsLeaseTo => 'Au';

  @override
  String get tenantsViewDetails => 'Voir les détails';

  @override
  String get tenantsEdit => 'Modifier';

  @override
  String get tenantsDelete => 'Supprimer';

  @override
  String get tenantsNoTenantsFound => 'Aucun locataire trouvé';

  @override
  String get tenantsGetStartedAddTenant =>
      'Commencez par ajouter un nouveau locataire';

  @override
  String get tenantsConfirmDeletionTitle => 'Confirmer la suppression';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return 'Êtes-vous sûr de vouloir supprimer le locataire $tenant ? Cette action est irréversible.';
  }

  @override
  String get tenantsCancel => 'Annuler';

  @override
  String get tenantsDeleting => 'Suppression en cours...';

  @override
  String get tenantsPrevious => 'Précédent';

  @override
  String get tenantsNext => 'Suivant';

  @override
  String get tenantsStatusUnpaid => 'Non payé';

  @override
  String get tenantsStatusPartiallyPaid => 'Partiellement payé';

  @override
  String get tenantsStatusPaid => 'Payé';

  @override
  String get tenantsStatusRefunded => 'Remboursé';

  @override
  String get tenantsStatusOverdue => 'En retard';

  @override
  String get tenantsStatusCancelled => 'Annulé';

  @override
  String get agenciesTitle => 'Agences';

  @override
  String get agenciesDescription => 'Gérez vos agences et leurs paramètres.';

  @override
  String get agenciesSearch => 'Rechercher des agences...';

  @override
  String get agenciesStatus => 'Statut';

  @override
  String get agenciesStatusValuesPending => 'En attente';

  @override
  String get agenciesStatusValuesVerified => 'Vérifié';

  @override
  String get agenciesStatusValuesRejected => 'Rejeté';

  @override
  String get agenciesAdd => 'Ajouter une agence';

  @override
  String get agenciesEdit => 'Modifier';

  @override
  String get agenciesDelete => 'Supprimer';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return 'Êtes-vous sûr de vouloir supprimer $name ? Cette action est irréversible.';
  }

  @override
  String get agenciesDeletedMsg => 'Agence supprimée avec succès.';

  @override
  String get agenciesNone =>
      'Aucune agence ne correspond à votre recherche. Essayez d\'autres filtres.';

  @override
  String get agenciesNa => 'N/A';

  @override
  String get agenciesAgents => 'Agents';

  @override
  String get agenciesView => 'Voir';

  @override
  String get agenciesName => 'Nom de l\'agence';

  @override
  String get agenciesEmail => 'E-mail';

  @override
  String get agenciesPhoneNumber => 'Numéro de téléphone';

  @override
  String get agenciesAddress => 'Adresse';

  @override
  String get agenciesWebsite => 'Site web';

  @override
  String get agenciesLogoUrl => 'URL du logo';

  @override
  String get agenciesCreated => 'Créé';

  @override
  String get agenciesUpdated => 'Mis à jour';

  @override
  String get agenciesProperties => 'Propriétés';

  @override
  String get agenciesActions => 'Actions';

  @override
  String get agenciesCancel => 'Annuler';

  @override
  String get agenciesDeleting => 'Suppression en cours...';

  @override
  String get agenciesCreating => 'Création en cours...';

  @override
  String get agenciesSaving => 'Enregistrement en cours...';

  @override
  String get agenciesSave => 'Enregistrer';

  @override
  String get agenciesCreate => 'Créer';

  @override
  String get agenciesGetStarted => 'Commencez par ajouter une nouvelle agence';

  @override
  String get agenciesRequired => 'Ce champ est obligatoire.';

  @override
  String get agenciesInvalidEmail => 'Adresse e-mail invalide.';

  @override
  String get agenciesInvalidUrl => 'URL invalide.';

  @override
  String get agenciesUpdatedMsg => 'Mis à jour !';

  @override
  String get agenciesCreatedMsg => 'Créé !';

  @override
  String get agenciesErrorLoad => 'Échec du chargement des détails.';

  @override
  String get agenciesErrorCreate => 'Échec de la création.';

  @override
  String get agenciesErrorUpdate => 'Échec de la mise à jour.';

  @override
  String get agenciesErrorDelete => 'Échec de la suppression.';

  @override
  String get loginPageTitle => 'Connexion';

  @override
  String get loginPageEmail => 'E-mail';

  @override
  String get loginPagePassword => 'Mot de passe';

  @override
  String get loginPageRememberMe => 'Se souvenir de moi';

  @override
  String get loginPageForgotPassword => 'Mot de passe oublié ?';

  @override
  String get loginPageSignIn => 'Se connecter';

  @override
  String get loginPageOrContinueWith => 'Ou continuer avec';

  @override
  String get loginPageDontHaveAccount => 'Vous n\'avez pas de compte ?';

  @override
  String get loginPageSignUp => 'S\'inscrire';

  @override
  String get loginPageErrorInvalidCredentials =>
      'E-mail ou mot de passe invalide';

  @override
  String get loginPageErrorSomethingWentWrong =>
      'Quelque chose s\'est mal passé. Veuillez réessayer.';

  @override
  String get loginPageErrorSessionExpired =>
      'Votre session a expiré. Veuillez vous reconnecter.';

  @override
  String get authErrorTitle => 'Erreur d\'authentification';

  @override
  String get authErrorSomethingWentWrong =>
      'Quelque chose s\'est mal passé pendant l\'authentification. Veuillez réessayer.';

  @override
  String get authErrorOauthAccountNotLinked =>
      'Un compte avec cette adresse e-mail existe déjà. Veuillez vous connecter avec la méthode d\'authentification d\'origine.';

  @override
  String get authErrorOauthCallbackError =>
      'Une erreur s\'est produite lors du processus de rappel OAuth.';

  @override
  String get authErrorOauthCreateAccountError =>
      'Échec de la création d\'un nouveau compte. Veuillez réessayer.';

  @override
  String get authErrorOauthSignInError =>
      'Erreur lors de la connexion avec le fournisseur sélectionné. Veuillez réessayer.';

  @override
  String get authErrorBackToLogin => 'Retour à la connexion';

  @override
  String get propertyTitle => 'Détails de la propriété';

  @override
  String get propertyBackToProperties => 'Retour aux propriétés';

  @override
  String get propertyEditProperty => 'Modifier la propriété';

  @override
  String get propertyDeleteProperty => 'Supprimer la propriété';

  @override
  String get propertyCreateProperty => 'Créer une propriété';

  @override
  String get propertyAddProperty => 'Ajouter une propriété';

  @override
  String get propertyLoading => 'Chargement de la propriété...';

  @override
  String get propertyNotFound => 'Propriété introuvable.';

  @override
  String get propertyDebugInfo => 'Informations de débogage :';

  @override
  String get propertyConfirmDeleteTitle =>
      'Êtes-vous sûr de vouloir supprimer cette propriété ?';

  @override
  String get propertyConfirmDeleteDescription =>
      'Cette action est irréversible. Toutes les données associées à cette propriété seront définitivement supprimées.';

  @override
  String get propertyConfirmDeleteCancel => 'Annuler';

  @override
  String get propertyConfirmDeleteConfirm => 'Confirmer la suppression';

  @override
  String get propertyTabsOverview => 'Aperçu';

  @override
  String get propertyTabsFeatures => 'Caractéristiques';

  @override
  String get propertyTabsAmenities => 'Équipements';

  @override
  String get propertyTabsLocation => 'Localisation';

  @override
  String get propertyTabsDocuments => 'Documents';

  @override
  String get propertyTabsHistory => 'Historique';

  @override
  String get propertySectionsBasicInfo => 'Informations de base';

  @override
  String get propertySectionsPhysicalCharacteristics =>
      'Caractéristiques physiques';

  @override
  String get propertySectionsContactInfo => 'Informations de contact';

  @override
  String get propertySectionsRelatedEntities => 'Entités liées';

  @override
  String get propertySectionsMetadata => 'Métadonnées';

  @override
  String get propertySectionsFeatures => 'Caractéristiques';

  @override
  String get propertySectionsAmenities => 'Équipements';

  @override
  String get propertySectionsLocationInfo => 'Informations de localisation';

  @override
  String get propertyFieldsTitle => 'Titre';

  @override
  String get propertyFieldsDescription => 'Description';

  @override
  String get propertyFieldsPropertyType => 'Type de propriété';

  @override
  String get propertyFieldsStatus => 'Statut';

  @override
  String get propertyFieldsCategory => 'Catégorie';

  @override
  String get propertyFieldsBuildingClass => 'Classe de bâtiment';

  @override
  String get propertyFieldsCondition => 'Condition';

  @override
  String get propertyFieldsSize => 'Taille (m²)';

  @override
  String get propertyFieldsBedrooms => 'Chambres';

  @override
  String get propertyFieldsBathrooms => 'Salles de bain';

  @override
  String get propertyFieldsYearBuilt => 'Année de construction';

  @override
  String get propertyFieldsContactEmail => 'E-mail de contact';

  @override
  String get propertyFieldsContactPhone => 'Téléphone de contact';

  @override
  String get propertyFieldsOwner => 'Propriétaire';

  @override
  String get propertyFieldsAgent => 'Agent';

  @override
  String get propertyFieldsAgency => 'Agence';

  @override
  String get propertyFieldsCreated => 'Créé';

  @override
  String get propertyFieldsUpdated => 'Mis à jour';

  @override
  String get propertyFieldsListed => 'Listé';

  @override
  String get propertyFieldsAddress => 'Adresse';

  @override
  String get propertyFieldsCity => 'Ville';

  @override
  String get propertyFieldsStateProvince => 'État/Province';

  @override
  String get propertyFieldsPostalCode => 'Code postal';

  @override
  String get propertyFieldsCountry => 'Pays';

  @override
  String get propertyFieldsCoordinates => 'Coordonnées';

  @override
  String get propertyFieldsLatitude => 'Latitude';

  @override
  String get propertyFieldsLongitude => 'Longitude';

  @override
  String get propertyNoFeatures => 'Aucune caractéristique listée';

  @override
  String get propertyNoAmenities => 'Aucun équipement listé';

  @override
  String get propertyNoCoordinates => 'Aucune coordonnée disponible';

  @override
  String get propertySuccessDeleted => 'Propriété supprimée avec succès';

  @override
  String get propertySuccessCreated => 'Propriété créée avec succès';

  @override
  String get propertySuccessUpdated => 'Propriété mise à jour avec succès';

  @override
  String get propertyErrorDelete => 'Échec de la suppression de la propriété';

  @override
  String get propertyErrorCreate => 'Échec de la création de la propriété';

  @override
  String get propertyErrorUpdate => 'Échec de la mise à jour de la propriété';

  @override
  String get propertyErrorFetch =>
      'Échec de la récupération des détails de la propriété';

  @override
  String get adminDashboard => 'Tableau de bord administrateur';

  @override
  String get adminProperties => 'Propriétés';

  @override
  String get adminAgents => 'Agents';

  @override
  String get adminAgencies => 'Agences';

  @override
  String get adminOwners => 'Propriétaires';

  @override
  String get adminTenants => 'Locataires';

  @override
  String get adminPayments => 'Paiements';

  @override
  String get adminTasks => 'Tâches';

  @override
  String get adminMessages => 'Messages';

  @override
  String get adminReports => 'Rapports';

  @override
  String get adminAnalytics => 'Analytique';

  @override
  String get adminSettings => 'Paramètres';

  @override
  String get adminNotifications => 'Notifications';

  @override
  String get account_id => 'ID du compte';

  @override
  String get account_type => 'Type';

  @override
  String get account_provider => 'Fournisseur';

  @override
  String get accountFilter_type_BANK => 'Compte bancaire';

  @override
  String get accountFilter_type_CREDIT_CARD => 'Carte de crédit';

  @override
  String get accountFilter_type_INVESTMENT => 'Compte d\'investissement';

  @override
  String get accountFilter_type_SAVINGS => 'Compte d\'épargne';

  @override
  String get accountFilter_type_LOAN => 'Compte de prêt';

  @override
  String get accountFilter_type_OTHER => 'Autre compte';

  @override
  String get facilityDetailTitle => 'Détails de l\'installation';

  @override
  String get facilityDetailId => 'ID';

  @override
  String get facilityDetailName => 'Nom';

  @override
  String get facilityDetailDescription => 'Description';

  @override
  String get facilityDetailType => 'Type';

  @override
  String get facilityDetailStatus => 'Statut';

  @override
  String get facilityDetailPropertyId => 'ID de la propriété';

  @override
  String get facilityDetailLocation => 'Localisation';

  @override
  String get facilityDetailMetadata => 'Métadonnées';

  @override
  String get facilityDetailCreatedBy => 'Créé par';

  @override
  String get facilityDetailUpdatedBy => 'Mis à jour par';

  @override
  String get facilityDetailCreatedAt => 'Créé le';

  @override
  String get facilityDetailUpdatedAt => 'Mis à jour le';

  @override
  String get facilityDetailDeletedAt => 'Supprimé le';

  @override
  String get complianceRecordDetailTitle => 'Détails du dossier de conformité';

  @override
  String get complianceRecordType => 'Type';

  @override
  String get complianceRecordStatus => 'Statut';

  @override
  String get complianceRecordMetadata => 'Métadonnées';

  @override
  String get complianceRecordCustomFields => 'Champs personnalisés';

  @override
  String get analyticsDetailTitle => 'Détails analytiques';

  @override
  String get analyticsType => 'Type';

  @override
  String get analyticsEntityType => 'Type d\'entité';

  @override
  String get analyticsEntityId => 'ID de l\'entité';

  @override
  String get analyticsTimestamp => 'Horodatage';

  @override
  String get analyticsPropertyId => 'ID de la propriété';

  @override
  String get analyticsUserId => 'ID de l\'utilisateur';

  @override
  String get analyticsAgentId => 'ID de l\'agent';

  @override
  String get analyticsAgencyId => 'ID de l\'agence';

  @override
  String get analyticsReservationId => 'ID de la réservation';

  @override
  String get analyticsTaskId => 'ID de la tâche';

  @override
  String get analyticsDeletedAt => 'Supprimé le';

  @override
  String get analyticsCreatedAt => 'Créé le';

  @override
  String get analyticsUpdatedAt => 'Mis à jour le';

  @override
  String get analyticsData => 'Données';

  @override
  String get analyticsAgency => 'Agence';

  @override
  String get analyticsAgent => 'Agent';

  @override
  String get analyticsTypeListingView => 'Vue de l\'annonce';

  @override
  String get analyticsTypeBookingConversion => 'Conversion de réservation';

  @override
  String get analyticsTypeUserEngagement => 'Engagement de l\'utilisateur';

  @override
  String get analyticsTypeRevenue => 'Revenus';

  @override
  String get analyticsTypePerformance => 'Performance';

  @override
  String get analyticsTypeAgentPerformance => 'Performance de l\'agent';

  @override
  String get analyticsTypeAgencyPerformance => 'Performance de l\'agence';

  @override
  String get analyticsTypeView => 'Vue';

  @override
  String get contractDetailTitle => 'Détails du contrat';

  @override
  String get contractIdLabel => 'ID';

  @override
  String get contractNameLabel => 'Nom';

  @override
  String get contractDescriptionLabel => 'Description';

  @override
  String get contractTypeLabel => 'Type';

  @override
  String get contractStatusLabel => 'Statut';

  @override
  String get contractCurrencyLabel => 'Devise';

  @override
  String get contractRentAmountLabel => 'Montant du loyer';

  @override
  String get contractNoticePeriodLabel => 'Délai de préavis';

  @override
  String get contractPropertyIdLabel => 'ID de la propriété';

  @override
  String get contractTenantIdLabel => 'ID du locataire';

  @override
  String get contractLandlordIdLabel => 'ID du propriétaire';

  @override
  String get contractOwnerIdLabel => 'ID du propriétaire';

  @override
  String get contractAgencyIdLabel => 'ID de l\'agence';

  @override
  String get contractStartDateLabel => 'Date de début';

  @override
  String get contractEndDateLabel => 'Date de fin';

  @override
  String get contractCreatedAtLabel => 'Créé le';

  @override
  String get contractUpdatedAtLabel => 'Mis à jour le';

  @override
  String get contractDeletedAtLabel => 'Supprimé le';

  @override
  String get contractSignedByLabel => 'Signé par';

  @override
  String get contractSignedAtLabel => 'Signé le';

  @override
  String get contractTerminatedByLabel => 'Résilié par';

  @override
  String get contractTerminatedAtLabel => 'Résilié le';

  @override
  String get contractCancelledByLabel => 'Annulé par';

  @override
  String get contractCancelledAtLabel => 'Annulé le';

  @override
  String get contractTermsLabel => 'Termes :';

  @override
  String get contractConditionsLabel => 'Conditions :';

  @override
  String get contractTypeRental => 'Location';

  @override
  String get contractTypeSale => 'Vente';

  @override
  String get contractTypeManagement => 'Gestion';

  @override
  String get contractTypeCommission => 'Commission';

  @override
  String get contractTypeService => 'Service';

  @override
  String get contractStatusDraft => 'Brouillon';

  @override
  String get contractStatusActive => 'Actif';

  @override
  String get contractStatusExpired => 'Expiré';

  @override
  String get contractStatusTerminated => 'Résilié';

  @override
  String get contractStatusRenewed => 'Renouvelé';

  @override
  String get contractStatusPending => 'En attente';

  @override
  String get contractStatusArchived => 'Archivé';

  @override
  String get taxRecordAny => 'Tout';

  @override
  String get taxRecordPaid => 'Payé';

  @override
  String get taxRecordUnpaid => 'Non payé';

  @override
  String get taxRecordsTitle => 'Dossiers fiscaux';

  @override
  String get eventType => 'Type';

  @override
  String get eventStatus => 'Statut';

  @override
  String get eventProperty => 'Propriété';

  @override
  String get eventAttendees => 'Participants';

  @override
  String get eventDate => 'Date';

  @override
  String get eventListTitle => 'Événements';

  @override
  String get eventGallery => 'Galerie';

  @override
  String get pricingRuleName => 'Nom';

  @override
  String get pricingRuleType => 'Type';

  @override
  String get pricingRuleStatus => 'Statut';

  @override
  String get pricingRuleMultiplier => 'Multiplicateur';

  @override
  String get pricingRuleFixedPrice => 'Prix fixe';

  @override
  String get pricingRuleIsActive => 'Est actif';

  @override
  String get pricingRulePropertyId => 'ID de la propriété';

  @override
  String get pricingRuleCreatedAt => 'Créé le';

  @override
  String get pricingRuleUpdatedAt => 'Mis à jour le';

  @override
  String get pricingRuleDeletedAt => 'Supprimé le';

  @override
  String get pricingRuleConditions => 'Conditions';

  @override
  String get pricingRuleProperty => 'Propriété';

  @override
  String get mentionType => 'Type';

  @override
  String get mentionStatus => 'Statut';

  @override
  String get taskType => 'Type';

  @override
  String get taskStatus => 'Statut';

  @override
  String get taskPriority => 'Priorité';

  @override
  String get taskAssignedTo => 'Assigné à';

  @override
  String get taskCreatedAt => 'Créé le';

  @override
  String get taskUpdatedAt => 'Mis à jour le';

  @override
  String get taskDeletedAt => 'Supprimé le';

  @override
  String get guestStatus => 'Statut';

  @override
  String get guestPhoneNumber => 'Numéro de téléphone';

  @override
  String get reviewType => 'Type';

  @override
  String get reviewStatus => 'Statut';

  @override
  String get notificationType => 'Type';

  @override
  String get notificationStatus => 'Statut';

  @override
  String get messageType => 'Type';

  @override
  String get messageStatus => 'Statut';

  @override
  String get accountType => 'Type';

  @override
  String get accountStatus => 'Statut';

  @override
  String get complianceTypeLicense => 'Licence';

  @override
  String get complianceTypeCertification => 'Certification';

  @override
  String get complianceTypeInsurance => 'Assurance';

  @override
  String get complianceTypePermit => 'Permis';

  @override
  String get complianceTypeOther => 'Autre';

  @override
  String get complianceStatusPending => 'En attente';

  @override
  String get complianceStatusApproved => 'Approuvé';

  @override
  String get complianceStatusRejected => 'Rejeté';

  @override
  String get complianceStatusExpired => 'Expiré';

  @override
  String get commonYes => 'Oui';

  @override
  String get commonNo => 'Non';

  @override
  String get accountFilter_type_oauth => 'OAuth';

  @override
  String get accountFilter_type_email => 'E-mail';

  @override
  String get accountFilter_type_oidc => 'OIDC';

  @override
  String get accountFilter_type_credentials => 'Identifiants';

  @override
  String get accountFilter_type_google => 'Google';

  @override
  String get adminUsers => 'Utilisateurs';

  @override
  String get adminExpenses => 'Dépenses';

  @override
  String get adminFacilities => 'Installations';

  @override
  String get adminHelpdesk => 'Service d\'assistance';

  @override
  String get adminSubscriptions => 'Abonnements';

  @override
  String get adminContracts => 'Contrats';

  @override
  String get adminGuests => 'Invités';

  @override
  String get adminCompliance => 'Conformité';

  @override
  String get adminPricingRules => 'Règles de tarification';

  @override
  String get adminReviews => 'Avis';

  @override
  String get accountFilter_type_facebook => 'Facebook';

  @override
  String get edit_agent_tooltip => 'Modifier l\'agent';

  @override
  String get agent_contact_information_title => 'Informations de contact';

  @override
  String get agent_email_label => 'E-mail';

  @override
  String get agent_phone_label => 'Téléphone';

  @override
  String get agent_address_label => 'Adresse';

  @override
  String get agent_website_label => 'Site web';

  @override
  String get agent_professional_information_title =>
      'Informations professionnelles';

  @override
  String get agent_status_label => 'Statut';

  @override
  String get agent_agency_label => 'Agence';

  @override
  String get agent_specialities_label => 'Spécialités';

  @override
  String get agent_activity_title => 'Activité récente';

  @override
  String get agent_last_active_label => 'Dernière activité';

  @override
  String get agent_is_active_label => 'Est actif';

  @override
  String get agent_created_at_label => 'Créé le';

  @override
  String get common_not_available => 'Non disponible';

  @override
  String get common_yes => 'Oui';

  @override
  String get common_no => 'Non';

  @override
  String get availability_edit_title => 'Modifier la disponibilité';

  @override
  String get common_save => 'Enregistrer';

  @override
  String get availability_date => 'Date';

  @override
  String get availability_not_set => 'Non défini';

  @override
  String get availability_blocked => 'Bloqué';

  @override
  String get availability_booked => 'Réservé';

  @override
  String get availability_property_id => 'ID de la propriété';

  @override
  String get availability_reservation_id => 'ID de la réservation';

  @override
  String get availability_pricing_rule_id => 'ID de la règle de tarification';

  @override
  String get availability_total_units => 'Total des unités';

  @override
  String get availability_available_units => 'Unités disponibles';

  @override
  String get availability_booked_units => 'Unités réservées';

  @override
  String get availability_blocked_units => 'Unités bloquées';

  @override
  String get availability_base_price => 'Prix de base';

  @override
  String get availability_current_price => 'Prix actuel';

  @override
  String get availability_special_pricing_json =>
      'Tarification spéciale (JSON)';

  @override
  String get availability_price_settings_json => 'Paramètres de prix (JSON)';

  @override
  String get availability_min_nights => 'Nuits minimum';

  @override
  String get availability_max_nights => 'Nuits maximum';

  @override
  String get availability_max_guests => 'Invités maximum';

  @override
  String get availability_discount_settings_json =>
      'Paramètres de réduction (JSON)';

  @override
  String get availability_weekend_rate => 'Tarif week-end';

  @override
  String get availability_weekday_rate => 'Tarif semaine';

  @override
  String get availability_weekend_multiplier => 'Multiplicateur week-end';

  @override
  String get availability_weekday_multiplier => 'Multiplicateur semaine';

  @override
  String get availability_seasonal_multiplier => 'Multiplicateur saisonnier';

  @override
  String get facilityTypeGym => 'Salle de sport';

  @override
  String get facilityTypePool => 'Piscine';

  @override
  String get facilityTypeParkingLot => 'Parking';

  @override
  String get facilityTypeLaundry => 'Buanderie';

  @override
  String get facilityTypeElevator => 'Ascenseur';

  @override
  String get facilityTypeSecurity => 'Sécurité';

  @override
  String get facilityTypeOther => 'Autre';

  @override
  String get facilityStatusAvailable => 'Disponible';

  @override
  String get facilityStatusUnavailable => 'Indisponible';

  @override
  String get facilityStatusMaintenance => 'Maintenance';
}
