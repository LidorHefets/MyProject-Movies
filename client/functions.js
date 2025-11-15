// functions.js

// ====== פורמט ועזר ======
const moneyFmt = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});
const safe = (v, fb = "—") => ((v ?? "") === "" ? fb : v);

// ====== Wish List API (localStorage בשלב זה) ======
const WISH_KEY = "wishList";

export function getWishList() {
  try {
    return JSON.parse(localStorage.getItem(WISH_KEY)) ?? [];
  } catch {
    return [];
  }
}

export function isInWish(id) {
  return getWishList().some((m) => m.id === id);
}

export function addToWish(movie) {
  const list = getWishList();
  if (!list.some((m) => m.id === movie.id)) {
    list.push(movie);
    localStorage.setItem(WISH_KEY, JSON.stringify(list));
  }
}

export function removeFromWish(id) {
  const list = getWishList().filter((m) => m.id !== id);
  localStorage.setItem(WISH_KEY, JSON.stringify(list));
}

export function clearWish() {
  localStorage.setItem(WISH_KEY, JSON.stringify([]));
}

// ====== תמונת ברירת מחדל במקרה שגיאה ======
export function fallbackPoster(ev) {
  ev.target.src =
    "data:image/svg+xml;charset=utf-8," +
    encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" width="400" height="600">
        <rect width="100%" height="100%" fill="#0b1020"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle"
              font-family="Arial" font-size="22" fill="#6b7280">No Image</text>
      </svg>
    `);
}

// ====== כרטיס בספריית הסרטים (כולל כפתור Add) ======
export function createMovieCard(m) {
  const income = Number.isFinite(m.income) ? moneyFmt.format(m.income) : "—";
  const inWish = isInWish(m.id);
  return `
    <article class="card" aria-label="${safe(m.title, "סרט")}">
      <img class="poster" src="${safe(m.photoUrl, "")}" alt="פוסטר: ${safe(m.title, "")}">
      <div class="content">
        <div class="title">
          <h3 title="${safe(m.title)}">${safe(m.title)}</h3>
          <div class="rating" title="דירוג">${safe(m.rating, "?")}</div>
        </div>
        <div class="meta">
          <span class="chip" title="שנה">${safe(m.releaseYear, "—")}</span>
          <span class="chip" title="משך">${safe(m.duration, "—")} דק׳</span>
          <span class="chip" title="שפה">${safe(m.language, "—")}</span>
          <span class="chip" title="ז׳אנר">${safe(m.genre, "—")}</span>
        </div>
        <p class="desc">${safe(m.description, "אין תיאור לסרט זה.")}</p>
        <div class="row">
          <span>הכנסות:</span>
          <b>${income}</b>
        </div>

        <button class="btn-wish" data-id="${m.id}" aria-pressed="${inWish}">
          ${inWish ? "✓ ברשימה" : "Add to Wish List"}
        </button>
      </div>
    </article>
  `;
}

// ====== כרטיס למסך Wish List (כולל כפתור הסרה) ======
export function createWishCard(m) {
  const income = Number.isFinite(m.income) ? moneyFmt.format(m.income) : "—";
  return `
    <article class="card" aria-label="${safe(m.title, "סרט")}">
      <img class="poster" src="${safe(m.photoUrl, "")}" alt="פוסטר: ${safe(m.title, "")}">
      <div class="content">
        <div class="title">
          <h3 title="${safe(m.title)}">${safe(m.title)}</h3>
          <div class="rating" title="דירוג">${safe(m.rating, "?")}</div>
        </div>
        <div class="meta">
          <span class="chip">${safe(m.releaseYear, "—")}</span>
          <span class="chip">${safe(m.duration, "—")} דק׳</span>
          <span class="chip">${safe(m.genre, "—")}</span>
        </div>
        <p class="desc">${safe(m.description)}</p>
        <div class="row">
          <span>הכנסות:</span>
          <b>${income}</b>
        </div>

        <button class="btn-remove" data-id="${m.id}">הסר מהרשימה</button>
      </div>
    </article>
  `;
}

// ====== רנדרים ======
export function renderMovies(list, root) {
  if (!root) return;
  if (!Array.isArray(list) || list.length === 0) {
    root.innerHTML = `<div class="empty">לא נמצאו סרטים להצגה.</div>`;
    return;
  }
  root.innerHTML = list.map(createMovieCard).join("");
  root.querySelectorAll("img.poster").forEach((img) =>
    img.addEventListener("error", fallbackPoster, { once: true })
  );
}

export function renderWish(root) {
  const list = getWishList();
  if (!root) return;
  if (list.length === 0) {
    root.innerHTML = `<div class="empty">הרשימה ריקה.</div>`;
    return;
  }
  root.innerHTML = list.map(createWishCard).join("");
  root.querySelectorAll("img.poster").forEach((img) =>
    img.addEventListener("error", fallbackPoster, { once: true })
  );
}


// אתחול דף Wish List (במקום wishList.js)
export function initWishPage() {
  // 🔻 אין כאן יותר "DOMContentLoaded" 🔻
  const root = document.getElementById("wish");
  if (!root) return;
  renderWish(root); // <-- קריאה לציור ראשוני

  // הסרה מרשימה
  root.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".btn-remove");
    if (!btn) return;
    const id = Number(btn.dataset.id);
    removeFromWish(id);
    renderWish(root); // ריענון אחרי הסרה
  });
}


// ====== סינון סרטים ======

// לפי דירוג מינימלי
export function filterByRating(movies, minRating) {
  if (!minRating || isNaN(minRating)) return movies;
  return movies.filter((m) => m.rating >= minRating);
}

// לפי משך מקסימלי
export function filterByDuration(movies, maxDuration) {
  if (!maxDuration || isNaN(maxDuration)) return movies;
  return movies.filter((m) => m.duration <= maxDuration);
}



// ====== אתחול דף הסרטים (movies.html) ======
// מקבל את מערך הסרטים (כדי לא לתלות את functions.js ב-movies.js)
export function initMoviesPage(movies) {
  // 🔻 אין כאן יותר "DOMContentLoaded"
  const root = document.getElementById("cards");
  if (!root) return;

  const inputRating = document.getElementById("minRating");
  const inputDuration = document.getElementById("maxDuration");
  const btnFilter = document.getElementById("btnFilter");
  const btnClear = document.getElementById("btnClearFilters");

  // ציור ראשוני
  renderMovies(movies, root);

  // סינון בלחיצה
  btnFilter?.addEventListener("click", () => {
    const minR = parseFloat(inputRating.value);
    const maxD = parseFloat(inputDuration.value);

    let filtered = [...movies];
    if (!isNaN(minR)) filtered = filterByRating(filtered, minR);
    if (!isNaN(maxD)) filtered = filterByDuration(filtered, maxD);

    renderMovies(filtered, root);
  });

  // ניקוי סינון
  btnClear?.addEventListener("click", () => {
    inputRating.value = "";
    inputDuration.value = "";
    renderMovies(movies, root);
  });

  // האזנה לכפתורי Add/Remove (אותו חלק שהיה)
  root.addEventListener("click", (ev) => {
    const btn = ev.target.closest(".btn-wish");
    if (!btn) return;

    const id = Number(btn.dataset.id);
    const movie = movies.find((m) => m.id === id);
    if (!movie) return;

    if (isInWish(id)) {
      removeFromWish(id);
      btn.textContent = "Add to Wish List";
      btn.setAttribute("aria-pressed", "false");
    } else {
      addToWish(movie);
      btn.textContent = "✓ ברשימה";
      btn.setAttribute("aria-pressed", "true");
    }
  });
}


// ===================================
// ====== ניהול שחקנים (Cast) ======
// ===================================

const CAST_KEY = "castMembers";

// ====== Cast API (localStorage) ======

/** מחזיר את רשימת השחקנים מה"שרת" (localStorage) */
export function getCastList() {
  try {
    return JSON.parse(localStorage.getItem(CAST_KEY)) ?? [];
  } catch {
    return [];
  }
}

/** שומר את הרשימה המלאה בחזרה ל"שרת" */
function saveCastList(list) {
  localStorage.setItem(CAST_KEY, JSON.stringify(list));
}

/** מוסיף שחקן חדש לרשימה */
export function addCastMember(member) {
  const list = getCastList();
  list.push(member);
  saveCastList(list);
}

// ====== Cast Rendering ======

/** יוצר HTML עבור כרטיס שחקן בודד */
function createCastCard(member) {
  const photo = member.photoUrl || `https://via.placeholder.com/200x300.png?text=${encodeURIComponent(member.name)}`;
  
  return `
    <article class="card cast-card" aria-label="${member.name}">
      <img class="poster" src="${photo}" alt="תמונה של ${member.name}">
      <div class="content">
        <h3 class="cast-name">${member.name}</h3>
        ${member.character ? `<p class="cast-char">דמות: ${member.character}</p>` : ''}
      </div>
    </article>
  `;
}

/** מרנדר את רשימת השחקנים לתוך ה-DOM */
function renderCastList(rootElement) {
  const list = getCastList();
  if (!rootElement) return;
  
  if (list.length === 0) {
    rootElement.innerHTML = `<div class="empty">אין שחקנים ברשימה.</div>`;
  } else {
    rootElement.innerHTML = list.map(createCastCard).reverse().join("");
  }
}

// ====== אתחול עמוד השחקנים (cast.html) ======
// (בדיוק כמו initMoviesPage, אבל עבור העמוד השני)
export function initCastPage() {
  // 🔻 חשוב: אין כאן "DOMContentLoaded"
  const form = document.getElementById("formAddCast");
  const errorDiv = document.getElementById("formError");
  const listRoot = document.getElementById("castList");

  // 1. רינדור ראשוני של הרשימה הקיימת
  if (listRoot) {
    renderCastList(listRoot);
  }

  // 2. האזנה לאירוע שליחת הטופס
  if (form) {
    form.addEventListener("submit", (ev) => {
      ev.preventDefault();
      
      const nameInput = document.getElementById("castName");
      const photoUrlInput = document.getElementById("castPhotoUrl");
      const characterInput = document.getElementById("castCharacter");

      const name = nameInput.value.trim();
      const photoUrl = photoUrlInput.value.trim();
      const character = characterInput.value.trim();

      // --- ולידציה ---
      if (name === "") {
        errorDiv.textContent = "שדה 'שם מלא' הוא שדה חובה.";
        nameInput.focus();
        return;
      }

      const newMember = {
        id: Date.now(),
        name: name,
        photoUrl: photoUrl,
        character: character,
      };

      addCastMember(newMember);

      errorDiv.textContent = "";
      form.reset();
      
      // רינדור מחדש
      renderCastList(listRoot);
      
      nameInput.focus();
    });
  }
}