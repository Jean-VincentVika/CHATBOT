export type Language = "en" | "fr";

export const languages = {
  en: "English",
  fr: "Français",
} as const;

export const translations = {
  en: {
    welcome: "Welcome to Hotel Finesse! How may I assist you today?",
    clearChat: "Clear Chat",
    typeMessage: "Type your message...",
    hotelName: "Hotel Finesse",
    virtualConcierge: "Virtual Receptionist",
    responseTime: "Response time",
    newChat: "New Chat",
    deleteChat: "Delete Chat",
    chatName: "Chat Name",
    defaultChatName: "New Conversation",
    confirmDeleteChat: "Are you sure you want to delete this chat?",
  },
  fr: {
    welcome: "Bienvenue à l'Hôtel Finesse ! Comment puis-je vous aider aujourd'hui ?",
    clearChat: "Effacer la Discussion",
    typeMessage: "Tapez votre message...",
    hotelName: "Hôtel Finesse",
    virtualConcierge: "Réceptionniste Virtuel",
    responseTime: "Temps de réponse",
    newChat: "Nouvelle Discussion",
    deleteChat: "Supprimer la Discussion",
    chatName: "Nom de la Discussion",
    defaultChatName: "Nouvelle Conversation",
    confirmDeleteChat: "Êtes-vous sûr de vouloir supprimer cette discussion ?",
  },
} as const;

export function getTranslation(lang: Language, key: keyof typeof translations["en"]) {
  return translations[lang][key];
}