// ============================================================
// KOTA ROOM FINDER - MAIN APP
// Firebase + Authentication + Roles + Common Utilities
// ============================================================

import { initializeApp } from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

import {
  getAuth,
  onAuthStateChanged,
  signOut
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

import {
  getFirestore,
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp
} from
  "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

import { firebaseConfig } from "./firebase-config.js";


// ============================================================
// FIREBASE INITIALIZATION
// ============================================================

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);


// ============================================================
// FIREBASE SHORTCUT OBJECT
// Existing pages can continue using A and F.
// ============================================================

const A = {
  getAuth,
  onAuthStateChanged,
  signOut
};


const F = {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  limit,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  setDoc,
  serverTimestamp
};


// ============================================================
// LANGUAGE
// ============================================================

const translations = {

  hi: {
    home: "Home",
    findRooms: "Find Rooms",
    listProperty: "List Property",
    about: "About",
    contact: "Contact",
    login: "Login",
    register: "Register",

    studentDashboard: "My Enquiries",
    ownerDashboard: "Owner Dashboard",
    adminPanel: "Admin Panel",

    logout: "Logout",

    searchRooms: "Search Rooms",

    student: "Student",
    owner: "House Owner",
    admin: "Admin"
  },


  en: {
    home: "Home",
    findRooms: "Find Rooms",
    listProperty: "List Property",
    about: "About",
    contact: "Contact",
    login: "Login",
    register: "Register",

    studentDashboard: "My Enquiries",
    ownerDashboard: "Owner Dashboard",
    adminPanel: "Admin Panel",

    logout: "Logout",

    searchRooms: "Search Rooms",

    student: "Student",
    owner: "House Owner",
    admin: "Admin"
  }

};


// Default language

let currentLanguage =
  localStorage.getItem("language") || "hi";


function t(key) {

  return (
    translations[currentLanguage]?.[key]
    ||
    translations.en[key]
    ||
    key
  );

}


// ============================================================
// TOAST
// ============================================================

function toast(message, type = "info") {

  let container = document.getElementById("toast-container");

  if (!container) {

    container = document.createElement("div");

    container.id = "toast-container";

    container.style.position = "fixed";
    container.style.left = "50%";
    container.style.bottom = "25px";
    container.style.transform = "translateX(-50%)";
    container.style.zIndex = "99999";
    container.style.width = "min(92%, 420px)";

    document.body.appendChild(container);

  }

  const item = document.createElement("div");

  item.textContent = message;

  item.style.padding = "13px 16px";
  item.style.marginTop = "8px";
  item.style.borderRadius = "12px";

  item.style.background =
    type === "error"
      ? "#dc2626"
      : type === "success"
        ? "#16a34a"
        : "#0f172a";

  item.style.color = "#ffffff";
  item.style.fontWeight = "700";
  item.style.fontSize = "14px";
  item.style.boxShadow = "0 10px 30px rgba(0,0,0,.18)";

  container.appendChild(item);

  setTimeout(() => {
    item.remove();
  }, 3500);

}


// ============================================================
// CURRENCY
// ============================================================

function inr(value) {

  const number = Number(value);

  if (!Number.isFinite(number)) {
    return "₹0";
  }

  return "₹" + number.toLocaleString("en-IN");

}


// ============================================================
// HTML ESCAPE
// ============================================================

function escapeHTML(value = "") {

  return String(value).replace(
    /[&<>"']/g,
    char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[char]
  );

}


// ============================================================
// GET USER ROLE
// ============================================================

async function getRole(user) {

  if (!user) {
    return null;
  }

  // ----------------------------------------------------------
  // First check Admin Custom Claim
  // ----------------------------------------------------------

  try {

    const token = await user.getIdTokenResult(true);

    if (token?.claims?.admin === true) {
      return "admin";
    }

  } catch (error) {

    console.warn("Admin claim check failed:", error);

  }

  // ----------------------------------------------------------
  // Then check users collection
  // ----------------------------------------------------------

  try {

    const userRef = doc(db, "users", user.uid);

    const snapshot = await getDoc(userRef);

    if (snapshot.exists()) {

      const data = snapshot.data();

      const role = data.role;

      // New naming

      if (
        role === "student" ||
        role === "owner" ||
        role === "admin"
      ) {
        return role;
      }

      // Old naming compatibility

      if (role === "customer") {
        return "student";
      }

      if (role === "worker") {
        return "owner";
      }

    }

  } catch (error) {

    console.error("Role read error:", error);

  }

  return null;

}


// ============================================================
// ROLE LABEL
// ============================================================

function roleLabel(role) {

  if (role === "admin") {
    return t("admin");
  }

  if (role === "owner") {
    return t("owner");
  }

  if (role === "student") {
    return t("student");
  }

  return "";

}


// ============================================================
// HOME / ROLE DESTINATION
// ============================================================

function home(role) {

  if (role === "admin") {
    window.location.href = "./admin.html";
    return;
  }

  if (role === "owner") {
    window.location.href = "./owner-dashboard.html";
    return;
  }

  if (role === "student") {
    window.location.href = "./index.html";
    return;
  }

  window.location.href = "./index.html";

}


// ============================================================
// AUTH GUARD
// ============================================================

async function guard(allowedRoles = []) {

  return new Promise(resolve => {

    const unsubscribe = onAuthStateChanged(auth, async user => {

      if (!user) {

        window.location.href = "./login.html";

        resolve(null);

        return;

      }

      const role = await getRole(user);

      if (
        allowedRoles.length &&
        !allowedRoles.includes(role)
      ) {

        toast("Aapko is page ka access nahi hai.", "error");

        setTimeout(() => {
          home(role);
        }, 800);

        resolve(null);

        return;

      }

      resolve({
        user,
        role
      });

    });

  });

}


// ============================================================
// LOGOUT
// ============================================================

async function logout() {

  try {

    await signOut(auth);

    window.location.href = "./index.html";

  } catch (error) {

    console.error("Logout error:", error);

    toast("Logout nahi ho paya.", "error");

  }

}


// ============================================================
// COMMON NAVIGATION
// ============================================================

function renderChrome(user = null, role = null) {

  // ----------------------------------------------------------
  // Remove previous chrome
  // ----------------------------------------------------------

  const old = document.getElementById("app-chrome");

  if (old) {
    old.remove();
  }

  // ----------------------------------------------------------
  // Header
  // ----------------------------------------------------------

  const header = document.createElement("header");

  header.id = "app-chrome";

  header.innerHTML = `

    <style>

      #app-chrome {
        position: relative;
        z-index: 1000;
        background: #ffffff;
        border-bottom: 1px solid #e2e8f0;
        box-shadow: 0 2px 10px rgba(15,23,42,.04);
      }

      #app-chrome * {
        box-sizing: border-box;
      }

      .krf-nav-wrap {
        width: min(1180px, 92%);
        margin: auto;
        min-height: 68px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 15px;
      }

      .krf-brand {
        display: flex;
        align-items: center;
        gap: 9px;
        text-decoration: none;
        color: #0f172a;
        font-weight: 900;
        font-size: 18px;
        white-space: nowrap;
      }

      .krf-brand-icon {
        width: 38px;
        height: 38px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 11px;
        background: #2563eb;
        color: white;
        font-size: 20px;
      }

      .krf-nav-links {
        display: flex;
        align-items: center;
        gap: 5px;
      }

      .krf-nav-links a,
      .krf-nav-button {
        border: 0;
        background: transparent;
        color: #475569;
        text-decoration: none;
        font: inherit;
        font-size: 14px;
        font-weight: 700;
        padding: 9px 10px;
        border-radius: 9px;
        cursor: pointer;
      }

      .krf-nav-links a:hover,
      .krf-nav-button:hover {
        background: #eff6ff;
        color: #2563eb;
      }

      .krf-nav-primary {
        background: #2563eb !important;
        color: white !important;
      }

      .krf-nav-primary:hover {
        background: #1d4ed8 !important;
      }

      .krf-nav-user {
        display: flex;
        align-items: center;
        gap: 7px;
      }

      .krf-nav-menu {
        display: none;
        border: 0;
        background: #f1f5f9;
        color: #0f172a;
        width: 42px;
        height: 42px;
        border-radius: 10px;
        font-size: 20px;
        cursor: pointer;
      }

      @media (max-width: 850px) {

        .krf-nav-menu {
          display: block;
        }

        .krf-nav-links {
          display: none;
          position: absolute;
          top: 68px;
          left: 4%;
          right: 4%;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 14px;
          padding: 10px;
          box-shadow: 0 15px 35px rgba(15,23,42,.12);
          flex-direction: column;
          align-items: stretch;
        }

        .krf-nav-links.open {
          display: flex;
        }

        .krf-nav-links a,
        .krf-nav-button {
          width: 100%;
          text-align: left;
        }

      }

    </style>


    <div class="krf-nav-wrap">

      <a class="krf-brand" href="./index.html">

        <span class="krf-brand-icon">🏠</span>

        <span>Kota Room Finder</span>

      </a>


      <button
        class="krf-nav-menu"
        id="krfNavMenu"
        type="button"
        aria-label="Menu"
      >
        ☰
      </button>


      <nav class="krf-nav-links" id="krfNavLinks">

        <a href="./index.html">
          ${escapeHTML(t("home"))}
        </a>

        <a href="./workers.html">
          ${escapeHTML(t("findRooms"))}
        </a>

        <a href="./about.html">
          ${escapeHTML(t("about"))}
        </a>

        <a href="./contact.html">
          ${escapeHTML(t("contact"))}
        </a>


        ${
          role === "owner"
            ? `
              <a href="./join.html" class="krf-nav-primary">
                + ${escapeHTML(t("listProperty"))}
              </a>

              <a href="./owner-dashboard.html">
                ${escapeHTML(t("ownerDashboard"))}
              </a>
            `
            : ""
        }


        ${
          role === "student"
            ? `
              <a href="./customer-dashboard.html">
                ${escapeHTML(t("studentDashboard"))}
              </a>
            `
            : ""
        }


        ${
          role === "admin"
            ? `
              <a href="./admin.html" class="krf-nav-primary">
                ${escapeHTML(t("adminPanel"))}
              </a>
            `
            : ""
        }


        ${
          user
            ? `
              <button
                class="krf-nav-button"
                id="krfLogoutBtn"
                type="button"
              >
                ${escapeHTML(t("logout"))}
              </button>
            `
            : `
              <a href="./login.html">
                ${escapeHTML(t("login"))}
              </a>

              <a href="./register.html" class="krf-nav-primary">
                ${escapeHTML(t("register"))}
              </a>
            `
        }

      </nav>

    </div>

  `;

  // Put header at top of body

  document.body.prepend(header);

  // Mobile menu

  const menuButton = document.getElementById("krfNavMenu");

  const navLinks = document.getElementById("krfNavLinks");

  if (menuButton && navLinks) {

    menuButton.addEventListener("click", () => {
      navLinks.classList.toggle("open");
    });

  }

  // Logout

  const logoutButton = document.getElementById("krfLogoutBtn");

  if (logoutButton) {
    logoutButton.addEventListener("click", logout);
  }

}


// ============================================================
// LANGUAGE SETTER
// ============================================================

function setLanguage(language) {

  if (!translations[language]) {
    language = "hi";
  }

  currentLanguage = language;

  localStorage.setItem("language", language);

  window.location.reload();

}


// ============================================================
// LOCATION HELPERS
// ============================================================

function getCurrentLocation() {

  return new Promise((resolve, reject) => {

    if (!navigator.geolocation) {

      reject(new Error("Geolocation supported nahi hai."));

      return;

    }

    navigator.geolocation.getCurrentPosition(
      position => {

        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        });

      },

      error => {
        reject(error);
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );

  });

}


// ============================================================
// DISTANCE CALCULATOR
// ============================================================

function distanceKm(lat1, lon1, lat2, lon2) {

  const toRad = value => value * Math.PI / 180;

  const earthRadius = 6371;

  const dLat = toRad(Number(lat2) - Number(lat1));

  const dLon = toRad(Number(lon2) - Number(lon1));

  const a =
    Math.sin(dLat / 2) ** 2
    +
    Math.cos(toRad(Number(lat1)))
    *
    Math.cos(toRad(Number(lat2)))
    *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadius * c;

}


// ============================================================
// FORMAT DISTANCE
// ============================================================

function formatDistance(distance) {

  const value = Number(distance);

  if (!Number.isFinite(value)) {
    return "";
  }

  if (value < 1) {
    return Math.round(value * 1000) + " m";
  }

  return value.toFixed(1) + " km";

}


// ============================================================
// GET URL PARAMETERS
// ============================================================

function params() {

  return new URLSearchParams(window.location.search);

}


// ============================================================
// FIRESTORE TIMESTAMP
// ============================================================

function now() {

  return serverTimestamp();

}


// ============================================================
// NOTIFICATION HELPERS
// ============================================================

// Frontend pages can use this helper when the
// backend/admin is allowed to create notifications.

async function createNotification(userId, data = {}) {

  if (!userId) {
    throw new Error("Notification userId missing.");
  }

  return addDoc(
    collection(db, "notifications"),
    {
      userId,
      type: data.type || "general",
      title: data.title || "Notification",
      message: data.message || "",
      relatedId: data.relatedId || "",
      read: false,
      createdAt: serverTimestamp()
    }
  );

}


// ============================================================
// EXPORTS
// ============================================================

export {

  app,

  auth,

  db,

  A,

  F,

  translations,

  getRole,

  roleLabel,

  home,

  guard,

  logout,

  renderChrome,

  toast,

  inr,

  escapeHTML,

  getCurrentLocation,

  distanceKm,

  formatDistance,

  params,

  now,

  createNotification,

  setLanguage

};
