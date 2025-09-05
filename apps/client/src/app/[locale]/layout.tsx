import type { ReactNode } from "react";

import { Toaster } from "@reservatior/ui/toaster";

import { ChatBalloon } from "~/components/ChatBalloon";
import { ChatProvider } from "~/context/ChatContext";
import { useToast } from "~/hooks/use-toast";
import { routing } from "../../i18n/routing";
import { Providers } from "../_components/Providers";

// Import messages from all locales
import enabout from "../../../locales/en/about.json";
import enaccount from "../../../locales/en/account.json";
import enadmin from "../../../locales/en/admin.json";
import enAdminTickets from "../../../locales/en/admin/tickets.json";
import enagencies from "../../../locales/en/agencies.json";
import enagency from "../../../locales/en/agency.json";
import enagents from "../../../locales/en/agents.json";
import enanalytics from "../../../locales/en/analytics.json";
import enapp from "../../../locales/en/app.json";
import enauthError from "../../../locales/en/auth-error.json";
import enauthor from "../../../locales/en/author.json";
import enbecomeAgency from "../../../locales/en/become-agency.json";
import enbecomeAgent from "../../../locales/en/become-agent.json";
import enchat from "../../../locales/en/chat.json";
import encheckout from "../../../locales/en/checkout.json";
import enclientHome from "../../../locales/en/client-home.json";
import enclientSection from "../../../locales/en/client-section.json";
import enClientPropertyDetail from "../../../locales/en/ClientPropertyDetail.json";
import enclient from "../../../locales/en/client.json";
import encommissionRule from "../../../locales/en/commission-rule.json";
import encommon from "../../../locales/en/common.json";
import encompliance from "../../../locales/en/compliance.json";
import encontact from "../../../locales/en/contact.json";
import encontext from "../../../locales/en/context.json";
import encontract from "../../../locales/en/contract.json";
import endashboardPage from "../../../locales/en/dashboard-page.json";
import endashboard from "../../../locales/en/dashboard.json";
import enenums from "../../../locales/en/enums.json";
import enevents from "../../../locales/en/events.json";
import enfacility from "../../../locales/en/facility.json";
import enfavorites from "../../../locales/en/favorites.json";
import enfooter from "../../../locales/en/footer.json";
import enguest from "../../../locales/en/guest.json";
import enhelp from "../../../locales/en/help.json";
import enhelpers from "../../../locales/en/helpers.json";
import enhomeComponents from "../../../locales/en/home-components.json";
import enhome from "../../../locales/en/home.json";
import enhooks from "../../../locales/en/hooks.json";
import enindex from "../../../locales/en/index.json";
import enlanguageDropdown from "../../../locales/en/language-dropdown.json";
import enlisting from "../../../locales/en/listing.json";
import enlogout from "../../../locales/en/logout.json";
import enmessages from "../../../locales/en/messages.json";
import enml from "../../../locales/en/ml.json";
import enmobileMenu from "../../../locales/en/mobile-menu.json";
import enmortgage from "../../../locales/en/mortgage.json";
import enmyListings from "../../../locales/en/my-listings.json";
import ennav from "../../../locales/en/nav.json";
import ennavbar from "../../../locales/en/navbar.json";
import ennotification from "../../../locales/en/notification.json";
import ennotifications from "../../../locales/en/notifications.json";
import enpages from "../../../locales/en/pages.json";
import enpayments from "../../../locales/en/payments.json";
import enplaces from "../../../locales/en/places.json";
import enposts from "../../../locales/en/posts.json";
import enprofile from "../../../locales/en/profile.json";
import enproperties from "../../../locales/en/properties.json";
import enpropertyFilter from "../../../locales/en/property-filter.json";
import enproperty from "../../../locales/en/property.json";
import enquickAccess from "../../../locales/en/quick-access.json";
import enquickActions from "../../../locales/en/quick-actions.json";
import enreport from "../../../locales/en/report.json";
import enreservation from "../../../locales/en/reservation.json";
import enreviews from "../../../locales/en/reviews.json";
import ensearch from "../../../locales/en/search.json";
import enservices from "../../../locales/en/services.json";
import ensettings from "../../../locales/en/settings.json";
import enshared from "../../../locales/en/shared.json";
import ensidebar from "../../../locales/en/sidebar.json";
import ensubscription from "../../../locales/en/subscription.json";
import entasks from "../../../locales/en/tasks.json";
import entaxRecords from "../../../locales/en/taxRecords.json";
import entenants from "../../../locales/en/tenants.json";
import entrpc from "../../../locales/en/trpc.json";
import entypes from "../../../locales/en/types.json";
import enuiComponents from "../../../locales/en/ui-components.json";
import enwelcome from "../../../locales/en/welcome.json";
import tragencies from "../../../locales/tr/agencies.json";
import tranalytics from "../../../locales/tr/analytics.json";
import trapp from "../../../locales/tr/app.json";
import trauthError from "../../../locales/tr/auth-error.json";
import trchat from "../../../locales/tr/chat.json";
import trclientSection from "../../../locales/tr/client-section.json";
import trdashboardPage from "../../../locales/tr/dashboard-page.json";
import trevents from "../../../locales/tr/events.json";
import trfooter from "../../../locales/tr/footer.json";
import trlogout from "../../../locales/tr/logout.json";
import trmortgage from "../../../locales/tr/mortgage.json";
import trnav from "../../../locales/tr/nav.json";
import trpropertyFilter from "../../../locales/tr/property-filter.json";
import trreport from "../../../locales/tr/report.json";
import trreviews from "../../../locales/tr/reviews.json";
import trsearch from "../../../locales/tr/search.json";
import trservices from "../../../locales/tr/services.json";
import trsettings from "../../../locales/tr/settings.json";
import trsidebar from "../../../locales/tr/sidebar.json";
import trsubscription from "../../../locales/tr/subscription.json";
import trtaxRecords from "../../../locales/tr/taxRecords.json";
import trtenants from "../../../locales/tr/tenants.json";
import trtrpc from "../../../locales/tr/trpc.json";
import trtypes from "../../../locales/tr/types.json";
import truiComponents from "../../../locales/tr/ui-components.json";

import esagencies from "../../../locales/es/agencies.json";
import esanalytics from "../../../locales/es/analytics.json";
import esapp from "../../../locales/es/app.json";
import esauthError from "../../../locales/es/auth-error.json";
import eschat from "../../../locales/es/chat.json";
import esclientSection from "../../../locales/es/client-section.json";
import esdashboardPage from "../../../locales/es/dashboard-page.json";
import esevents from "../../../locales/es/events.json";
import esfooter from "../../../locales/es/footer.json";
import eslogout from "../../../locales/es/logout.json";
import esmortgage from "../../../locales/es/mortgage.json";
import esnav from "../../../locales/es/nav.json";
import espropertyFilter from "../../../locales/es/property-filter.json";
import esreport from "../../../locales/es/report.json";
import esreviews from "../../../locales/es/reviews.json";
import essearch from "../../../locales/es/search.json";
import esservices from "../../../locales/es/services.json";
import essettings from "../../../locales/es/settings.json";
import essidebar from "../../../locales/es/sidebar.json";
import essubscription from "../../../locales/es/subscription.json";
import estaxRecords from "../../../locales/es/taxRecords.json";
import estenants from "../../../locales/es/tenants.json";
import estrpc from "../../../locales/es/trpc.json";
import estypes from "../../../locales/es/types.json";
import esuiComponents from "../../../locales/es/ui-components.json";
import trabout from "../../../locales/tr/about.json";
import traccount from "../../../locales/tr/account.json";
import tradmin from "../../../locales/tr/admin.json";
import trAdminTickets from "../../../locales/tr/admin/tickets.json";
import tragency from "../../../locales/tr/agency.json";
import tragents from "../../../locales/tr/agents.json";
import trauthor from "../../../locales/tr/author.json";
import trbecomeAgency from "../../../locales/tr/become-agency.json";
import trbecomeAgent from "../../../locales/tr/become-agent.json";
import trcheckout from "../../../locales/tr/checkout.json";
import trclientHome from "../../../locales/tr/client-home.json";
import trclient from "../../../locales/tr/client.json";
import trClientPropertyDetail from "../../../locales/tr/ClientPropertyDetail.json";
import trhelp from "../../../locales/tr/client/help.json";
import trcommissionRule from "../../../locales/tr/commission-rule.json";
import trcommon from "../../../locales/tr/common.json";
import trcompliance from "../../../locales/tr/compliance.json";
import trcontact from "../../../locales/tr/contact.json";
import trcontext from "../../../locales/tr/context.json";
import trcontract from "../../../locales/tr/contract.json";
import trdashboard from "../../../locales/tr/dashboard.json";
import trenums from "../../../locales/tr/enums.json";
import trfacility from "../../../locales/tr/facility.json";
import trfavorites from "../../../locales/tr/favorites.json";
import trguest from "../../../locales/tr/guest.json";
import trhelpers from "../../../locales/tr/helpers.json";
import trhomeComponents from "../../../locales/tr/home-components.json";
import trhome from "../../../locales/tr/home.json";
import trhooks from "../../../locales/tr/hooks.json";
import trindex from "../../../locales/tr/index.json";
import trlanguageDropdown from "../../../locales/tr/language-dropdown.json";
import trlisting from "../../../locales/tr/listing.json";
import trmessages from "../../../locales/tr/messages.json";
import trml from "../../../locales/tr/ml.json";
import trmobileMenu from "../../../locales/tr/mobile-menu.json";
import trmyListings from "../../../locales/tr/my-listings.json";
import trnavbar from "../../../locales/tr/navbar.json";
import trnotification from "../../../locales/tr/notification.json";
import trnotifications from "../../../locales/tr/notifications.json";
import trpages from "../../../locales/tr/pages.json";
import trpayments from "../../../locales/tr/payments.json";
import trplaces from "../../../locales/tr/places.json";
import trposts from "../../../locales/tr/posts.json";
import trprofile from "../../../locales/tr/profile.json";
import trproperties from "../../../locales/tr/properties.json";
import trproperty from "../../../locales/tr/property.json";
import trquickAccess from "../../../locales/tr/quick-access.json";
import trquickActions from "../../../locales/tr/quick-actions.json";
import trreservation from "../../../locales/tr/reservation.json";
import trshared from "../../../locales/tr/shared.json";
import trtasks from "../../../locales/tr/tasks.json";
import trwelcome from "../../../locales/tr/welcome.json";

import esabout from "../../../locales/es/about.json";
import esaccount from "../../../locales/es/account.json";
import esadmin from "../../../locales/es/admin.json";
import esagency from "../../../locales/es/agency.json";
import esagents from "../../../locales/es/agents.json";
import esauthor from "../../../locales/es/author.json";
import esbecomeAgency from "../../../locales/es/become-agency.json";
import esbecomeAgent from "../../../locales/es/become-agent.json";
import escheckout from "../../../locales/es/checkout.json";
import esclientHome from "../../../locales/es/client-home.json";
import esclient from "../../../locales/es/client.json";
import escommissionRule from "../../../locales/es/commission-rule.json";
import escommon from "../../../locales/es/common.json";
import escompliance from "../../../locales/es/compliance.json";
import escontact from "../../../locales/es/contact.json";
import escontext from "../../../locales/es/context.json";
import escontract from "../../../locales/es/contract.json";
import esdashboard from "../../../locales/es/dashboard.json";
import esenums from "../../../locales/es/enums.json";
import esfacility from "../../../locales/es/facility.json";
import esfavorites from "../../../locales/es/favorites.json";
import esguest from "../../../locales/es/guest.json";
import eshelp from "../../../locales/es/help.json";
import eshelpers from "../../../locales/es/helpers.json";
import eshomeComponents from "../../../locales/es/home-components.json";
import eshome from "../../../locales/es/home.json";
import eshooks from "../../../locales/es/hooks.json";
import esindex from "../../../locales/es/index.json";
import eslanguageDropdown from "../../../locales/es/language-dropdown.json";
import eslisting from "../../../locales/es/listing.json";
import esmessages from "../../../locales/es/messages.json";
import esml from "../../../locales/es/ml.json";
import esmobileMenu from "../../../locales/es/mobile-menu.json";
import esmyListings from "../../../locales/es/my-listings.json";
import esnavbar from "../../../locales/es/navbar.json";
import esnotification from "../../../locales/es/notification.json";
import esnotifications from "../../../locales/es/notifications.json";
import espages from "../../../locales/es/pages.json";
import espayments from "../../../locales/es/payments.json";
import esplaces from "../../../locales/es/places.json";
import esposts from "../../../locales/es/posts.json";
import esprofile from "../../../locales/es/profile.json";
import esproperties from "../../../locales/es/properties.json";
import esproperty from "../../../locales/es/property.json";
import esquickAccess from "../../../locales/es/quick-access.json";
import esquickActions from "../../../locales/es/quick-actions.json";
import esreservation from "../../../locales/es/reservation.json";
import esshared from "../../../locales/es/shared.json";
import estasks from "../../../locales/es/tasks.json";
import eswelcome from "../../../locales/es/welcome.json";
import fragencies from "../../../locales/fr/agencies.json";
import fragents from "../../../locales/fr/agents.json";
import franalytics from "../../../locales/fr/analytics.json";
import frapp from "../../../locales/fr/app.json";
import frauthError from "../../../locales/fr/auth-error.json";
import frchat from "../../../locales/fr/chat.json";
import frcheckout from "../../../locales/fr/checkout.json";
import frclientHome from "../../../locales/fr/client-home.json";
import frclientSection from "../../../locales/fr/client-section.json";
import frcommissionRule from "../../../locales/fr/commissionRule.json";
import frcommon from "../../../locales/fr/common.json";
import frdashboardPage from "../../../locales/fr/dashboard-page.json";
import frevents from "../../../locales/fr/events.json";
import frfooter from "../../../locales/fr/footer.json";
import frlogout from "../../../locales/fr/logout.json";
import frmessages from "../../../locales/fr/messages.json";
import frml from "../../../locales/fr/ml.json";
import frmortgage from "../../../locales/fr/mortgage.json";
import frnav from "../../../locales/fr/nav.json";
import frplaces from "../../../locales/fr/places.json";
import frproperties from "../../../locales/fr/properties.json";
import frpropertyFilter from "../../../locales/fr/property-filter.json";
import frreport from "../../../locales/fr/report.json";
import frreviews from "../../../locales/fr/reviews.json";
import frsearch from "../../../locales/fr/search.json";
import frservices from "../../../locales/fr/services.json";
import frsettings from "../../../locales/fr/settings.json";
import frsidebar from "../../../locales/fr/sidebar.json";
import frsubscription from "../../../locales/fr/subscription.json";
import frtaxRecords from "../../../locales/fr/taxRecords.json";
import frtenants from "../../../locales/fr/tenants.json";
import frtrpc from "../../../locales/fr/trpc.json";
import frtypes from "../../../locales/fr/types.json";
import fruiComponents from "../../../locales/fr/ui-components.json";
import frwelcome from "../../../locales/fr/welcome.json";

import deagencies from "../../../locales/de/agencies.json";
import deanalytics from "../../../locales/de/analytics.json";
import deapp from "../../../locales/de/app.json";
import deauthError from "../../../locales/de/auth-error.json";
import dechat from "../../../locales/de/chat.json";
import declientSection from "../../../locales/de/client-section.json";
import dedashboardPage from "../../../locales/de/dashboard-page.json";
import deevents from "../../../locales/de/events.json";
import defooter from "../../../locales/de/footer.json";
import delogout from "../../../locales/de/logout.json";
import demortgage from "../../../locales/de/mortgage.json";
import denav from "../../../locales/de/nav.json";
import depropertyFilter from "../../../locales/de/property-filter.json";
import dereport from "../../../locales/de/report.json";
import dereviews from "../../../locales/de/reviews.json";
import desearch from "../../../locales/de/search.json";
import deservices from "../../../locales/de/services.json";
import desettings from "../../../locales/de/settings.json";
import desidebar from "../../../locales/de/sidebar.json";
import desubscription from "../../../locales/de/subscription.json";
import detaxRecords from "../../../locales/de/taxRecords.json";
import detenants from "../../../locales/de/tenants.json";
import detrpc from "../../../locales/de/trpc.json";
import detypes from "../../../locales/de/types.json";
import deuiComponents from "../../../locales/de/ui-components.json";
import frabout from "../../../locales/fr/about.json";
import fraccount from "../../../locales/fr/account.json";
import fradmin from "../../../locales/fr/admin.json";
import fragency from "../../../locales/fr/agency.json";
import frauthor from "../../../locales/fr/author.json";
import frbecomeAgency from "../../../locales/fr/become-agency.json";
import frbecomeAgent from "../../../locales/fr/become-agent.json";
import frclient from "../../../locales/fr/client.json";
import frcompliance from "../../../locales/fr/compliance.json";
import frcontact from "../../../locales/fr/contact.json";
import frcontext from "../../../locales/fr/context.json";
import frcontract from "../../../locales/fr/contract.json";
import frdashboard from "../../../locales/fr/dashboard.json";
import frenums from "../../../locales/fr/enums.json";
import frfacility from "../../../locales/fr/facility.json";
import frfavorites from "../../../locales/fr/favorites.json";
import frguest from "../../../locales/fr/guest.json";
import frhelp from "../../../locales/fr/help.json";
import frhelpers from "../../../locales/fr/helpers.json";
import frhomeComponents from "../../../locales/fr/home-components.json";
import frhome from "../../../locales/fr/home.json";
import frhooks from "../../../locales/fr/hooks.json";
import frindex from "../../../locales/fr/index.json";
import frlanguageDropdown from "../../../locales/fr/language-dropdown.json";
import frlisting from "../../../locales/fr/listing.json";
import frmobileMenu from "../../../locales/fr/mobile-menu.json";
import frmyListings from "../../../locales/fr/my-listings.json";
import frnavbar from "../../../locales/fr/navbar.json";
import frnotification from "../../../locales/fr/notification.json";
import frnotifications from "../../../locales/fr/notifications.json";
import frpages from "../../../locales/fr/pages.json";
import frpayments from "../../../locales/fr/payments.json";
import frposts from "../../../locales/fr/posts.json";
import frprofile from "../../../locales/fr/profile.json";
import frproperty from "../../../locales/fr/property.json";
import frquickAccess from "../../../locales/fr/quick-access.json";
import frquickActions from "../../../locales/fr/quick-actions.json";
import frreservation from "../../../locales/fr/reservation.json";
import frshared from "../../../locales/fr/shared.json";
import frtasks from "../../../locales/fr/tasks.json";

import deabout from "../../../locales/de/about.json";
import deaccount from "../../../locales/de/account.json";
import deadmin from "../../../locales/de/admin.json";
import deagency from "../../../locales/de/agency.json";
import deagents from "../../../locales/de/agents.json";
import deauthor from "../../../locales/de/author.json";
import debecomeAgency from "../../../locales/de/become-agency.json";
import debecomeAgent from "../../../locales/de/become-agent.json";
import decheckout from "../../../locales/de/checkout.json";
import declientHome from "../../../locales/de/client-home.json";
import declient from "../../../locales/de/client.json";
import decommissionRule from "../../../locales/de/commission-rule.json";
import decommon from "../../../locales/de/common.json";
import decompliance from "../../../locales/de/compliance.json";
import decontact from "../../../locales/de/contact.json";
import decontext from "../../../locales/de/context.json";
import decontract from "../../../locales/de/contract.json";
import dedashboard from "../../../locales/de/dashboard.json";
import deenums from "../../../locales/de/enums.json";
import defacility from "../../../locales/de/facility.json";
import defavorites from "../../../locales/de/favorites.json";
import deguest from "../../../locales/de/guest.json";
import dehelp from "../../../locales/de/help.json";
import dehelpers from "../../../locales/de/helpers.json";
import dehomeComponents from "../../../locales/de/home-components.json";
import dehome from "../../../locales/de/home.json";
import dehooks from "../../../locales/de/hooks.json";
import deindex from "../../../locales/de/index.json";
import delanguageDropdown from "../../../locales/de/language-dropdown.json";
import delisting from "../../../locales/de/listing.json";
import demessages from "../../../locales/de/messages.json";
import deml from "../../../locales/de/ml.json";
import demobileMenu from "../../../locales/de/mobile-menu.json";
import demyListings from "../../../locales/de/my-listings.json";
import denavbar from "../../../locales/de/navbar.json";
import denotification from "../../../locales/de/notification.json";
import denotifications from "../../../locales/de/notifications.json";
import depages from "../../../locales/de/pages.json";
import depayments from "../../../locales/de/payments.json";
import deplaces from "../../../locales/de/places.json";
import deposts from "../../../locales/de/posts.json";
import deprofile from "../../../locales/de/profile.json";
import deproperties from "../../../locales/de/properties.json";
import deproperty from "../../../locales/de/property.json";
import dequickAccess from "../../../locales/de/quick-access.json";
import dequickActions from "../../../locales/de/quick-actions.json";
import dereservation from "../../../locales/de/reservation.json";
import deshared from "../../../locales/de/shared.json";
import detasks from "../../../locales/de/tasks.json";
import dewelcome from "../../../locales/de/welcome.json";
import itagencies from "../../../locales/it/agencies.json";
import itanalytics from "../../../locales/it/analytics.json";
import itapp from "../../../locales/it/app.json";
import itauthError from "../../../locales/it/auth-error.json";
import itchat from "../../../locales/it/chat.json";
import itclientSection from "../../../locales/it/client-section.json";
import itdashboardPage from "../../../locales/it/dashboard-page.json";
import itevents from "../../../locales/it/events.json";
import itfooter from "../../../locales/it/footer.json";
import itlogout from "../../../locales/it/logout.json";
import itmortgage from "../../../locales/it/mortgage.json";
import itnav from "../../../locales/it/nav.json";
import itpropertyFilter from "../../../locales/it/property-filter.json";
import itreport from "../../../locales/it/report.json";
import itreviews from "../../../locales/it/reviews.json";
import itsearch from "../../../locales/it/search.json";
import itservices from "../../../locales/it/services.json";
import itsettings from "../../../locales/it/settings.json";
import itsidebar from "../../../locales/it/sidebar.json";
import itsubscription from "../../../locales/it/subscription.json";
import ittaxRecords from "../../../locales/it/taxRecords.json";
import ittenants from "../../../locales/it/tenants.json";
import ittrpc from "../../../locales/it/trpc.json";
import ittypes from "../../../locales/it/types.json";
import ituiComponents from "../../../locales/it/ui-components.json";

import itabout from "../../../locales/it/about.json";
import itaccount from "../../../locales/it/account.json";
import itadmin from "../../../locales/it/admin.json";
import itagency from "../../../locales/it/agency.json";
import itagents from "../../../locales/it/agents.json";
import itauthor from "../../../locales/it/author.json";
import itbecomeAgency from "../../../locales/it/become-agency.json";
import itbecomeAgent from "../../../locales/it/become-agent.json";
import itcheckout from "../../../locales/it/checkout.json";
import itclientHome from "../../../locales/it/client-home.json";
import itclient from "../../../locales/it/client.json";
import itcommissionRule from "../../../locales/it/commission-rule.json";
import itcommon from "../../../locales/it/common.json";
import itcompliance from "../../../locales/it/compliance.json";
import itcontact from "../../../locales/it/contact.json";
import itcontext from "../../../locales/it/context.json";
import itcontract from "../../../locales/it/contract.json";
import itdashboard from "../../../locales/it/dashboard.json";
import itenums from "../../../locales/it/enums.json";
import itfacility from "../../../locales/it/facility.json";
import itfavorites from "../../../locales/it/favorites.json";
import itguest from "../../../locales/it/guest.json";
import ithelp from "../../../locales/it/help.json";
import ithelpers from "../../../locales/it/helpers.json";
import ithomeComponents from "../../../locales/it/home-components.json";
import ithome from "../../../locales/it/home.json";
import ithooks from "../../../locales/it/hooks.json";
import itindex from "../../../locales/it/index.json";
import itlanguageDropdown from "../../../locales/it/language-dropdown.json";
import itlisting from "../../../locales/it/listing.json";
import itmessages from "../../../locales/it/messages.json";
import itml from "../../../locales/it/ml.json";
import itmobileMenu from "../../../locales/it/mobile-menu.json";
import itmyListings from "../../../locales/it/my-listings.json";
import itnavbar from "../../../locales/it/navbar.json";
import itnotification from "../../../locales/it/notification.json";
import itnotifications from "../../../locales/it/notifications.json";
import itpages from "../../../locales/it/pages.json";
import itpayments from "../../../locales/it/payments.json";
import itplaces from "../../../locales/it/places.json";
import itposts from "../../../locales/it/posts.json";
import itprofile from "../../../locales/it/profile.json";
import itproperties from "../../../locales/it/properties.json";
import itproperty from "../../../locales/it/property.json";
import itquickAccess from "../../../locales/it/quick-access.json";
import itquickActions from "../../../locales/it/quick-actions.json";
import itreservation from "../../../locales/it/reservation.json";
import itshared from "../../../locales/it/shared.json";
import ittasks from "../../../locales/it/tasks.json";
import itwelcome from "../../../locales/it/welcome.json";
import jaagencies from "../../../locales/ja/agencies.json";
import jaanalytics from "../../../locales/ja/analytics.json";
import jaapp from "../../../locales/ja/app.json";
import jaauthError from "../../../locales/ja/auth-error.json";
import jachat from "../../../locales/ja/chat.json";
import jaclientSection from "../../../locales/ja/client-section.json";
import jadashboardPage from "../../../locales/ja/dashboard-page.json";
import jaevents from "../../../locales/ja/events.json";
import jafooter from "../../../locales/ja/footer.json";
import jalogout from "../../../locales/ja/logout.json";
import jamortgage from "../../../locales/ja/mortgage.json";
import janav from "../../../locales/ja/nav.json";
import japropertyFilter from "../../../locales/ja/property-filter.json";
import jareport from "../../../locales/ja/report.json";
import jareviews from "../../../locales/ja/reviews.json";
import jasearch from "../../../locales/ja/search.json";
import jaservices from "../../../locales/ja/services.json";
import jasettings from "../../../locales/ja/settings.json";
import jasidebar from "../../../locales/ja/sidebar.json";
import jasubscription from "../../../locales/ja/subscription.json";
import jataxRecords from "../../../locales/ja/taxRecords.json";
import jatenants from "../../../locales/ja/tenants.json";
import jatrpc from "../../../locales/ja/trpc.json";
import jatypes from "../../../locales/ja/types.json";
import jauiComponents from "../../../locales/ja/ui-components.json";
import ruabout from "../../../locales/ru/about.json";
import ruaccount from "../../../locales/ru/account.json";
import ruadmin from "../../../locales/ru/admin.json";
import ruagencies from "../../../locales/ru/agencies.json";
import ruagency from "../../../locales/ru/agency.json";
import ruagents from "../../../locales/ru/agents.json";
import ruanalytics from "../../../locales/ru/analytics.json";
import ruapp from "../../../locales/ru/app.json";
import ruauthError from "../../../locales/ru/auth-error.json";
import ruauthor from "../../../locales/ru/author.json";
import rubecomeAgency from "../../../locales/ru/become-agency.json";
import rubecomeAgent from "../../../locales/ru/become-agent.json";
import ruchat from "../../../locales/ru/chat.json";
import rucheckout from "../../../locales/ru/checkout.json";
import ruclientHome from "../../../locales/ru/client-home.json";
import ruclientSection from "../../../locales/ru/client-section.json";
import ruclient from "../../../locales/ru/client.json";
import rucommissionRule from "../../../locales/ru/commission-rule.json";
import rucommon from "../../../locales/ru/common.json";
import rucompliance from "../../../locales/ru/compliance.json";
import rucontact from "../../../locales/ru/contact.json";
import rucontext from "../../../locales/ru/context.json";
import rucontract from "../../../locales/ru/contract.json";
import rudashboardPage from "../../../locales/ru/dashboard-page.json";
import rudashboard from "../../../locales/ru/dashboard.json";
import ruenums from "../../../locales/ru/enums.json";
import ruevents from "../../../locales/ru/events.json";
import rufacility from "../../../locales/ru/facility.json";
import rufavorites from "../../../locales/ru/favorites.json";
import rufooter from "../../../locales/ru/footer.json";
import ruguest from "../../../locales/ru/guest.json";
import ruhelp from "../../../locales/ru/help.json";
import ruhelpers from "../../../locales/ru/helpers.json";
import ruhomeComponents from "../../../locales/ru/home-components.json";
import ruhome from "../../../locales/ru/home.json";
import ruhooks from "../../../locales/ru/hooks.json";
import ruindex from "../../../locales/ru/index.json";
import rulanguageDropdown from "../../../locales/ru/language-dropdown.json";
import rulisting from "../../../locales/ru/listing.json";
import rulogout from "../../../locales/ru/logout.json";
import rumessages from "../../../locales/ru/messages.json";
import ruml from "../../../locales/ru/ml.json";
import rumobileMenu from "../../../locales/ru/mobile-menu.json";
import rumortgage from "../../../locales/ru/mortgage.json";
import rumyListings from "../../../locales/ru/my-listings.json";
import runav from "../../../locales/ru/nav.json";
import runavbar from "../../../locales/ru/navbar.json";
import runotification from "../../../locales/ru/notification.json";
import runotifications from "../../../locales/ru/notifications.json";
import rupages from "../../../locales/ru/pages.json";
import rupayments from "../../../locales/ru/payments.json";
import ruplaces from "../../../locales/ru/places.json";
import ruposts from "../../../locales/ru/posts.json";
import ruprofile from "../../../locales/ru/profile.json";
import ruproperties from "../../../locales/ru/properties.json";
import rupropertyFilter from "../../../locales/ru/property-filter.json";
import ruproperty from "../../../locales/ru/property.json";
import ruquickAccess from "../../../locales/ru/quick-access.json";
import ruquickActions from "../../../locales/ru/quick-actions.json";
import rureport from "../../../locales/ru/report.json";
import rureservation from "../../../locales/ru/reservation.json";
import rureviews from "../../../locales/ru/reviews.json";
import rusearch from "../../../locales/ru/search.json";
import ruservices from "../../../locales/ru/services.json";
import rusettings from "../../../locales/ru/settings.json";
import rushared from "../../../locales/ru/shared.json";
import rusidebar from "../../../locales/ru/sidebar.json";
import rusubscription from "../../../locales/ru/subscription.json";
import rutasks from "../../../locales/ru/tasks.json";
import rutaxRecords from "../../../locales/ru/taxRecords.json";
import rutenants from "../../../locales/ru/tenants.json";
import rutrpc from "../../../locales/ru/trpc.json";
import rutypes from "../../../locales/ru/types.json";
import ruuiComponents from "../../../locales/ru/ui-components.json";
import ruwelcome from "../../../locales/ru/welcome.json";

import jaabout from "../../../locales/ja/about.json";
import jaaccount from "../../../locales/ja/account.json";
import jaadmin from "../../../locales/ja/admin.json";
import jaagency from "../../../locales/ja/agency.json";
import jaagents from "../../../locales/ja/agents.json";
import jaauthor from "../../../locales/ja/author.json";
import jabecomeAgency from "../../../locales/ja/become-agency.json";
import jabecomeAgent from "../../../locales/ja/become-agent.json";
import jacheckout from "../../../locales/ja/checkout.json";
import jaclientHome from "../../../locales/ja/client-home.json";
import jaclient from "../../../locales/ja/client.json";
import jacommissionRule from "../../../locales/ja/commission-rule.json";
import jacommon from "../../../locales/ja/common.json";
import jacompliance from "../../../locales/ja/compliance.json";
import jacontact from "../../../locales/ja/contact.json";
import jacontext from "../../../locales/ja/context.json";
import jacontract from "../../../locales/ja/contract.json";
import jadashboard from "../../../locales/ja/dashboard.json";
import jaenums from "../../../locales/ja/enums.json";
import jafacility from "../../../locales/ja/facility.json";
import jafavorites from "../../../locales/ja/favorites.json";
import jaguest from "../../../locales/ja/guest.json";
import jahelp from "../../../locales/ja/help.json";
import jahelpers from "../../../locales/ja/helpers.json";
import jahomeComponents from "../../../locales/ja/home-components.json";
import jahome from "../../../locales/ja/home.json";
import jahooks from "../../../locales/ja/hooks.json";
import jaindex from "../../../locales/ja/index.json";
import jalanguageDropdown from "../../../locales/ja/language-dropdown.json";
import jalisting from "../../../locales/ja/listing.json";
import jamessages from "../../../locales/ja/messages.json";
import jaml from "../../../locales/ja/ml.json";
import jamobileMenu from "../../../locales/ja/mobile-menu.json";
import jamyListings from "../../../locales/ja/my-listings.json";
import janavbar from "../../../locales/ja/navbar.json";
import janotification from "../../../locales/ja/notification.json";
import janotifications from "../../../locales/ja/notifications.json";
import japages from "../../../locales/ja/pages.json";
import japayments from "../../../locales/ja/payments.json";
import japlaces from "../../../locales/ja/places.json";
import japosts from "../../../locales/ja/posts.json";
import japrofile from "../../../locales/ja/profile.json";
import japroperties from "../../../locales/ja/properties.json";
import japroperty from "../../../locales/ja/property.json";
import jaquickAccess from "../../../locales/ja/quick-access.json";
import jaquickActions from "../../../locales/ja/quick-actions.json";
import jareservation from "../../../locales/ja/reservation.json";
import jashared from "../../../locales/ja/shared.json";
import jatasks from "../../../locales/ja/tasks.json";
import jawelcome from "../../../locales/ja/welcome.json";
import zhagencies from "../../../locales/zh/agencies.json";
import zhanalytics from "../../../locales/zh/analytics.json";
import zhapp from "../../../locales/zh/app.json";
import zhauthError from "../../../locales/zh/auth-error.json";
import zhchat from "../../../locales/zh/chat.json";
import zhclientSection from "../../../locales/zh/client-section.json";
import zhdashboardPage from "../../../locales/zh/dashboard-page.json";
import zhevents from "../../../locales/zh/events.json";
import zhfooter from "../../../locales/zh/footer.json";
import zhlogout from "../../../locales/zh/logout.json";
import zhmortgage from "../../../locales/zh/mortgage.json";
import zhnav from "../../../locales/zh/nav.json";
import zhpropertyFilter from "../../../locales/zh/property-filter.json";
import zhreport from "../../../locales/zh/report.json";
import zhreviews from "../../../locales/zh/reviews.json";
import zhsearch from "../../../locales/zh/search.json";
import zhservices from "../../../locales/zh/services.json";
import zhsettings from "../../../locales/zh/settings.json";
import zhsidebar from "../../../locales/zh/sidebar.json";
import zhsubscription from "../../../locales/zh/subscription.json";
import zhtaxRecords from "../../../locales/zh/taxRecords.json";
import zhtenants from "../../../locales/zh/tenants.json";
import zhtrpc from "../../../locales/zh/trpc.json";
import zhtypes from "../../../locales/zh/types.json";
import zhuiComponents from "../../../locales/zh/ui-components.json";

import aragencies from "../../../locales/ar/agencies.json";
import aragents from "../../../locales/ar/agents.json";
import aranalytics from "../../../locales/ar/analytics.json";
import arapp from "../../../locales/ar/app.json";
import arauthError from "../../../locales/ar/auth-error.json";
import archat from "../../../locales/ar/chat.json";
import archeckout from "../../../locales/ar/checkout.json";
import arclientHome from "../../../locales/ar/client-home.json";
import arclientSection from "../../../locales/ar/client-section.json";
import arcommissionRule from "../../../locales/ar/commissionRule.json";
import arcommon from "../../../locales/ar/common.json";
import ardashboardPage from "../../../locales/ar/dashboard-page.json";
import arevents from "../../../locales/ar/events.json";
import arfooter from "../../../locales/ar/footer.json";
import arlogout from "../../../locales/ar/logout.json";
import armessages from "../../../locales/ar/messages.json";
import arml from "../../../locales/ar/ml.json";
import armortgage from "../../../locales/ar/mortgage.json";
import arnav from "../../../locales/ar/nav.json";
import arplaces from "../../../locales/ar/places.json";
import arproperties from "../../../locales/ar/properties.json";
import arpropertyFilter from "../../../locales/ar/property-filter.json";
import arreport from "../../../locales/ar/report.json";
import arreviews from "../../../locales/ar/reviews.json";
import arsearch from "../../../locales/ar/search.json";
import arservices from "../../../locales/ar/services.json";
import arsettings from "../../../locales/ar/settings.json";
import arsidebar from "../../../locales/ar/sidebar.json";
import arsubscription from "../../../locales/ar/subscription.json";
import artaxRecords from "../../../locales/ar/taxRecords.json";
import artenants from "../../../locales/ar/tenants.json";
import artrpc from "../../../locales/ar/trpc.json";
import artypes from "../../../locales/ar/types.json";
import aruiComponents from "../../../locales/ar/ui-components.json";
import arwelcome from "../../../locales/ar/welcome.json";
import zhabout from "../../../locales/zh/about.json";
import zhaccount from "../../../locales/zh/account.json";
import zhadmin from "../../../locales/zh/admin.json";
import zhagency from "../../../locales/zh/agency.json";
import zhagents from "../../../locales/zh/agents.json";
import zhauthor from "../../../locales/zh/author.json";
import zhbecomeAgency from "../../../locales/zh/become-agency.json";
import zhbecomeAgent from "../../../locales/zh/become-agent.json";
import zhcheckout from "../../../locales/zh/checkout.json";
import zhclientHome from "../../../locales/zh/client-home.json";
import zhclient from "../../../locales/zh/client.json";
import zhcommissionRule from "../../../locales/zh/commission-rule.json";
import zhcommon from "../../../locales/zh/common.json";
import zhcompliance from "../../../locales/zh/compliance.json";
import zhcontact from "../../../locales/zh/contact.json";
import zhcontext from "../../../locales/zh/context.json";
import zhcontract from "../../../locales/zh/contract.json";
import zhdashboard from "../../../locales/zh/dashboard.json";
import zhenums from "../../../locales/zh/enums.json";
import zhfacility from "../../../locales/zh/facility.json";
import zhfavorites from "../../../locales/zh/favorites.json";
import zhguest from "../../../locales/zh/guest.json";
import zhhelp from "../../../locales/zh/help.json";
import zhhelpers from "../../../locales/zh/helpers.json";
import zhhomeComponents from "../../../locales/zh/home-components.json";
import zhhome from "../../../locales/zh/home.json";
import zhhooks from "../../../locales/zh/hooks.json";
import zhindex from "../../../locales/zh/index.json";
import zhlanguageDropdown from "../../../locales/zh/language-dropdown.json";
import zhlisting from "../../../locales/zh/listing.json";
import zhmessages from "../../../locales/zh/messages.json";
import zhml from "../../../locales/zh/ml.json";
import zhmobileMenu from "../../../locales/zh/mobile-menu.json";
import zhmyListings from "../../../locales/zh/my-listings.json";
import zhnavbar from "../../../locales/zh/navbar.json";
import zhnotification from "../../../locales/zh/notification.json";
import zhnotifications from "../../../locales/zh/notifications.json";
import zhpages from "../../../locales/zh/pages.json";
import zhpayments from "../../../locales/zh/payments.json";
import zhplaces from "../../../locales/zh/places.json";
import zhposts from "../../../locales/zh/posts.json";
import zhprofile from "../../../locales/zh/profile.json";
import zhproperties from "../../../locales/zh/properties.json";
import zhproperty from "../../../locales/zh/property.json";
import zhquickAccess from "../../../locales/zh/quick-access.json";
import zhquickActions from "../../../locales/zh/quick-actions.json";
import zhreservation from "../../../locales/zh/reservation.json";
import zhshared from "../../../locales/zh/shared.json";
import zhtasks from "../../../locales/zh/tasks.json";
import zhwelcome from "../../../locales/zh/welcome.json";

import arabout from "../../../locales/ar/about.json";
import araccount from "../../../locales/ar/account.json";
import aradmin from "../../../locales/ar/admin.json";
import aragency from "../../../locales/ar/agency.json";
import arauthor from "../../../locales/ar/author.json";
import arbecomeAgency from "../../../locales/ar/become-agency.json";
import arbecomeAgent from "../../../locales/ar/become-agent.json";
import arclient from "../../../locales/ar/client.json";
import arcompliance from "../../../locales/ar/compliance.json";
import arcontact from "../../../locales/ar/contact.json";
import arcontext from "../../../locales/ar/context.json";
import arcontract from "../../../locales/ar/contract.json";
import ardashboard from "../../../locales/ar/dashboard.json";
import arenums from "../../../locales/ar/enums.json";
import arfacility from "../../../locales/ar/facility.json";
import arfavorites from "../../../locales/ar/favorites.json";
import arguest from "../../../locales/ar/guest.json";
import arhelp from "../../../locales/ar/help.json";
import arhelpers from "../../../locales/ar/helpers.json";
import arhomeComponents from "../../../locales/ar/home-components.json";
import arhome from "../../../locales/ar/home.json";
import arhooks from "../../../locales/ar/hooks.json";
import arindex from "../../../locales/ar/index.json";
import arlanguageDropdown from "../../../locales/ar/language-dropdown.json";
import arlisting from "../../../locales/ar/listing.json";
import armobileMenu from "../../../locales/ar/mobile-menu.json";
import armyListings from "../../../locales/ar/my-listings.json";
import arnavbar from "../../../locales/ar/navbar.json";
import arnotification from "../../../locales/ar/notification.json";
import arnotifications from "../../../locales/ar/notifications.json";
import arpages from "../../../locales/ar/pages.json";
import arpayments from "../../../locales/ar/payments.json";
import arposts from "../../../locales/ar/posts.json";
import arprofile from "../../../locales/ar/profile.json";
import arproperty from "../../../locales/ar/property.json";
import arquickAccess from "../../../locales/ar/quick-access.json";
import arquickActions from "../../../locales/ar/quick-actions.json";
import arreservation from "../../../locales/ar/reservation.json";
import arshared from "../../../locales/ar/shared.json";
import artasks from "../../../locales/ar/tasks.json";
import hiagencies from "../../../locales/hi/agencies.json";
import hianalytics from "../../../locales/hi/analytics.json";
import hiapp from "../../../locales/hi/app.json";
import hiauthError from "../../../locales/hi/auth-error.json";
import hichat from "../../../locales/hi/chat.json";
import hiclientSection from "../../../locales/hi/client-section.json";
import hidashboardPage from "../../../locales/hi/dashboard-page.json";
import hievents from "../../../locales/hi/events.json";
import hifooter from "../../../locales/hi/footer.json";
import hilogout from "../../../locales/hi/logout.json";
import himortgage from "../../../locales/hi/mortgage.json";
import hinav from "../../../locales/hi/nav.json";
import hipropertyFilter from "../../../locales/hi/property-filter.json";
import hireport from "../../../locales/hi/report.json";
import hireviews from "../../../locales/hi/reviews.json";
import hisearch from "../../../locales/hi/search.json";
import hiservices from "../../../locales/hi/services.json";
import hisettings from "../../../locales/hi/settings.json";
import hisidebar from "../../../locales/hi/sidebar.json";
import hisubscription from "../../../locales/hi/subscription.json";
import hitaxRecords from "../../../locales/hi/taxRecords.json";
import hitenants from "../../../locales/hi/tenants.json";
import hitrpc from "../../../locales/hi/trpc.json";
import hitypes from "../../../locales/hi/types.json";
import hiuiComponents from "../../../locales/hi/ui-components.json";

import hiabout from "../../../locales/hi/about.json";
import hiaccount from "../../../locales/hi/account.json";
import hiadmin from "../../../locales/hi/admin.json";
import hiagency from "../../../locales/hi/agency.json";
import hiagents from "../../../locales/hi/agents.json";
import hiauthor from "../../../locales/hi/author.json";
import hibecomeAgency from "../../../locales/hi/become-agency.json";
import hibecomeAgent from "../../../locales/hi/become-agent.json";
import hicheckout from "../../../locales/hi/checkout.json";
import hiclientHome from "../../../locales/hi/client-home.json";
import hiclient from "../../../locales/hi/client.json";
import hicommissionRule from "../../../locales/hi/commission-rule.json";
import hicommon from "../../../locales/hi/common.json";
import hicompliance from "../../../locales/hi/compliance.json";
import hicontact from "../../../locales/hi/contact.json";
import hicontext from "../../../locales/hi/context.json";
import hicontract from "../../../locales/hi/contract.json";
import hidashboard from "../../../locales/hi/dashboard.json";
import hienums from "../../../locales/hi/enums.json";
import hifacility from "../../../locales/hi/facility.json";
import hifavorites from "../../../locales/hi/favorites.json";
import higuest from "../../../locales/hi/guest.json";
import hihelp from "../../../locales/hi/help.json";
import hihelpers from "../../../locales/hi/helpers.json";
import hihomeComponents from "../../../locales/hi/home-components.json";
import hihome from "../../../locales/hi/home.json";
import hihooks from "../../../locales/hi/hooks.json";
import hiindex from "../../../locales/hi/index.json";
import hilanguageDropdown from "../../../locales/hi/language-dropdown.json";
import hilisting from "../../../locales/hi/listing.json";
import himessages from "../../../locales/hi/messages.json";
import himl from "../../../locales/hi/ml.json";
import himobileMenu from "../../../locales/hi/mobile-menu.json";
import himyListings from "../../../locales/hi/my-listings.json";
import hinavbar from "../../../locales/hi/navbar.json";
import hinotification from "../../../locales/hi/notification.json";
import hinotifications from "../../../locales/hi/notifications.json";
import hipages from "../../../locales/hi/pages.json";
import hipayments from "../../../locales/hi/payments.json";
import hiplaces from "../../../locales/hi/places.json";
import hiposts from "../../../locales/hi/posts.json";
import hiprofile from "../../../locales/hi/profile.json";
import hiproperties from "../../../locales/hi/properties.json";
import hiproperty from "../../../locales/hi/property.json";
import hiquickAccess from "../../../locales/hi/quick-access.json";
import hiquickActions from "../../../locales/hi/quick-actions.json";
import hireservation from "../../../locales/hi/reservation.json";
import hishared from "../../../locales/hi/shared.json";
import hitasks from "../../../locales/hi/tasks.json";
import hiwelcome from "../../../locales/hi/welcome.json";
import thagencies from "../../../locales/th/agencies.json";
import thanalytics from "../../../locales/th/analytics.json";
import thapp from "../../../locales/th/app.json";
import thauthError from "../../../locales/th/auth-error.json";
import thchat from "../../../locales/th/chat.json";
import thclientSection from "../../../locales/th/client-section.json";
import thdashboardPage from "../../../locales/th/dashboard-page.json";
import thevents from "../../../locales/th/events.json";
import thfooter from "../../../locales/th/footer.json";
import thlogout from "../../../locales/th/logout.json";
import thmortgage from "../../../locales/th/mortgage.json";
import thnav from "../../../locales/th/nav.json";
import thpropertyFilter from "../../../locales/th/property-filter.json";
import threport from "../../../locales/th/report.json";
import threviews from "../../../locales/th/reviews.json";
import thsearch from "../../../locales/th/search.json";
import thservices from "../../../locales/th/services.json";
import thsettings from "../../../locales/th/settings.json";
import thsidebar from "../../../locales/th/sidebar.json";
import thsubscription from "../../../locales/th/subscription.json";
import thtaxRecords from "../../../locales/th/taxRecords.json";
import thtenants from "../../../locales/th/tenants.json";
import thtrpc from "../../../locales/th/trpc.json";
import thtypes from "../../../locales/th/types.json";
import thuiComponents from "../../../locales/th/ui-components.json";

import faagencies from "../../../locales/fa/agencies.json";
import faanalytics from "../../../locales/fa/analytics.json";
import faapp from "../../../locales/fa/app.json";
import faauthError from "../../../locales/fa/auth-error.json";
import fachat from "../../../locales/fa/chat.json";
import faclientSection from "../../../locales/fa/client-section.json";
import fadashboardPage from "../../../locales/fa/dashboard-page.json";
import faevents from "../../../locales/fa/events.json";
import fafooter from "../../../locales/fa/footer.json";
import falogout from "../../../locales/fa/logout.json";
import famortgage from "../../../locales/fa/mortgage.json";
import fanav from "../../../locales/fa/nav.json";
import fapropertyFilter from "../../../locales/fa/property-filter.json";
import fareport from "../../../locales/fa/report.json";
import fareviews from "../../../locales/fa/reviews.json";
import fasearch from "../../../locales/fa/search.json";
import faservices from "../../../locales/fa/services.json";
import fasettings from "../../../locales/fa/settings.json";
import fasidebar from "../../../locales/fa/sidebar.json";
import fasubscription from "../../../locales/fa/subscription.json";
import fataxRecords from "../../../locales/fa/taxRecords.json";
import fatenants from "../../../locales/fa/tenants.json";
import fatrpc from "../../../locales/fa/trpc.json";
import fatypes from "../../../locales/fa/types.json";
import fauiComponents from "../../../locales/fa/ui-components.json";
import thabout from "../../../locales/th/about.json";
import thaccount from "../../../locales/th/account.json";
import thadmin from "../../../locales/th/admin.json";
import thagency from "../../../locales/th/agency.json";
import thagents from "../../../locales/th/agents.json";
import thauthor from "../../../locales/th/author.json";
import thbecomeAgency from "../../../locales/th/become-agency.json";
import thbecomeAgent from "../../../locales/th/become-agent.json";
import thcheckout from "../../../locales/th/checkout.json";
import thclientHome from "../../../locales/th/client-home.json";
import thclient from "../../../locales/th/client.json";
import thcommissionRule from "../../../locales/th/commission-rule.json";
import thcommon from "../../../locales/th/common.json";
import thcompliance from "../../../locales/th/compliance.json";
import thcontact from "../../../locales/th/contact.json";
import thcontext from "../../../locales/th/context.json";
import thcontract from "../../../locales/th/contract.json";
import thdashboard from "../../../locales/th/dashboard.json";
import thenums from "../../../locales/th/enums.json";
import thfacility from "../../../locales/th/facility.json";
import thfavorites from "../../../locales/th/favorites.json";
import thguest from "../../../locales/th/guest.json";
import thhelp from "../../../locales/th/help.json";
import thhelpers from "../../../locales/th/helpers.json";
import thhomeComponents from "../../../locales/th/home-components.json";
import thhome from "../../../locales/th/home.json";
import thhooks from "../../../locales/th/hooks.json";
import thindex from "../../../locales/th/index.json";
import thlanguageDropdown from "../../../locales/th/language-dropdown.json";
import thlisting from "../../../locales/th/listing.json";
import thmessages from "../../../locales/th/messages.json";
import thml from "../../../locales/th/ml.json";
import thmobileMenu from "../../../locales/th/mobile-menu.json";
import thmyListings from "../../../locales/th/my-listings.json";
import thnavbar from "../../../locales/th/navbar.json";
import thnotification from "../../../locales/th/notification.json";
import thnotifications from "../../../locales/th/notifications.json";
import thpages from "../../../locales/th/pages.json";
import thpayments from "../../../locales/th/payments.json";
import thplaces from "../../../locales/th/places.json";
import thposts from "../../../locales/th/posts.json";
import thprofile from "../../../locales/th/profile.json";
import thproperties from "../../../locales/th/properties.json";
import thproperty from "../../../locales/th/property.json";
import thquickAccess from "../../../locales/th/quick-access.json";
import thquickActions from "../../../locales/th/quick-actions.json";
import threservation from "../../../locales/th/reservation.json";
import thshared from "../../../locales/th/shared.json";
import thtasks from "../../../locales/th/tasks.json";
import thwelcome from "../../../locales/th/welcome.json";

import faabout from "../../../locales/fa/about.json";
import faaccount from "../../../locales/fa/account.json";
import faadmin from "../../../locales/fa/admin.json";
import faagency from "../../../locales/fa/agency.json";
import faagents from "../../../locales/fa/agents.json";
import faauthor from "../../../locales/fa/author.json";
import fabecomeAgency from "../../../locales/fa/become-agency.json";
import fabecomeAgent from "../../../locales/fa/become-agent.json";
import facheckout from "../../../locales/fa/checkout.json";
import faclientHome from "../../../locales/fa/client-home.json";
import faclient from "../../../locales/fa/client.json";
import facommissionRule from "../../../locales/fa/commission-rule.json";
import facommon from "../../../locales/fa/common.json";
import facompliance from "../../../locales/fa/compliance.json";
import facontact from "../../../locales/fa/contact.json";
import facontext from "../../../locales/fa/context.json";
import facontract from "../../../locales/fa/contract.json";
import fadashboard from "../../../locales/fa/dashboard.json";
import faenums from "../../../locales/fa/enums.json";
import fafacility from "../../../locales/fa/facility.json";
import fafavorites from "../../../locales/fa/favorites.json";
import faguest from "../../../locales/fa/guest.json";
import fahelp from "../../../locales/fa/help.json";
import fahelpers from "../../../locales/fa/helpers.json";
import fahomeComponents from "../../../locales/fa/home-components.json";
import fahome from "../../../locales/fa/home.json";
import fahooks from "../../../locales/fa/hooks.json";
import faindex from "../../../locales/fa/index.json";
import falanguageDropdown from "../../../locales/fa/language-dropdown.json";
import falisting from "../../../locales/fa/listing.json";
import famessages from "../../../locales/fa/messages.json";
import faml from "../../../locales/fa/ml.json";
import famobileMenu from "../../../locales/fa/mobile-menu.json";
import famyListings from "../../../locales/fa/my-listings.json";
import fanavbar from "../../../locales/fa/navbar.json";
import fanotification from "../../../locales/fa/notification.json";
import fanotifications from "../../../locales/fa/notifications.json";
import fapages from "../../../locales/fa/pages.json";
import fapayments from "../../../locales/fa/payments.json";
import faplaces from "../../../locales/fa/places.json";
import faposts from "../../../locales/fa/posts.json";
import faprofile from "../../../locales/fa/profile.json";
import faproperties from "../../../locales/fa/properties.json";
import faproperty from "../../../locales/fa/property.json";
import faquickAccess from "../../../locales/fa/quick-access.json";
import faquickActions from "../../../locales/fa/quick-actions.json";
import fareservation from "../../../locales/fa/reservation.json";
import fashared from "../../../locales/fa/shared.json";
import fatasks from "../../../locales/fa/tasks.json";
import fawelcome from "../../../locales/fa/welcome.json";



const enMessages = {
  ...enchat,
  ...enmortgage,
  ...enpropertyFilter,
  ...enuiComponents,
  ...entenants,
  ...ennav,
  ...enauthError,
  ...ensubscription,
  ...enlogout,
  ...enclientSection,
  ...enreviews,
  ...ensidebar,
  ...enagencies,
  ...enreport,
  ...ensettings,
  ...enservices,
  ...enevents,
  ...enapp,
  ...endashboardPage,
  ...enAdminTickets,
  ...ensearch,
  ...enanalytics,
  ...enfooter,
  ...entrpc,
  ...entypes,
  ...entaxRecords,
  ...encommissionRule,
  ...enwelcome,
  ...encommon,
  ...enmessages,
  ...enplaces,
  ...enclientHome,
  ...encheckout,
  ...enml,
  ...enproperties,
  ...enagents,
  ...encommissionRule,
  ...enfacility,
  ...enshared,
  ...enbecomeAgency,
  ...enaccount,
  ...enbecomeAgent,
  ...endashboard,
  ...enauthor,
  ...enmobileMenu,
  ...enpayments,
  ...enlisting,
  ...ennotifications,
  ...enmyListings,
  ...encontext,
  ...ennotification,
  ...enhooks,
  ...enguest,
  ...enposts,
  ...encontact,
  ...enreservation,
  ...enlanguageDropdown,
  ...enadmin,
  ...enabout,
  ...enfavorites,
  ...enhomeComponents,
  ...enhelpers,
  ...enagency,
  ...entasks,
  ...enproperty,
  ...enquickActions,
  ...enhelp,
  ...encompliance,
  ...enindex,
  ...enhome,
  ...ennavbar,
  ...enclient,
  ...enquickAccess,
  ...enpages,
  ...enenums,
  ...enprofile,
  ...encontract,
  ClientPropertyDetail: enClientPropertyDetail,
  // Ensure Admin Tickets keys override any generic keys with same names
  ...enAdminTickets
};

const trMessages = {
  ...trchat,
  ...trmortgage,
  ...trpropertyFilter,
  ...truiComponents,
  ...trtenants,
  ...trnav,
  ...trauthError,
  ...trsubscription,
  ...trlogout,
  ...trclientSection,
  ...trreviews,
  ...trsidebar,
  ...tragencies,
  ...trreport,
  ...trsettings,
  ...trservices,
  ...trevents,
  ...trapp,
  ...trdashboardPage,
  ...trsearch,
  ...tranalytics,
  ...trfooter,
  ...trtrpc,
  ...trtypes,
  ...trtaxRecords,
  ...trcommissionRule,
  ...trwelcome,
  ...trcommon,
  ...trmessages,
  ...trplaces,
  ...trclientHome,
  ...trcheckout,
  ...trml,
  ...trproperties,
  ...tragents,
  ...trcommissionRule,
  ...trfacility,
  ...trshared,
  ...trbecomeAgency,
  ...traccount,
  ...trbecomeAgent,
  ...trdashboard,
  ...trAdminTickets,
  ...trauthor,
  ...trmobileMenu,
  ...trpayments,
  ...trlisting,
  ...trnotifications,
  ...trmyListings,
  ...trcontext,
  ...trnotification,
  ...trhooks,
  ...trguest,
  ...trposts,
  ...trcontact,
  ...trreservation,
  ...trlanguageDropdown,
  ...tradmin,
  ...trabout,
  ...trfavorites,
  ...trhomeComponents,
  ...trhelpers,
  ...tragency,
  ...trtasks,
  ...trproperty,
  ...trquickActions,
  ...trhelp,
  ...trcompliance,
  ...trindex,
  ...trhome,
  ...trnavbar,
  ...trclient,
  ...trquickAccess,
  ...trpages,
  ...trenums,
  ...trprofile,
  ...trcontract,
  ClientPropertyDetail: trClientPropertyDetail,
  // Ensure Admin Tickets keys override any generic keys with same names
  ...trAdminTickets
};

const esMessages = {
  ...eschat,
  ...esmortgage,
  ...espropertyFilter,
  ...esuiComponents,
  ...estenants,
  ...esnav,
  ...esauthError,
  ...essubscription,
  ...eslogout,
  ...esclientSection,
  ...esreviews,
  ...essidebar,
  ...esagencies,
  ...esreport,
  ...essettings,
  ...esservices,
  ...esevents,
  ...esapp,
  ...esdashboardPage,
  ...essearch,
  ...esanalytics,
  ...esfooter,
  ...estrpc,
  ...estypes,
  ...estaxRecords,
  ...escommissionRule,
  ...eswelcome,
  ...escommon,
  ...esmessages,
  ...esplaces,
  ...esclientHome,
  ...escheckout,
  ...esml,
  ...esproperties,
  ...esagents,
  ...escommissionRule,
  ...esfacility,
  ...esshared,
  ...esbecomeAgency,
  ...esaccount,
  ...esbecomeAgent,
  ...esdashboard,
  ...esauthor,
  ...esmobileMenu,
  ...espayments,
  ...eslisting,
  ...esnotifications,
  ...esmyListings,
  ...escontext,
  ...esnotification,
  ...eshooks,
  ...esguest,
  ...esposts,
  ...escontact,
  ...esreservation,
  ...eslanguageDropdown,
  ...esadmin,
  ...esabout,
  ...esfavorites,
  ...eshomeComponents,
  ...eshelpers,
  ...esagency,
  ...estasks,
  ...esproperty,
  ...esquickActions,
  ...eshelp,
  ...escompliance,
  ...esindex,
  ...eshome,
  ...esnavbar,
  ...esclient,
  ...esquickAccess,
  ...espages,
  ...esenums,
  ...esprofile,
  ...escontract
};

const frMessages = {
  ...frchat,
  ...frmortgage,
  ...frpropertyFilter,
  ...fruiComponents,
  ...frtenants,
  ...frnav,
  ...frauthError,
  ...frsubscription,
  ...frlogout,
  ...frclientSection,
  ...frreviews,
  ...frsidebar,
  ...fragencies,
  ...frreport,
  ...frsettings,
  ...frservices,
  ...frevents,
  ...frapp,
  ...frdashboardPage,
  ...frsearch,
  ...franalytics,
  ...frfooter,
  ...frtrpc,
  ...frtypes,
  ...frtaxRecords,
  ...frcommissionRule,
  ...frwelcome,
  ...frcommon,
  ...frmessages,
  ...frplaces,
  ...frclientHome,
  ...frcheckout,
  ...frml,
  ...frproperties,
  ...fragents,
  ...frcommissionRule,
  ...frfacility,
  ...frshared,
  ...frbecomeAgency,
  ...fraccount,
  ...frbecomeAgent,
  ...frdashboard,
  ...frauthor,
  ...frmobileMenu,
  ...frpayments,
  ...frlisting,
  ...frnotifications,
  ...frmyListings,
  ...frcontext,
  ...frnotification,
  ...frhooks,
  ...frguest,
  ...frposts,
  ...frcontact,
  ...frreservation,
  ...frlanguageDropdown,
  ...fradmin,
  ...frabout,
  ...frfavorites,
  ...frhomeComponents,
  ...frhelpers,
  ...fragency,
  ...frtasks,
  ...frproperty,
  ...frquickActions,
  ...frhelp,
  ...frcompliance,
  ...frindex,
  ...frhome,
  ...frnavbar,
  ...frclient,
  ...frquickAccess,
  ...frpages,
  ...frenums,
  ...frprofile,
  ...frcontract
};

const deMessages = {
  ...dechat,
  ...demortgage,
  ...depropertyFilter,
  ...deuiComponents,
  ...detenants,
  ...denav,
  ...deauthError,
  ...desubscription,
  ...delogout,
  ...declientSection,
  ...dereviews,
  ...desidebar,
  ...deagencies,
  ...dereport,
  ...desettings,
  ...deservices,
  ...deevents,
  ...deapp,
  ...dedashboardPage,
  ...desearch,
  ...deanalytics,
  ...defooter,
  ...detrpc,
  ...detypes,
  ...detaxRecords,
  ...decommissionRule,
  ...dewelcome,
  ...decommon,
  ...demessages,
  ...deplaces,
  ...declientHome,
  ...decheckout,
  ...deml,
  ...deproperties,
  ...deagents,
  ...decommissionRule,
  ...defacility,
  ...deshared,
  ...debecomeAgency,
  ...deaccount,
  ...debecomeAgent,
  ...dedashboard,
  ...deauthor,
  ...demobileMenu,
  ...depayments,
  ...delisting,
  ...denotifications,
  ...demyListings,
  ...decontext,
  ...denotification,
  ...dehooks,
  ...deguest,
  ...deposts,
  ...decontact,
  ...dereservation,
  ...delanguageDropdown,
  ...deadmin,
  ...deabout,
  ...defavorites,
  ...dehomeComponents,
  ...dehelpers,
  ...deagency,
  ...detasks,
  ...deproperty,
  ...dequickActions,
  ...dehelp,
  ...decompliance,
  ...deindex,
  ...dehome,
  ...denavbar,
  ...declient,
  ...dequickAccess,
  ...depages,
  ...deenums,
  ...deprofile,
  ...decontract
};

const itMessages = {
  ...itchat,
  ...itmortgage,
  ...itpropertyFilter,
  ...ituiComponents,
  ...ittenants,
  ...itnav,
  ...itauthError,
  ...itsubscription,
  ...itlogout,
  ...itclientSection,
  ...itreviews,
  ...itsidebar,
  ...itagencies,
  ...itreport,
  ...itsettings,
  ...itservices,
  ...itevents,
  ...itapp,
  ...itdashboardPage,
  ...itsearch,
  ...itanalytics,
  ...itfooter,
  ...ittrpc,
  ...ittypes,
  ...ittaxRecords,
  ...itcommissionRule,
  ...itwelcome,
  ...itcommon,
  ...itmessages,
  ...itplaces,
  ...itclientHome,
  ...itcheckout,
  ...itml,
  ...itproperties,
  ...itagents,
  ...itcommissionRule,
  ...itfacility,
  ...itshared,
  ...itbecomeAgency,
  ...itaccount,
  ...itbecomeAgent,
  ...itdashboard,
  ...itauthor,
  ...itmobileMenu,
  ...itpayments,
  ...itlisting,
  ...itnotifications,
  ...itmyListings,
  ...itcontext,
  ...itnotification,
  ...ithooks,
  ...itguest,
  ...itposts,
  ...itcontact,
  ...itreservation,
  ...itlanguageDropdown,
  ...itadmin,
  ...itabout,
  ...itfavorites,
  ...ithomeComponents,
  ...ithelpers,
  ...itagency,
  ...ittasks,
  ...itproperty,
  ...itquickActions,
  ...ithelp,
  ...itcompliance,
  ...itindex,
  ...ithome,
  ...itnavbar,
  ...itclient,
  ...itquickAccess,
  ...itpages,
  ...itenums,
  ...itprofile,
  ...itcontract
};

const ruMessages = {
  ...ruchat,
  ...rumortgage,
  ...rupropertyFilter,
  ...ruuiComponents,
  ...rutenants,
  ...runav,
  ...ruauthError,
  ...rusubscription,
  ...rulogout,
  ...ruclientSection,
  ...rureviews,
  ...rusidebar,
  ...ruagencies,
  ...rureport,
  ...rusettings,
  ...ruservices,
  ...ruevents,
  ...ruapp,
  ...rudashboardPage,
  ...rusearch,
  ...ruanalytics,
  ...rufooter,
  ...rutrpc,
  ...rutypes,
  ...rutaxRecords,
  ...rucommissionRule,
  ...ruwelcome,
  ...rucommon,
  ...rumessages,
  ...ruplaces,
  ...ruclientHome,
  ...rucheckout,
  ...ruml,
  ...ruproperties,
  ...ruagents,
  ...rucommissionRule,
  ...rufacility,
  ...rushared,
  ...rubecomeAgency,
  ...ruaccount,
  ...rubecomeAgent,
  ...rudashboard,
  ...ruauthor,
  ...rumobileMenu,
  ...rupayments,
  ...rulisting,
  ...runotifications,
  ...rumyListings,
  ...rucontext,
  ...runotification,
  ...ruhooks,
  ...ruguest,
  ...ruposts,
  ...rucontact,
  ...rureservation,
  ...rulanguageDropdown,
  ...ruadmin,
  ...ruabout,
  ...rufavorites,
  ...ruhomeComponents,
  ...ruhelpers,
  ...ruagency,
  ...rutasks,
  ...ruproperty,
  ...ruquickActions,
  ...ruhelp,
  ...rucompliance,
  ...ruindex,
  ...ruhome,
  ...runavbar,
  ...ruclient,
  ...ruquickAccess,
  ...rupages,
  ...ruenums,
  ...ruprofile,
  ...rucontract
};

const jaMessages = {
  ...jachat,
  ...jamortgage,
  ...japropertyFilter,
  ...jauiComponents,
  ...jatenants,
  ...janav,
  ...jaauthError,
  ...jasubscription,
  ...jalogout,
  ...jaclientSection,
  ...jareviews,
  ...jasidebar,
  ...jaagencies,
  ...jareport,
  ...jasettings,
  ...jaservices,
  ...jaevents,
  ...jaapp,
  ...jadashboardPage,
  ...jasearch,
  ...jaanalytics,
  ...jafooter,
  ...jatrpc,
  ...jatypes,
  ...jataxRecords,
  ...jacommissionRule,
  ...jawelcome,
  ...jacommon,
  ...jamessages,
  ...japlaces,
  ...jaclientHome,
  ...jacheckout,
  ...jaml,
  ...japroperties,
  ...jaagents,
  ...jacommissionRule,
  ...jafacility,
  ...jashared,
  ...jabecomeAgency,
  ...jaaccount,
  ...jabecomeAgent,
  ...jadashboard,
  ...jaauthor,
  ...jamobileMenu,
  ...japayments,
  ...jalisting,
  ...janotifications,
  ...jamyListings,
  ...jacontext,
  ...janotification,
  ...jahooks,
  ...jaguest,
  ...japosts,
  ...jacontact,
  ...jareservation,
  ...jalanguageDropdown,
  ...jaadmin,
  ...jaabout,
  ...jafavorites,
  ...jahomeComponents,
  ...jahelpers,
  ...jaagency,
  ...jatasks,
  ...japroperty,
  ...jaquickActions,
  ...jahelp,
  ...jacompliance,
  ...jaindex,
  ...jahome,
  ...janavbar,
  ...jaclient,
  ...jaquickAccess,
  ...japages,
  ...jaenums,
  ...japrofile,
  ...jacontract
};

const zhMessages = {
  ...zhchat,
  ...zhmortgage,
  ...zhpropertyFilter,
  ...zhuiComponents,
  ...zhtenants,
  ...zhnav,
  ...zhauthError,
  ...zhsubscription,
  ...zhlogout,
  ...zhclientSection,
  ...zhreviews,
  ...zhsidebar,
  ...zhagencies,
  ...zhreport,
  ...zhsettings,
  ...zhservices,
  ...zhevents,
  ...zhapp,
  ...zhdashboardPage,
  ...zhsearch,
  ...zhanalytics,
  ...zhfooter,
  ...zhtrpc,
  ...zhtypes,
  ...zhtaxRecords,
  ...zhcommissionRule,
  ...zhwelcome,
  ...zhcommon,
  ...zhmessages,
  ...zhplaces,
  ...zhclientHome,
  ...zhcheckout,
  ...zhml,
  ...zhproperties,
  ...zhagents,
  ...zhcommissionRule,
  ...zhfacility,
  ...zhshared,
  ...zhbecomeAgency,
  ...zhaccount,
  ...zhbecomeAgent,
  ...zhdashboard,
  ...zhauthor,
  ...zhmobileMenu,
  ...zhpayments,
  ...zhlisting,
  ...zhnotifications,
  ...zhmyListings,
  ...zhcontext,
  ...zhnotification,
  ...zhhooks,
  ...zhguest,
  ...zhposts,
  ...zhcontact,
  ...zhreservation,
  ...zhlanguageDropdown,
  ...zhadmin,
  ...zhabout,
  ...zhfavorites,
  ...zhhomeComponents,
  ...zhhelpers,
  ...zhagency,
  ...zhtasks,
  ...zhproperty,
  ...zhquickActions,
  ...zhhelp,
  ...zhcompliance,
  ...zhindex,
  ...zhhome,
  ...zhnavbar,
  ...zhclient,
  ...zhquickAccess,
  ...zhpages,
  ...zhenums,
  ...zhprofile,
  ...zhcontract
};

const arMessages = {
  ...archat,
  ...armortgage,
  ...arpropertyFilter,
  ...aruiComponents,
  ...artenants,
  ...arnav,
  ...arauthError,
  ...arsubscription,
  ...arlogout,
  ...arclientSection,
  ...arreviews,
  ...arsidebar,
  ...aragencies,
  ...arreport,
  ...arsettings,
  ...arservices,
  ...arevents,
  ...arapp,
  ...ardashboardPage,
  ...arsearch,
  ...aranalytics,
  ...arfooter,
  ...artrpc,
  ...artypes,
  ...artaxRecords,
  ...arcommissionRule,
  ...arwelcome,
  ...arcommon,
  ...armessages,
  ...arplaces,
  ...arclientHome,
  ...archeckout,
  ...arml,
  ...arproperties,
  ...aragents,
  ...arcommissionRule,
  ...arfacility,
  ...arshared,
  ...arbecomeAgency,
  ...araccount,
  ...arbecomeAgent,
  ...ardashboard,
  ...arauthor,
  ...armobileMenu,
  ...arpayments,
  ...arlisting,
  ...arnotifications,
  ...armyListings,
  ...arcontext,
  ...arnotification,
  ...arhooks,
  ...arguest,
  ...arposts,
  ...arcontact,
  ...arreservation,
  ...arlanguageDropdown,
  ...aradmin,
  ...arabout,
  ...arfavorites,
  ...arhomeComponents,
  ...arhelpers,
  ...aragency,
  ...artasks,
  ...arproperty,
  ...arquickActions,
  ...arhelp,
  ...arcompliance,
  ...arindex,
  ...arhome,
  ...arnavbar,
  ...arclient,
  ...arquickAccess,
  ...arpages,
  ...arenums,
  ...arprofile,
  ...arcontract
};

const hiMessages = {
  ...hichat,
  ...himortgage,
  ...hipropertyFilter,
  ...hiuiComponents,
  ...hitenants,
  ...hinav,
  ...hiauthError,
  ...hisubscription,
  ...hilogout,
  ...hiclientSection,
  ...hireviews,
  ...hisidebar,
  ...hiagencies,
  ...hireport,
  ...hisettings,
  ...hiservices,
  ...hievents,
  ...hiapp,
  ...hidashboardPage,
  ...hisearch,
  ...hianalytics,
  ...hifooter,
  ...hitrpc,
  ...hitypes,
  ...hitaxRecords,
  ...hicommissionRule,
  ...hiwelcome,
  ...hicommon,
  ...himessages,
  ...hiplaces,
  ...hiclientHome,
  ...hicheckout,
  ...himl,
  ...hiproperties,
  ...hiagents,
  ...hicommissionRule,
  ...hifacility,
  ...hishared,
  ...hibecomeAgency,
  ...hiaccount,
  ...hibecomeAgent,
  ...hidashboard,
  ...hiauthor,
  ...himobileMenu,
  ...hipayments,
  ...hilisting,
  ...hinotifications,
  ...himyListings,
  ...hicontext,
  ...hinotification,
  ...hihooks,
  ...higuest,
  ...hiposts,
  ...hicontact,
  ...hireservation,
  ...hilanguageDropdown,
  ...hiadmin,
  ...hiabout,
  ...hifavorites,
  ...hihomeComponents,
  ...hihelpers,
  ...hiagency,
  ...hitasks,
  ...hiproperty,
  ...hiquickActions,
  ...hihelp,
  ...hicompliance,
  ...hiindex,
  ...hihome,
  ...hinavbar,
  ...hiclient,
  ...hiquickAccess,
  ...hipages,
  ...hienums,
  ...hiprofile,
  ...hicontract
};

const thMessages = {
  ...thchat,
  ...thmortgage,
  ...thpropertyFilter,
  ...thuiComponents,
  ...thtenants,
  ...thnav,
  ...thauthError,
  ...thsubscription,
  ...thlogout,
  ...thclientSection,
  ...threviews,
  ...thsidebar,
  ...thagencies,
  ...threport,
  ...thsettings,
  ...thservices,
  ...thevents,
  ...thapp,
  ...thdashboardPage,
  ...thsearch,
  ...thanalytics,
  ...thfooter,
  ...thtrpc,
  ...thtypes,
  ...thtaxRecords,
  ...thcommissionRule,
  ...thwelcome,
  ...thcommon,
  ...thmessages,
  ...thplaces,
  ...thclientHome,
  ...thcheckout,
  ...thml,
  ...thproperties,
  ...thagents,
  ...thcommissionRule,
  ...thfacility,
  ...thshared,
  ...thbecomeAgency,
  ...thaccount,
  ...thbecomeAgent,
  ...thdashboard,
  ...thauthor,
  ...thmobileMenu,
  ...thpayments,
  ...thlisting,
  ...thnotifications,
  ...thmyListings,
  ...thcontext,
  ...thnotification,
  ...thhooks,
  ...thguest,
  ...thposts,
  ...thcontact,
  ...threservation,
  ...thlanguageDropdown,
  ...thadmin,
  ...thabout,
  ...thfavorites,
  ...thhomeComponents,
  ...thhelpers,
  ...thagency,
  ...thtasks,
  ...thproperty,
  ...thquickActions,
  ...thhelp,
  ...thcompliance,
  ...thindex,
  ...thhome,
  ...thnavbar,
  ...thclient,
  ...thquickAccess,
  ...thpages,
  ...thenums,
  ...thprofile,
  ...thcontract
};

const faMessages = {
  ...fachat,
  ...famortgage,
  ...fapropertyFilter,
  ...fauiComponents,
  ...fatenants,
  ...fanav,
  ...faauthError,
  ...fasubscription,
  ...falogout,
  ...faclientSection,
  ...fareviews,
  ...fasidebar,
  ...faagencies,
  ...fareport,
  ...fasettings,
  ...faservices,
  ...faevents,
  ...faapp,
  ...fadashboardPage,
  ...fasearch,
  ...faanalytics,
  ...fafooter,
  ...fatrpc,
  ...fatypes,
  ...fataxRecords,
  ...facommissionRule,
  ...fawelcome,
  ...facommon,
  ...famessages,
  ...faplaces,
  ...faclientHome,
  ...facheckout,
  ...faml,
  ...faproperties,
  ...faagents,
  ...facommissionRule,
  ...fafacility,
  ...fashared,
  ...fabecomeAgency,
  ...faaccount,
  ...fabecomeAgent,
  ...fadashboard,
  ...faauthor,
  ...famobileMenu,
  ...fapayments,
  ...falisting,
  ...fanotifications,
  ...famyListings,
  ...facontext,
  ...fanotification,
  ...fahooks,
  ...faguest,
  ...faposts,
  ...facontact,
  ...fareservation,
  ...falanguageDropdown,
  ...faadmin,
  ...faabout,
  ...fafavorites,
  ...fahomeComponents,
  ...fahelpers,
  ...faagency,
  ...fatasks,
  ...faproperty,
  ...faquickActions,
  ...fahelp,
  ...facompliance,
  ...faindex,
  ...fahome,
  ...fanavbar,
  ...faclient,
  ...faquickAccess,
  ...fapages,
  ...faenums,
  ...faprofile,
  ...facontract
};

const messagesMap = {
  en: enMessages,
  tr: trMessages,
  es: esMessages,
  fr: frMessages,
  de: deMessages,
  it: itMessages,
  ru: ruMessages,
  ja: jaMessages,
  zh: zhMessages,
  ar: arMessages,
  hi: hiMessages,
  th: thMessages,
  fa: faMessages,
};

function getMessagesForLocale(locale: string) {
  return messagesMap[locale as keyof typeof messagesMap];
}

export default function LocaleLayout({
  children,
  params: { locale },
}: {
  children: ReactNode;
  params: {
    locale:
      | "en"
      | "zh"
      | "es"
      | "ar"
      | "hi"
      | "fr"
      | "tr"
      | "fa"
      | "de"
      | "ja"
      | "it"
      | "ru"
      | "th";
  };
}) {
  // Ensure that the incoming `locale` is valid
  console.log("LocaleLayout locale param:", locale, routing.locales);

  const messages = getMessagesForLocale(locale);

  return (
    <Providers locale={locale} messages={messages}>
      <div className="relative flex min-h-screen flex-col">
        <ChatProvider>
          {children}
          <ChatBalloon />
        </ChatProvider>
        <Toaster useToast={useToast} />
      </div>
    </Providers>
  );
}
