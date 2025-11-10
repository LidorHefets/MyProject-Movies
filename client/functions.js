// functions.js

// פונקציית עזר: החזרת מחרוזת בטוחה לתצוגה (מניעת תווים "בעייתיים")
function safeText(v) {
  return String(v ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

// פונקציית עזר: גזירת טקסטים ארוכים לתצוגה נעימה
function truncate(text, max = 120) {
  const s = String(text ?? '');
  return s.length > max ? s.slice(0, max).trim() + '…' : s;
}

// פונקציית עזר: קבלת URL לתמונה עם נפילה ל-placeholder אם חסר/נכשל
function getPhotoUrl(m) {
  const url = m.photoUrl || m.photoURL || m.PhotoURL || '';
  return url || 'https://via.placeholder.com/300x420?text=No+Image';
}

// אלמנט כרטיס סרט ב-HTML (כתוכן מחרוזת)
function createMovieCard(movie) {
  const id          = Number(movie.id ?? movie.Id ?? 0);
  const title       = safeText(movie.title ?? movie.Title ?? 'ללא שם');
  const rating      = Number(movie.rating ?? movie.Rating ?? 0);
  const year        = Number(movie.releaseYear ?? movie.ReleaseYear ?? movie.year ?? 0) || '';
  const genre       = safeText(movie.genre ?? movie.Genre ?? '');
  const language    = safeText(movie.language ?? movie.Language ?? '');
  const director    = safeText(movie.director ?? movie.Director ?? '');
  const description = safeText(truncate(movie.description ?? movie.Description ?? '', 150));
  const imgSrc      = getPhotoUrl(movie);

  // כפתור ה-Wish List ייקלט ב-index.js באמצעות האזנה דלגטיבית
  return `
    <article class="movie-card" dir="rtl">
      <div class="movie-poster">
        <img src="${imgSrc}" alt="כרזת הסרט: ${title}"
             onerror="this.onerror=null;this.src='https://via.placeholder.com/300x420?text=No+Image';">
      </div>
      <div class="movie-body">
        <h3 class="movie-title">${title}</h3>
        <div class="movie-meta">
          ${year ? `<span class="chip year">${year}</span>` : ''}
          ${genre ? `<span class="chip genre">${genre}</span>` : ''}
          ${language ? `<span class="chip lang">${language}</span>` : ''}
          <span class="chip rating">⭐ ${rating.toFixed(1)}</span>
        </div>
        ${director ? `<div class="movie-director"><strong>במאי/ת:</strong> ${director}</div>` : ''}
        ${description ? `<p class="movie-desc">${description}</p>` : ''}
        <div class="movie-actions">
          <button class="wishlist-btn" data-movie-id="${id}" type="button" aria-label="הוסף לרשימת משאלות">
            Add to Wish List
          </button>
        </div>
      </div>
    </article>
  `;
}

// רינדור רשימת סרטים לתוך קונטיינר נתון
// שימוש: displayMovies(allMovies, document.getElementById('movie-container'));
function displayMovies(movies, container) {
  if (!container) return;
  if (!Array.isArray(movies) || movies.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        לא נמצאו סרטים להצגה.
      </div>`;
    return;
  }

  // בניית ה-HTML כמחרוזת אחת לטובת ביצועים
  const html = movies.map(createMovieCard).join('');
  container.innerHTML = `
    <div class="movies-grid">
      ${html}
    </div>
  `;
}

// ייצוא גלובלי במידת הצורך (אם תרצה להשתמש בקבצים אחרים ללא bundler)
window.displayMovies = window.displayMovies || displayMovies;
