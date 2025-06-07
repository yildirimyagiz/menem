// DO NOT EDIT. This is code generated via package:intl/generate_localized.dart
// This is a library that provides messages for a es locale. All the
// messages from the main program should be duplicated here with the same
// function name.

// Ignore issues from commonly used lints in this file.
// ignore_for_file:unnecessary_brace_in_string_interps, unnecessary_new
// ignore_for_file:prefer_single_quotes,comment_references, directives_ordering
// ignore_for_file:annotate_overrides,prefer_generic_function_type_aliases
// ignore_for_file:unused_import, file_names, avoid_escaping_inner_quotes
// ignore_for_file:unnecessary_string_interpolations, unnecessary_string_escapes

import 'package:intl/intl.dart';
import 'package:intl/message_lookup_by_library.dart';

final messages = new MessageLookup();

typedef String MessageIfAbsent(String messageStr, List<dynamic> args);

class MessageLookup extends MessageLookupByLibrary {
  String get localeName => 'es';

  static String m0(count) =>
      "${Intl.plural(count, zero: 'No se encontraron cuentas', one: '1 cuenta encontrada', other: '${count} cuentas encontradas')}";

  static String m2(name) => "Bienvenido de nuevo, ${name}";

  static String m3(name) => "Chateando con ${name}";

  static String m5(count) => "Nuevos inquilinos: ${count}";

  static String m6(rate) => "Tasa de ocupación: ${rate}";

  static String m7(count) => "Pagos pendientes: ${count}";

  static String m9(count) => "${count} esta semana";

  final messages = _notInlinedMessages(_notInlinedMessages);
  static Map<String, Function> _notInlinedMessages(_) => <String, Function>{
    "accountsFound": m0,
    "agent_activity_title": MessageLookupByLibrary.simpleMessage(
      "Actividad reciente",
    ),
    "agent_address_label": MessageLookupByLibrary.simpleMessage("Dirección"),
    "agent_agency_label": MessageLookupByLibrary.simpleMessage("Agencia"),
    "agent_contact_information_title": MessageLookupByLibrary.simpleMessage(
      "Información de contacto",
    ),
    "agent_created_at_label": MessageLookupByLibrary.simpleMessage("Creado el"),
    "agent_email_label": MessageLookupByLibrary.simpleMessage(
      "Correo electrónico",
    ),
    "agent_is_active_label": MessageLookupByLibrary.simpleMessage(
      "Está activo",
    ),
    "agent_last_active_label": MessageLookupByLibrary.simpleMessage(
      "Última actividad",
    ),
    "agent_phone_label": MessageLookupByLibrary.simpleMessage("Teléfono"),
    "agent_professional_information_title":
        MessageLookupByLibrary.simpleMessage("Información profesional"),
    "agent_specialities_label": MessageLookupByLibrary.simpleMessage(
      "Especialidades",
    ),
    "agent_status_label": MessageLookupByLibrary.simpleMessage("Estado"),
    "agent_website_label": MessageLookupByLibrary.simpleMessage("Sitio web"),
    "amenitiesSectionTitle": MessageLookupByLibrary.simpleMessage("Servicios"),
    "analyticsAgency": MessageLookupByLibrary.simpleMessage("Agency"),
    "analyticsAgencyId": MessageLookupByLibrary.simpleMessage("Agency ID"),
    "analyticsAgent": MessageLookupByLibrary.simpleMessage("Agent"),
    "analyticsAgentId": MessageLookupByLibrary.simpleMessage("Agent ID"),
    "analyticsCreatedAt": MessageLookupByLibrary.simpleMessage("Created At"),
    "analyticsData": MessageLookupByLibrary.simpleMessage("Data"),
    "analyticsDeletedAt": MessageLookupByLibrary.simpleMessage("Deleted At"),
    "analyticsDetailTitle": MessageLookupByLibrary.simpleMessage(
      "Analytics Details",
    ),
    "analyticsEntityId": MessageLookupByLibrary.simpleMessage("Entity ID"),
    "analyticsEntityType": MessageLookupByLibrary.simpleMessage("Entity Type"),
    "analyticsPropertyId": MessageLookupByLibrary.simpleMessage("Property ID"),
    "analyticsReservationId": MessageLookupByLibrary.simpleMessage(
      "Reservation ID",
    ),
    "analyticsTaskId": MessageLookupByLibrary.simpleMessage("Task ID"),
    "analyticsTimestamp": MessageLookupByLibrary.simpleMessage("Timestamp"),
    "analyticsType": MessageLookupByLibrary.simpleMessage("Type"),
    "analyticsTypeAgencyPerformance": MessageLookupByLibrary.simpleMessage(
      "Agency Performance",
    ),
    "analyticsTypeAgentPerformance": MessageLookupByLibrary.simpleMessage(
      "Agent Performance",
    ),
    "analyticsTypeBookingConversion": MessageLookupByLibrary.simpleMessage(
      "Booking Conversion",
    ),
    "analyticsTypeListingView": MessageLookupByLibrary.simpleMessage(
      "Listing View",
    ),
    "analyticsTypePerformance": MessageLookupByLibrary.simpleMessage(
      "Performance",
    ),
    "analyticsTypeRevenue": MessageLookupByLibrary.simpleMessage("Revenue"),
    "analyticsTypeUserEngagement": MessageLookupByLibrary.simpleMessage(
      "User Engagement",
    ),
    "analyticsTypeView": MessageLookupByLibrary.simpleMessage("View"),
    "analyticsUpdatedAt": MessageLookupByLibrary.simpleMessage("Updated At"),
    "analyticsUserId": MessageLookupByLibrary.simpleMessage("User ID"),
    "appTitle": MessageLookupByLibrary.simpleMessage("Menem"),
    "authSignIn": MessageLookupByLibrary.simpleMessage(
      "Iniciar sesión con Google",
    ),
    "authSignOut": MessageLookupByLibrary.simpleMessage("Cerrar sesión"),
    "authWelcomeBack": m2,
    "chatBack": MessageLookupByLibrary.simpleMessage("Atrás"),
    "chatBackToList": MessageLookupByLibrary.simpleMessage("Volver a la lista"),
    "chatChattingWith": m3,
    "chatConnectWithUsers": MessageLookupByLibrary.simpleMessage(
      "Connect with users and get support",
    ),
    "chatConnectionError": MessageLookupByLibrary.simpleMessage(
      "Error al conectar con el servidor de chat. Por favor, inténtelo de nuevo.",
    ),
    "chatContactSupport": MessageLookupByLibrary.simpleMessage(
      "Contactar con soporte",
    ),
    "chatError": MessageLookupByLibrary.simpleMessage("Error"),
    "chatErrorMarkAsRead": MessageLookupByLibrary.simpleMessage(
      "Error al marcar los mensajes como leídos",
    ),
    "chatErrorSendMessage": MessageLookupByLibrary.simpleMessage(
      "Error al enviar el mensaje",
    ),
    "chatErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Debe iniciar sesión para realizar esta acción",
    ),
    "chatMessageSendError": MessageLookupByLibrary.simpleMessage(
      "Error al enviar su mensaje. Por favor, inténtelo más tarde.",
    ),
    "chatMessages": MessageLookupByLibrary.simpleMessage("Mensajes"),
    "chatNewMessage": MessageLookupByLibrary.simpleMessage("Nuevo mensaje"),
    "chatSearchUsers": MessageLookupByLibrary.simpleMessage(
      "Buscar usuarios...",
    ),
    "chatSend": MessageLookupByLibrary.simpleMessage("Enviar"),
    "chatTypeMessage": MessageLookupByLibrary.simpleMessage(
      "Escriba su mensaje...",
    ),
    "chatWelcomeDescription": MessageLookupByLibrary.simpleMessage(
      "Inicie una conversación con otros usuarios o contacte con soporte para obtener ayuda",
    ),
    "chatWelcomeToChat": MessageLookupByLibrary.simpleMessage(
      "Bienvenido al Chat",
    ),
    "common_no": MessageLookupByLibrary.simpleMessage("No"),
    "common_not_available": MessageLookupByLibrary.simpleMessage(
      "No disponible",
    ),
    "common_save": MessageLookupByLibrary.simpleMessage("Guardar"),
    "common_yes": MessageLookupByLibrary.simpleMessage("Sí"),
    "dashboard": MessageLookupByLibrary.simpleMessage("Panel de control"),
    "defaultUser": MessageLookupByLibrary.simpleMessage(
      "Usuario predeterminado",
    ),
    "edit_agent_tooltip": MessageLookupByLibrary.simpleMessage("Editar agente"),
    "getDirectionsButton": MessageLookupByLibrary.simpleMessage(
      "Obtener direcciones",
    ),
    "homeLabel": MessageLookupByLibrary.simpleMessage("Inicio"),
    "indexDescription": MessageLookupByLibrary.simpleMessage(
      "Su solución de gestión de propiedades",
    ),
    "indexPropertyManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Gestione sus propiedades de manera eficiente con nuestro completo conjunto de herramientas.",
    ),
    "indexPropertyManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Gestión de propiedades",
    ),
    "indexTitle": MessageLookupByLibrary.simpleMessage("Bienvenido a Menem"),
    "indexWaterManagementDescription": MessageLookupByLibrary.simpleMessage(
      "Rastree y optimice el uso del agua en sus propiedades.",
    ),
    "indexWaterManagementTitle": MessageLookupByLibrary.simpleMessage(
      "Gestión del agua",
    ),
    "listings": MessageLookupByLibrary.simpleMessage("Mis propiedades"),
    "locationSectionTitle": MessageLookupByLibrary.simpleMessage("Ubicación"),
    "loggingout": MessageLookupByLibrary.simpleMessage("Cerrando sesión..."),
    "logoutLabel": MessageLookupByLibrary.simpleMessage("Cerrar sesión"),
    "manageProperties": MessageLookupByLibrary.simpleMessage(
      "Administre sus propiedades eficazmente",
    ),
    "messageStatusDelivered": MessageLookupByLibrary.simpleMessage("Entregado"),
    "messageStatusRead": MessageLookupByLibrary.simpleMessage("Leído"),
    "messageStatusSent": MessageLookupByLibrary.simpleMessage("Enviado"),
    "messagesLabel": MessageLookupByLibrary.simpleMessage("Mensajes"),
    "monthlyCashflow": MessageLookupByLibrary.simpleMessage(
      "Flujo de caja mensual",
    ),
    "nav_analytics": MessageLookupByLibrary.simpleMessage("Analíticas"),
    "nav_expenses": MessageLookupByLibrary.simpleMessage("Gastos"),
    "nav_facilities": MessageLookupByLibrary.simpleMessage("Instalaciones"),
    "nav_help": MessageLookupByLibrary.simpleMessage("Ayuda"),
    "nav_helpdesk": MessageLookupByLibrary.simpleMessage("Mesa de ayuda"),
    "nav_home": MessageLookupByLibrary.simpleMessage("Inicio"),
    "nav_logout": MessageLookupByLibrary.simpleMessage("Cerrar sesión"),
    "nav_messages": MessageLookupByLibrary.simpleMessage("Mensajes"),
    "nav_notifications": MessageLookupByLibrary.simpleMessage("Notificaciones"),
    "nav_payments": MessageLookupByLibrary.simpleMessage("Pagos"),
    "nav_profile": MessageLookupByLibrary.simpleMessage("Perfil"),
    "nav_properties": MessageLookupByLibrary.simpleMessage("Propiedades"),
    "nav_settings": MessageLookupByLibrary.simpleMessage("Configuración"),
    "nav_subscription": MessageLookupByLibrary.simpleMessage("Suscripción"),
    "nav_tasks": MessageLookupByLibrary.simpleMessage("Tareas"),
    "nav_tenants": MessageLookupByLibrary.simpleMessage("Inquilinos"),
    "nav_viewAll": MessageLookupByLibrary.simpleMessage("Ver todo"),
    "newTenants": m5,
    "noAmenitiesListed": MessageLookupByLibrary.simpleMessage(
      "No hay servicios listados",
    ),
    "notificationsLabel": MessageLookupByLibrary.simpleMessage(
      "Notificaciones",
    ),
    "notifications_placeholder": MessageLookupByLibrary.simpleMessage(
      "Aún no hay notificaciones",
    ),
    "occupancyRate": m6,
    "payments": MessageLookupByLibrary.simpleMessage("Pagos"),
    "paymentsLabel": MessageLookupByLibrary.simpleMessage("Pagos"),
    "pendingPayments": m7,
    "pendingTasks": MessageLookupByLibrary.simpleMessage("Tareas pendientes"),
    "postsCancel": MessageLookupByLibrary.simpleMessage("Cancelar"),
    "postsContent": MessageLookupByLibrary.simpleMessage("Contenido"),
    "postsCreate": MessageLookupByLibrary.simpleMessage("Crear publicación"),
    "postsDelete": MessageLookupByLibrary.simpleMessage("Eliminar"),
    "postsEdit": MessageLookupByLibrary.simpleMessage("Editar"),
    "postsErrorCreatePost": MessageLookupByLibrary.simpleMessage(
      "Error al crear la publicación",
    ),
    "postsErrorDeletePost": MessageLookupByLibrary.simpleMessage(
      "Error al eliminar la publicación",
    ),
    "postsErrorUnauthorized": MessageLookupByLibrary.simpleMessage(
      "Debe iniciar sesión para realizar esta acción",
    ),
    "postsErrorUpdatePost": MessageLookupByLibrary.simpleMessage(
      "Error al actualizar la publicación",
    ),
    "postsLoading": MessageLookupByLibrary.simpleMessage(
      "Cargando publicaciones...",
    ),
    "postsNoPostsYet": MessageLookupByLibrary.simpleMessage(
      "Aún no hay publicaciones",
    ),
    "postsSave": MessageLookupByLibrary.simpleMessage("Guardar"),
    "postsTitle": MessageLookupByLibrary.simpleMessage("Título"),
    "profileLabel": MessageLookupByLibrary.simpleMessage("Perfil"),
    "properties": MessageLookupByLibrary.simpleMessage("Propiedades"),
    "quickAccess": MessageLookupByLibrary.simpleMessage("Acceso rápido"),
    "settingsLabel": MessageLookupByLibrary.simpleMessage("Configuración"),
    "sitetitle": MessageLookupByLibrary.simpleMessage("RentalProc"),
    "summaryStatistics": MessageLookupByLibrary.simpleMessage(
      "Estadísticas resumen",
    ),
    "tasks": MessageLookupByLibrary.simpleMessage("Tareas"),
    "tasksThisWeek": m9,
    "tenants": MessageLookupByLibrary.simpleMessage("Inquilinos"),
    "totalProperties": MessageLookupByLibrary.simpleMessage(
      "Total de propiedades",
    ),
    "totalTenants": MessageLookupByLibrary.simpleMessage("Total de inquilinos"),
    "unknownTime": MessageLookupByLibrary.simpleMessage("Hora desconocida"),
  };
}
