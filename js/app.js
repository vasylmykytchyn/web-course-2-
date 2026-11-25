// ==========================================================
// Проєкт: Кіносвіт — онлайн-кінотеатр (варіант 4)
// Файл: js/app.js — завантаження даних, каталог, модалка, форма,
// меню, тема, localStorage (LR10)
// Скрипт підключено на всіх сторінках, тому кожна секція внизу
// спершу перевіряє, чи є потрібні їй елементи на цій сторінці.
// ==========================================================

// ===== 1. Довідники =====
// Постерів у data.json немає, тому шляхи до них зберігаються тут.
const POSTERS = {
  "Interstellar": "images/interstellar.jpg",
  "Avatar": "images/avatar.jpg",
  "Inception": "images/inception.jpg",
  "The Lord of the Rings: The Fellowship of the Ring": "images/fellowship.jpg",
  "The Matrix": "images/matrix.jpg",
  "Dune": "images/dune.jpg",
  "Blade Runner 2049": "images/blade-runner-2049.jpg",
  "The Dark Knight": "images/dark-knight.jpg",
  "The Shawshank Redemption": "images/shawshank.jpg",
  "Gladiator": "images/gladiator.jpg"
};

// Українські підписи жанрів (у даних вони англійською).
const GENRE_LABELS = {
  "sci-fi": "Фантастика",
  "drama": "Драма",
  "adventure": "Пригоди",
  "fantasy": "Фентезі",
  "thriller": "Трилер",
  "action": "Бойовик",
  "epic": "Епос",
  "neo-noir": "Неонуар",
  "crime": "Кримінал",
  "historical": "Історичний"
};

// Підписи полів вкладеного об'єкта boxOffice.
const BOX_LABELS = {
  budget_million: "Бюджет",
  gross_worldwide_million: "Збори у світі"
};

// ===== 2. Стан =====
// Дані приїжджають із data.json після завантаження (див. loadData),
// тому на старті масив порожній. Це let, а не const, бо значення
// присвоюється пізніше.
let items = [];
let watchLater = loadWatchLater(); // id фільмів зі списку «Дивитися пізніше»
let toastTimer = null;

// ===== 3. Допоміжні функції =====

// Приймає ключ жанру, повертає український підпис (або сам ключ).
const genreLabel = (key) => GENRE_LABELS[key] ?? key;

// Приймає кількість мільйонів, повертає рядок "2 686 млн $" з розділювачами розрядів.
const formatMoney = (million) => `${million.toLocaleString("uk-UA")} млн $`;

// Приймає фільм, повертає прибуток у млн $ (збори мінус бюджет); у даних цього поля немає.
const profitOf = (film) =>
  film.boxOffice.gross_worldwide_million - film.boxOffice.budget_million;

// Приймає фільм, повертає середню оцінку глядачів (0, якщо оцінок немає).
const averageRating = (film) =>
  film.ratings.length === 0
    ? 0
    : film.ratings.reduce((sum, rating) => sum + rating, 0) / film.ratings.length;

// Приймає id, повертає код бронювання формату CIN-2026-A17 (літера ряду + номер місця).
// У даних коду немає, тому він обчислюється з id.
const bookingCode = (id) =>
  `CIN-2026-${String.fromCharCode(64 + id)}${String((id * 7) % 90 + 10)}`;

// Читає список «Дивитися пізніше» зі сховища; на будь-яку проблему повертає [].
function loadWatchLater() {
  try {
    const raw = localStorage.getItem("watchLater");
    if (raw === null) return [];
    const parsed = JSON.parse(raw); // вміст могли зіпсувати вручну
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
}

// Зберігає список id у сховищі як JSON-рядок
// (localStorage зберігає лише рядки: без stringify масив став би "1,2,3").
function saveWatchLater(list) {
  localStorage.setItem("watchLater", JSON.stringify(list));
}

// Показує тимчасове повідомлення на 2,5 секунди.
const toastEl = document.getElementById("toast");

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

// ===== 4. Фільтри та сортування =====

// Приймає масив і ключ жанру, повертає фільми, у яких він є в списку genres.
const filterByGenre = (list, genre) => list.filter((f) => f.genres.includes(genre));

// Приймає масив і межі в хвилинах, повертає фільми з тривалістю в діапазоні.
const filterByDurationRange = (list, min, max) =>
  list.filter((f) => f.duration_min >= min && f.duration_min <= max);

// Приймає масив і запит (у нижньому регістрі), повертає фільми,
// у яких запит міститься в назві або в імені режисера.
const filterByText = (list, query) =>
  list.filter((f) =>
    f.title.toLowerCase().includes(query) || f.director.toLowerCase().includes(query));

// Приймає масив і режим, повертає КОПІЮ, відсортовану за обраним режимом.
// [...list] потрібен, бо sort() змінює масив, для якого викликаний.
function sortFilms(list, mode) {
  switch (mode) {
    case "year":
      return [...list].sort((a, b) => b.year - a.year);
    case "rating":
      return [...list].sort((a, b) => averageRating(b) - averageRating(a));
    case "profit":
      return [...list].sort((a, b) => profitOf(b) - profitOf(a));
    default:
      return list;
  }
}

// ===== 5. Каталог: завантаження, рендер, фільтри, модалка =====
const cardsEl = document.getElementById("cards");

if (cardsEl !== null) {
  const searchEl = document.getElementById("q");
  const genreEl = document.getElementById("filter");
  const minEl = document.getElementById("dmin");
  const maxEl = document.getElementById("dmax");
  const sortEl = document.getElementById("sort");
  const onlySavedEl = document.getElementById("only-saved");
  const emptyEl = document.getElementById("empty");
  const foundEl = document.getElementById("found");
  const resetEl = document.getElementById("reset-filters");
  const loader = document.querySelector(".loader");
  const errorEl = document.getElementById("load-error");

  const dlg = document.getElementById("details");
  const dTitle = document.getElementById("d-title");
  const dMain = document.getElementById("d-main");
  const dObject = document.getElementById("d-object");
  const dList = document.getElementById("d-list");
  const dTable = document.getElementById("d-table");

  // Створює елемент з текстом і (за потреби) класом; текст іде лише через textContent.
  const makeEl = (tag, text, className) => {
    const el = document.createElement(tag);
    if (text !== undefined) el.textContent = text;
    if (className !== undefined) el.className = className;
    return el;
  };

  // Будує картки з масиву; усі дані потрапляють на сторінку
  // тільки через textContent або атрибути src/alt, жодного innerHTML.
  function renderCards(list) {
    cardsEl.replaceChildren();

    for (const film of list) {
      const average = averageRating(film);
      const saved = watchLater.includes(film.id);

      const card = document.createElement("article");
      card.className = "card";
      card.dataset.id = film.id;

      const media = document.createElement("div");
      media.className = "card__media";

      // Клас бейджа залежить від даних: висока середня оцінка — акцентний бейдж.
      const badge = document.createElement("span");
      badge.className = average >= 9 ? "card__badge" : "card__badge card__badge--regular";
      badge.textContent = `★ ${average.toFixed(1)}`;

      const img = document.createElement("img");
      img.className = "card__img";
      img.src = POSTERS[film.title] ?? "images/cinema-banner.webp";
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
      meta.textContent = `${film.year} · ${film.director}`;

      const codeLine = document.createElement("p");
      codeLine.className = "card__id";
      codeLine.textContent = `Код бронювання: ${bookingCode(film.id)}`;

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

      const fav = document.createElement("button");
      fav.className = "card__action fav";
      fav.type = "button";
      fav.dataset.id = film.id;
      fav.textContent = saved ? "✓ Пізніше" : "＋ Пізніше";
      fav.setAttribute("aria-pressed", String(saved));
      fav.setAttribute(
        "aria-label",
        saved ? "Прибрати зі списку «Дивитися пізніше»" : "Додати до списку «Дивитися пізніше»"
      );

      actions.append(book, more, fav);
      card.append(media, body, actions);
      cardsEl.append(card);
    }
  }

  // Заповнює модалку повною деталізацією фільму: прості поля, вкладений
  // об'єкт, масив рядків і масив об'єктів. Контейнери очищаються через
  // replaceChildren(), тому дані двох фільмів не змішуються.
  function fillDetails(film) {
    dTitle.textContent = film.title;

    // 1) Прості поля — список означень
    const mainList = document.createElement("dl");
    const mainRows = [
      ["Режисер", film.director],
      ["Рік", String(film.year)],
      ["Тривалість", `${film.duration_min} хв`],
      ["Жанри", film.genres.map(genreLabel).join(", ")],
      ["Код бронювання", bookingCode(film.id)],
      [
        "Середній рейтинг",
        film.ratings.length > 0
          ? `${averageRating(film).toFixed(1)} (оцінок: ${film.ratings.length})`
          : "оцінок поки немає"
      ],
      [
        "Оцінки глядачів",
        film.ratings.length > 0 ? film.ratings.join(", ") : "оцінок поки немає"
      ]
    ];
    for (const [label, value] of mainRows) {
      mainList.append(makeEl("dt", label), makeEl("dd", value));
    }
    dMain.replaceChildren(mainList);

    // 2) Вкладений об'єкт boxOffice — перебір ключів + обчислюваний прибуток
    const boxList = document.createElement("dl");
    for (const [key, value] of Object.entries(film.boxOffice)) {
      boxList.append(makeEl("dt", BOX_LABELS[key] ?? key), makeEl("dd", formatMoney(value)));
    }
    boxList.append(
      makeEl("dt", "Прибуток"),
      makeEl("dd", `${formatMoney(profitOf(film))} (збори − бюджет)`)
    );
    dObject.replaceChildren(makeEl("h3", "Касові збори"), boxList);

    // 3) Масив рядків — локації зйомок
    const placesTitle = makeEl("h3", "Локації зйомок");
    if (film.locations.length === 0) {
      dList.replaceChildren(placesTitle, makeEl("p", "Локації зйомок не вказано"));
    } else {
      const places = document.createElement("ul");
      for (const place of film.locations) {
        places.append(makeEl("li", place));
      }
      dList.replaceChildren(placesTitle, places);
    }

    // 4) Масив об'єктів — склад «актор — роль» таблицею
    const castTitle = makeEl("h3", "Склад: актор — роль");
    if (film.cast.length === 0) {
      dTable.replaceChildren(castTitle, makeEl("p", "Склад не вказано"));
    } else {
      const table = document.createElement("table");
      const head = document.createElement("thead");
      const headRow = document.createElement("tr");
      for (const label of ["Актор", "Роль"]) {
        const th = makeEl("th", label);
        th.scope = "col";
        headRow.append(th);
      }
      head.append(headRow);

      const bodyEl = document.createElement("tbody");
      for (const member of film.cast) {
        const row = document.createElement("tr");
        row.append(makeEl("td", member.name), makeEl("td", member.role));
        bodyEl.append(row);
      }
      table.append(head, bodyEl);

      // Контейнер із прокруткою: широка таблиця не розтягує сторінку на 360px
      const wrap = makeEl("div", undefined, "table-wrap table-wrap--narrow");
      wrap.append(table);
      dTable.replaceChildren(castTitle, wrap);
    }
  }

  // Читає межу тривалості: порожнє поле означає "без обмеження".
  // Number("") дорівнює 0, тому порожнє поле треба обробляти окремо,
  // інакше "до" лишилося б нулем і сховало б усі фільми.
  const readLimit = (input, fallback) => (input.value === "" ? fallback : Number(input.value));

  // Збирає всі умови (пошук, жанр, тривалість, «Дивитися пізніше», сортування)
  // і перемальовує картки та лічильник.
  function applyFilters() {
    const query = searchEl.value.trim().toLowerCase();
    const min = readLimit(minEl, 0);
    const max = readLimit(maxEl, Infinity);

    let result = items;
    if (genreEl.value !== "all") {
      result = filterByGenre(result, genreEl.value);
    }
    result = filterByDurationRange(result, min, max);
    result = filterByText(result, query);
    if (onlySavedEl.checked) {
      result = result.filter((f) => watchLater.includes(f.id));
    }
    result = sortFilms(result, sortEl.value);

    renderCards(result);
    emptyEl.hidden = result.length > 0;
    foundEl.textContent = `Показано ${result.length} із ${items.length}`;
  }

  // Додає в список жанрів опції, зібрані з даних, а не написані руками в HTML.
  function fillGenreOptions() {
    const genres = [...new Set(items.flatMap((f) => f.genres))]
      .sort((a, b) => genreLabel(a).localeCompare(genreLabel(b), "uk"));
    for (const genre of genres) {
      const option = document.createElement("option");
      option.value = genre;
      option.textContent = genreLabel(genre);
      genreEl.append(option);
    }
  }

  // Додає фільм у «Дивитися пізніше» або прибирає, зберігає список
  // і повертає фокус на ту саму кнопку після перемальовування.
  function toggleWatchLater(id) {
    if (watchLater.includes(id)) {
      watchLater = watchLater.filter((savedId) => savedId !== id);
      showToast("Прибрано зі списку «Дивитися пізніше»");
    } else {
      watchLater = [...watchLater, id];
      showToast("Додано до «Дивитися пізніше»");
    }
    saveWatchLater(watchLater);
    applyFilters();

    const again = cardsEl.querySelector(`.fav[data-id="${id}"]`);
    if (again !== null) again.focus();
  }

  // Завантажує data.json і повертає масив фільмів з доданим id.
  // fetch не кидає помилку на HTTP 404/500: він повертає відповідь із
  // ok === false. Без перевірки response.ok ми б спробували розібрати
  // HTML-сторінку помилки як JSON і отримали б незрозумілий SyntaxError
  // замість "HTTP 404"; тому статус перевіряємо вручну.
  // У файлі даних поля id немає, а файл змінювати не можна,
  // тож id (1, 2, 3…) додається тут, у пам'яті, за порядком у файлі.
  async function loadData() {
    const response = await fetch("data.json");

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length === 0) {
      throw new Error("Файл даних порожній або має неправильну структуру");
    }

    return data.map((film, index) => ({ ...film, id: index + 1 }));
  }

  // Показує людині повідомлення про помилку з порадою, що робити.
  function showLoadError(error) {
    errorEl.hidden = false;
    errorEl.textContent =
      `Не вдалося завантажити каталог. Перевірте з'єднання і оновіть сторінку. ` +
      `Технічні подробиці: ${error.message}`;
  }

  // Запускає завантаження: спінер, дані, фільтри, показ помилки.
  async function init() {
    loader.hidden = false;
    errorEl.hidden = true;
    try {
      items = await loadData();
      fillGenreOptions();
      applyFilters();
    } catch (error) {
      showLoadError(error);
    } finally {
      // Ховаємо спінер тут, а не в кінці try: після помилки try обривається,
      // і спінер крутився б вічно поруч із повідомленням про помилку.
      loader.hidden = true;
    }
  }

  // input спрацьовує на кожен символ, тому список змінюється під час набирання;
  // change для текстового поля спрацював би лише після виходу з поля чи Enter.
  searchEl.addEventListener("input", applyFilters);
  genreEl.addEventListener("change", applyFilters);
  minEl.addEventListener("input", applyFilters);
  maxEl.addEventListener("input", applyFilters);
  sortEl.addEventListener("change", applyFilters);
  onlySavedEl.addEventListener("change", applyFilters);

  resetEl.addEventListener("click", () => {
    searchEl.value = "";
    genreEl.value = "all";
    minEl.value = "";
    maxEl.value = "";
    sortEl.value = "default";
    onlySavedEl.checked = false;
    applyFilters();
    showToast("Фільтри скинуто");
  });

  // Делегування: слухач висить на контейнері, а не на кнопках. Подія click
  // спливає від кнопки вгору до .cards, тому один слухач працює і для карток,
  // створених пізніше, після перемальовування пошуком або після fetch.
  cardsEl.addEventListener("click", (event) => {
    const favButton = event.target.closest(".fav");
    if (favButton !== null) {
      toggleWatchLater(Number(favButton.dataset.id));
      return; // сердечко не відкриває модалку
    }
    if (event.target.closest("a") !== null) return; // посилання "Забронювати" працює як звичайно

    const card = event.target.closest(".card");
    if (card === null) return;
    const film = items.find((f) => f.id === Number(card.dataset.id));
    if (film === undefined) return;

    fillDetails(film);
    dlg.showModal();
  });

  document.getElementById("d-close").addEventListener("click", () => dlg.close());

  init();
}

// ===== 6. Форма бронювання: власна валідація =====
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

  // Ця перевірка не є захистом, а лише зручністю: користувач може змінити код
  // або вимкнути JavaScript у браузері, тому по-справжньому дані перевіряє сервер.
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

// ===== 7. Меню-кнопка =====
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

// ===== 8. Тема =====
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

  // Спершу дивимось у сховище: збережений вибір користувача важливіший
  // за системну схему, яку він міг не обирати свідомо.
  const savedTheme = localStorage.getItem("theme"); // "dark", "light" або null
  applyTheme(savedTheme === null ? isDark() : savedTheme === "dark");

  themeBtn.addEventListener("click", () => {
    const next = !isDark();
    applyTheme(next);
    localStorage.setItem("theme", next ? "dark" : "light");
  });
}