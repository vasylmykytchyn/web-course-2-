// ==========================================================
// Проєкт: Кіносвіт — онлайн-кінотеатр (варіант 4)
// Файл: js/app.js — дані, обробка (LR8) і поведінка сторінок (LR9)
// Скрипт підключено на всіх сторінках, тому кожна секція внизу
// спершу перевіряє, чи є потрібні їй елементи на цій сторінці.
// ==========================================================

// ===== 1. Дані =====
// Дані набрано вручну; у LR10 вони поїдуть у зовнішній JSON і
// завантажуватимуться через fetch, а масив films лишиться тим самим.
// Тривалість — у хвилинах, бюджет і збори — у млн $ (округлено;
// для фільмів 2026 року збори орієнтовні, станом на початок вересня 2026).
// const забороняє лише перепризначити змінну films на інше значення,
// а сам масив залишається змінним, тому films.push(...) працює.
const films = [
  {
    id: 1,
    code: "CIN-2026-A17",
    title: "Втеча з Шоушенка",
    director: "Френк Дарабонт",
    year: 1994,
    duration: 142,
    rating: 9.3,
    budget: 25,
    gross: 29,
    genre: "драма",
    premiere: false,
    img: "images/shawshank.jpg",
    session: { hall: "Зал 1", time: "12:00" },
    actors: [
      "Тім Роббінс — Енді Дюфрейн",
      "Морган Фріман — Елліс «Ред» Реддінг",
      "Боб Гантон — начальник в'язниці Нортон"
    ]
  },
  {
    id: 2,
    code: "CIN-2026-B24",
    title: "Хрещений батько",
    director: "Френсіс Форд Коппола",
    year: 1972,
    duration: 175,
    rating: 9.2,
    budget: 6,
    gross: 250,
    genre: "кримінал",
    premiere: false,
    img: "images/godfather.jpg",
    session: { hall: "Зал 3", time: "14:00" },
    actors: [
      "Марлон Брандо — Віто Корлеоне",
      "Аль Пачино — Майкл Корлеоне",
      "Джеймс Каан — Сонні Корлеоне",
      "Роберт Дювалл — Том Гейген"
    ]
  },
  {
    id: 3,
    code: "CIN-2026-C05",
    title: "Інтерстеллар",
    director: "Крістофер Нолан",
    year: 2014,
    duration: 169,
    rating: 8.7,
    budget: 165,
    gross: 730,
    genre: "фантастика",
    premiere: false,
    img: "images/interstellar.jpg",
    session: { hall: "Зал 2", time: "16:30" },
    actors: [
      "Меттью Макконегі — Купер",
      "Енн Гетевей — Амелія Бренд",
      "Джессіка Честейн — Мерф"
    ]
  },
  {
    id: 4,
    code: "CIN-2026-D31",
    title: "Темний лицар",
    director: "Крістофер Нолан",
    year: 2008,
    duration: 152,
    rating: 9.0,
    budget: 185,
    gross: 1006,
    genre: "бойовик",
    premiere: false,
    img: "images/dark-knight.jpg",
    session: { hall: "Зал 1", time: "19:00" },
    actors: [
      "Крістіан Бейл — Брюс Вейн / Бетмен",
      "Гіт Леджер — Джокер",
      "Аарон Екгарт — Гарві Дент",
      "Майкл Кейн — Альфред"
    ]
  },
  {
    id: 5,
    code: "CIN-2026-E12",
    title: "Форрест Гамп",
    director: "Роберт Земекіс",
    year: 1994,
    duration: 142,
    rating: 8.8,
    budget: 55,
    gross: 678,
    genre: "драма",
    premiere: false,
    img: "images/forrest-gump.jpg",
    session: { hall: "Зал 2", time: "13:15" },
    actors: [
      "Том Генкс — Форрест Гамп",
      "Робін Райт — Дженні Каррен"
    ]
  },
  {
    id: 6,
    code: "CIN-2026-F09",
    title: "Гладіатор",
    director: "Рідлі Скотт",
    year: 2000,
    duration: 155,
    rating: 8.5,
    budget: 103,
    gross: 460,
    genre: "історичний",
    premiere: false,
    img: "images/gladiator.jpg",
    session: { hall: "Зал 3", time: "21:00" },
    actors: [
      "Расселл Кроу — Максимус",
      "Хоакін Фенікс — Коммод",
      "Конні Нільсен — Луцілла"
    ]
  },
  {
    id: 7,
    code: "CIN-2026-G21",
    title: "Один вдома",
    director: "Кріс Коламбус",
    year: 1990,
    duration: 103,
    rating: 7.7,
    budget: 18,
    gross: 476,
    genre: "комедія",
    premiere: false,
    img: "images/home-alone.jpg",
    session: { hall: "Зал 3", time: "11:00" },
    actors: [
      "Маколей Калкін — Кевін Маккалістер",
      "Джо Пеші — Гаррі Лайм",
      "Деніел Стерн — Марв Мерчінс"
    ]
  },
  {
    id: 8,
    code: "CIN-2026-H14",
    title: "Людина-павук: Абсолютно новий день",
    director: "Дестін Деніел Креттон",
    year: 2026,
    duration: 140,
    rating: 8.5,
    budget: 225,
    gross: 2400,
    genre: "супергероїка",
    premiere: true,
    img: "images/cinema-banner.webp",
    session: { hall: "Зал 1", time: "16:00" },
    actors: [
      "Том Голланд — Пітер Паркер / Людина-павук",
      "Зендея — Ем-Джей",
      "Джейкоб Баталон — Нед Лідс"
    ]
  },
  {
    id: 9,
    code: "CIN-2026-J07",
    title: "Одіссея",
    director: "Крістофер Нолан",
    year: 2026,
    duration: 165,
    rating: 8.7,
    budget: 250,
    gross: 1590,
    genre: "пригоди",
    premiere: true,
    img: "images/odyssey.jpg",
    session: { hall: "VIP-зал", time: "20:00" },
    actors: [
      "Метт Деймон — Одіссей",
      "Том Голланд — Телемах",
      "Зендея — Афіна"
    ]
  }
];

// ===== 2. Допоміжні функції =====

// Записує текст у елемент за id; масив рядків склеює переносами.
// Єдина функція, що пише в демо-блок #demo (LR8).
const show = (id, value) => {
  const box = document.getElementById(id);
  if (box === null) {
    console.error("Немає елемента з id:", id);
    return;
  }
  box.textContent = Array.isArray(value) ? value.join("\n") : value;
};

// Приймає фільм, повертає його прибуток у млн $ (збори мінус бюджет).
const profitOf = (film) => film.gross - film.budget;

// Приймає масив і функцію форматування, повертає масив рядків
// або повідомлення, що нічого не знайдено.
const listLines = (items, format) =>
  items.length > 0 ? items.map(format) : ["  нічого не знайдено"];

// Приймає рядок, повертає його з великої літери.
const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// ===== 3. Функції обробки (LR8) =====

// Приймає фільм, повертає назву групи за жанром (тільки switch).
function categoryOf(film) {
  switch (film.genre) {
    case "драма":
    case "кримінал":
      return "Класика кіно";
    case "фантастика":
    case "бойовик":
      return "Блокбастери";
    default:
      return "Інші жанри";
  }
}

// Приймає масив фільмів, повертає масив рядків
// "1. Назва — режисер, рік (зал, час)" (класичний цикл for).
function numberedList(items) {
  const lines = [];
  for (let i = 0; i < items.length; i++) {
    const f = items[i];
    lines.push(`${i + 1}. ${f.title} — ${f.director}, ${f.year} (${f.session.hall}, ${f.session.time})`);
  }
  return lines;
}

// Приймає масив і жанр, повертає фільми цього жанру (нічого не змінює).
const filterByGenre = (items, value) => items.filter((f) => f.genre === value);

// Приймає масив і поріг у хвилинах, повертає фільми довші за поріг.
const filterByDurationOver = (items, minutes) => items.filter((f) => f.duration > minutes);

// Приймає масив, повертає КОПІЮ, відсортовану за роком зростання.
// [...items] потрібен, бо sort() змінює масив, для якого викликаний.
const sortByYear = (items) => [...items].sort((a, b) => a.year - b.year);

// Приймає масив, повертає КОПІЮ, відсортовану за назвою в українській абетці.
const sortByTitle = (items) => [...items].sort((a, b) => a.title.localeCompare(b.title, "uk"));

// Приймає масив фільмів, повертає об'єкт зі статистикою.
const statsForFilms = (items) => {
  // Початкове значення 0 потрібне, щоб сума починалася з числа.
  // Без нього акумулятором став би перший фільм (об'єкт), і результат
  // перетворився б на рядок "[object Object]9.2..." замість числа.
  const total = items.reduce((sum, f) => sum + f.rating, 0);

  // Порівнюємо накопичувач best із поточним записом f.
  const topRated = items.reduce((best, f) => (f.rating > best.rating ? f : best));
  const mostProfitable = items.reduce((best, f) => (profitOf(f) > profitOf(best) ? f : best));

  return {
    count: items.length,
    total,
    average: (total / items.length).toFixed(1),
    topRated,
    mostProfitable,
    genres: new Set(items.map((f) => f.genre)).size
  };
};

// ===== 4. Нові фільтри (LR9) =====

// Приймає масив і межі в хвилинах, повертає фільми з тривалістю в діапазоні.
const filterByDurationRange = (items, min, max) =>
  items.filter((f) => f.duration >= min && f.duration <= max);

// Приймає масив і запит (уже в нижньому регістрі), повертає фільми,
// у яких запит міститься в назві або в імені режисера.
const filterByText = (items, query) =>
  items.filter((f) =>
    f.title.toLowerCase().includes(query) || f.director.toLowerCase().includes(query));

// ===== 5. Тост: тимчасове повідомлення =====
const toastEl = document.getElementById("toast");
let toastTimer = null;

// Показує повідомлення на 2,5 секунди.
function showToast(text) {
  if (toastEl === null) return;
  toastEl.textContent = text;
  toastEl.hidden = false;
  // clearTimeout потрібен, щоб старий таймер не сховав нове повідомлення
  // раніше часу: без нього друге натискання підряд зникало б
  // у момент, коли спрацює таймер від першого.
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toastEl.hidden = true;
  }, 2500);
}

// ===== 6. Демонстрація LR8 (тільки на сторінці, де є #demo) =====
if (document.getElementById("demo") !== null) {
  const stats = statsForFilms(films);
  const dramas = filterByGenre(films, "драма");
  const longFilms = filterByDurationOver(films, 150);
  const cartoons = filterByGenre(films, "мультфільм"); // навмисно порожній результат

  show("out-count", `Фільмів у каталозі: ${films.length}`);

  show("out-numbered", numberedList(films));

  show("out-categories", films.map((f) => `${f.title} → ${categoryOf(f)}`));

  show("out-filter", [
    `За жанром «драма»: знайдено ${dramas.length}`,
    ...listLines(dramas, (f) => `  • ${f.title}`),
    `Довші за 150 хв: знайдено ${longFilms.length}`,
    ...listLines(longFilms, (f) => `  • ${f.title} — ${f.duration} хв`),
    `За жанром «мультфільм»: знайдено ${cartoons.length}`,
    ...listLines(cartoons, (f) => `  • ${f.title}`)
  ]);

  show("out-sorted", [
    "За роком виходу (від старих до нових):",
    ...sortByYear(films).map((f) => `  ${f.year} — ${f.title}`),
    "За назвою (А–Я):",
    ...sortByTitle(films).map((f) => `  ${f.title}`),
    "Вихідний порядок (оригінал не змінено):",
    ...films.map((f) => `  ${f.id}. ${f.title}`)
  ]);

  show("out-stats", [
    `Кількість фільмів: ${stats.count}`,
    `Сума рейтингів: ${stats.total.toFixed(1)}`,
    `Середній рейтинг: ${stats.average}`,
    `Найвищий рейтинг: ${stats.topRated.title} (${stats.topRated.rating})`,
    `Різних жанрів: ${stats.genres}`,
    `Найприбутковіший: ${stats.mostProfitable.title} (${profitOf(stats.mostProfitable)} млн $)`,
    "Прибуток кожного фільму (збори − бюджет):",
    ...films.map((f) => `  ${f.title}: ${profitOf(f)} млн $`)
  ]);
}

// ===== 7. Каталог: рендер, пошук, фільтри, модалка =====
const cardsEl = document.getElementById("cards");

if (cardsEl !== null) {
  const searchEl = document.getElementById("q");
  const genreEl = document.getElementById("filter");
  const minEl = document.getElementById("dmin");
  const maxEl = document.getElementById("dmax");
  const emptyEl = document.getElementById("empty");
  const foundEl = document.getElementById("found");
  const resetEl = document.getElementById("reset-filters");

  // Будує картки з масиву; усі дані потрапляють на сторінку
  // тільки через textContent або атрибути src/alt, жодного innerHTML.
  function renderCards(list) {
    cardsEl.replaceChildren();

    for (const film of list) {
      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = film.id;

      const media = document.createElement("div");
      media.className = "card__media";

      const badge = document.createElement("span");
      badge.className = film.premiere ? "card__badge" : "card__badge card__badge--regular";
      badge.textContent = film.premiere ? "Прем'єра" : "У прокаті";

      const img = document.createElement("img");
      img.className = "card__img";
      img.src = film.img;
      img.alt = `Постер фільму «${film.title}»`;
      img.loading = "lazy";

      const overlay = document.createElement("span");
      overlay.className = "card__overlay";
      overlay.setAttribute("aria-hidden", "true");
      overlay.textContent = film.title;

      media.append(badge, img, overlay);

      const body = document.createElement("div");
      body.className = "card__body";

      const title = document.createElement("h3");
      title.className = "card__title";
      title.textContent = film.title;

      const meta = document.createElement("p");
      meta.className = "card__meta";
      meta.textContent = `${film.year} · ${capitalize(film.genre)} · ${film.director}`;

      const codeLine = document.createElement("p");
      codeLine.className = "card__id";
      codeLine.textContent = `Код бронювання: ${film.code}`;

      body.append(title, meta, codeLine);

      const actions = document.createElement("div");
      actions.className = "card__actions";

      const book = document.createElement("a");
      book.className = "card__action";
      book.href = "form.html";
      book.textContent = "Забронювати";

      const more = document.createElement("button");
      more.className = "card__action";
      more.type = "button";
      more.textContent = "Детальніше";

      actions.append(book, more);
      card.append(media, body, actions);
      cardsEl.append(card);
    }
  }

  // Читає межу тривалості: порожнє поле означає "без обмеження".
  // Number("") дорівнює 0, тому порожнє поле треба обробляти окремо,
  // інакше "до" лишилося б нулем і сховало б усі фільми.
  const readLimit = (input, fallback) => (input.value === "" ? fallback : Number(input.value));

  // Збирає всі умови (жанр, тривалість, пошук) і перемальовує картки.
  function applyFilters() {
    const query = searchEl.value.trim().toLowerCase();
    const genre = genreEl.value;
    const min = readLimit(minEl, 0);
    const max = readLimit(maxEl, Infinity);

    let result = films;
    if (genre !== "all") {
      result = filterByGenre(result, genre);
    }
    result = filterByDurationRange(result, min, max);
    result = filterByText(result, query);

    renderCards(result);
    emptyEl.hidden = result.length > 0;
    foundEl.textContent = `Знайдено: ${result.length} з ${films.length}`;
  }

  // input спрацьовує на кожен символ, тому список змінюється під час набирання;
  // change для текстового поля спрацював би лише після виходу з поля чи Enter.
  searchEl.addEventListener("input", applyFilters);
  genreEl.addEventListener("change", applyFilters);
  minEl.addEventListener("input", applyFilters);
  maxEl.addEventListener("input", applyFilters);

  resetEl.addEventListener("click", () => {
    searchEl.value = "";
    genreEl.value = "all";
    minEl.value = "";
    maxEl.value = "";
    applyFilters();
    showToast("Фільтри скинуто");
  });

  // Модальне вікно: один обробник на контейнері для всіх карток.
  const dlg = document.getElementById("details");
  const dTitle = document.getElementById("d-title");
  const dLine1 = document.getElementById("d-line1");
  const dLine2 = document.getElementById("d-line2");
  const dLine3 = document.getElementById("d-line3");

  // Делегування: слухач висить на контейнері, а не на кнопках. Подія click
  // спливає від картки вгору до .cards, тому один слухач працює і для карток,
  // створених пізніше, після перемальовування пошуком. Кнопки, підписані
  // в циклі, після replaceChildren() зникли б разом зі своїми слухачами.
  cardsEl.addEventListener("click", (event) => {
    if (event.target.closest("a") !== null) return; // посилання "Забронювати" працює як звичайно
    const card = event.target.closest(".card");
    if (card === null) return;
    const film = films.find((f) => f.id === Number(card.dataset.id));
    if (film === undefined) return;

    dTitle.textContent = film.title;
    dLine1.textContent = `Режисер: ${film.director} · Рік: ${film.year} · Тривалість: ${film.duration} хв · Жанр: ${film.genre}`;
    dLine2.textContent = `Код бронювання: ${film.code} · Сеанс: ${film.session.hall}, ${film.session.time} · Рейтинг: ${film.rating}`;
    dLine3.textContent = `У ролях: ${film.actors.join("; ")}`;
    dlg.showModal();
  });

  document.getElementById("d-close").addEventListener("click", () => dlg.close());

  applyFilters();
}

// ===== 8. Форма бронювання: власна валідація =====
const bookingForm = document.getElementById("booking-form");

if (bookingForm !== null) {
  const FIELD_IDS = [
    "fullname", "email", "phone", "visit-date", "movie",
    "tickets-count", "booking-code", "comment", "agree"
  ];
  const movieEl = document.getElementById("movie");
  const commentEl = document.getElementById("comment");
  const receiptEl = document.getElementById("receipt");

  // Власна перевірка, недосяжна для HTML-атрибутів: якщо обрано
  // "Інший фільм", коментар обов'язковий. Коли умова вже не порушується,
  // обов'язково setCustomValidity(""), інакше поле лишилося б невалідним назавжди.
  function updateCustomRules() {
    const needComment = movieEl.value === "other" && commentEl.value.trim() === "";
    commentEl.setCustomValidity(needComment ? "Вкажіть у коментарі, який саме фільм вам потрібен" : "");
  }

  // Приймає поле, повертає зрозуміле повідомлення про помилку.
  function messageFor(input) {
    const v = input.validity;
    if (v.customError) return input.validationMessage;
    if (v.valueMissing) return "Заповніть це поле";
    if (v.typeMismatch) return "Невірний формат значення";
    if (v.patternMismatch) return input.title || "Невірний формат";
    if (v.tooShort) return `Введіть щонайменше ${input.minLength} символи`;
    if (v.rangeUnderflow || v.rangeOverflow) return "Значення поза допустимим діапазоном";
    return input.validationMessage;
  }

  // Перевіряє одне поле, показує або стирає помилку, повертає true, якщо поле коректне.
  function validateField(input) {
    const ok = input.checkValidity();
    document.getElementById(`err-${input.id}`).textContent = ok ? "" : messageFor(input);
    input.classList.toggle("invalid", !ok);
    return ok;
  }

  // Будує квитанцію через createElement + textContent.
  function renderReceipt() {
    const typeEl = bookingForm.querySelector('input[name="ticket-type"]:checked');
    const extras = [...bookingForm.querySelectorAll('input[name="extras"]:checked')]
      .map((el) => el.parentElement.textContent.trim());
    const code = document.getElementById("booking-code").value.trim();
    const comment = commentEl.value.trim();

    const rows = [
      ["Глядач", document.getElementById("fullname").value.trim()],
      ["Пошта", document.getElementById("email").value.trim()],
      ["Телефон", document.getElementById("phone").value.trim()],
      ["Дата сеансу", document.getElementById("visit-date").value],
      ["Фільм", movieEl.selectedOptions[0].textContent],
      ["Кількість квитків", String(Number(document.getElementById("tickets-count").value))],
      ["Код бронювання", code === "" ? "не вказано" : code],
      ["Тип квитка", typeEl === null ? "не обрано" : typeEl.parentElement.textContent.trim()],
      ["Додатково", extras.length > 0 ? extras.join(", ") : "немає"],
      ["Коментар", comment === "" ? "немає" : comment],
      ["Згода на обробку даних", document.getElementById("agree").checked ? "так" : "ні"]
    ];

    const title = document.createElement("h3");
    title.textContent = "Квитанція про бронювання";

    const list = document.createElement("ul");
    for (const [label, value] of rows) {
      const li = document.createElement("li");
      li.textContent = `${label}: ${value}`;
      list.append(li);
    }

    receiptEl.replaceChildren(title, list);
    receiptEl.hidden = false;
  }

  // Ця перевірка не є захистом: користувач може змінити код або вимкнути
  // JavaScript у браузері, тому по-справжньому дані перевіряє сервер.
  bookingForm.addEventListener("submit", (event) => {
    event.preventDefault();
    updateCustomRules();

    let allOk = true;
    for (const id of FIELD_IDS) {
      if (!validateField(document.getElementById(id))) {
        allOk = false;
      }
    }

    if (!allOk) {
      const firstBad = bookingForm.querySelector(".invalid");
      if (firstBad !== null) firstBad.focus();
      return;
    }

    renderReceipt();
    showToast("Бронювання оформлено");
    bookingForm.reset();
  });

  // Поки користувач виправляє поле з помилкою, перевіряємо його на льоту.
  bookingForm.addEventListener("input", (event) => {
    updateCustomRules();
    if (event.target.classList.contains("invalid")) {
      validateField(event.target);
    }
  });

  movieEl.addEventListener("change", () => {
    updateCustomRules();
    if (commentEl.classList.contains("invalid")) {
      validateField(commentEl);
    }
  });
}

// ===== 9. Меню-кнопка =====
const burger = document.getElementById("burger");
const menu = document.getElementById("menu");

if (burger !== null && menu !== null) {
  // Відкриває або закриває меню й одночасно оновлює aria-expanded.
  const setMenu = (open) => {
    menu.classList.toggle("open", open);
    burger.setAttribute("aria-expanded", String(open));
  };

  burger.addEventListener("click", () => {
    setMenu(burger.getAttribute("aria-expanded") !== "true");
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  document.addEventListener("click", (event) => {
    if (event.target.closest("#menu") === null && event.target.closest("#burger") === null) {
      setMenu(false);
    }
  });
}

// ===== 10. Тема =====
const themeBtn = document.getElementById("theme");

if (themeBtn !== null) {
  const root = document.documentElement;

  // Повертає true, якщо зараз темна тема: спершу дивимось на класи,
  // які поставила кнопка, і лише потім питаємо систему.
  const isDark = () => {
    if (root.classList.contains("dark-theme")) return true;
    if (root.classList.contains("light-theme")) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  // Вмикає темну або світлу тему, оновлює aria-pressed і підпис кнопки.
  const applyTheme = (dark) => {
    root.classList.toggle("dark-theme", dark);
    root.classList.toggle("light-theme", !dark);
    themeBtn.setAttribute("aria-pressed", String(dark));
    themeBtn.textContent = dark ? "☀️ Світла тема" : "🌙 Темна тема";
  };

  applyTheme(isDark());
  themeBtn.addEventListener("click", () => applyTheme(!isDark()));
}