// // index.js
// import { AllMovies } from "./movies.js";
// import { renderMovies, addToWish, removeFromWish, isInWish, initMoviesPage } from "./functions.js";

// document.addEventListener("DOMContentLoaded", () => {
//   const root = document.getElementById("cards");
//   renderMovies(AllMovies, root);

//   // האזנה לכפתורי ה-Wish (האצלת אירועים)
//   root.addEventListener("click", (ev) => {
//     const btn = ev.target.closest(".btn-wish");
//     if (!btn) return;

//     const id = Number(btn.dataset.id);
//     const movie = AllMovies.find((m) => m.id === id);
//     if (!movie) return;

//     if (isInWish(id)) {
//       removeFromWish(id);
//       btn.textContent = "Add to Wish List";
//       btn.setAttribute("aria-pressed", "false");
//     } else {
//       // כאן בהמשך נחליף ל-AJAX לשרת
//       addToWish(movie);
//       btn.textContent = "✓ ברשימה";
//       btn.setAttribute("aria-pressed", "true");
//     }
//   });
// });


// index.js
import { AllMovies } from "./movies.js";
// 🔻 שיניתי את הייבוא - אנחנו צריכים רק את initMoviesPage
import { initMoviesPage } from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {
  // 🔻 פשוט קוראים לפונקציה שמרכזת את כל הלוגיקה של הדף
  initMoviesPage(AllMovies);
});




