console.log("app.js підключено");
// ==========================================================
// Проєкт: Кіносвіт — онлайн-кінотеатр (варіант 4)
// Файл: js/app.js — дані фільмів і функції їх обробки (LR8)
// ==========================================================

// ===== 1. Дані =====
// const забороняє лише перепризначити змінну films на інше значення,
// а сам масив залишається змінним, тому films.push(...) працює.
// Тривалість — у хвилинах, бюджет і збори — у млн $ (округлено).
// Зали й час сеансів — навчальні.
const films = [
    {
        id: 1,
        title: "Втеча з Шоушенка",
        director: "Френк Дарабонт",
        year: 1994,
        duration: 142,
        rating: 9.3,
        budget: 25,
        gross: 29,
        genre: "драма",
        session: { hall: "Зал 1", time: "12:00" },
        actors: ["Тім Роббінс", "Морган Фріман", "Боб Гантон"]
    },
    {
        id: 2,
        title: "Хрещений батько",
        director: "Френсіс Форд Коппола",
        year: 1972,
        duration: 175,
        rating: 9.2,
        budget: 6,
        gross: 250,
        genre: "кримінал",
        session: { hall: "Зал 3", time: "14:00" },
        actors: ["Марлон Брандо", "Аль Пачино", "Джеймс Каан", "Роберт Дювалл"]
    },
    {
        id: 3,
        title: "Інтерстеллар",
        director: "Крістофер Нолан",
        year: 2014,
        duration: 169,
        rating: 8.7,
        budget: 165,
        gross: 730,
        genre: "фантастика",
        session: { hall: "Зал 2", time: "16:30" },
        actors: ["Меттью Макконегі", "Енн Гетевей", "Джессіка Честейн"]
    },
    {
        id: 4,
        title: "Темний лицар",
        director: "Крістофер Нолан",
        year: 2008,
        duration: 152,
        rating: 9.0,
        budget: 185,
        gross: 1006,
        genre: "бойовик",
        session: { hall: "Зал 1", time: "19:00" },
        actors: ["Крістіан Бейл", "Гіт Леджер", "Аарон Екгарт", "Майкл Кейн"]
    },
    {
        id: 5,
        title: "Форрест Гамп",
        director: "Роберт Земекіс",
        year: 1994,
        duration: 142,
        rating: 8.8,
        budget: 55,
        gross: 678,
        genre: "драма",
        session: { hall: "Зал 2", time: "13:15" },
        actors: ["Том Генкс", "Робін Райт"]
    },
    {
        id: 6,
        title: "Гладіатор",
        director: "Рідлі Скотт",
        year: 2000,
        duration: 155,
        rating: 8.5,
        budget: 103,
        gross: 460,
        genre: "історичний",
        session: { hall: "VIP-зал", time: "20:00" },
        actors: ["Расселл Кроу", "Хоакін Фенікс", "Конні Нільсен"]
    }
];

// ===== 2. Допоміжні функції =====

// Записує текст у елемент за id; масив рядків склеює переносами.
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

// ===== 3. Функції обробки =====

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

// ===== 4. Виведення на сторінку =====
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