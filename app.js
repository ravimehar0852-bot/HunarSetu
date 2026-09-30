import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import * as A from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import * as F from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


// ===============================
// FIREBASE
// ===============================

export const app = initializeApp(firebaseConfig);

export const auth = A.getAuth(app);

export const db = F.getFirestore(app);

export { A, F };


// ===============================
// LANGUAGE
// ===============================

const T = {
  hi: {
    home: "होम",
    services: "सेवाएँ",
    workers: "कामगार खोजें",
    login: "लॉगिन",
    start: "शुरू करें",
    logout: "लॉगआउट",
    dash: "डैशबोर्ड",
    about: "हमारे बारे में",
    contact: "संपर्क",
    menu: "मेन्यू"
  },

  en: {
    home: "Home",
    services: "Services",
    workers: "Find Workers",
    login: "Login",
    start: "Get Started",
    logout: "Logout",
    dash: "Dashboard",
    about: "About",
    contact: "Contact",
    menu: "Menu"
  }
};

export let lang = localStorage.getItem("lang") || "hi";

export const t = (key) => {
  return T[lang]?.[key] || T.en[key] || key;
};


// ===============================
// HELPERS
// ===============================

export const inr = (number) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0
  }).format(Number(number) || 0);
};


export function toast(message) {
  let element = document.getElementById("toast");

  if (!element) {
    element = document.createElement("div");
    element.id = "toast";
    element.setAttribute("role", "status");

    document.body.appendChild(element);
  }

  element.textContent = message;

  element.style.cssText = `
    display: block;
    position: fixed;
    bottom: 24px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 99999;
    background: #0f172a;
    color: #ffffff;
    padding: 14px 20px;
    border-radius: 12px;
    box-shadow: 0 8px 30px #0002;
    max-width: calc(100% - 32px);
    font-size: 14px;
  `;

  clearTimeout(element._hideTimer);

  element._hideTimer = setTimeout(() => {
    element.style.display = "none";
  }, 3500);
}


// ===============================
// USER ROLE
// ===============================

export async function getRole(user) {
  const token = await user.getIdTokenResult();

  if (token.claims.admin === true) {
    return "admin";
  }

  const snapshot = await F.getDoc(
    F.doc(db, "users", user.uid)
  );

  return snapshot.exists()
    ? snapshot.data().role || null
    : null;
}


export const home = (role) => {
  const destinations = {
    admin: "/index.html",
    worker: "/join.html",
    customer: "/index.html"
  };

  return destinations[role] || "/index.html";
};

// ===============================
// NAVBAR CSS
// ===============================

function addNavigationStyles() {
  if (document.getElementById("hunarsetu-nav-styles")) {
    return;
  }

  const style = document.createElement("style");

  style.id = "hunarsetu-nav-styles";

  style.textContent = `
    .nav {
      position: sticky;
      top: 0;
      z-index: 9999;
      width: 100%;
      background: #ffffff;
      border-bottom: 1px solid #e2e8f0;
      box-shadow: 0 2px 12px rgba(15,23,42,.04);
    }

    .nav .wrap {
      min-height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 22px;
    }

    .nav a {
      color: #0f172a;
      text-decoration: none;
      font-weight: 600;
      font-size: 14px;
    }

    .nav .logo {
      font-size: 24px;
      font-weight: 800;
      white-space: nowrap;
      margin-right: auto;
    }

    .nav .logo b {
      color: #0f766e;
    }

    .nav select {
      padding: 9px 12px;
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      background: #ffffff;
      color: #0f172a;
    }

    .nav .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 11px 17px;
      border-radius: 999px;
      background: #f59e0b;
      color: #0f172a;
      font-weight: 800;
    }

    .nav-menu-button {
      display: none;
      width: 44px;
      height: 44px;
      border: 1px solid #e2e8f0;
      border-radius: 12px;
      background: #ffffff;
      color: #0f172a;
      font-size: 25px;
      cursor: pointer;
    }

    .nav-links {
      display: flex;
      align-items: center;
      gap: 22px;
    }

    .nav-links a:hover {
      color: #0f766e;
    }

    .nav-auth {
      display: flex;
      align-items: center;
      gap: 14px;
    }

    @media (max-width: 760px) {
      .nav .wrap {
        min-height: 66px;
        gap: 12px;
        flex-wrap: wrap;
        padding-top: 10px;
        padding-bottom: 10px;
      }

      .nav-menu-button {
        display: inline-flex;
        align-items: center;
        justify-content: center;
      }

      .nav-links {
        display: none;
        width: 100%;
        order: 3;
        flex-direction: column;
        align-items: stretch;
        gap: 0;
        padding: 8px 0;
      }

      .nav-links.open {
        display: flex;
      }

      .nav-links a {
        display: block;
        padding: 14px 8px;
        border-top: 1px solid #e2e8f0;
      }

      .nav-auth {
        width: 100%;
        order: 4;
        display: flex;
        flex-wrap: wrap;
        padding: 8px 0;
      }

      .nav-auth:empty {
        display: none;
      }

      .nav select {
        margin-left: auto;
        max-width: 110px;
      }
    }
  `;

  document.head.appendChild(style);
}


// ===============================
// NAVIGATION + FOOTER
// ===============================

export function renderChrome() {
  addNavigationStyles();

  const headerHTML = `
    <header class="nav">
      <div class="wrap">

        <a class="logo" href="/">
          Hunar<b>Setu</b>
        </a>

        <button
          type="button"
          class="nav-menu-button"
          id="navMenuButton"
          aria-label="Open navigation menu"
          aria-expanded="false"
        >
          ☰
        </button>

        <nav class="nav-links" id="navLinks">
          <a href="/">${t("home")}</a>
          <a href="/services.html">${t("services")}</a>
          <a href="/workers.html">${t("workers")}</a>
          <a href="/about.html">${t("about")}</a>
          <a href="/contact.html">${t("contact")}</a>
        </nav>

        <select id="lg" aria-label="Language">
          <option value="hi">हिंदी</option>
          <option value="en">English</option>
        </select>

        <div class="nav-auth" id="au">
          <a href="/login.html">${t("login")}</a>
          <a class="btn" href="/register.html">${t("start")}</a>
        </div>

      </div>
    </header>
  `;

  const footerHTML = `
    <footer>
      <div class="wrap">
        <a class="logo" href="/">Hunar<b>Setu</b></a>

        <p>
          Local Skills. Local Work. Local Growth.
        </p>

        <p>
          Jhalawar, Rajasthan, India
        </p>

        <div class="footer-links">
          <a href="/about.html">About</a> ·
          <a href="/contact.html">Contact</a> ·
          <a href="/privacy-policy.html">Privacy</a> ·
          <a href="/terms.html">Terms</a> ·
          <a href="/cancellation-refund-policy.html">
            Cancellation &amp; Refunds
          </a>
        </div>

        <small>
          © ${new Date().getFullYear()} HunarSetu. All rights reserved.
        </small>
      </div>
    </footer>
  `;


  // Use existing containers when available.
  // Otherwise, create the header and footer.

  let header = document.getElementById("site-header");

  if (header) {
    header.innerHTML = headerHTML;
  } else if (!document.querySelector("body > .nav")) {
    document.body.insertAdjacentHTML("afterbegin", headerHTML);
  }

  let footer = document.getElementById("site-footer");

  if (footer) {
    footer.innerHTML = footerHTML;
  } else if (!document.querySelector("body > footer")) {
    document.body.insertAdjacentHTML("beforeend", footerHTML);
  }


  // MOBILE MENU

  const menuButton = document.getElementById("navMenuButton");
  const navLinks = document.getElementById("navLinks");

  if (menuButton && navLinks) {
    menuButton.addEventListener("click", () => {
      const isOpen = navLinks.classList.toggle("open");

      menuButton.setAttribute(
        "aria-expanded",
        String(isOpen)
      );

      menuButton.textContent = isOpen ? "✕" : "☰";
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuButton.setAttribute("aria-expanded", "false");
        menuButton.textContent = "☰";
      });
    });
  }


  // LANGUAGE SWITCHER

  const languageSelect = document.getElementById("lg");

  if (languageSelect) {
    languageSelect.value = lang;

    languageSelect.addEventListener("change", () => {
      localStorage.setItem("lang", languageSelect.value);
      location.reload();
    });
  }


  // AUTHENTICATION STATE

  A.onAuthStateChanged(auth, async (user) => {
    const authElement = document.getElementById("au");

    if (!authElement) return;

    if (!user) {
      authElement.innerHTML = `
        <a href="/login.html">${t("login")}</a>
        <a class="btn" href="/register.html">${t("start")}</a>
      `;

      return;
    }

    try {
      const role = await getRole(user);

      authElement.innerHTML = `
        <a href="${home(role)}">${t("dash")}</a>
        <a href="#" id="lo">${t("logout")}</a>
      `;

      const logoutButton = document.getElementById("lo");

      logoutButton?.addEventListener("click", async (event) => {
        event.preventDefault();

        try {
          await A.signOut(auth);
          location.href = "/";
        } catch (error) {
          console.error("Logout error:", error);
          toast("Logout nahi ho paya. Dobara try karein.");
        }
      });

    } catch (error) {
      console.error("Auth state error:", error);

      authElement.innerHTML = `
        <a href="/login.html">${t("login")}</a>
      `;
    }
  });
}


// ===============================
// PAGE GUARD
// ===============================

export function guard(requiredRole) {
  A.onAuthStateChanged(auth, async (user) => {
    if (!user) {
      location.href = "/login.html";
      return;
    }

    try {
      const role = await getRole(user);

      if (role !== requiredRole) {
        location.href = home(role);
      }
    } catch (error) {
      console.error("Access check failed:", error);
      location.href = "/login.html";
    }
  });
   }
