/* Flavorscape Kitchen – Interactive Frontend JS
   ------------------------------------------------
   Features:
   - Admin login/logout (demo)
   - Add/Delete menu items (stored in localStorage)
   - Smooth scrolling for nav + menu cards
   - Customer Feedback section (stored locally)
   - User login (demo modal)
*/

(() => {
  // 🧩 Helper Functions (moved to top for reuse)
  function openModal(modal) {
    if (modal) modal.setAttribute("aria-hidden", "false");
  }

  function closeModal(modal) {
    if (modal) modal.setAttribute("aria-hidden", "true");
  }

  // 🧾 Initial sample items
  const initial = {
    breakfast: [
  { name: "Masala Dosa", desc: "Crispy dosa with potato masala", price: 80, img: "masaladosa.jpg" },
  { name: "Idli Sambar", desc: "Soft idlis with sambar", price: 60, img: "https://placehold.co/800x600?text=Idli+Sambar" },
  { name: "Egg Omelette", desc: "Spicy omelette with onions", price: 70, img: "https://placehold.co/800x600?text=Egg+Omelette" },
  { name: "Pongal", desc: "Creamy pongal with ghee", price: 75, img: "https://placehold.co/800x600?text=Pongal" }
]
,
    lunch: [
      { name: "Veg Thali", desc: "Assorted vegetables, rice, chapati", price: 150, img: "https://images.unsplash.com/photo-1604908177546-8e1c60b3b3ee?w=800&q=60" },
      { name: "Chicken Biryani", desc: "Spiced chicken biryani", price: 220, img: "https://images.unsplash.com/photo-1604908177527-6f8a1d8e6f4c?w=800&q=60" },
      { name: "Paneer Butter Masala", desc: "Creamy paneer curry", price: 180, img: "https://images.unsplash.com/photo-1604908177526-2b2d36a8d8ae?w=800&q=60" },
      { name: "Lemon Rice", desc: "Tangy lemon rice", price: 90, img: "https://images.unsplash.com/photo-1604908177540-c6f1d2c1d9e5?w=800&q=60" }
    ],
    dinner: [
      { name: "Chapati + Sabzi", desc: "Soft chapati with mixed veg", price: 120, img: "https://images.unsplash.com/photo-1604908177525-3b3e1c9c9b74?w=800&q=60" },
      { name: "Fish Curry Rice", desc: "Southern fish curry with rice", price: 230, img: "https://images.unsplash.com/photo-1604908177523-5d5b1b5b5f0c?w=800&q=60" },
      { name: "Fried Rice", desc: "Veg fried rice with chilli", price: 140, img: "https://images.unsplash.com/photo-1604908177521-1b1a1a1a1a1c?w=800&q=60" },
      { name: "Paneer Tikka", desc: "Grilled paneer cubes", price: 200, img: "https://images.unsplash.com/photo-1604908177519-0a0a0a0a0a0b?w=800&q=60" }
    ],
    snacks: [
      { name: "Samosa", desc: "Crispy potato samosa", price: 35, img: "https://images.unsplash.com/photo-1604908177517-9b9b9b9b9b9a?w=800&q=60" },
      { name: "Vada", desc: "Crispy medu vada", price: 30, img: "https://images.unsplash.com/photo-1604908177515-6c6c6c6c6c6d?w=800&q=60" },
      { name: "Sandwich", desc: "Veg sandwich with chutney", price: 55, img: "https://images.unsplash.com/photo-1604908177513-5e5e5e5e5e5f?w=800&q=60" },
      { name: "Fries", desc: "Crispy potato fries", price: 70, img: "https://images.unsplash.com/photo-1604908177511-4d4d4d4d4d4e?w=800&q=60" }
    ],
special: [
    { name: "Tandoori Chicken", desc: "Juicy grilled chicken with spices", price: 200, offer: 20, img: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?w=800&q=60" },
    { name: "Pasta Alfredo", desc: "Creamy and delicious Italian pasta", price: 180, offer: 20, img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&q=60" },
    { name: "Chocolate Lava Cake", desc: "Rich molten chocolate dessert", price: 150, offer: 20, img: "https://images.unsplash.com/photo-1604908177525-3b3e1c9c9b74?w=800&q=60" },
    { name: "Grilled Paneer Tikka", desc: "Smoky grilled paneer cubes", price: 190, offer: 20, img: "https://images.unsplash.com/photo-1604908177523-5d5b1b5b5f0c?w=800&q=60" }
  ]
  };

  // 🔧 Helpers
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const KEY = "flavorscape_menu_v1";

  function loadMenu() {
    const raw = localStorage.getItem(KEY);
    if (!raw) {
      localStorage.setItem(KEY, JSON.stringify(initial));
      return JSON.parse(JSON.stringify(initial));
    }
    try {
      return JSON.parse(raw);
    } catch {
      localStorage.setItem(KEY, JSON.stringify(initial));
      return JSON.parse(JSON.stringify(initial));
    }
  }

  function saveMenu(menu) {
    localStorage.setItem(KEY, JSON.stringify(menu));
  }

  function placeholderFor(name) {
    return `https://via.placeholder.com/800x600.png?text=${encodeURIComponent(name)}`;
  }

  function escapeHtml(s) {
    return String(s || "").replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  // 🍽 Render category
  function renderCategory(category, container) {
    container.innerHTML = "";
    const menu = loadMenu();
    const items = menu[category] || [];

    items.forEach(it => {
      const card = document.createElement("article");
      card.className = "menu-item";
      card.innerHTML = `
        <div class="item-media" style="background-image:url('${it.img || placeholderFor(it.name)}')"></div>
        <div class="item-body">
          <div class="item-title">
            <div>${escapeHtml(it.name)}</div>
            <div class="item-price">
  ₹${it.offer ? Math.round(it.price * (1 - it.offer / 100)) : Number(it.price).toFixed(0)}
  ${it.offer ? `<span class="offer-tag">${it.offer}% OFF</span>` : ""}
</div>

          </div>
          <p class="item-desc">${escapeHtml(it.desc || "")}</p>
          <div class="item-actions">
            <button class="btn outline small add-btn">Add</button>
            <button class="btn" data-action="details">Details</button>
            ${localStorage.getItem("isAdmin") === "true"
              ? '<button class="btn outline small delete-btn">Delete</button>'
              : ''}
          </div>
        </div>
      `;

      const addBtn = card.querySelector(".add-btn");
      addBtn.addEventListener("click", () => {
      addToCart(it.name, it.price); // 👈 calls your working function
});




      const delBtn = card.querySelector(".delete-btn");
      if (delBtn) {
        delBtn.addEventListener("click", () => {
          if (confirm(`Delete "${it.name}"?`)) {
            const menu = loadMenu();
            menu[category] = menu[category].filter(x => x.name !== it.name);
            saveMenu(menu);
            renderAll();
            toast(`${it.name} deleted successfully`);
          }
        });
      }

      container.appendChild(card);
    });

    if (items.length === 0) {
      container.innerHTML = `<p class="muted">No items in this category yet.</p>`;
    }
  }

  // 🔔 Toast + Popup
  let toastTimer = null;

  function showPopup(message = "Action successful!", type = "success") {
    const popup = document.getElementById("successPopup");
    const msgBox = document.getElementById("popupMessage");
    if (!popup || !msgBox) return;

    popup.classList.remove("success", "error");
    popup.classList.add(type, "show");
    msgBox.textContent = message;

    setTimeout(() => popup.classList.remove("show"), 1800);
  }

  function toast(msg = "", ms = 1800) {
    let el = document.getElementById("simple-toast");
    if (!el) {
      el = document.createElement("div");
      el.id = "simple-toast";
      Object.assign(el.style, {
        position: "fixed", right: "20px", bottom: "20px", padding: "10px 14px",
        background: "linear-gradient(90deg,var(--primary),var(--accent))", color: "#fff",
        borderRadius: "10px", zIndex: 200, boxShadow: "0 8px 30px rgba(0,0,0,0.12)", fontWeight: 700
      });
      document.body.appendChild(el);
    }
    el.textContent = msg;
    el.style.opacity = "1";
    if (toastTimer) clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.style.opacity = "0", ms);
  }

  // 🔁 Render all categories
  function renderAll() {
    $$("[data-category]").forEach(node => {
      const cat = node.getAttribute("data-category");
      renderCategory(cat, node);
    });
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    $("#openAdminPanel").style.display = isAdmin ? "block" : "none";
    $("#logoutAdminBtn").style.display = isAdmin ? "inline-block" : "none";
    const clearBtn = $("#clearFeedback");
    if (clearBtn) clearBtn.style.display = isAdmin ? "inline-block" : "none";
  }

  // 🧭 Smooth scroll
  function setupSmoothScroll() {
    $$("[data-scroll], .menu-card").forEach(btn => {
      btn.addEventListener("click", e => {
        e.preventDefault();
        const target = btn.getAttribute("data-scroll") || btn.getAttribute("data-target");
        const el = document.getElementById(target);
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  // 💬 Feedback section
  const FEEDBACK_KEY = "flavorscape_feedback_v1";
  function loadFeedback() {
    try { return JSON.parse(localStorage.getItem(FEEDBACK_KEY)) || []; }
    catch { return []; }
  }
  function saveFeedback(arr) { localStorage.setItem(FEEDBACK_KEY, JSON.stringify(arr)); }

  function renderFeedback() {
    const list = $("#feedbackList");
    if (!list) return;
    const items = loadFeedback();
    if (items.length === 0) {
      list.innerHTML = `<p class="muted">No feedback yet. Be the first to leave a review!</p>`;
      return;
    }
    list.innerHTML = items.map(fb => `
      <div class="feedback-item">
        <div class="feedback-meta">
          <div class="feedback-name">${escapeHtml(fb.name)}</div>
          <div class="feedback-rating">★ ${escapeHtml(String(fb.rating))}</div>
        </div>
        <p class="feedback-text">${escapeHtml(fb.comment || "")}</p>
        <div class="muted" style="margin-top:0.5rem; font-size:0.85rem;">${new Date(fb.ts).toLocaleString()}</div>
      </div>
    `).join("");
  }

  function setupFeedback() {
    const form = $("#feedbackForm");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const name = $("#fbName").value.trim() || "Anonymous";
      const rating = $("#fbRating").value;
      const comment = $("#fbComment").value.trim() || "";
      if (!rating) return toast("Please select a rating");

      const arr = loadFeedback();
      arr.unshift({ name, rating: Number(rating), comment, ts: Date.now() });
      saveFeedback(arr);
      renderFeedback();
      form.reset();
      toast("Thank you for your feedback!");
    });

    const clearBtn = $("#clearFeedback");
    if (clearBtn) {
      clearBtn.addEventListener("click", () => {
        if (localStorage.getItem("isAdmin") !== "true") return toast("Only admin can clear feedback");
        if (!confirm("Clear all feedback?")) return;
        localStorage.removeItem(FEEDBACK_KEY);
        renderFeedback();
        toast("Feedback cleared");
      });
    }
  }

  // 🧰 Admin modal
  const adminModal = $("#adminModal");
  const adminForm = $("#adminForm");
  const openAdminPanel = $("#openAdminPanel");
  const adminClose = $("#adminClose");
  const adminCancel = $("#adminCancel");

  if (openAdminPanel) openAdminPanel.addEventListener("click", () => openModal(adminModal));
  if (adminClose) adminClose.addEventListener("click", () => closeModal(adminModal));
  if (adminCancel) adminCancel.addEventListener("click", () => closeModal(adminModal));

  adminForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const category = $("#categoryInput").value;
    const name = $("#nameInput").value.trim();
    const desc = $("#descInput").value.trim();
    const price = Number($("#priceInput").value) || 0;
    const img = $("#imgInput").value.trim();

    if (!category || !name) return toast("Please provide category and name");

    const menu = loadMenu();
    menu[category] = menu[category] || [];
    menu[category].unshift({ name, desc, price, img: img || placeholderFor(name) });
    saveMenu(menu);
    renderAll();
    closeModal(adminModal);
    adminForm.reset();
    showPopup("Menu item added successfully!");
  });

  // 🔐 Admin login/logout
  $("#adminLoginBtn")?.addEventListener("click", () => {
    const pass = prompt("Enter admin password (demo):");
    if (pass === "admin123") {
      localStorage.setItem("isAdmin", "true");
      toast("Admin logged in");
      renderAll();
    } else toast("Incorrect password");
  });

  const logoutBtn = document.createElement("button");
  logoutBtn.id = "logoutAdminBtn";
  logoutBtn.textContent = "Logout Admin";
  logoutBtn.className = "btn outline";
  logoutBtn.style.marginLeft = "10px";
  logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("isAdmin");
  localStorage.removeItem("user");
  toast("Logged out");
  renderAll();
  location.reload(); // refresh page to reset header
});

  document.querySelector(".actions").appendChild(logoutBtn);

 // 👤 User login setup + welcome display
// 👤 User login setup + welcome + logout with fade animation
function setupUserLogin() {
  const authModal = document.getElementById("authModal");
  const authForm = document.getElementById("authForm");
  const authClose = document.getElementById("authClose");
  const authCancel = document.getElementById("authCancel");
  const userLoginBtn = document.getElementById("userLoginBtn");
  const userWelcome = document.getElementById("userWelcome");
  const userLogoutBtn = document.getElementById("userLogoutBtn");

  // Helper for smooth show/hide
  function fadeShow(el) {
    el.style.display = "inline-block";
    requestAnimationFrame(() => el.classList.add("show"));
  }
  function fadeHide(el) {
    el.classList.remove("show");
    setTimeout(() => (el.style.display = "none"), 400);
  }

  // 🔄 Check if already logged in
  const existingUser = localStorage.getItem("user");
  if (existingUser) {
    userWelcome.textContent = `Welcome, ${existingUser}`;
    fadeShow(userWelcome);
    fadeShow(userLogoutBtn);
    userLoginBtn.style.display = "none";
  }

  // Open login modal
  if (userLoginBtn) userLoginBtn.addEventListener("click", () => openModal(authModal));
  if (authClose) authClose.addEventListener("click", () => closeModal(authModal));
  if (authCancel) authCancel.addEventListener("click", () => closeModal(authModal));

  // Handle login submit
  if (authForm) {
    authForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const email = document.getElementById("authEmail").value.trim();
      const pass = document.getElementById("authPassword").value.trim();
      if (!email || !pass) return toast("Please enter email and password");

      localStorage.setItem("user", email);
      closeModal(authModal);

      userWelcome.textContent = `Welcome, ${email}`;
      fadeShow(userWelcome);
      fadeShow(userLogoutBtn);
      userLoginBtn.style.display = "none";
      toast(`Welcome, ${email}!`);
    });
  }

  // Handle user logout
  if (userLogoutBtn) {
    userLogoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      fadeHide(userWelcome);
      fadeHide(userLogoutBtn);
      userLoginBtn.style.display = "inline-block";
      toast("You’ve been logged out!");
    });
  }
}

  // 🚀 Initialize
  function boot() {
    renderAll();
    setupSmoothScroll();
    setupFeedback();
    renderFeedback();
    setupUserLogin(); // added here ✅
    window.addEventListener("load", setupOfferPopup);

  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else boot();
/* 🛒 CART SYSTEM */
const CART_KEY = "flavorscape_cart_v1";
function loadCart() {
  try { return JSON.parse(localStorage.getItem(CART_KEY)) || []; }
  catch { return []; }
}
function saveCart(c) {
  localStorage.setItem(CART_KEY, JSON.stringify(c));
}
function updateCartUI() {
  const items = loadCart();
  const list = document.getElementById("cartItems");
  const totalEl = document.getElementById("cartTotal");
  if (!list || !totalEl) return;
  if (items.length === 0) {
    list.innerHTML = `<p class="muted">Cart is empty.</p>`;
    totalEl.textContent = "0";
    return;
  }
  let total = 0;
  list.innerHTML = items.map((it, i) => {
    total += it.price * it.qty;
    return `
      <div class="cart-item">
        <span>${it.name}</span>
        <div class="cart-controls">
          <button data-idx="${i}" data-act="dec">−</button>
          <span>${it.qty}</span>
          <button data-idx="${i}" data-act="inc">+</button>
        </div>
        <span>₹${it.price * it.qty}</span>
      </div>
    `;
  }).join("");
  totalEl.textContent = total.toFixed(0);

  // Quantity control
  list.querySelectorAll("button").forEach(btn => {
    btn.onclick = () => {
      const act = btn.dataset.act;
      const idx = +btn.dataset.idx;
      const cart = loadCart();
      if (act === "inc") cart[idx].qty++;
      if (act === "dec") {
        cart[idx].qty--;
        if (cart[idx].qty <= 0) cart.splice(idx, 1);
      }
      saveCart(cart);
      updateCartUI();
    };
  });
}

function addToCart(name, price) {
  const cart = loadCart();
  const existing = cart.find(x => x.name === name);
  if (existing) existing.qty++;
  else cart.push({ name, price, qty: 1 });
  saveCart(cart);
  updateCartUI();
  toast(`${name} added to cart 🛒`);
}

function setupCart() {
  const panel = document.getElementById("cartPanel");
  const openBtn = document.getElementById("cartBtn");
  const closeBtn = document.getElementById("closeCart");
  const clearBtn = document.getElementById("clearCart");

  openBtn.addEventListener("click", () => {
    panel.classList.toggle("hidden");
    updateCartUI();
  });
  closeBtn.addEventListener("click", () => panel.classList.add("hidden"));
  clearBtn.addEventListener("click", () => {
    localStorage.removeItem(CART_KEY);
    updateCartUI();
    toast("Cart cleared");
  });

  // Connect add buttons (including dynamically loaded ones)
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("add-btn")) {
      const card = e.target.closest(".menu-item, .special-card");
      if (!card) return;
      const name = card.querySelector("h3")?.textContent || "Item";
      const priceText = card.querySelector(".item-price, .price")?.textContent || "0";
      const price = parseInt(priceText.replace(/[^\d]/g, "")) || 0;
      addToCart(name, price);
    }
  });
}
setupCart();

// Run confirm-order + popup-fix only after everything is loaded
window.addEventListener("DOMContentLoaded", () => {
  // ✅ Confirm Order button setup
  const cartFooter = document.querySelector(".cart-footer");
  if (cartFooter) {
    const confirmBtn = document.createElement("button");
    confirmBtn.className = "btn primary small";
    confirmBtn.textContent = "Confirm Order";
    cartFooter.appendChild(confirmBtn);

    confirmBtn.addEventListener("click", () => {
      const items = JSON.parse(localStorage.getItem("flavorscape_cart_v1")) || [];
      if (items.length === 0) {
        alert("Your cart is empty!");
        return;
      }

      const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
      const popup = document.getElementById("successPopup");
      const message = document.getElementById("popupMessage");
      if (message) message.textContent = `✅ Order Confirmed! Total: ₹${total}`;
      if (popup) {
        popup.classList.remove("hidden");
        popup.classList.add("show");
        setTimeout(() => popup.classList.add("hidden"), 2000);
      }

      // Clear cart
      localStorage.removeItem("flavorscape_cart_v1");
      document.getElementById("cartItems").innerHTML = "";
      document.getElementById("cartTotal").textContent = "0";
      toast("Order placed successfully 🎉");
    });
  }
// 🎁 OFFER POPUP – show every time the website opens
function setupOfferPopup() {
  const popup = document.getElementById("offerPopup");
  const closeBtn = document.getElementById("closeOffer");
  const textEl = document.querySelector(".offer-text");
  if (!popup || !closeBtn || !textEl) {
    console.warn("Offer popup elements not found");
    return;
  }

  const discounts = [10, 15, 20, 25, 30];
  const discount = discounts[Math.floor(Math.random() * discounts.length)];
  textEl.innerHTML = `🎉 <strong>${discount}% OFF</strong> on all Special Foods today! 🍝`;

  // Show after short delay
  setTimeout(() => {
    popup.classList.remove("hidden");
    popup.classList.add("show");
  }, 1200);

  // Close button hides popup
  closeBtn.addEventListener("click", () => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  });
}

    window.addEventListener("load", setupOfferPopup);
    setupCart();
  })

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

   // 🚀 Initialize everything
  function boot() {
    renderAll();
    setupSmoothScroll();
    setupFeedback();
    renderFeedback();
    setupUserLogin();
    setupCart();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }

})(); // ✅ closes the main IIFE properly
