export type Language = "ru" | "kk" | "en";

export interface Translations {
  common: {
    loading: string;
    error: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    close: string;
    confirm: string;
    yes: string;
    no: string;
    settings: string;
    // Новые ключи для плейсхолдеров
    enterName: string;
    enterEmail: string;
    enterPassword: string;
    confirmPassword: string;
    enterNewPassword: string;
    repeatNewPassword: string;
    enterPartnerEmail: string;
  };
  navigation: {
    dates: string;
    prizes: string;
    history: string;
    account: string;
    partner: string;
    logout: string;
  };
  auth: {
    welcome: string;
    welcomeSubtitle: string;
    login: string;
    register: string;
    email: string;
    password: string;
    confirmPassword: string;
    name: string;
    loginButton: string;
    registerButton: string;
    loginOrRegister: string;
    loginOrRegisterSubtitle: string;
    createMemories: string;
    noAccount: string;
    hasAccount: string;
    forgotPassword: string;
    resetPassword: string;
    changePassword: string;
    newPassword: string;
    currentPassword: string;
    // Новые ключи для плейсхолдеров
    yourName: string;
    yourEmail: string;
    passwordPlaceholder: string;
  };
  dates: {
    title: string;
    addDate: string;
    newDate: string;
    editDate: string;
    dateTitle: string;
    description: string;
    tags: string;
    location: string;
    budget: string;
    difficulty: string;
    difficultyPoints: string;
    difficultyPoints1: string;
    difficultyPoints2: string;
    difficultyPoints3: string;
    addTag: string;
    plannedDates: string;
    completedDates: string;
    noDates: string;
    noDatesSubtitle: string;
    createFirstDate: string;
    complete: string;
    undo: string;
    notes: string;
    completed: string;
    notCompleted: string;
    myCreatedDates: string;
    partnerCreatedDates: string;
    // Новые ключи для плейсхолдеров
    dateTitlePlaceholder: string;
    dateDescriptionPlaceholder: string;
    locationPlaceholder: string;
    budgetPlaceholder: string;
  };
  prizes: {
    title: string;
    addPrize: string;
    newPrize: string;
    editPrize: string;
    prizeTitle: string;
    description: string;
    type: string;
    typeSpecific: string;
    typeCount: string;
    typePoints: string;
    conditions: string;
    selectDate: string;
    selectDatePlaceholder: string;
    countThreshold: string;
    pointsThreshold: string;
    isRepeatable: string;
    expiresAt: string;
    expiresAtOptional: string;
    availablePrizes: string;
    claimedPrizes: string;
    noPrizes: string;
    noPrizesSubtitle: string;
    createFirstPrize: string;
    claimed: string;
    claimedByMe: string;
    claimedByPartner: string;
    claim: string;
    // Новые ключи для плейсхолдеров
    prizeTitlePlaceholder: string;
    prizeDescriptionPlaceholder: string;
    countThresholdPlaceholder: string;
    pointsThresholdPlaceholder: string;
  };
  partners: {
    title: string;
    noPartner: string;
    noPartnerSubtitle: string;
    addPartner: string;
    partnerEmail: string;
    sendRequest: string;
    requestSent: string;
    incomingRequests: string;
    outgoingRequests: string;
    accept: string;
    reject: string;
    remove: string;
    connected: string;
    pending: string;
    howItWorks: string;
    howItWorksText: string;
    partnerInfo: string;
    // Новые ключи для плейсхолдеров
    partnerEmailPlaceholder: string;
  };
  profile: {
    title: string;
    name: string;
    email: string;
    avatar: string;
    theme: string;
    lightTheme: string;
    darkTheme: string;
    language: string;
    saveChanges: string;
    changesSaved: string;
    passwordChanged: string;
    active: string;
    // Новые ключи для плейсхолдеров
    namePlaceholder: string;
  };
  stats: {
    title: string;
    totalDates: string;
    completedDates: string;
    totalPoints: string;
    availablePrizes: string;
    myCreatedDates: string;
    partnerCreatedDates: string;
    myCreatedCompleted: string;
    partnerCreatedCompleted: string;
  };
  notifications: {
    success: string;
    error: string;
    warning: string;
    info: string;
    dateCreated: string;
    dateCompleted: string;
    prizeCreated: string;
    prizeClaimed: string;
    partnerRequestSent: string;
    partnerRequestAccepted: string;
    partnerRequestRejected: string;
    partnerRemoved: string;
  };
}

export const translations: Record<Language, Translations> = {
  ru: {
    common: {
      loading: "Загрузка...",
      error: "Ошибка",
      save: "Сохранить",
      cancel: "Отмена",
      delete: "Удалить",
      edit: "Редактировать",
      add: "Добавить",
      close: "Закрыть",
      confirm: "Подтвердить",
      yes: "Да",
      no: "Нет",
      settings: "Настройки",
      // Новые ключи для плейсхолдеров
      enterName: "Введите имя",
      enterEmail: "Введите email",
      enterPassword: "Введите пароль",
      confirmPassword: "Подтвердите пароль",
      enterNewPassword: "Введите новый пароль",
      repeatNewPassword: "Повторите новый пароль",
      enterPartnerEmail: "Введите email партнера",
    },
    navigation: {
      dates: "Свидания",
      prizes: "Призы",
      history: "История",
      account: "Аккаунт",
      partner: "Партнер",
      logout: "Выйти",
    },
    auth: {
      welcome: "Добро пожаловать в LoveQuest",
      welcomeSubtitle: "Планируйте свидания и получайте призы вместе",
      login: "Войти",
      register: "Регистрация",
      email: "Email",
      password: "Пароль",
      confirmPassword: "Подтвердите пароль",
      name: "Имя",
      loginButton: "Войти",
      registerButton: "Зарегистрироваться",
      loginOrRegister: "Войти или зарегистрироваться",
      loginOrRegisterSubtitle: "Начните планировать свидания",
      createMemories: "Создавайте воспоминания",
      noAccount: "Нет аккаунта?",
      hasAccount: "Уже есть аккаунт?",
      forgotPassword: "Забыли пароль?",
      resetPassword: "Сбросить пароль",
      changePassword: "Изменить пароль",
      newPassword: "Новый пароль",
      currentPassword: "Текущий пароль",
      // Новые ключи для плейсхолдеров
      yourName: "Ваше имя",
      yourEmail: "Ваш email",
      passwordPlaceholder: "Пароль",
    },
    dates: {
      title: "Свидания",
      addDate: "Добавить свидание",
      newDate: "Новое свидание",
      editDate: "Редактировать свидание",
      dateTitle: "Название свидания",
      description: "Описание",
      tags: "Теги",
      location: "Место",
      budget: "Бюджет",
      difficulty: "Сложность",
      difficultyPoints: "очков",
      difficultyPoints1: "очко",
      difficultyPoints2: "очка",
      difficultyPoints3: "очка",
      addTag: "Добавить тег",
      plannedDates: "Запланированные свидания",
      completedDates: "Завершенные свидания",
      noDates: "Нет свиданий",
      noDatesSubtitle: "Создайте первое свидание",
      createFirstDate: "Создать первое свидание",
      complete: "Завершить",
      undo: "Отменить",
      notes: "Заметки",
      completed: "Завершено",
      notCompleted: "Не завершено",
      myCreatedDates: "Мои свидания",
      partnerCreatedDates: "Свидания партнера",
      // Новые ключи для плейсхолдеров
      dateTitlePlaceholder: "Название свидания",
      dateDescriptionPlaceholder: "Описание свидания",
      locationPlaceholder: "Место проведения",
      budgetPlaceholder: "Бюджет",
    },
    prizes: {
      title: "Призы",
      addPrize: "Добавить приз",
      newPrize: "Новый приз",
      editPrize: "Редактировать приз",
      prizeTitle: "Название приза",
      description: "Описание",
      type: "Тип",
      typeSpecific: "Конкретное свидание",
      typeCount: "Количество свиданий",
      typePoints: "Количество очков",
      conditions: "Условия",
      selectDate: "Выберите свидание",
      selectDatePlaceholder: "Выберите свидание для приза",
      countThreshold: "Порог количества",
      pointsThreshold: "Порог очков",
      isRepeatable: "Повторяемый",
      expiresAt: "Истекает",
      expiresAtOptional: "Истекает (необязательно)",
      availablePrizes: "Доступные призы",
      claimedPrizes: "Полученные призы",
      noPrizes: "Нет призов",
      noPrizesSubtitle: "Создайте первый приз",
      createFirstPrize: "Создать первый приз",
      claimed: "Получено",
      claimedByMe: "Получено мной",
      claimedByPartner: "Получено партнером",
      claim: "Получить",
      // Новые ключи для плейсхолдеров
      prizeTitlePlaceholder: "Название приза",
      prizeDescriptionPlaceholder: "Описание приза",
      countThresholdPlaceholder: "Порог количества",
      pointsThresholdPlaceholder: "Порог очков",
    },
    partners: {
      title: "Партнер",
      noPartner: "У вас нет партнера",
      noPartnerSubtitle: "Добавьте партнера для начала планирования",
      addPartner: "Добавить партнера",
      partnerEmail: "Email партнера",
      sendRequest: "Отправить запрос",
      requestSent: "Запрос отправлен",
      incomingRequests: "Входящие запросы",
      outgoingRequests: "Исходящие запросы",
      accept: "Принять",
      reject: "Отклонить",
      remove: "Удалить",
      connected: "Подключен",
      pending: "Ожидает",
      howItWorks: "Как это работает",
      howItWorksText:
        "Отправьте запрос партнеру по email. После принятия запроса вы сможете планировать свидания вместе.",
      partnerInfo: "Информация о партнере",
      // Новые ключи для плейсхолдеров
      partnerEmailPlaceholder: "Email партнера",
    },
    profile: {
      title: "Профиль",
      name: "Имя",
      email: "Email",
      avatar: "Аватар",
      theme: "Тема",
      lightTheme: "Светлая",
      darkTheme: "Темная",
      language: "Язык",
      saveChanges: "Сохранить изменения",
      changesSaved: "Изменения сохранены",
      passwordChanged: "Пароль изменен",
      active: "Активен",
      // Новые ключи для плейсхолдеров
      namePlaceholder: "Имя",
    },
    stats: {
      title: "Статистика",
      totalDates: "Всего свиданий",
      completedDates: "Завершенных свиданий",
      totalPoints: "Всего очков",
      availablePrizes: "Доступных призов",
      myCreatedDates: "Свидания назначенные мной",
      partnerCreatedDates: "Свидания назначенные партнёром",
      myCreatedCompleted: "Завершенных мной",
      partnerCreatedCompleted: "Завершенных партнером",
    },
    notifications: {
      success: "Успешно",
      error: "Ошибка",
      warning: "Предупреждение",
      info: "Информация",
      dateCreated: "Свидание создано",
      dateCompleted: "Свидание завершено",
      prizeCreated: "Приз создан",
      prizeClaimed: "Приз получен",
      partnerRequestSent: "Запрос партнеру отправлен",
      partnerRequestAccepted: "Запрос партнеру принят",
      partnerRequestRejected: "Запрос партнеру отклонен",
      partnerRemoved: "Партнер удален",
    },
  },
  kk: {
    common: {
      loading: "Жүктелуде...",
      error: "Қате",
      save: "Сақтау",
      cancel: "Бас тарту",
      delete: "Жою",
      edit: "Өңдеу",
      add: "Қосу",
      close: "Жабу",
      confirm: "Растау",
      yes: "Иә",
      no: "Жоқ",
      settings: "Баптаулар",
      // Новые ключи для плейсхолдеров
      enterName: "Атыңызды енгізіңіз",
      enterEmail: "Email-іңізді енгізіңіз",
      enterPassword: "Құпия сөзді енгізіңіз",
      confirmPassword: "Құпия сөзді растау",
      enterNewPassword: "Жаңа құпия сөзді енгізіңіз",
      repeatNewPassword: "Жаңа құпия сөзді қайталаңыз",
      enterPartnerEmail: "Серіктестің email-ін енгізіңіз",
    },
    navigation: {
      dates: "Кездесулер",
      prizes: "Сыйлықтар",
      history: "Тарих",
      account: "Есептік жазба",
      partner: "Серіктес",
      logout: "Шығу",
    },
    auth: {
      welcome: "LoveQuest-ке қош келдіңіз",
      welcomeSubtitle: "Кездесулерді жоспарлаңыз және сыйлықтар алыңыз",
      login: "Кіру",
      register: "Тіркеу",
      email: "Email",
      password: "Құпия сөз",
      confirmPassword: "Құпия сөзді растау",
      name: "Аты",
      loginButton: "Кіру",
      registerButton: "Тіркелу",
      loginOrRegister: "Кіру немесе тіркелу",
      loginOrRegisterSubtitle: "Кездесулерді жоспарлауды бастаңыз",
      createMemories: "Естеліктер жасаңыз",
      noAccount: "Есептік жазба жоқ па?",
      hasAccount: "Есептік жазба бар ма?",
      forgotPassword: "Құпия сөзді ұмыттыңыз ба?",
      resetPassword: "Құпия сөзді қалпына келтіру",
      changePassword: "Құпия сөзді өзгерту",
      newPassword: "Жаңа құпия сөз",
      currentPassword: "Ағымдағы құпия сөз",
      // Новые ключи для плейсхолдеров
      yourName: "Сіздің атыңыз",
      yourEmail: "Сіздің email-іңіз",
      passwordPlaceholder: "Құпия сөз",
    },
    dates: {
      title: "Кездесулер",
      addDate: "Кездесу қосу",
      newDate: "Жаңа кездесу",
      editDate: "Кездесуді өңдеу",
      dateTitle: "Кездесу атауы",
      description: "Сипаттама",
      tags: "Тегтер",
      location: "Орын",
      budget: "Бюджет",
      difficulty: "Қиындық",
      difficultyPoints: "ұпай",
      difficultyPoints1: "ұпай",
      difficultyPoints2: "ұпай",
      difficultyPoints3: "ұпай",
      addTag: "Тег қосу",
      plannedDates: "Жоспарланған кездесулер",
      completedDates: "Аяқталған кездесулер",
      noDates: "Кездесулер жоқ",
      noDatesSubtitle: "Алғашқы кездесуді жасаңыз",
      createFirstDate: "Алғашқы кездесуді жасау",
      complete: "Аяқтау",
      undo: "Болдырмау",
      notes: "Жазбалар",
      completed: "Аяқталды",
      notCompleted: "Аяқталмады",
      myCreatedDates: "Менің кездесулерім",
      partnerCreatedDates: "Серіктестің кездесулері",
      // Новые ключи для плейсхолдеров
      dateTitlePlaceholder: "Кездесу атауы",
      dateDescriptionPlaceholder: "Сипаттама",
      locationPlaceholder: "Орын",
      budgetPlaceholder: "Бюджет",
    },
    prizes: {
      title: "Сыйлықтар",
      addPrize: "Сыйлық қосу",
      newPrize: "Жаңа сыйлық",
      editPrize: "Сыйлықты өңдеу",
      prizeTitle: "Сыйлық атауы",
      description: "Сипаттама",
      type: "Түрі",
      typeSpecific: "Нақты кездесу",
      typeCount: "Кездесулер саны",
      typePoints: "Ұпайлар саны",
      conditions: "Шарттар",
      selectDate: "Кездесуді таңдаңыз",
      selectDatePlaceholder: "Сыйлық үшін кездесуді таңдаңыз",
      countThreshold: "Сан шегі",
      pointsThreshold: "Ұпай шегі",
      isRepeatable: "Қайталанатын",
      expiresAt: "Аяқталады",
      expiresAtOptional: "Аяқталады (міндетті емес)",
      availablePrizes: "Қолжетімді сыйлықтар",
      claimedPrizes: "Алынған сыйлықтар",
      noPrizes: "Сыйлықтар жоқ",
      noPrizesSubtitle: "Алғашқы сыйлықты жасаңыз",
      createFirstPrize: "Алғашқы сыйлықты жасау",
      claimed: "Алынды",
      claimedByMe: "Мен алдым",
      claimedByPartner: "Серіктес алды",
      claim: "Алу",
      // Новые ключи для плейсхолдеров
      prizeTitlePlaceholder: "Сыйлық атауы",
      prizeDescriptionPlaceholder: "Сипаттама",
      countThresholdPlaceholder: "Сан шегі",
      pointsThresholdPlaceholder: "Ұпай шегі",
    },
    partners: {
      title: "Серіктес",
      noPartner: "Серіктесіңіз жоқ",
      noPartnerSubtitle: "Жоспарлауды бастау үшін серіктес қосыңыз",
      addPartner: "Серіктес қосу",
      partnerEmail: "Серіктестің email-і",
      sendRequest: "Сұрау жіберу",
      requestSent: "Сұрау жіберілді",
      incomingRequests: "Келетін сұраулар",
      outgoingRequests: "Шығатын сұраулар",
      accept: "Қабылдау",
      reject: "Қабылдамау",
      remove: "Жою",
      connected: "Қосылған",
      pending: "Күтуде",
      howItWorks: "Қалай жұмыс істейді",
      howItWorksText:
        "Email арқылы серіктеске сұрау жіберіңіз. Сұрау қабылданғаннан кейін кездесулерді бірге жоспарлай аласыз.",
      partnerInfo: "Серіктес туралы ақпарат",
      // Новые ключи для плейсхолдеров
      partnerEmailPlaceholder: "Серіктестің email-і",
    },
    profile: {
      title: "Профиль",
      name: "Аты",
      email: "Email",
      avatar: "Аватар",
      theme: "Тақырып",
      lightTheme: "Жарық",
      darkTheme: "Қараңғы",
      language: "Тіл",
      saveChanges: "Өзгерістерді сақтау",
      changesSaved: "Өзгерістер сақталды",
      passwordChanged: "Құпия сөз өзгертілді",
      active: "Белсенді",
      // Новые ключи для плейсхолдеров
      namePlaceholder: "Аты",
    },
    stats: {
      title: "Статистика",
      totalDates: "Барлық кездесулер",
      completedDates: "Аяқталған кездесулер",
      totalPoints: "Барлық ұпайлар",
      availablePrizes: "Қолжетімді сыйлықтар",
      myCreatedDates: "Мен тағайындаған кездесулер",
      partnerCreatedDates: "Серіктес тағайындаған кездесулер",
      myCreatedCompleted: "Мен аяқтаған",
      partnerCreatedCompleted: "Серіктес аяқтаған",
    },
    notifications: {
      success: "Сәтті",
      error: "Қате",
      warning: "Ескерту",
      info: "Ақпарат",
      dateCreated: "Кездесу жасалды",
      dateCompleted: "Кездесу аяқталды",
      prizeCreated: "Сыйлық жасалды",
      prizeClaimed: "Сыйлық алынды",
      partnerRequestSent: "Серіктеске сұрау жіберілді",
      partnerRequestAccepted: "Серіктеске сұрау қабылданды",
      partnerRequestRejected: "Серіктеске сұрау қабылданбады",
      partnerRemoved: "Серіктес жойылды",
    },
  },
  en: {
    common: {
      loading: "Loading...",
      error: "Error",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      add: "Add",
      close: "Close",
      confirm: "Confirm",
      yes: "Yes",
      no: "No",
      settings: "Settings",
      // Новые ключи для плейсхолдеров
      enterName: "Enter name",
      enterEmail: "Enter email",
      enterPassword: "Enter password",
      confirmPassword: "Confirm password",
      enterNewPassword: "Enter new password",
      repeatNewPassword: "Repeat new password",
      enterPartnerEmail: "Enter partner email",
    },
    navigation: {
      dates: "Dates",
      prizes: "Prizes",
      history: "History",
      account: "Account",
      partner: "Partner",
      logout: "Logout",
    },
    auth: {
      welcome: "Welcome to LoveQuest",
      welcomeSubtitle: "Plan dates and earn prizes together",
      login: "Login",
      register: "Register",
      email: "Email",
      password: "Password",
      confirmPassword: "Confirm Password",
      name: "Name",
      loginButton: "Login",
      registerButton: "Register",
      loginOrRegister: "Login or Register",
      loginOrRegisterSubtitle: "Start planning dates",
      createMemories: "Create memories",
      noAccount: "Don't have an account?",
      hasAccount: "Already have an account?",
      forgotPassword: "Forgot password?",
      resetPassword: "Reset Password",
      changePassword: "Change Password",
      newPassword: "New Password",
      currentPassword: "Current Password",
      // Новые ключи для плейсхолдеров
      yourName: "Your name",
      yourEmail: "Your email",
      passwordPlaceholder: "Password",
    },
    dates: {
      title: "Dates",
      addDate: "Add Date",
      newDate: "New Date",
      editDate: "Edit Date",
      dateTitle: "Date Title",
      description: "Description",
      tags: "Tags",
      location: "Location",
      budget: "Budget",
      difficulty: "Difficulty",
      difficultyPoints: "points",
      difficultyPoints1: "point",
      difficultyPoints2: "points",
      difficultyPoints3: "points",
      addTag: "Add Tag",
      plannedDates: "Planned Dates",
      completedDates: "Completed Dates",
      noDates: "No dates",
      noDatesSubtitle: "Create your first date",
      createFirstDate: "Create first date",
      complete: "Complete",
      undo: "Undo",
      notes: "Notes",
      completed: "Completed",
      notCompleted: "Not completed",
      myCreatedDates: "My dates",
      partnerCreatedDates: "Partner dates",
      // Новые ключи для плейсхолдеров
      dateTitlePlaceholder: "Date Title",
      dateDescriptionPlaceholder: "Description",
      locationPlaceholder: "Location",
      budgetPlaceholder: "Budget",
    },
    prizes: {
      title: "Prizes",
      addPrize: "Add Prize",
      newPrize: "New Prize",
      editPrize: "Edit Prize",
      prizeTitle: "Prize Title",
      description: "Description",
      type: "Type",
      typeSpecific: "Specific date",
      typeCount: "Date count",
      typePoints: "Points count",
      conditions: "Conditions",
      selectDate: "Select date",
      selectDatePlaceholder: "Select date for prize",
      countThreshold: "Count threshold",
      pointsThreshold: "Points threshold",
      isRepeatable: "Repeatable",
      expiresAt: "Expires at",
      expiresAtOptional: "Expires at (optional)",
      availablePrizes: "Available prizes",
      claimedPrizes: "Claimed prizes",
      noPrizes: "No prizes",
      noPrizesSubtitle: "Create your first prize",
      createFirstPrize: "Create first prize",
      claimed: "Claimed",
      claimedByMe: "Claimed by me",
      claimedByPartner: "Claimed by partner",
      claim: "Claim",
      // Новые ключи для плейсхолдеров
      prizeTitlePlaceholder: "Prize Title",
      prizeDescriptionPlaceholder: "Description",
      countThresholdPlaceholder: "Count threshold",
      pointsThresholdPlaceholder: "Points threshold",
    },
    partners: {
      title: "Partner",
      noPartner: "You have no partner",
      noPartnerSubtitle: "Add a partner to start planning",
      addPartner: "Add Partner",
      partnerEmail: "Partner email",
      sendRequest: "Send Request",
      requestSent: "Request sent",
      incomingRequests: "Incoming requests",
      outgoingRequests: "Outgoing requests",
      accept: "Accept",
      reject: "Reject",
      remove: "Remove",
      connected: "Connected",
      pending: "Pending",
      howItWorks: "How it works",
      howItWorksText:
        "Send a request to your partner by email. After accepting the request, you can plan dates together.",
      partnerInfo: "Partner information",
      // Новые ключи для плейсхолдеров
      partnerEmailPlaceholder: "Partner email",
    },
    profile: {
      title: "Profile",
      name: "Name",
      email: "Email",
      avatar: "Avatar",
      theme: "Theme",
      lightTheme: "Light",
      darkTheme: "Dark",
      language: "Language",
      saveChanges: "Save changes",
      changesSaved: "Changes saved",
      passwordChanged: "Password changed",
      active: "Active",
      // Новые ключи для плейсхолдеров
      namePlaceholder: "Name",
    },
    stats: {
      title: "Statistics",
      totalDates: "Total dates",
      completedDates: "Completed dates",
      totalPoints: "Total points",
      availablePrizes: "Available prizes",
      myCreatedDates: "Dates assigned by me",
      partnerCreatedDates: "Dates assigned by partner",
      myCreatedCompleted: "Completed by me",
      partnerCreatedCompleted: "Completed by partner",
    },
    notifications: {
      success: "Success",
      error: "Error",
      warning: "Warning",
      info: "Info",
      dateCreated: "Date created",
      dateCompleted: "Date completed",
      prizeCreated: "Prize created",
      prizeClaimed: "Prize claimed",
      partnerRequestSent: "Partner request sent",
      partnerRequestAccepted: "Partner request accepted",
      partnerRequestRejected: "Partner request rejected",
      partnerRemoved: "Partner removed",
    },
  },
};

