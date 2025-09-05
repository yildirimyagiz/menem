"use client";

import {
  ChevronLeft,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  Phone,
  Search
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@reservatior/ui/accordion";
import { Badge } from "@reservatior/ui/badge";
import { Button } from "@reservatior/ui/button";
import { Card, CardContent } from "@reservatior/ui/card";
import { Input } from "@reservatior/ui/input";

import { api } from "~/trpc/react";

// Translation helper to avoid raw keys showing up and ensure safe fallbacks
const useSafeT = () => {
  const t = useTranslations();
  const safeT = (key: string, fallback: string, values?: Record<string, unknown>): string => {
    try {
      const translated = t(key as never, { ...(values ?? {}), default: fallback } as never) as unknown as string;
      if (!translated || translated === key || translated.includes(".")) return fallback;
      return translated;
    } catch {
      return fallback;
    }
  };
  return safeT;
};

function TicketForm({ onSuccess }: { onSuccess?: () => void }) {
  const t = useTranslations();
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  // @ts-expect-error tRPC router typing collision on accessor; tracked elsewhere
  const createTicket = api.ticket.create.useMutation({ onSuccess });
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createTicket.mutate({ subject, description });
      }}
      className="mobile-fade-in mb-8 space-y-4"
    >
      <div>
        <label className="mobile-text-sm font-medium">{t("help.subject", { default: "Subject" })}</label>
        <Input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          placeholder={t("help.subjectPlaceholder", { default: "Enter subject" })}
          required
          className="mobile-input"
        />
      </div>
      <div>
        <label className="mobile-text-sm font-medium">{t("help.descriptionLabel", { default: "Description" })}</label>
        <Input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t("help.descriptionPlaceholder", { default: "Describe your issue" })}
          className="mobile-input"
        />
      </div>
      <Button type="submit" disabled={createTicket.isPending} className="mobile-button">
        {t("help.submitTicket", { default: "Submit Ticket" })}
      </Button>
    </form>
  );
}

interface Ticket {
  id: string;
  subject: string;
  status: string;
  createdAt: Date | string;
  userId: string;
  agentId: string | null;
  CommunicationLogs?: {
    id: string;
    content: string;
    type: string;
    createdAt: Date | string;
    userId: string | null;
    ticketId: string | null;
  }[];
}

function TicketList({ onSelect }: { onSelect: (id: string) => void }) {
  const t = useTranslations();
  const safeT = useSafeT();
  // @ts-expect-error tRPC router typing collision on accessor; tracked elsewhere
  const { data, isLoading } = api.ticket.myTickets.useQuery();

  const STATUS_KEY: Record<string, { key: string; fallback: string }> = {
    OPEN: { key: "open", fallback: "Open" },
    IN_PROGRESS: { key: "inProgress", fallback: "In Progress" },
    RESOLVED: { key: "resolved", fallback: "Resolved" },
    CLOSED: { key: "closed", fallback: "Closed" },
    ARCHIVED: { key: "archived", fallback: "Archived" },
  };
  const statusLabel = (s: string) => {
    const meta = STATUS_KEY[s];
    if (!meta) return s;
    return safeT(`tickets.status.${meta.key}`, meta.fallback);
  };

  if (isLoading) {
    return (
      <div className="mobile-fade-in">
        <div className="mobile-card mobile-skeleton h-32 rounded-xl ios-mobile-menu android-mobile-menu" />
      </div>
    );
  }
  
  if (!data?.data?.length) {
    return (
      <div className="mobile-fade-in">
        <div className="mobile-card text-center rounded-xl border border-gray-200 bg-white p-8 shadow-sm dark:border-gray-700 dark:bg-gray-800 ios-mobile-menu android-mobile-menu">
          <FileText className="mx-auto mb-4 h-12 w-12 text-gray-400" />
          <h3 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">
            {t("tickets.none", { default: "No tickets found" })}
          </h3>
          <p className="mobile-text-base text-gray-600 dark:text-gray-300">
            {t("tickets.noneDescription", { default: "You haven't created any support tickets yet." })}
          </p>
        </div>
      </div>
    );
  }

  const tickets = data.data as Ticket[];

  return (
    <div className="mobile-fade-in mb-8">
      <h3 className="mobile-text-lg font-semibold mb-4">{t("tickets.title", { default: "My Tickets" })}</h3>
      <div className="space-y-3">
        {tickets.map((ticket) => {
          const createdAt =
            ticket.createdAt instanceof Date
              ? ticket.createdAt
              : new Date(ticket.createdAt);

          return (
            <Card
              key={ticket.id}
              className="mobile-card mobile-scale-in cursor-pointer ios-mobile-menu android-mobile-menu"
              onClick={() => onSelect(ticket.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h4 className="mobile-text-base font-medium text-gray-900 dark:text-white">
                      {ticket.subject}
                    </h4>
                    <p className="mobile-text-sm text-gray-600 dark:text-gray-400">
                      {t("tickets.createdOn", { default: "Created {date}", date: createdAt.toLocaleDateString() })}
                    </p>
                  </div>
                  <Badge 
                    variant={ticket.status === "OPEN" ? "default" : "secondary"}
                    className="mobile-text-xs"
                  >
                    {statusLabel(ticket.status)}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

interface TicketWithLogs extends Omit<Ticket, "CommunicationLogs"> {
  CommunicationLogs: {
    id: string;
    content: string;
    type: string;
    createdAt: Date | string;
    userId: string | null;
    ticketId: string | null;
  }[];
}

function TicketDetail({
  ticketId,
  onBack,
}: {
  ticketId: string;
  onBack: () => void;
}) {
  // @ts-expect-error tRPC router typing collision on accessor; tracked elsewhere
  const { data, isLoading } = api.ticket.byId.useQuery({ id: ticketId });
  const [newMessage, setNewMessage] = useState("");
  // @ts-expect-error tRPC router typing collision on accessor; tracked elsewhere
  const addMessage = api.ticket.create.useMutation();
  const t = useTranslations();

  if (isLoading) {
    return (
      <div className="mobile-fade-in">
        <div className="mobile-card mobile-skeleton h-64 rounded-xl ios-mobile-menu android-mobile-menu" />
      </div>
    );
  }

  const ticket = data as unknown as TicketWithLogs;

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    addMessage.mutate(
      { subject: t("ticket.replySubject", { default: "Reply to ticket" }), description: newMessage },
      {
        onSuccess: () => {
          setNewMessage("");
        },
      },
    );
  };

  return (
    <div className="mobile-fade-in">
      <div className="mobile-card mb-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ios-mobile-menu android-mobile-menu">
        <div className="mb-4 flex items-center gap-4">
          <Button onClick={onBack} variant="ghost" size="sm" className="mobile-button">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t("back", { default: "Back" })}
          </Button>
          <div className="flex-1">
            <h2 className="mobile-text-lg font-semibold text-gray-900 dark:text-white">
              {ticket.subject}
            </h2>
            <p className="mobile-text-sm text-gray-600 dark:text-gray-400">
              {t("ticket.number", { default: "Ticket #{id}", id: ticket.id })}
            </p>
          </div>
          <Badge variant="secondary" className="mobile-text-xs">
            {ticket.status}
          </Badge>
        </div>

        <div className="space-y-4">
          {ticket.CommunicationLogs.map((log) => (
            <div
              key={log.id}
              className={`rounded-lg p-3 ${
                log.type === "USER"
                  ? "bg-blue-50 dark:bg-blue-900/50"
                  : "bg-gray-50 dark:bg-gray-800/50"
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
                  {log.type === "USER" ? (
                    <MessageCircle className="h-4 w-4 text-blue-600" />
                  ) : (
                    <HelpCircle className="h-4 w-4 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="mobile-text-sm text-gray-900 dark:text-white">
                    {log.content}
                  </p>
                  <p className="mobile-text-xs text-gray-500 dark:text-gray-400">
                    {new Date(log.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex gap-2">
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder={t("messagePlaceholder", { default: "Type your message..." })}
            className="mobile-input flex-1"
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={!newMessage.trim() || addMessage.isPending}
            className="mobile-button"
          >
            {t("send", { default: "Send" })}
          </Button>
        </div>
      </div>
    </div>
  );
}

function NotificationBell() {
  const t = useTranslations();
  return (
    <div className="mobile-fade-in">
      <div className="mobile-card rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-800 ios-mobile-menu android-mobile-menu">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
            <MessageCircle className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="mobile-text-base font-semibold text-gray-900 dark:text-white">
              {t("help.liveChat.title", { default: "Live Chat Support" })}
            </h3>
            <p className="mobile-text-sm text-gray-600 dark:text-gray-400">
              {t("help.liveChat.subtitle", { default: "Get instant help from our support team" })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HelpPage() {
  const t = useTranslations();
  const safeT = useSafeT();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  // Defaults for FAQ items to keep UX intact when translation keys are missing
  const defaultFaq = [
    {
      q: "How do I search for properties?",
      a: "Use the search bar on the homepage to find properties by location, price range, and other criteria. You can also use advanced filters to narrow down your search.",
    },
    {
      q: "How do I contact a property owner?",
      a: "Click on any property to view its details, then use the contact form or call the provided phone number to get in touch with the owner or agent.",
    },
    {
      q: "What payment methods are accepted?",
      a: "We accept various payment methods including credit cards, bank transfers, and digital wallets. Payment options may vary by property.",
    },
    {
      q: "How do I report an issue with a property?",
      a: "If you encounter any issues with a property listing, please contact our support team through the help section or submit a ticket.",
    },
    {
      q: "Can I save properties to view later?",
      a: "Yes! Click the heart icon on any property to add it to your favorites. You can view all your saved properties in the Favorites section.",
    },
  ];
  // Build FAQ items dynamically from translation keys with index, falling back to defaults
  const faqItems = defaultFaq.map((d, i) => ({
    question: safeT(`help.faqItems.${i + 1}.q`, d.q),
    answer: safeT(`help.faqItems.${i + 1}.a`, d.a),
  }));

  const filteredFaqItems = faqItems.filter((item) =>
    item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="ios-layout android-layout">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mobile-fade-in mb-8 text-center">
          <h1 className="mobile-text-xl font-bold lg:text-3xl">{t("help.title", { default: "Help & Support" })}</h1>
          <p className="mobile-text-base text-gray-600 dark:text-gray-300">
            {t("help.description", { default: "Find answers to common questions and get support" })}
          </p>
        </div>

        {/* Search */}
        <div className="mobile-fade-in mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              placeholder={t("help.searchPlaceholder", { default: "Search help articles..." })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mobile-input pl-10"
            />
          </div>
        </div>

        {/* Contact Options */}
        <div className="mobile-fade-in mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="mobile-card ios-mobile-menu android-mobile-menu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
                  <Mail className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="mobile-text-base font-semibold">{t("help.email", { default: "Email Support" })}</h3>
                  <p className="mobile-text-sm text-gray-600">{t("help.emailAddress", { default: "support@reservatior.com" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mobile-card ios-mobile-menu android-mobile-menu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
                  <Phone className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="mobile-text-base font-semibold">{t("help.phone", { default: "Phone Support" })}</h3>
                  <p className="mobile-text-sm text-gray-600">{t("help.phoneNumber", { default: "+1 (555) 123-4567" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mobile-card ios-mobile-menu android-mobile-menu">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
                  <MessageCircle className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="mobile-text-base font-semibold">{t("help.chat", { default: "Live Chat" })}</h3>
                  <p className="mobile-text-sm text-gray-600">{t("help.availability", { default: "Available 24/7" })}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mobile-fade-in mb-8">
          <h2 className="mobile-text-lg font-semibold mb-4">{t("help.faq", { default: "Frequently Asked Questions" })}</h2>
          <Accordion type="single" collapsible className="space-y-2">
            {filteredFaqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="mobile-card ios-mobile-menu android-mobile-menu">
                <AccordionTrigger className="mobile-text-base font-medium px-4 py-3">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="px-4 pb-3">
                  <p className="mobile-text-sm text-gray-600 dark:text-gray-300">
                    {item.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>

        {/* Support Tickets */}
        <div className="mobile-fade-in mb-8">
          <h2 className="mobile-text-lg font-semibold mb-4">{t("tickets.header", { default: "Support Tickets" })}</h2>
          {selectedTicketId ? (
            <TicketDetail ticketId={selectedTicketId} onBack={() => setSelectedTicketId(null)} />
          ) : (
            <div className="space-y-6">
              <TicketForm onSuccess={() => console.log("Ticket created successfully")} />
              <TicketList onSelect={setSelectedTicketId} />
            </div>
          )}
        </div>

        {/* Live Chat */}
        <NotificationBell />
      </div>
    </div>
  );
}
