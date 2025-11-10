// index.js

// עזר: מיפוי אובייקט סרט מהשרת → פורמט ה-render בלקוח
// בצד שרת: PhotoURL (P,U,R,L גדולים), בצד לקוח ייתכן photoUrl קטן
function mapServerMovieToClient(m) {
  return {
    id: m.id,
    title: m.title,
    rating: m.rating,
    releaseYear: m.releaseYear,
    photoUrl: m.photoUrl || m.photoURL || m.PhotoURL || ''
  };
}

// ------------------------------------------------------
// תצוגת פתיחה: כל הסרטים מהקובץ המקומי movies.js
document.addEventListener('DOMContentLoaded', () => {
  const movieContainer = document.getElementById('movie-container');
  if (typeof displayMovies === 'function' && Array.isArray(window.AllMovies)) {
    displayMovies(AllMovies, movieContainer);
  } else {
    movieContainer.innerHTML = `
      <div style="color:#b00">
        לא נמצאו allMovies או displayMovies. ודא ש-movies.js ו-functions.js נטענים.
      </div>`;
  }

  initTabs();
  initWishlist(movieContainer);
  initFilters();
  initCastForm();
});

// ------------------------------------------------------
// ניווט טאבים בסיסי
function initTabs() {
  const nav = document.querySelector('nav');
  if (!nav) return;
  nav.addEventListener('click', (e) => {
    const btn = e.target.closest('button[data-tab]');
    if (!btn) return;
    const tab = btn.dataset.tab;

    ['tab-all','tab-filters','tab-wishlist','tab-cast'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
    const target = document.getElementById(`tab-${tab}`);
    if (target) target.style.display = '';
  });
}

// ------------------------------------------------------
// Wish List: הוספה (POST) + טעינה מהשרת (GET)
function initWishlist(movieContainer) {
  // האזנה לכפתורי "Add to Wish List" שנוצרים דינמית בכרטיסים
  movieContainer.addEventListener('click', async (e) => {
    const btn = e.target.closest('.wishlist-btn'); // בכרטיסים שמיוצרים ב-functions.js
    if (!btn) return;

    const id = Number(btn.dataset.movieId);
    if (!Number.isFinite(id)) return alert('זיהוי סרט לא תקין');

    // חיפוש הסרט מתוך allMovies המקומי להצבה ב-POST
    const movie = Array.isArray(window.allMovies) ? allMovies.find(m => Number(m.id) === id) : null;
    if (!movie) return alert('הסרט לא נמצא ברשימת המקור');

    // בניית גוף הבקשה לפי השרת (שמות שדות תואמים למחלקת Movie.cs)
    const payload = {
      id: Number(movie.id),
      title: movie.title ?? '',
      rating: Number(movie.rating ?? 0),
      income: Number(movie.income ?? 0),
      duration: Number(movie.duration ?? movie.Duration ?? 0),
      language: movie.language ?? '',
      description: movie.description ?? '',
      director: movie.director ?? '',
      releaseYear: Number(movie.releaseYear ?? movie.year ?? 0),
      genre: movie.genre ?? '',
      photoURL: movie.photoURL || movie.PhotoURL || movie.photoUrl || '' // בצד שרת: PhotoURL
    };

    try {
      const resp = await fetch('/api/movies', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(payload)
      });

      if (resp.ok) {
        btn.textContent = 'Added ✓';
        btn.disabled = true;
        return;
      }

      if (resp.status === 409) {
        // קיים כבר בשרת
        btn.textContent = 'כבר ברשימה';
        btn.disabled = true;
        return;
      }

      // ניסיון לקרוא הודעת שגיאה מהשרת
      let data = {};
      try { data = await resp.json(); } catch {}
      alert('שגיאה בהוספה: ' + (data.message || resp.statusText));

    } catch (err) {
      alert('שגיאת רשת: ' + err.message);
    }
  });

  // טעינת ה-Wish List מהשרת (GET api/movies) לתוך הטאב המתאים
  const loadBtn = document.getElementById('loadWishlistBtn');
  const listContainer = document.getElementById('wishlist-container');
  if (loadBtn && listContainer) {
    loadBtn.addEventListener('click', async () => {
      listContainer.innerHTML = 'טוען...';
      try {
        const resp = await fetch('https://localhost:7285/api/Movies');
        if (!resp.ok) throw new Error('סטטוס ' + resp.status);
        const serverList = await resp.json();

        if (typeof displayMovies !== 'function') {
          listContainer.innerHTML = '<div>displayMovies לא מוגדר</div>';
          return;
        }

        const mapped = Array.isArray(serverList) ? serverList.map(mapServerMovieToClient) : [];
        listContainer.innerHTML = '';
        displayMovies(mapped, listContainer);

      } catch (e) {
        listContainer.innerHTML = 'שגיאה בטעינה: ' + e.message;
      }
    });
  }
}

// ------------------------------------------------------
// סינון: דירוג (Resource Route) + משך (Query String)
function initFilters() {
  const ratingBtn = document.getElementById('filterByRatingBtn');
  const ratingInput = document.getElementById('minRatingInput');
  const durationBtn = document.getElementById('filterByDurationBtn');
  const durationInput = document.getElementById('maxDurationInput');
  const results = document.getElementById('filter-results');

  async function renderListFrom(url) {
    if (!results) return;
    results.innerHTML = 'טוען...';
    try {
      const resp = await fetch(url);
      if (!resp.ok) throw new Error('סטטוס ' + resp.status);
      const serverList = await resp.json();
      if (typeof displayMovies !== 'function') {
        results.innerHTML = '<div>displayMovies לא מוגדר</div>';
        return;
      }
      const mapped = Array.isArray(serverList) ? serverList.map(mapServerMovieToClient) : [];
      results.innerHTML = '';
      displayMovies(mapped, results);
    } catch (e) {
      results.innerHTML = 'שגיאה: ' + e.message;
    }
  }

  if (ratingBtn && ratingInput) {
    ratingBtn.addEventListener('click', () => {
      const val = Number(ratingInput.value);
      if (Number.isNaN(val) || val < 0 || val > 10) {
        alert('הכנס דירוג בין 0 ל-10');
        return;
        }
      renderListFrom(`/api/movies/rating/${val}`);
    });
  }

  if (durationBtn && durationInput) {
    durationBtn.addEventListener('click', () => {
      const val = Number(durationInput.value);
      if (Number.isNaN(val) || val <= 0) {
        alert('הכנס משך חיובי בדקות');
        return;
      }
      renderListFrom(`/api/movies/duration?maxDuration=${encodeURIComponent(val)}`);
    });
  }
}

// ------------------------------------------------------
// טופס Cast עם ולידציות צד-לקוח (ללא שרת כרגע)
function initCastForm() {
  const form = document.getElementById('castForm');
  const list = document.getElementById('cast-list');
  if (!form || !list) return;

  const castArr = [];

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameEl = document.getElementById('castName');
    const roleEl = document.getElementById('castRole');
    const yearEl = document.getElementById('castYear');

    // ניקוי שגיאות קודמות
    form.querySelectorAll('.error').forEach(s => s.textContent = '');

    let valid = true;

    const name = (nameEl.value || '').trim();
    if (!name || name.length < 2) {
      valid = false;
      const span = form.querySelector('[data-for="castName"]');
      if (span) span.textContent = 'שם חייב לפחות 2 תווים';
    }

    const role = (roleEl.value || '').trim();
    if (!role || role.length < 2) {
      valid = false;
      const span = form.querySelector('[data-for="castRole"]');
      if (span) span.textContent = 'תפקיד חייב לפחות 2 תווים';
    }

    let year = (yearEl.value || '').trim();
    if (year) {
      const y = Number(year);
      if (Number.isNaN(y) || y < 1900 || y > 2100) {
        valid = false;
        const span = form.querySelector('[data-for="castYear"]');
        if (span) span.textContent = 'שנה בין 1900–2100';
      } else {
        year = String(y);
      }
    } else {
      year = null;
    }

    if (!valid) return;

    const item = { name, role, year };
    castArr.push(item);

    // כאן בעתיד: fetch('/api/cast', { method:'POST', body: JSON.stringify(item) ... })
    // כרגע הדמיה בלבד:
    // console.log('CAST POST (simulate):', item);

    list.innerHTML = castArr
      .map(c => `• ${c.name} — ${c.role}${c.year ? ` (${c.year})` : ''}`)
      .map(line => `<div>${line}</div>`)
      .join('');

    form.reset();
  });
}
