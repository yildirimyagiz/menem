// ignore: unused_import
import 'package:intl/intl.dart' as intl;
import 'l10n.dart';

// ignore_for_file: type=lint

/// The translations for Spanish Castilian (`es`).
class AppLocalizationsEs extends AppLocalizations {
  AppLocalizationsEs([String locale = 'es']) : super(locale);

  @override
  String get appTitle => 'Menem';

  @override
  String get dashboard => 'Panel de control';

  @override
  String get manageProperties => 'Administre sus propiedades eficazmente';

  @override
  String get quickAccess => 'Acceso rápido';

  @override
  String get properties => 'Propiedades';

  @override
  String get tenants => 'Inquilinos';

  @override
  String get payments => 'Pagos';

  @override
  String get tasks => 'Tareas';

  @override
  String get summaryStatistics => 'Estadísticas resumen';

  @override
  String get totalProperties => 'Total de propiedades';

  @override
  String occupancyRate(Object rate) {
    return 'Tasa de ocupación: $rate';
  }

  @override
  String get monthlyCashflow => 'Flujo de caja mensual';

  @override
  String pendingPayments(Object count) {
    return 'Pagos pendientes: $count';
  }

  @override
  String get pendingTasks => 'Tareas pendientes';

  @override
  String tasksThisWeek(Object count) {
    return '$count esta semana';
  }

  @override
  String get propertyDetailTitle => 'Detalles de la propiedad';

  @override
  String get propertyDetailOverviewTab => 'Resumen';

  @override
  String get propertyDetailFeaturesTab => 'Características';

  @override
  String get propertyDetailLocationTab => 'Ubicación';

  @override
  String get propertyDetailGalleryTab => 'Galería';

  @override
  String get propertyDetailId => 'ID';

  @override
  String get propertyDetailNumber => 'Número de propiedad';

  @override
  String get propertyDetailTitleField => 'Título';

  @override
  String get propertyDetailDescription => 'Descripción';

  @override
  String get propertyDetailType => 'Tipo';

  @override
  String get propertyDetailStatus => 'Estado';

  @override
  String get propertyDetailCategory => 'Categoría';

  @override
  String get propertyDetailCondition => 'Condición';

  @override
  String get propertyDetailMarketValue => 'Valor de mercado';

  @override
  String get propertyDetailBedrooms => 'Dormitorios';

  @override
  String get propertyDetailBathrooms => 'Baños';

  @override
  String get propertyDetailYearBuilt => 'Año de construcción';

  @override
  String get propertyDetailFeatures => 'Características';

  @override
  String get propertyDetailAmenities => 'Servicios';

  @override
  String get propertyDetailAddress => 'Dirección';

  @override
  String get propertyDetailCity => 'Ciudad';

  @override
  String get propertyDetailState => 'Estado';

  @override
  String get propertyDetailCountry => 'País';

  @override
  String get propertyDetailZipCode => 'Código postal';

  @override
  String get propertyDetailCoordinates => 'Coordenadas';

  @override
  String get propertyDetailNoFeatures =>
      'No hay características o servicios disponibles';

  @override
  String get propertyDetailNoLocation =>
      'No hay información de ubicación disponible';

  @override
  String get propertyDetailGalleryPlaceholder =>
      'Vista de galería (Implementar con GridView de Imágenes)';

  @override
  String get propertyDetailDeleteConfirm =>
      '¿Está seguro de que desea eliminar esta propiedad?';

  @override
  String get propertyDetailDeleteSuccess => 'Propiedad eliminada con éxito';

  @override
  String propertyDetailDeleteFailed(Object error) {
    return 'Error al eliminar la propiedad: $error';
  }

  @override
  String get propertyDetailContactAgent => 'Contactar Agente';

  @override
  String get propertyDetailPrice => 'Precio';

  @override
  String get propertyDetailLoading => 'Cargando detalles de la propiedad...';

  @override
  String get propertyDetailNotFound => 'Propiedad no encontrada.';

  @override
  String get totalTenants => 'Total de inquilinos';

  @override
  String newTenants(Object count) {
    return 'Nuevos inquilinos: $count';
  }

  @override
  String get homeLabel => 'Inicio';

  @override
  String get favoritesEmpty => 'Aún no hay favoritos';

  @override
  String get favoritesError => 'Error al cargar favoritos';

  @override
  String get favoritesRetry => 'Reintentar';

  @override
  String get emptyStateRetry => 'Reintentar';

  @override
  String get listings => 'Mis propiedades';

  @override
  String get listingsEmpty => 'Aún no hay listados';

  @override
  String get listingsRetry => 'Reintentar';

  @override
  String get filterPropertiesTitle => 'Filtrar Propiedades';

  @override
  String get filterPropertiesApply => 'Aplicar';

  @override
  String get filterPropertiesCancel => 'Cancelar';

  @override
  String get messagesLabel => 'Mensajes';

  @override
  String get notificationsLabel => 'Notificaciones';

  @override
  String get notificationsEmpty => 'Aún no hay notificaciones';

  @override
  String get paymentsLabel => 'Pagos';

  @override
  String get settingsLabel => 'Configuración';

  @override
  String get settingsAppearance => 'Apariencia';

  @override
  String get settingsDarkMode => 'Modo Oscuro';

  @override
  String get filterTasksTitle => 'Filtrar Tareas';

  @override
  String get filterTasksStatus => 'Estado';

  @override
  String get filterTasksPriority => 'Prioridad';

  @override
  String get filterTasksType => 'Tipo';

  @override
  String get filterTasksDueDate => 'Fecha de Vencimiento';

  @override
  String get filterTasksApply => 'Aplicar';

  @override
  String get filterTasksCancel => 'Cancelar';

  @override
  String get profileLabel => 'Perfil';

  @override
  String get logoutLabel => 'Cerrar sesión';

  @override
  String get loggingout => 'Cerrando sesión...';

  @override
  String get sitetitle => 'RentalProc';

  @override
  String get nav_home => 'Inicio';

  @override
  String get nav_properties => 'Propiedades';

  @override
  String get nav_payments => 'Pagos';

  @override
  String get nav_tasks => 'Tareas';

  @override
  String get nav_messages => 'Mensajes';

  @override
  String get nav_notifications => 'Notificaciones';

  @override
  String get nav_helpdesk => 'Mesa de ayuda';

  @override
  String get nav_subscription => 'Suscripción';

  @override
  String get nav_settings => 'Configuración';

  @override
  String get nav_tenants => 'Inquilinos';

  @override
  String get nav_expenses => 'Gastos';

  @override
  String get nav_facilities => 'Instalaciones';

  @override
  String get nav_analytics => 'Analíticas';

  @override
  String get nav_help => 'Ayuda';

  @override
  String get nav_logout => 'Cerrar sesión';

  @override
  String get nav_profile => 'Perfil';

  @override
  String get nav_viewAll => 'Ver todo';

  @override
  String get indexTitle => 'Bienvenido a Menem';

  @override
  String get indexDescription => 'Su solución de gestión de propiedades';

  @override
  String get indexPropertyManagementTitle => 'Gestión de propiedades';

  @override
  String get indexPropertyManagementDescription =>
      'Gestione sus propiedades de manera eficiente con nuestro completo conjunto de herramientas.';

  @override
  String get indexWaterManagementTitle => 'Gestión del agua';

  @override
  String get indexWaterManagementDescription =>
      'Rastree y optimice el uso del agua en sus propiedades.';

  @override
  String get authSignIn => 'Iniciar sesión con Google';

  @override
  String get authSignOut => 'Cerrar sesión';

  @override
  String get createPropertyTitle => 'Crear Nueva Propiedad';

  @override
  String get propertyCreatedSuccess => 'Propiedad creada con éxito';

  @override
  String get propertyCreatedError => 'Error al crear la propiedad';

  @override
  String get registerAlreadyHaveAccount =>
      '¿Ya tienes una cuenta? Iniciar sesión';

  @override
  String get registerForgotPassword => '¿Olvidaste tu contraseña?';

  @override
  String get propertyViewingEventsTitle => 'Eventos de Visualización';

  @override
  String get propertyViewingSchedule => 'Programar Visualización';

  @override
  String authWelcomeBack(Object name) {
    return 'Bienvenido de nuevo, $name';
  }

  @override
  String get postsCreate => 'Crear publicación';

  @override
  String get postsTitle => 'Título';

  @override
  String get postsContent => 'Contenido';

  @override
  String get postsLoading => 'Cargando publicaciones...';

  @override
  String get postsSave => 'Guardar';

  @override
  String get postsCancel => 'Cancelar';

  @override
  String get postsEdit => 'Editar';

  @override
  String get postsDelete => 'Eliminar';

  @override
  String get postsNoPostsYet => 'Aún no hay publicaciones';

  @override
  String get postsErrorUnauthorized =>
      'Debe iniciar sesión para realizar esta acción';

  @override
  String get postsErrorCreatePost => 'Error al crear la publicación';

  @override
  String get postsErrorUpdatePost => 'Error al actualizar la publicación';

  @override
  String get postsErrorDeletePost => 'Error al eliminar la publicación';

  @override
  String get chatMessages => 'Mensajes';

  @override
  String chatChattingWith(Object name) {
    return 'Chateando con $name';
  }

  @override
  String get chatConnectWithUsers => 'Connect with users and get support';

  @override
  String get chatBackToList => 'Volver a la lista';

  @override
  String get chatWelcomeToChat => 'Bienvenido al Chat';

  @override
  String get chatWelcomeDescription =>
      'Inicie una conversación con otros usuarios o contacte con soporte para obtener ayuda';

  @override
  String get chatNewMessage => 'Nuevo mensaje';

  @override
  String get chatContactSupport => 'Contactar con soporte';

  @override
  String get chatBack => 'Atrás';

  @override
  String get chatSearchUsers => 'Buscar usuarios...';

  @override
  String get chatTypeMessage => 'Escriba su mensaje...';

  @override
  String get chatSend => 'Enviar';

  @override
  String get chatErrorUnauthorized =>
      'Debe iniciar sesión para realizar esta acción';

  @override
  String get chatErrorSendMessage => 'Error al enviar el mensaje';

  @override
  String get chatErrorMarkAsRead => 'Error al marcar los mensajes como leídos';

  @override
  String get chatError => 'Error';

  @override
  String get chatConnectionError =>
      'Error al conectar con el servidor de chat. Por favor, inténtelo de nuevo.';

  @override
  String get chatMessageSendError =>
      'Error al enviar su mensaje. Por favor, inténtelo más tarde.';

  @override
  String get notifications_placeholder => 'Aún no hay notificaciones';

  @override
  String get notificationsPlaceholder => 'Aún no hay notificaciones';

  @override
  String commonTimeAgo(Object time) {
    return 'hace $time';
  }

  @override
  String get commonSuccess => 'Éxito';

  @override
  String get commonError => 'Error';

  @override
  String propertiesFound(Object count) {
    return '$count propiedades encontradas';
  }

  @override
  String get errorScreenTitle => 'Error';

  @override
  String get errorScreenGoBack => 'Volver';

  @override
  String get dateRangeSelectTitle => 'Seleccionar Rango de Fechas';

  @override
  String get dateRangeSelectApply => 'Aplicar';

  @override
  String get dateRangeSelectCancel => 'Cancelar';

  @override
  String get commonWarning => 'Advertencia';

  @override
  String get commonInfo => 'Información';

  @override
  String get commonLoading => 'Cargando...';

  @override
  String get commonSave => 'Guardar';

  @override
  String get commonCancel => 'Cancelar';

  @override
  String get commonDelete => 'Eliminar';

  @override
  String get commonEdit => 'Editar';

  @override
  String get commonCreate => 'Crear';

  @override
  String get commonView => 'Ver';

  @override
  String get commonPrevious => 'Anterior';

  @override
  String get commonNext => 'Siguiente';

  @override
  String get commonBack => 'Atrás';

  @override
  String get commonConfirm => 'Confirmar';

  @override
  String get commonActions => 'Acciones';

  @override
  String get commonSearch => 'Buscar';

  @override
  String get commonFilter => 'Filtrar';

  @override
  String get commonSort => 'Ordenar';

  @override
  String get commonNoData => 'No hay datos disponibles';

  @override
  String get editAgentTooltip => 'Editar agente';

  @override
  String get agentContactInformationTitle => 'Información de contacto';

  @override
  String get agentEmailLabel => 'Correo electrónico';

  @override
  String get agentPhoneLabel => 'Teléfono';

  @override
  String get agentAddressLabel => 'Dirección';

  @override
  String get agentWebsiteLabel => 'Sitio web';

  @override
  String get agentProfessionalInformationTitle => 'Información profesional';

  @override
  String get agentStatusLabel => 'Estado';

  @override
  String get agentAgencyLabel => 'Agencia';

  @override
  String get agentSpecialitiesLabel => 'Especialidades';

  @override
  String get agentActivityTitle => 'Actividad reciente';

  @override
  String get agentLastActiveLabel => 'Última actividad';

  @override
  String get agentIsActiveLabel => 'Está activo';

  @override
  String get agentCreatedAtLabel => 'Creado el';

  @override
  String get agentAdditionalInformationTitle => 'Información Adicional';

  @override
  String get agentBioLabel => 'Biografía';

  @override
  String get agentExternalIdLabel => 'ID Externo';

  @override
  String get agentSettingsLabel => 'Configuración';

  @override
  String get agentIntegrationLabel => 'Integración';

  @override
  String get agentOwnerIdLabel => 'ID de Propietario';

  @override
  String get agentAgencyIdLabel => 'ID de Agencia';

  @override
  String get agentDeletedAtLabel => 'Eliminado el';

  @override
  String get amenitiesSectionTitle => 'Servicios';

  @override
  String get noAmenitiesListed => 'No hay servicios listados';

  @override
  String get locationSectionTitle => 'Ubicación';

  @override
  String get getDirectionsButton => 'Obtener direcciones';

  @override
  String get messageStatusRead => 'Leído';

  @override
  String get messageStatusDelivered => 'Entregado';

  @override
  String get messageStatusSent => 'Enviado';

  @override
  String get defaultUser => 'Usuario predeterminado';

  @override
  String get unknownTime => 'Hora desconocida';

  @override
  String get commonNotAvailable => 'No disponible';

  @override
  String accountsFound(num count) {
    String _temp0 = intl.Intl.pluralLogic(
      count,
      locale: localeName,
      other: '$count cuentas encontradas',
      one: '1 cuenta encontrada',
      zero: 'No se encontraron cuentas',
    );
    return '$_temp0';
  }

  @override
  String get actionCardProperties => 'Propiedades';

  @override
  String get actionCardTenants => 'Inquilinos';

  @override
  String get actionCardAnalytics => 'Analíticas';

  @override
  String get actionCardPayments => 'Pagos';

  @override
  String get actionCardTasks => 'Tareas';

  @override
  String get actionCardMessages => 'Mensajes';

  @override
  String get actionCardHelpDesk => 'Mesa de ayuda';

  @override
  String get actionCardManageYourPropertyPortfolio =>
      'Administre su portafolio de propiedades';

  @override
  String get actionCardManageTenantInformation =>
      'Gestione la información de los inquilinos';

  @override
  String get actionCardViewReportsAndAnalytics => 'Ver informes y análisis';

  @override
  String get actionCardTrackFinancialRecords =>
      'Rastrear registros financieros';

  @override
  String get actionCardManageMaintenanceTasks =>
      'Gestionar tareas de mantenimiento';

  @override
  String get actionCardCommunicateWithTenants =>
      'Comunicarse con los inquilinos';

  @override
  String get actionCardGetAssistanceWhenNeeded =>
      'Obtener asistencia cuando sea necesario';

  @override
  String get actionCardAddProperty => 'Agregar propiedad';

  @override
  String get actionCardCreateANewPropertyListing =>
      'Crear una nueva lista de propiedades';

  @override
  String get actionCardAddTenant => 'Agregar inquilino';

  @override
  String get actionCardRegisterANewTenant => 'Registrar un nuevo inquilino';

  @override
  String get actionCardRecordPayment => 'Registrar pago';

  @override
  String get actionCardRecordARentPayment => 'Registrar un pago de alquiler';

  @override
  String get actionCardAddTask => 'Agregar tarea';

  @override
  String get actionCardCreateAMaintenanceTask =>
      'Crear una tarea de mantenimiento';

  @override
  String get actionCardScheduleEvent => 'Programar Evento';

  @override
  String get actionCardCreateAPropertyEvent => 'Crear un evento de propiedad';

  @override
  String get actionCardComposeMessage => 'Redactar Mensaje';

  @override
  String get actionCardSendAMessageToTenants =>
      'Enviar un mensaje a los inquilinos';

  @override
  String get actionCardCreateDocument => 'Crear Documento';

  @override
  String get actionCardGenerateANewDocument => 'Generar un nuevo documento';

  @override
  String get actionCardGetStarted => 'Get Started';

  @override
  String get actionCardNewThisMonth => 'New This Month';

  @override
  String get tenantsTitle => 'Inquilinos';

  @override
  String get tenantsDescription =>
      'Gestione la información y los contratos de los inquilinos en todas sus propiedades';

  @override
  String get tenantsAddTenant => 'Agregar inquilino';

  @override
  String get tenantsPropertyFilter => 'Propiedad';

  @override
  String get tenantsAllProperties => 'Todas las propiedades';

  @override
  String get tenantsPaymentStatusFilter => 'Estado de pago';

  @override
  String get tenantsAllStatuses => 'Todos los estados';

  @override
  String get tenantsTenantColumn => 'Inquilino';

  @override
  String get tenantsStatusColumn => 'Estado';

  @override
  String get tenantsPropertyUnitColumn => 'Propiedad / Unidad';

  @override
  String get tenantsContactColumn => 'Contacto';

  @override
  String get tenantsLeasePeriodColumn => 'Periodo de alquiler';

  @override
  String get tenantsActionsColumn => 'Acciones';

  @override
  String get tenantsIdLabel => 'ID';

  @override
  String get tenantsNotAssigned => 'No asignado';

  @override
  String get tenantsNotAvailable => 'N/D';

  @override
  String get tenantsLeaseFrom => 'Desde';

  @override
  String get tenantsLeaseTo => 'Hasta';

  @override
  String get tenantsViewDetails => 'Ver detalles';

  @override
  String get tenantsEdit => 'Editar';

  @override
  String get tenantsDelete => 'Eliminar';

  @override
  String get tenantsNoTenantsFound => 'No se encontraron inquilinos';

  @override
  String get tenantsGetStartedAddTenant =>
      'Comience agregando un nuevo inquilino';

  @override
  String get tenantsConfirmDeletionTitle => 'Confirmar eliminación';

  @override
  String tenantsConfirmDeletionDesc(Object tenant) {
    return '¿Está seguro de que desea eliminar al inquilino $tenant? Esta acción no se puede deshacer.';
  }

  @override
  String get tenantsCancel => 'Cancelar';

  @override
  String get tenantsDeleting => 'Eliminando...';

  @override
  String get tenantsPrevious => 'Anterior';

  @override
  String get tenantsNext => 'Siguiente';

  @override
  String get tenantsStatusUnpaid => 'No pagado';

  @override
  String get tenantsStatusPartiallyPaid => 'Parcialmente pagado';

  @override
  String get tenantsStatusPaid => 'Pagado';

  @override
  String get tenantsStatusRefunded => 'Reembolsado';

  @override
  String get tenantsStatusOverdue => 'Atrasado';

  @override
  String get tenantsStatusCancelled => 'Cancelado';

  @override
  String get agenciesTitle => 'Agencias';

  @override
  String get agenciesDescription => 'Gestione sus agencias y su configuración.';

  @override
  String get agenciesSearch => 'Buscar agencias...';

  @override
  String get agenciesStatus => 'Estado';

  @override
  String get agenciesStatusValuesPending => 'Pendiente';

  @override
  String get agenciesStatusValuesVerified => 'Verificada';

  @override
  String get agenciesStatusValuesRejected => 'Rechazada';

  @override
  String get agenciesAdd => 'Agregar agencia';

  @override
  String get agenciesEdit => 'Editar';

  @override
  String get agenciesDelete => 'Eliminar';

  @override
  String agenciesConfirmDeleteDesc(Object name) {
    return '¿Está seguro de que desea eliminar $name? Esta acción no se puede deshacer.';
  }

  @override
  String get agenciesDeletedMsg => 'Agencia eliminada correctamente.';

  @override
  String get agenciesNone =>
      'Ninguna agencia coincide con su búsqueda. Pruebe con otros filtros.';

  @override
  String get agenciesNa => 'N/D';

  @override
  String get agenciesAgents => 'Agentes';

  @override
  String get agenciesView => 'Ver';

  @override
  String get agenciesName => 'Nombre de la agencia';

  @override
  String get agenciesEmail => 'Correo electrónico';

  @override
  String get agenciesPhoneNumber => 'Número de teléfono';

  @override
  String get agenciesAddress => 'Dirección';

  @override
  String get agenciesWebsite => 'Sitio web';

  @override
  String get agenciesLogoUrl => 'URL del logo';

  @override
  String get agenciesCreated => 'Creada';

  @override
  String get agenciesUpdated => 'Actualizada';

  @override
  String get agenciesProperties => 'Propiedades';

  @override
  String get agenciesActions => 'Acciones';

  @override
  String get agenciesCancel => 'Cancelar';

  @override
  String get agenciesDeleting => 'Eliminando...';

  @override
  String get agenciesCreating => 'Creando...';

  @override
  String get agenciesSaving => 'Guardando...';

  @override
  String get agenciesSave => 'Guardar';

  @override
  String get agenciesCreate => 'Crear';

  @override
  String get agenciesGetStarted => 'Comience agregando una nueva agencia';

  @override
  String get agenciesRequired => 'Este campo es obligatorio.';

  @override
  String get agenciesInvalidEmail => 'Correo electrónico no válido.';

  @override
  String get agenciesInvalidUrl => 'URL no válida.';

  @override
  String get agenciesUpdatedMsg => '¡Actualizada!';

  @override
  String get agenciesCreatedMsg => '¡Creada!';

  @override
  String get agenciesErrorLoad => 'No se pudieron cargar los detalles.';

  @override
  String get agenciesErrorCreate => 'No se pudo crear.';

  @override
  String get agenciesErrorUpdate => 'No se pudo actualizar.';

  @override
  String get agenciesErrorDelete => 'No se pudo eliminar.';

  @override
  String get loginPageTitle => 'Iniciar sesión';

  @override
  String get loginPageEmail => 'Correo electrónico';

  @override
  String get loginPagePassword => 'Contraseña';

  @override
  String get loginPageRememberMe => 'Recuérdame';

  @override
  String get loginPageForgotPassword => '¿Olvidó su contraseña?';

  @override
  String get loginPageSignIn => 'Iniciar sesión';

  @override
  String get loginPageOrContinueWith => 'O continuar con';

  @override
  String get loginPageDontHaveAccount => '¿No tiene una cuenta?';

  @override
  String get loginPageSignUp => 'Regístrate';

  @override
  String get loginPageErrorInvalidCredentials =>
      'Correo electrónico o contraseña inválidos';

  @override
  String get loginPageErrorSomethingWentWrong =>
      'Algo salió mal. Por favor, inténtelo de nuevo.';

  @override
  String get loginPageErrorSessionExpired =>
      'Su sesión ha expirado. Por favor, inicie sesión de nuevo.';

  @override
  String get authErrorTitle => 'Error de autenticación';

  @override
  String get authErrorSomethingWentWrong =>
      'Ocurrió un error durante la autenticación. Por favor, inténtelo de nuevo.';

  @override
  String get authErrorOauthAccountNotLinked =>
      'Ya existe una cuenta con este correo electrónico. Inicie sesión con el método de autenticación original.';

  @override
  String get authErrorOauthCallbackError =>
      'Ocurrió un error durante el proceso de devolución de OAuth.';

  @override
  String get authErrorOauthCreateAccountError =>
      'No se pudo crear una nueva cuenta. Por favor, inténtelo de nuevo.';

  @override
  String get authErrorOauthSignInError =>
      'Error al iniciar sesión con el proveedor seleccionado. Por favor, inténtelo de nuevo.';

  @override
  String get authErrorBackToLogin => 'Volver al inicio de sesión';

  @override
  String get propertyTitle => 'Detalles de la propiedad';

  @override
  String get propertyBackToProperties => 'Volver a propiedades';

  @override
  String get propertyEditProperty => 'Editar propiedad';

  @override
  String get propertyDeleteProperty => 'Eliminar propiedad';

  @override
  String get propertyCreateProperty => 'Crear propiedad';

  @override
  String get propertyAddProperty => 'Agregar propiedad';

  @override
  String get propertyLoading => 'Cargando propiedad...';

  @override
  String get propertyNotFound => 'Propiedad no encontrada.';

  @override
  String get propertyDebugInfo => 'Información de depuración:';

  @override
  String get propertyConfirmDeleteTitle =>
      '¿Está seguro de que desea eliminar esta propiedad?';

  @override
  String get propertyConfirmDeleteDescription =>
      'Esta acción no se puede deshacer. Todos los datos asociados con esta propiedad se eliminarán permanentemente.';

  @override
  String get propertyConfirmDeleteCancel => 'Cancelar';

  @override
  String get propertyConfirmDeleteConfirm => 'Confirmar eliminación';

  @override
  String get propertyTabsOverview => 'Resumen';

  @override
  String get propertyTabsFeatures => 'Características';

  @override
  String get propertyTabsAmenities => 'Servicios';

  @override
  String get propertyTabsLocation => 'Ubicación';

  @override
  String get propertyTabsDocuments => 'Documentos';

  @override
  String get propertyTabsHistory => 'Historial';

  @override
  String get propertySectionsBasicInfo => 'Información básica';

  @override
  String get propertySectionsPhysicalCharacteristics =>
      'Características físicas';

  @override
  String get propertySectionsContactInfo => 'Información de contacto';

  @override
  String get propertySectionsRelatedEntities => 'Entidades relacionadas';

  @override
  String get propertySectionsMetadata => 'Metadatos';

  @override
  String get propertySectionsFeatures => 'Características';

  @override
  String get propertySectionsAmenities => 'Servicios';

  @override
  String get propertySectionsLocationInfo => 'Información de ubicación';

  @override
  String get propertyFieldsTitle => 'Título';

  @override
  String get propertyFieldsDescription => 'Descripción';

  @override
  String get propertyFieldsPropertyType => 'Tipo de propiedad';

  @override
  String get propertyFieldsStatus => 'Estado';

  @override
  String get propertyFieldsCategory => 'Categoría';

  @override
  String get propertyFieldsBuildingClass => 'Clase de edificio';

  @override
  String get propertyFieldsCondition => 'Condición';

  @override
  String get propertyFieldsSize => 'Tamaño (m²)';

  @override
  String get propertyFieldsBedrooms => 'Dormitorios';

  @override
  String get propertyFieldsBathrooms => 'Baños';

  @override
  String get propertyFieldsYearBuilt => 'Año de construcción';

  @override
  String get propertyFieldsContactEmail => 'Correo electrónico de contacto';

  @override
  String get propertyFieldsContactPhone => 'Teléfono de contacto';

  @override
  String get propertyFieldsOwner => 'Propietario';

  @override
  String get propertyFieldsAgent => 'Agente';

  @override
  String get propertyFieldsAgency => 'Agencia';

  @override
  String get propertyFieldsCreated => 'Creado';

  @override
  String get propertyFieldsUpdated => 'Actualizado';

  @override
  String get propertyFieldsListed => 'Listado';

  @override
  String get propertyFieldsAddress => 'Dirección';

  @override
  String get propertyFieldsCity => 'Ciudad';

  @override
  String get propertyFieldsStateProvince => 'Estado/Provincia';

  @override
  String get propertyFieldsPostalCode => 'Código postal';

  @override
  String get propertyFieldsCountry => 'País';

  @override
  String get propertyFieldsCoordinates => 'Coordenadas';

  @override
  String get propertyFieldsLatitude => 'Latitud';

  @override
  String get propertyFieldsLongitude => 'Longitud';

  @override
  String get propertyNoFeatures => 'No hay características listadas';

  @override
  String get propertyNoAmenities => 'No hay servicios listados';

  @override
  String get propertyNoCoordinates => 'No hay coordenadas disponibles';

  @override
  String get propertySuccessDeleted => 'Propiedad eliminada correctamente';

  @override
  String get propertySuccessCreated => 'Propiedad creada correctamente';

  @override
  String get propertySuccessUpdated => 'Propiedad actualizada correctamente';

  @override
  String get propertyErrorDelete => 'No se pudo eliminar la propiedad';

  @override
  String get propertyErrorCreate => 'No se pudo crear la propiedad';

  @override
  String get propertyErrorUpdate => 'No se pudo actualizar la propiedad';

  @override
  String get propertyErrorFetch =>
      'No se pudieron obtener los detalles de la propiedad';

  @override
  String get adminDashboard => 'Panel de control';

  @override
  String get adminProperties => 'Propiedades';

  @override
  String get adminAgents => 'Agentes';

  @override
  String get adminAgencies => 'Agencias';

  @override
  String get adminOwners => 'Propietarios';

  @override
  String get adminTenants => 'Inquilinos';

  @override
  String get adminPayments => 'Pagos';

  @override
  String get adminTasks => 'Tareas';

  @override
  String get adminMessages => 'Mensajes';

  @override
  String get adminReports => 'Informes';

  @override
  String get adminAnalytics => 'Analíticas';

  @override
  String get adminSettings => 'Configuración';

  @override
  String get adminNotifications => 'Notificaciones';

  @override
  String get account_id => 'ID de Cuenta';

  @override
  String get account_type => 'Tipo';

  @override
  String get account_provider => 'Proveedor';

  @override
  String get accountFilter_type_BANK => 'Cuenta Bancaria';

  @override
  String get accountFilter_type_CREDIT_CARD => 'Tarjeta de Crédito';

  @override
  String get accountFilter_type_INVESTMENT => 'Cuenta de Inversión';

  @override
  String get accountFilter_type_SAVINGS => 'Cuenta de Ahorros';

  @override
  String get accountFilter_type_LOAN => 'Cuenta de Préstamo';

  @override
  String get accountFilter_type_OTHER => 'Otra Cuenta';

  @override
  String get facilityDetailTitle => 'Detalles de la Instalación';

  @override
  String get facilityDetailId => 'ID';

  @override
  String get facilityDetailName => 'Nombre';

  @override
  String get facilityDetailDescription => 'Descripción';

  @override
  String get facilityDetailType => 'Tipo';

  @override
  String get facilityDetailStatus => 'Estado';

  @override
  String get facilityDetailPropertyId => 'ID de Propiedad';

  @override
  String get facilityDetailLocation => 'Ubicación';

  @override
  String get facilityDetailMetadata => 'Metadatos';

  @override
  String get facilityDetailCreatedBy => 'Creado Por';

  @override
  String get facilityDetailUpdatedBy => 'Actualizado Por';

  @override
  String get facilityDetailCreatedAt => 'Creado el';

  @override
  String get facilityDetailUpdatedAt => 'Actualizado el';

  @override
  String get facilityDetailDeletedAt => 'Eliminado el';

  @override
  String get complianceRecordDetailTitle =>
      'Detalles del Registro de Cumplimiento';

  @override
  String get complianceRecordType => 'Tipo';

  @override
  String get complianceRecordStatus => 'Estado';

  @override
  String get complianceRecordMetadata => 'Metadatos';

  @override
  String get complianceRecordCustomFields => 'Campos Personalizados';

  @override
  String get analyticsDetailTitle => 'Analytics Details';

  @override
  String get analyticsType => 'Type';

  @override
  String get analyticsEntityType => 'Entity Type';

  @override
  String get analyticsEntityId => 'Entity ID';

  @override
  String get analyticsTimestamp => 'Timestamp';

  @override
  String get analyticsPropertyId => 'Property ID';

  @override
  String get analyticsUserId => 'User ID';

  @override
  String get analyticsAgentId => 'Agent ID';

  @override
  String get analyticsAgencyId => 'Agency ID';

  @override
  String get analyticsReservationId => 'Reservation ID';

  @override
  String get analyticsTaskId => 'Task ID';

  @override
  String get analyticsDeletedAt => 'Deleted At';

  @override
  String get analyticsCreatedAt => 'Created At';

  @override
  String get analyticsUpdatedAt => 'Updated At';

  @override
  String get analyticsData => 'Data';

  @override
  String get analyticsAgency => 'Agency';

  @override
  String get analyticsAgent => 'Agent';

  @override
  String get analyticsTypeListingView => 'Listing View';

  @override
  String get analyticsTypeBookingConversion => 'Booking Conversion';

  @override
  String get analyticsTypeUserEngagement => 'User Engagement';

  @override
  String get analyticsTypeRevenue => 'Revenue';

  @override
  String get analyticsTypePerformance => 'Performance';

  @override
  String get analyticsTypeAgentPerformance => 'Agent Performance';

  @override
  String get analyticsTypeAgencyPerformance => 'Agency Performance';

  @override
  String get analyticsTypeView => 'View';

  @override
  String get contractDetailTitle => 'Detalles del Contrato';

  @override
  String get contractIdLabel => 'ID';

  @override
  String get contractNameLabel => 'Nombre';

  @override
  String get contractDescriptionLabel => 'Descripción';

  @override
  String get contractTypeLabel => 'Tipo';

  @override
  String get contractStatusLabel => 'Estado';

  @override
  String get contractCurrencyLabel => 'Moneda';

  @override
  String get contractRentAmountLabel => 'Monto del Alquiler';

  @override
  String get contractNoticePeriodLabel => 'Período de Notificación';

  @override
  String get contractPropertyIdLabel => 'ID de Propiedad';

  @override
  String get contractTenantIdLabel => 'ID de Inquilino';

  @override
  String get contractLandlordIdLabel => 'ID de Arrendador';

  @override
  String get contractOwnerIdLabel => 'ID de Propietario';

  @override
  String get contractAgencyIdLabel => 'ID de Agencia';

  @override
  String get contractStartDateLabel => 'Fecha de Inicio';

  @override
  String get contractEndDateLabel => 'Fecha de Fin';

  @override
  String get contractCreatedAtLabel => 'Creado el';

  @override
  String get contractUpdatedAtLabel => 'Actualizado el';

  @override
  String get contractDeletedAtLabel => 'Eliminado el';

  @override
  String get contractSignedByLabel => 'Firmado Por';

  @override
  String get contractSignedAtLabel => 'Firmado el';

  @override
  String get contractTerminatedByLabel => 'Terminado Por';

  @override
  String get contractTerminatedAtLabel => 'Terminado el';

  @override
  String get contractCancelledByLabel => 'Cancelado Por';

  @override
  String get contractCancelledAtLabel => 'Cancelado el';

  @override
  String get contractTermsLabel => 'Términos:';

  @override
  String get contractConditionsLabel => 'Condiciones:';

  @override
  String get contractTypeRental => 'Alquiler';

  @override
  String get contractTypeSale => 'Venta';

  @override
  String get contractTypeManagement => 'Gestión';

  @override
  String get contractTypeCommission => 'Comisión';

  @override
  String get contractTypeService => 'Servicio';

  @override
  String get contractStatusDraft => 'Borrador';

  @override
  String get contractStatusActive => 'Activo';

  @override
  String get contractStatusExpired => 'Vencido';

  @override
  String get contractStatusTerminated => 'Terminado';

  @override
  String get contractStatusRenewed => 'Renovado';

  @override
  String get contractStatusPending => 'Pendiente';

  @override
  String get contractStatusArchived => 'Archivado';

  @override
  String get taxRecordAny => 'Cualquiera';

  @override
  String get taxRecordPaid => 'Pagado';

  @override
  String get taxRecordUnpaid => 'No Pagado';

  @override
  String get taxRecordsTitle => 'Registros Fiscales';

  @override
  String get eventType => 'Tipo';

  @override
  String get eventStatus => 'Estado';

  @override
  String get eventProperty => 'Propiedad';

  @override
  String get eventAttendees => 'Asistentes';

  @override
  String get eventDate => 'Fecha';

  @override
  String get eventListTitle => 'Eventos';

  @override
  String get eventGallery => 'Galería';

  @override
  String get pricingRuleName => 'Nombre';

  @override
  String get pricingRuleType => 'Tipo';

  @override
  String get pricingRuleStatus => 'Estado';

  @override
  String get pricingRuleMultiplier => 'Multiplicador';

  @override
  String get pricingRuleFixedPrice => 'Precio Fijo';

  @override
  String get pricingRuleIsActive => 'Está Activo';

  @override
  String get pricingRulePropertyId => 'ID de Propiedad';

  @override
  String get pricingRuleCreatedAt => 'Creado el';

  @override
  String get pricingRuleUpdatedAt => 'Actualizado el';

  @override
  String get pricingRuleDeletedAt => 'Eliminado el';

  @override
  String get pricingRuleConditions => 'Condiciones';

  @override
  String get pricingRuleProperty => 'Propiedad';

  @override
  String get mentionType => 'Tipo';

  @override
  String get mentionStatus => 'Estado';

  @override
  String get taskType => 'Tipo';

  @override
  String get taskStatus => 'Estado';

  @override
  String get taskPriority => 'Prioridad';

  @override
  String get taskAssignedTo => 'Asignado A';

  @override
  String get taskCreatedAt => 'Creado el';

  @override
  String get taskUpdatedAt => 'Actualizado el';

  @override
  String get taskDeletedAt => 'Eliminado el';

  @override
  String get guestStatus => 'Estado';

  @override
  String get guestPhoneNumber => 'Número de Teléfono';

  @override
  String get reviewType => 'Tipo';

  @override
  String get reviewStatus => 'Estado';

  @override
  String get notificationType => 'Tipo';

  @override
  String get notificationStatus => 'Estado';

  @override
  String get messageType => 'Tipo';

  @override
  String get messageStatus => 'Estado';

  @override
  String get accountType => 'Tipo';

  @override
  String get accountStatus => 'Estado';

  @override
  String get complianceTypeLicense => 'Licencia';

  @override
  String get complianceTypeCertification => 'Certificación';

  @override
  String get complianceTypeInsurance => 'Seguro';

  @override
  String get complianceTypePermit => 'Permiso';

  @override
  String get complianceTypeOther => 'Otro';

  @override
  String get complianceStatusPending => 'Pendiente';

  @override
  String get complianceStatusApproved => 'Aprobado';

  @override
  String get complianceStatusRejected => 'Rechazado';

  @override
  String get complianceStatusExpired => 'Vencido';

  @override
  String get commonYes => 'Sí';

  @override
  String get commonNo => 'No';

  @override
  String get accountFilter_type_oauth => 'OAuth';

  @override
  String get accountFilter_type_email => 'Correo Electrónico';

  @override
  String get accountFilter_type_oidc => 'OIDC';

  @override
  String get accountFilter_type_credentials => 'Credenciales';

  @override
  String get accountFilter_type_google => 'Google';

  @override
  String get adminUsers => 'Usuarios';

  @override
  String get adminExpenses => 'Gastos';

  @override
  String get adminFacilities => 'Instalaciones';

  @override
  String get adminHelpdesk => 'Mesa de Ayuda';

  @override
  String get adminSubscriptions => 'Suscripciones';

  @override
  String get adminContracts => 'Contratos';

  @override
  String get adminGuests => 'Invitados';

  @override
  String get adminCompliance => 'Cumplimiento';

  @override
  String get adminPricingRules => 'Reglas de Precios';

  @override
  String get adminReviews => 'Reseñas';

  @override
  String get accountFilter_type_facebook => 'Facebook';

  @override
  String get edit_agent_tooltip => 'Editar agente';

  @override
  String get agent_contact_information_title => 'Información de contacto';

  @override
  String get agent_email_label => 'Correo electrónico';

  @override
  String get agent_phone_label => 'Teléfono';

  @override
  String get agent_address_label => 'Dirección';

  @override
  String get agent_website_label => 'Sitio web';

  @override
  String get agent_professional_information_title => 'Información profesional';

  @override
  String get agent_status_label => 'Estado';

  @override
  String get agent_agency_label => 'Agencia';

  @override
  String get agent_specialities_label => 'Especialidades';

  @override
  String get agent_activity_title => 'Actividad reciente';

  @override
  String get agent_last_active_label => 'Última actividad';

  @override
  String get agent_is_active_label => 'Está activo';

  @override
  String get agent_created_at_label => 'Creado el';

  @override
  String get common_not_available => 'No disponible';

  @override
  String get common_yes => 'Sí';

  @override
  String get common_no => 'No';

  @override
  String get availability_edit_title => 'Editar Disponibilidad';

  @override
  String get common_save => 'Guardar';

  @override
  String get availability_date => 'Fecha';

  @override
  String get availability_not_set => 'No establecido';

  @override
  String get availability_blocked => 'Bloqueado';

  @override
  String get availability_booked => 'Reservado';

  @override
  String get availability_property_id => 'ID de Propiedad';

  @override
  String get availability_reservation_id => 'ID de Reserva';

  @override
  String get availability_pricing_rule_id => 'ID de Regla de Precios';

  @override
  String get availability_total_units => 'Unidades Totales';

  @override
  String get availability_available_units => 'Unidades Disponibles';

  @override
  String get availability_booked_units => 'Unidades Reservadas';

  @override
  String get availability_blocked_units => 'Unidades Bloqueadas';

  @override
  String get availability_base_price => 'Precio Base';

  @override
  String get availability_current_price => 'Precio Actual';

  @override
  String get availability_special_pricing_json => 'Precios Especiales (JSON)';

  @override
  String get availability_price_settings_json =>
      'Configuración de Precios (JSON)';

  @override
  String get availability_min_nights => 'Noches Mínimas';

  @override
  String get availability_max_nights => 'Noches Máximas';

  @override
  String get availability_max_guests => 'Huéspedes Máximos';

  @override
  String get availability_discount_settings_json =>
      'Configuración de Descuentos (JSON)';

  @override
  String get availability_weekend_rate => 'Tarifa de Fin de Semana';

  @override
  String get availability_weekday_rate => 'Tarifa de Día de Semana';

  @override
  String get availability_weekend_multiplier =>
      'Multiplicador de Fin de Semana';

  @override
  String get availability_weekday_multiplier =>
      'Multiplicador de Día de Semana';

  @override
  String get availability_seasonal_multiplier => 'Multiplicador de Temporada';

  @override
  String get facilityTypeGym => 'Gimnasio';

  @override
  String get facilityTypePool => 'Piscina';

  @override
  String get facilityTypeParkingLot => 'Estacionamiento';

  @override
  String get facilityTypeLaundry => 'Lavandería';

  @override
  String get facilityTypeElevator => 'Ascensor';

  @override
  String get facilityTypeSecurity => 'Seguridad';

  @override
  String get facilityTypeOther => 'Otro';

  @override
  String get facilityStatusAvailable => 'Disponible';

  @override
  String get facilityStatusUnavailable => 'No Disponible';

  @override
  String get facilityStatusMaintenance => 'Mantenimiento';
}
