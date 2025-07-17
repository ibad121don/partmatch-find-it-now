import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Translation resources
const resources = {
  en: {
    translation: {
      // Common
      welcome: "Welcome",
      welcomeToPartMatch: "Welcome to PartMatch",
      partMatch: "PartMatch",
      ghana: "Ghana",
      loading: "Loading...",
      save: "Save",
      cancel: "Cancel",
      continue: "Continue",
      next: "Next",
      back: "Back",
      edit: "Edit",
      delete: "Delete",
      search: "Search",
      filter: "Filter",

      // Dashboard
      buyerDashboard: "Buyer Dashboard",
      welcomeBack: "Welcome back",
      myOrders: "My Orders",
      savedParts: "Saved Parts",
      rateSellers: "Rate Sellers",
      notifications: "Notifications",
      profileSettings: "Profile Settings",
      orders: "Orders",
      messages: "Messages",
      saved: "Saved",
      alerts: "Alerts",
      rate: "Rate",

      // Country & Currency
      selectCountry: "Select Country",
      countryCurrency: "Country & Currency",
      selectCountryToSetCurrency: "Select your country to set currency",
      countryUpdated: "Country Updated",
      locationSetTo: "Your location has been set to",
      andCurrencyTo: "and currency to",
      updateFailed: "Update Failed",
      failedToUpdateCountry: "Failed to update your country. Please try again.",
      autoDetectLocation: "Auto-detect my location",
      detecting: "Detecting...",
      detectingLocation: "Detecting location...",
      selectYourCountry: "Select Your Country",
      chooseCountryDescription:
        "Choose your country to automatically set the appropriate currency for pricing.",

      // Navigation
      home: "Home",
      browse: "Browse Parts",
      request: "Request Part",
      dashboard: "Dashboard",
      profile: "Profile",
      signIn: "Sign In",
      signOut: "Sign Out",
      signUp: "Sign Up",

      // Hero Section
      heroTitle: "Find & Sell Car Parts",
      heroSubtitle:
        "The easiest way to find and order car parts. Compare prices from trusted sellers and get quality parts delivered to your door.",
      requestCarParts: "Request Car Parts",
      findCarParts: "Find Car Parts",
      sellCarParts: "Sell Car Parts",
      browseParts: "Browse Parts",
      findPartsAndRequests: "Find parts for sale and buyer requests",
      partsForSale: "Parts for Sale",
      requestedParts: "Requested Parts",

      // Quick Actions & Navigation
      quickActions: "Quick Actions",
      findAvailableParts: "Find available parts",
      cantFindAskHere: "Can't find it? Ask here",
      listPartsForSale: "List your parts for sale",
      requestedCarParts: "Requested Car Parts",
      browseAndRespondRequests: "Browse and respond to buyer requests",
      searchRequests: "Search requests...",
      activeRequests: "Active Requests",
      noRequestsFound: "No requests found",
      active: "Active",
      makeOffer: "Make Offer",
      contact: "Contact",

      // Categories
      popularCategories: "Popular Categories",
      engineParts: "Engine Parts",
      brakeSystem: "Brake System",
      suspension: "Suspension",
      bodyParts: "Body Parts",
      parts: "parts",

      // Stats
      fastReliable: "Fast & Reliable",
      connectWithSellers: "Connect with verified sellers in your region",
      activeParts: "Active Parts",
      sellers: "Sellers",
      users: "Users",
      regions: "Regions",

      // Authentication
      email: "Email",
      password: "Password",
      firstName: "First Name",
      lastName: "Last Name",
      phone: "Phone/WhatsApp",
      location: "Location",
      city: "City",
      country: "Country",
      language: "Language",
      currency: "Currency",

      // User Types
      buyer: "Buyer",
      seller: "Seller",
      admin: "Administrator",

      // Form Validation
      required: "Required",
      invalidEmail: "Invalid email address",
      passwordTooShort: "Password must be at least 6 characters",

      // Success Messages
      profileUpdated: "Profile updated successfully",
      registrationSuccessful: "Registration successful!",

      // Error Messages
      somethingWentWrong: "Something went wrong",
      tryAgain: "Please try again",

      // Ratings
      ratings: {
        noRatings: "No ratings yet",
        reviewCount: "({{count}} review{{count !== 1 ? 's' : ''}})",
        topRated: "Top Rated",
      },

      // SubscriptionManager
      subscription: {
        business_subscription: "Business Subscription",
        activated_title: "Subscription Activated!",
        activated_desc:
          "Your Business subscription is now active. Enjoy unlimited posts and featured listings!",
        cancelled_title: "Subscription Cancelled",
        cancelled_desc:
          "Your subscription will remain active until the end of the current billing period.",
        loading: "Loading subscription...",
        business_plan: "Business Plan",
        active_subscription: "Active subscription",
        active: "Active",
        next_billing_date: "Next billing date",
        amount: "Amount",
        month: "month",
        your_benefits: "Your Benefits",
        benefit_unlimited_posts: "Unlimited posts",
        benefit_featured_listings: "All listings automatically featured",
        benefit_priority_support: "Priority customer support",
        benefit_analytics_dashboard: "Advanced analytics dashboard",
        benefit_no_fees_first_50: "No transaction fees on first 50 sales",
        update_payment: "Update Payment",
        cancel_subscription: "Cancel Subscription",
        upgrade_to_business: "Upgrade to Business",
        upgrade_benefits:
          "Get unlimited posts, featured listings, and priority support",
        per_month: "per month",
        benefit_unlimited_car_parts: "Unlimited car part listings",
        benefit_10_photos: "Up to 10 photos per listing included",
        benefit_analytics_insights: "Advanced analytics and insights",
        start_business_subscription: "Start Business Subscription",
        transaction_fees: "Transaction Fees",
        online_transaction_fee: "Online transaction fee",
        fee_3_percent: "3% per sale",
        business_subscribers: "Business subscribers",
        first_50_sales_free: "First 50 sales free",
        transaction_fees_note:
          "Transaction fees are automatically deducted from successful sales",
      },

      // PaymentModal
      payment: {
        user_not_found_title: "User not found",
        user_not_found_desc: "Please log in to proceed with payment.",
        method_required_title: "Payment Method Required",
        method_required_desc: "Please select a payment method.",
        paystack_not_available_title: "Paystack Not Available",
        paystack_not_available_desc:
          "Paystack integration is not implemented yet.",
        failed_title: "Payment Failed",
        failed_desc: "Please try again later.",
        unlock_contact_details: "Unlock Contact Details",
        one_time_fee: "One-time fee to unlock contact details",
        method_label: "Payment Method",
        select_method_placeholder: "Select payment method",
        stripe: "Stripe",
        paystack: "Paystack",
        cancel: "Cancel",
        processing: "Processing...",
        pay_now: "Pay Now",
      },
    },
  },
  fr: {
    translation: {
      // Common (French)
      welcome: "Bienvenue",
      welcomeToPartMatch: "Bienvenue sur PartMatch",
      partMatch: "PartMatch",
      ghana: "Ghana",
      loading: "Chargement...",
      save: "Enregistrer",
      cancel: "Annuler",
      continue: "Continuer",
      next: "Suivant",
      back: "Retour",
      edit: "Modifier",
      delete: "Supprimer",
      search: "Rechercher",
      filter: "Filtrer",

      // Dashboard
      buyerDashboard: "Tableau de bord acheteur",
      welcomeBack: "Bon retour",
      myOrders: "Mes commandes",
      savedParts: "Pièces sauvegardées",
      rateSellers: "Noter les vendeurs",
      notifications: "Notifications",
      profileSettings: "Paramètres du profil",
      orders: "Commandes",
      messages: "Messages",
      saved: "Sauvé",
      alerts: "Alertes",
      rate: "Noter",

      // Country & Currency
      selectCountry: "Sélectionner le pays",
      countryCurrency: "Pays et devise",
      selectCountryToSetCurrency:
        "Sélectionnez votre pays pour définir la devise",
      countryUpdated: "Pays mis à jour",
      locationSetTo: "Votre emplacement a été défini sur",
      andCurrencyTo: "et la devise sur",
      updateFailed: "Échec de la mise à jour",
      failedToUpdateCountry:
        "Échec de la mise à jour de votre pays. Veuillez réessayer.",
      autoDetectLocation: "Détecter automatiquement ma position",
      detecting: "Détection...",
      detectingLocation: "Détection de l'emplacement...",
      selectYourCountry: "Sélectionnez votre pays",
      chooseCountryDescription:
        "Choisissez votre pays pour définir automatiquement la devise appropriée pour la tarification.",

      // Navigation
      home: "Accueil",
      browse: "Parcourir les pièces",
      request: "Demander une pièce",
      dashboard: "Tableau de bord",
      profile: "Profil",
      signIn: "Se connecter",
      signOut: "Se déconnecter",
      signUp: "S'inscrire",

      // Hero Section
      heroTitle: "Trouver et vendre des pièces auto",
      heroSubtitle:
        "Le moyen le plus simple de trouver et commander des pièces auto. Comparez les prix de vendeurs de confiance.",
      requestCarParts: "Demander des pièces auto",
      findCarParts: "Trouver des pièces auto",
      sellCarParts: "Vendre des pièces auto",
      browseParts: "Parcourir les pièces",
      findPartsAndRequests:
        "Trouver des pièces à vendre et des demandes d'acheteurs",
      partsForSale: "Pièces à vendre",
      requestedParts: "Pièces demandées",

      // Quick Actions & Navigation
      quickActions: "Actions rapides",
      findAvailableParts: "Trouver les pièces disponibles",
      cantFindAskHere: "Vous ne trouvez pas? Demandez ici",
      listPartsForSale: "Lister vos pièces à vendre",
      requestedCarParts: "Pièces auto demandées",
      browseAndRespondRequests: "Parcourir et répondre aux demandes",
      searchRequests: "Rechercher demandes...",
      activeRequests: "Demandes actives",
      noRequestsFound: "Aucune demande trouvée",
      active: "Actif",
      makeOffer: "Faire une offre",
      contact: "Contact",

      // Categories
      popularCategories: "Catégories populaires",
      engineParts: "Pièces moteur",
      brakeSystem: "Système de freinage",
      suspension: "Suspension",
      bodyParts: "Pièces de carrosserie",
      parts: "pièces",

      // Stats
      fastReliable: "Rapide et fiable",
      connectWithSellers:
        "Connectez-vous avec des vendeurs vérifiés dans votre région",
      activeParts: "Pièces actives",
      sellers: "Vendeurs",
      users: "Utilisateurs",
      regions: "Régions",

      // Authentication
      email: "Email",
      password: "Mot de passe",
      firstName: "Prénom",
      lastName: "Nom",
      phone: "Téléphone/WhatsApp",
      location: "Localisation",
      city: "Ville",
      country: "Pays",
      language: "Langue",
      currency: "Devise",

      // User Types
      buyer: "Acheteur",
      seller: "Vendeur",
      admin: "Administrateur",

      // Form Validation
      required: "Requis",
      invalidEmail: "Adresse email invalide",
      passwordTooShort: "Le mot de passe doit contenir au moins 6 caractères",

      // Success Messages
      profileUpdated: "Profil mis à jour avec succès",
      registrationSuccessful: "Inscription réussie!",

      // Error Messages
      error: "Erreur",
      somethingWentWrong: "Quelque chose s'est mal passé",
      tryAgain: "Veuillez réessayer",
    },
  },
  sw: {
    translation: {
      // Common (Swahili)
      welcome: "Karibu",
      welcomeToPartMatch: "Karibu PartMatch",
      partMatch: "PartMatch",
      ghana: "Ghana",
      loading: "Inapakia...",
      save: "Hifadhi",
      cancel: "Ghairi",
      continue: "Endelea",
      next: "Ifuatayo",
      back: "Rudi",
      edit: "Hariri",
      delete: "Futa",
      search: "Tafuta",
      filter: "Chuja",

      // Dashboard
      buyerDashboard: "Dashibodi ya Mnunuzi",
      welcomeBack: "Karibu tena",
      myOrders: "Maagizo Yangu",
      savedParts: "Vipengee Vilivyohifadhiwa",
      rateSellers: "Kadiria Wachuuzi",
      notifications: "Arifa",
      profileSettings: "Mipangilio ya Wasifu",
      orders: "Maagizo",
      messages: "Ujumbe",
      saved: "Imehifadhiwa",
      alerts: "Arifa",
      rate: "Kadiria",

      // Country & Currency
      selectCountry: "Chagua Nchi",
      countryCurrency: "Nchi na Sarafu",
      selectCountryToSetCurrency: "Chagua nchi yako kuweka sarafu",
      countryUpdated: "Nchi Imesasishwa",
      locationSetTo: "Mahali pako pamewekwa",
      andCurrencyTo: "na sarafu",
      updateFailed: "Kusasisha Kumeshindikana",
      failedToUpdateCountry:
        "Kushindikana kusasisha nchi yako. Tafadhali jaribu tena.",
      autoDetectLocation: "Gundua mahali pangu kiotomatiki",
      detecting: "Inapata...",
      detectingLocation: "Inapata mahali...",
      selectYourCountry: "Chagua Nchi Yako",
      chooseCountryDescription:
        "Chagua nchi yako ili kuwezesha sarafu inayofaa kwa bei kiotomatiki.",

      // Navigation
      home: "Nyumbani",
      browse: "Angalia Vipengee",
      request: "Omba Kipengee",
      dashboard: "Dashibodi",
      profile: "Wasifu",
      signIn: "Ingia",
      signOut: "Toka",
      signUp: "Jisajili",

      // Hero Section
      heroTitle: "Pata na Uze Vipengee vya Magari",
      heroSubtitle:
        "Njia rahisi ya kupata na kuagiza vipengee vya magari. Linganisha bei kutoka kwa wachuuzi waaminifu na upate vipengee vya ubora.",
      requestCarParts: "Omba Vipengee vya Gari",
      findCarParts: "Pata Vipengee vya Gari",
      sellCarParts: "Uza Vipengee vya Gari",
      browseParts: "Vinjari Vipengee",
      findPartsAndRequests: "Pata vipengee vya kuuza na maombi ya wanunuzi",
      partsForSale: "Vipengee vya Kuuza",
      requestedParts: "Vipengee Vilivyoombwa",

      // Quick Actions & Navigation
      quickActions: "Vitendo vya Haraka",
      findAvailableParts: "Pata vipengee vinavyopatikana",
      cantFindAskHere: "Huwezi kupata? Uliza hapa",
      listPartsForSale: "Orodhesha vipengee vyako vya kuuza",
      requestedCarParts: "Vipengee vya Magari Vilivyoombwa",
      browseAndRespondRequests: "Vinjari na jibu maombi",
      searchRequests: "Tafuta maombi...",
      activeRequests: "Maombi hai",
      noRequestsFound: "Hakuna maombi yaliyopatikana",
      active: "Hai",
      makeOffer: "Toa Onyesho",
      contact: "Mawasiliano",

      // Categories
      popularCategories: "Makundi Maarufu",
      engineParts: "Vipengee vya Injini",
      brakeSystem: "Mfumo wa Breki",
      suspension: "Kusimamisha",
      bodyParts: "Vipengee vya Mwili",
      parts: "vipengee",

      // Stats
      fastReliable: "Haraka na Kuaminika",
      connectWithSellers:
        "Unganishwa na wachuuzi waliohakikishwa katika eneo lako",
      activeParts: "Vipengee hai",
      sellers: "Wachuuzi",
      users: "Watumiaji",
      regions: "Mikoa",

      // Authentication
      email: "Barua pepe",
      password: "Nywila",
      firstName: "Jina la Kwanza",
      lastName: "Jina la Mwisho",
      phone: "Simu/WhatsApp",
      location: "Mahali",
      city: "Mji",
      country: "Nchi",
      language: "Lugha",
      currency: "Sarafu",

      // User Types
      buyer: "Mnunuzi",
      seller: "Muuzaji",
      admin: "Msimamizi",

      // Form Validation
      required: "Inahitajika",
      invalidEmail: "Anwani ya barua pepe si sahihi",
      passwordTooShort: "Nywila lazima iwe na angalau herufi 6",

      // Success Messages
      profileUpdated: "Wasifu umebadilishwa kwa mafanikio",
      registrationSuccessful: "Usajili umefanikiwa!",

      // Error Messages
      error: "Hitilafu",
      somethingWentWrong: "Kuna kitu kimekwenda vibaya",
      tryAgain: "Tafadhali jaribu tena",
    },
  },
  tw: {
    translation: {
      // Common (Twi)
      welcome: "Akwaaba",
      welcomeToPartMatch: "Akwaaba wo PartMatch",
      partMatch: "PartMatch",
      ghana: "Ghana",
      loading: "Ɛreloading...",
      save: "Koraa",
      cancel: "Gyae",
      continue: "Kɔ so",
      next: "Ɛdi hɔ",
      back: "Bɛsan",
      edit: "Sesa",
      delete: "Yi fi",
      search: "Hwehwɛ",
      filter: "Susuw",

      // Dashboard
      buyerDashboard: "Otɔni Dashboard",
      welcomeBack: "Yɛma wo akwaaba bio",
      myOrders: "Me Orders",
      savedParts: "Nneɛma a wɔakoraa",
      rateSellers: "Bu adetɔnfoɔ",
      notifications: "Amanebɔ",
      profileSettings: "Profile Settings",
      orders: "Orders",
      messages: "Nkrasɛm",
      saved: "Wɔakoraa",
      alerts: "Amanebɔ",
      rate: "Bu",

      // Country & Currency
      selectCountry: "Paw Ɔman",
      countryCurrency: "Ɔman ne Sika",
      selectCountryToSetCurrency: "Paw wo man na wo asɛe sika",
      countryUpdated: "Wɔasesa Ɔman",
      locationSetTo: "Wɔde wo baabi ato",
      andCurrencyTo: "ne sika",
      updateFailed: "Nsesaeɛ Ankɔ Yie",
      failedToUpdateCountry: "Wɔantumi ansesa wo man. Yɛ srɛ wo sɔ bio.",
      autoDetectLocation: "Hu me baabi ankasa",
      detecting: "Ɛrehwehwɛ...",
      detectingLocation: "Ɛrehwehwɛ baabi...",
      selectYourCountry: "Paw Wo Man",
      chooseCountryDescription: "Paw wo man na sika a ɛfata no bɛba ankasa.",

      // Navigation
      home: "Fie",
      browse: "Hwɛ Nneɛma",
      request: "Bisa Nneɛma",
      dashboard: "Dashboard",
      profile: "Profile",
      signIn: "Wuraa mu",
      signOut: "Fi adi",
      signUp: "Kyerɛw wo din",

      // Hero Section
      heroTitle: "Hwehwɛ na Tɔn Kar Nneɛma",
      heroSubtitle:
        "Ɔkwan a ɛyɛ mmerɛw sen biara a wobɛfa so ahwehwɛ na woatɔ kar nneɛma. Ka bo ahodoɔ ho asɛm kyerɛ adetɔnfoɔ a wogye wɔn di.",
      requestCarParts: "Bisa Kar Nneɛma",
      findCarParts: "Hwehwɛ Kar Nneɛma",
      sellCarParts: "Tɔn Kar Nneɛma",
      browseParts: "Hwɛ Nneɛma",
      findPartsAndRequests: "Hwehwɛ nneɛma a wobɛtɔn ne nsɛm a wɔabisa",
      partsForSale: "Nneɛma a Wobɛtɔn",
      requestedParts: "Nneɛma a Wɔabisa",

      // Quick Actions & Navigation
      quickActions: "Ntɛm Dwumadie",
      findAvailableParts: "Hwehwɛ nneɛma a ɛwɔ hɔ",
      cantFindAskHere: "Woanhu? Bisa wɔ ha",
      listPartsForSale: "Kyerɛw wo nneɛma a wobɛtɔn",
      requestedCarParts: "Kar Nneɛma a Wɔabisa",
      browseAndRespondRequests: "Hwɛ na bua nsɛm a wɔabisa",
      searchRequests: "Hwehwɛ nsɛm a wɔabisa...",
      activeRequests: "Nsɛm a Ɛreyɛ Adwuma",
      noRequestsFound: "Wɔanhu nsɛm biara",
      active: "Ɛreyɛ Adwuma",
      makeOffer: "Ma Nhyɛsoɔ",
      contact: "Kasa",

      // Categories
      popularCategories: "Nneɛma a Agye Din",
      engineParts: "Injin Nneɛma",
      brakeSystem: "Breki Nhyehyɛe",
      suspension: "Ntwentwɛn",
      bodyParts: "Nipadua Nneɛma",
      parts: "nneɛma",

      // Stats
      fastReliable: "Ntɛm & Ahotoso",
      connectWithSellers: "Fa wo ho ka adetɔnfoɔ a wɔahwɛ wɔn ho wɔ wo mpɔtam",
      activeParts: "Nneɛma a Ɛreyɛ Adwuma",
      sellers: "Adetɔnfoɔ",
      users: "Adefoofoɔ",
      regions: "Mpɔtam",

      // Authentication
      email: "Email",
      password: "Password",
      firstName: "Din a ɛdi kan",
      lastName: "Din a etwa to",
      phone: "Telefon/WhatsApp",
      location: "Baabi",
      city: "Kuropɔn",
      country: "Ɔman",
      language: "Kasa",
      currency: "Sika",

      // User Types
      buyer: "Otɔni",
      seller: "Odetɔnni",
      admin: "Ɔsoadwumayɛni",

      // Form Validation
      required: "Ɛho hia",
      invalidEmail: "Email address no nyɛ",
      passwordTooShort: "Password no sua koraa ɛsɛ sɛ ɛyɛ nkyerɛwde 6",

      // Success Messages
      profileUpdated: "Wɔasesa profile no yiye",
      registrationSuccessful: "Wɔde wo din akyerɛw yiye!",

      // Error Messages
      error: "Mfomso",
      somethingWentWrong: "Biribi ankasa nyɛ yiye",
      tryAgain: "Yɛ srɛ wo sɔ bio",
    },
  },
  yo: {
    translation: {
      // Common (Yoruba)
      welcome: "Eku abo",
      welcomeToPartMatch: "Eku abo si PartMatch",
      partMatch: "PartMatch",
      ghana: "Ghana",
      loading: "N gbagbe...",
      save: "Fi pamo",
      cancel: "Fagilee",
      continue: "Tesiwaju",
      next: "To ba",
      back: "Pada sẹhin",
      edit: "Tunse",
      delete: "Pa rẹ",
      search: "Wa",
      filter: "Se ayẹwo",

      // Dashboard
      buyerDashboard: "Dashboard Oniranu",
      welcomeBack: "Eku abo pada",
      myOrders: "Awọn Ibere Mi",
      savedParts: "Awọn Ẹya Ti A Fi Pamọ",
      rateSellers: "Ṣe idajo Awọn Oluta",
      notifications: "Awọn Iwifun",
      profileSettings: "Awọn Eto Profil",
      orders: "Awọn Ibere",
      messages: "Awọn Ifiranṣẹ",
      saved: "Ti a fi pamọ",
      alerts: "Awọn Iwifun",
      rate: "Ṣe idajo",

      // Country & Currency
      selectCountry: "Yan Orilẹ-ede",
      countryCurrency: "Orilẹ-ede ati Owọ",
      selectCountryToSetCurrency: "Yan orilẹ-ede rẹ lati fi owọ lẹlẹ",
      countryUpdated: "Orilẹ-ede Ti Yipada",
      locationSetTo: "Ipo rẹ ti fi si",
      andCurrencyTo: "ati owọ si",
      updateFailed: "Imudojuiwọn Ko Ṣaṣeyọri",
      failedToUpdateCountry:
        "Ko ṣaṣeyọri lati mu orilẹ-ede rẹ ṣe imudojuiwọn. Jọwọ gbiyanju lẹẹkansi.",
      autoDetectLocation: "Ṣe ayẹwo ipo mi laifọwọyi",
      detecting: "N wa...",
      detectingLocation: "N wa ipo...",
      selectYourCountry: "Yan Orilẹ-ede Rẹ",
      chooseCountryDescription:
        "Yan orilẹ-ede rẹ lati ṣeto owọ ti o yẹ fun idiyele laifọwọyi.",

      // Navigation
      home: "Ile",
      browse: "Wo awọn ẹya",
      request: "Beere ẹya",
      dashboard: "Dashboard",
      profile: "Profile",
      signIn: "Wọle",
      signOut: "Jade",
      signUp: "Forukọsilẹ",

      // Hero Section
      heroTitle: "Wa ati Ta Awọn Ẹya Ọkọ",
      heroSubtitle:
        "Ọna ti o rọrun julọ lati wa ati gba awọn ẹya ọkọ. Ṣe afiwe awọn idiyele lati ọdọ awọn oluta ti o gbẹkẹle.",
      requestCarParts: "Beere Awọn Ẹya Ọkọ",
      findCarParts: "Wa Awọn Ẹya Ọkọ",
      sellCarParts: "Ta Awọn Ẹya Ọkọ",
      browseParts: "Wo Awọn Ẹya",
      findPartsAndRequests: "Wa awọn ẹya fun tita ati awọn ibeere oniranu",
      partsForSale: "Awọn Ẹya Fun Tita",
      requestedParts: "Awọn Ẹya Ti A Beere",

      // Quick Actions & Navigation
      quickActions: "Awọn Iṣe Kiakia",
      findAvailableParts: "Wa awọn ẹya ti o wa",
      cantFindAskHere: "Ko le ri? Beere nibi",
      listPartsForSale: "Ṣe akojọ awọn ẹya rẹ fun tita",
      requestedCarParts: "Awọn Ẹya Ọkọ Ti A Beere",
      browseAndRespondRequests: "Wa ati dahun si awọn ibeere",
      searchRequests: "Wa awọn ibeere...",
      activeRequests: "Awọn Ibeere Ti N Lọ",
      noRequestsFound: "Ko si awọn ibeere ti a ri",
      active: "Ti N Lọ",
      makeOffer: "Ṣe Ifilagba",
      contact: "Kan Si",

      // Categories
      popularCategories: "Awọn Ẹka Olokiki",
      engineParts: "Awọn Ẹya Enjini",
      brakeSystem: "Eto Breki",
      suspension: "Duduro",
      bodyParts: "Awọn Ẹya Ara",
      parts: "awọn ẹya",

      // Stats
      fastReliable: "Kiakia & Gbẹkẹle",
      connectWithSellers: "Sopọ pẹlu awọn oluta ti a ti rii daju ni agbegbe rẹ",
      activeParts: "Awọn Ẹya Lilo",
      sellers: "Awọn Oluta",
      users: "Awọn Olumulo",
      regions: "Awọn Agbegbe",

      // Authentication
      email: "Email",
      password: "Ọrọ aṣina",
      firstName: "Orukọ akọkọ",
      lastName: "Orukọ idile",
      phone: "Fonu/WhatsApp",
      location: "Ipo",
      city: "Ilu",
      country: "Orilẹ-ede",
      language: "Ede",
      currency: "Owọ",

      // User Types
      buyer: "Oniranu",
      seller: "Oluta",
      admin: "Alakoso",

      // Form Validation
      required: "O nilo",
      invalidEmail: "Adirẹsi email ti ko tọ",
      passwordTooShort: "Ọrọ aṣina gbọdọ jẹ o kere ju awọn kikọ 6",

      // Success Messages
      profileUpdated: "Profaili ti di imudojuiwọn ni aṣeyọri",
      registrationSuccessful: "Iforukọsilẹ aṣeyọri!",

      // Error Messages
      error: "Aṣiṣe",
      somethingWentWrong: "Nkankan ti lọ aṣiṣe",
      tryAgain: "Jọwọ gbiyanju lẹẹkansi",
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("selectedLanguage") || "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false, // React already escapes values
  },
  detection: {
    order: ["localStorage", "navigator"],
    caches: ["localStorage"],
  },
});

export default i18n;
