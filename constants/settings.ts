import { ListItemType, ListSectionType } from "@/components/ui/ListScreen";

export const SETTINGS_DATA: ListSectionType[] = [
  {
    header: "Account",
    items: [
      {
        id: "edit_profile",
        title: "Edit my profile",
        icon: "person-circle-outline",
        screen: "EditProfile", // Placeholder screen
      },
      {
        id: "change_password",
        title: "Change Password",
        icon: "key-outline",
        screen: "ChangePassword", // Placeholder screen
      },
    ],
  },
  {
    header: "Preferences",
    items: [
      {
        id: "language",
        title: "Language",
        subtitle: "English", // This will be dynamic in LanguageSelector
        icon: "language-outline",
        action: "language",
      },
      {
        id: "notifications",
        title: "Notifications",
        icon: "notifications-outline",
        screen: "NotificationScreen", // Placeholder screen
      },
    ],
  },
  {
    header: "General",
    items: [
      { id: "bookmarks", title: "Bookmarks", icon: "bookmark-outline", screen: "BookMark" }, // Placeholder screen
      { id: "faq", title: "FAQ", icon: "help-circle-outline", screen: "FAQScreen" }, // Placeholder screen
      {
        id: "terms",
        title: "Terms & Conditions",
        icon: "document-text-outline",
        screen: "TermsScreen", // Placeholder screen
      },
      {
        id: "about_app",
        title: "About App",
        icon: "information-circle-outline",
        screen: "AboutAppScreen", // Placeholder screen
      },
    ],
  },
];

export const ACCOUNT_ACTIONS: ListItemType[] = [
  {
    id: "deactivate_account",
    title: "Deactivate Account",
    subtitle: "Temporarily disable your account",
    icon: "pause-circle-outline",
    action: "deactivate",
    isDanger: true,
  },
  {
    id: "request_deletion",
    title: "Request Account Deletion",
    subtitle: "Permanently delete your account",
    icon: "trash-outline",
    action: "delete",
    isDanger: true,
  },
  {
    id: "logout",
    title: "Log Out",
    icon: "log-out-outline",
    action: "logout",
    isDanger: true,
  },
];

export const LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'zh', name: 'Mandarin Chinese' },
    { code: 'hi', name: 'Hindi' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'ar', name: 'Standard Arabic' },
    { code: 'bn', name: 'Bengali' },
    { code: 'ru', name: 'Russian' },
    { code: 'pt', name: 'Portuguese' },
    { code: 'ur', name: 'Urdu' },
];
