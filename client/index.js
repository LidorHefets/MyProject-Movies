

// // index.js
// import { AllMovies } from "./movies.js";
// // 🔻 שיניתי את הייבוא - אנחנו צריכים רק את initMoviesPage
// import { initMoviesPage } from "./functions.js";

// document.addEventListener("DOMContentLoaded", () => {
//   // 🔻 פשוט קוראים לפונקציה שמרכזת את כל הלוגיקה של הדף
//   initMoviesPage(AllMovies);
// });


// // index.js
// import { AllMovies } from "./movies.js";

// // 🔻 מייבאים את שתי פונקציות האתחול מ-functions.js
// import { initMoviesPage, initCastPage, initWishPage } from "./functions.js";

// document.addEventListener("DOMContentLoaded", () => {
//   // === בודק איזה עמוד זה ===

//   const moviesRoot = document.getElementById("cards");
//   const castForm = document.getElementById("formAddCast");
//   const wishRoot = document.getElementById("wish"); // למקרה שתרצה לאחד גם את wishList.js

//   if (moviesRoot) {
//     // 1. אם אנחנו בעמוד הסרטים (יש אלמנט "cards")
//     initMoviesPage(AllMovies);
//   } else if (castForm) {
//     // 2. אם אנחנו בעמוד השחקנים (יש אלמנט "formAddCast")
//     initCastPage();
//   } else if (wishRoot) {
//     // 3. אם אנחנו בעמוד המועדפים (יש אלמנט "wish")
//     initWishPage();
//   }
// });


// index.js
import { AllMovies } from "./movies.js";

// מייבאים את כל פונקציות האתחול מ-functions.js
import { initMoviesPage, initCastPage, initWishPage } from "./functions.js";

document.addEventListener("DOMContentLoaded", () => {
  // === בודק איזה עמוד זה ===
  // מחפש מזהים ייחודיים לכל עמוד
  const moviesRoot = document.getElementById("cards");
  const castForm = document.getElementById("formAddCast");
  const wishRoot = document.getElementById("wish");

  // === מפעיל את הפונקציה הנכונה ===
  if (moviesRoot) {
    // 1. אם אנחנו בעמוד הסרטים (מצאנו id="cards")
    initMoviesPage(AllMovies);
  } else if (castForm) {
    // 2. אם אנחנו בעמוד השחקנים (מצאנו id="formAddCast")
    initCastPage();
  } else if (wishRoot) {
    // 3. אם אנחנו בעמוד המועדפים (מצאנו id="wish")
    initWishPage();
  }
});



