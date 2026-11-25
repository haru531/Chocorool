// إعدادات الأسعار والنكهات (سهلة التعديل مستقبلاً)
const PRICING_CONFIG = {
  currency: "ل.س",
  baseCookiePrice: 150,   // سعر القطعة الواحدة
  toppingPrice: 50,       // سعر كل إضافة
  estimatedTime: "25 - 35 دقيقة",
  whatsappNumber: "963956925128" // بدون علامة +
};

const FLAVORS = [
  {
    id: "choc-chips",
    name: "شوكلت شيبس",
    primaryColor: "#5D3A1A",
    secondaryColor: "#3E2723"
  },
  {
    id: "dark-choc",
    name: "دارك شوكلت",
    primaryColor: "#2B1810",
    secondaryColor: "#1A0E09"
  },
  {
    id: "red-velvet",
    name: "ريد فلفت",
    primaryColor: "#A61C28",
    secondaryColor: "#F7EFEA"
  },
  {
    id: "white-choc",
    name: "شوكلت بيضاء",
    primaryColor: "#FAF3E3",
    secondaryColor: "#E8D8B9"
  },
  {
    id: "kinder",
    name: "كندر",
    primaryColor: "#8D5524",
    secondaryColor: "#FFFDF9"
  },
  {
    id: "lotus",
    name: "لوتس",
    primaryColor: "#C67D3B",
    secondaryColor: "#E3A869"
  }
];

// حالة الطلب
let quantity = 1;
const selectedFlavors = new Set();

// عناصر الصفحة
const bowlsGrid = document.getElementById("bowlsGrid");
const toppingsLayer = document.getElementById("toppingsLayer");
const cookieDough = document.getElementById("cookieDough");
const scoopedBall = document.getElementById("scoopedBall");
const tableArea = document.getElementById("tableArea");
const bowlsSection = document.getElementById("bowlsSection");
const orderControls = document.getElementById("orderControls");
const ovenArea = document.getElementById("ovenArea");
const ovenGlow = document.getElementById("ovenGlow");
const bakingTray = document.getElementById("bakingTray");
const bakingCookie = document.getElementById("bakingCookie");
const ovenTimer = document.getElementById("ovenTimer");
const bakingStatus = document.getElementById("bakingStatus");
const stageInstruction = document.getElementById("stageInstruction");

const qtyValue = document.getElementById("qtyValue");
const totalPriceEl = document.getElementById("totalPrice");
const decreaseQtyBtn = document.getElementById("decreaseQty");
const increaseQtyBtn = document.getElementById("increaseQty");
const resetOrderBtn = document.getElementById("resetOrderBtn");
const startBakeBtn = document.getElementById("startBakeBtn");

const receiptBackdrop = document.getElementById("receiptBackdrop");
const receiptDetails = document.getElementById("receiptDetails");
const receiptTotal = document.getElementById("receiptTotal");
const receiptTime = document.getElementById("receiptTime");
const whatsappOrderBtn = document.getElementById("whatsappOrderBtn");
const newOrderBtn = document.getElementById("newOrderBtn");

// رسم SVG لكل زبدية
function createBowlSVG(flavor) {
  return `
    <svg class="bowl-svg" viewBox="0 0 120 92" aria-hidden="true">
      <defs>
        <linearGradient id="ceramicOuter-${flavor.id}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FFFFFF" />
          <stop offset="55%" stop-color="#F6EFE4" />
          <stop offset="100%" stop-color="#D4BC9E" />
        </linearGradient>
        <linearGradient id="ceramicRim-${flavor.id}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#EFE4D6" />
          <stop offset="100%" stop-color="#C7A988" />
        </linearGradient>
        <radialGradient id="toppingMound-${flavor.id}" cx="45%" cy="30%" r="65%">
          <stop offset="0%" stop-color="${flavor.primaryColor}" />
          <stop offset="100%" stop-color="${flavor.secondaryColor}" />
        </radialGradient>
      </defs>

      <ellipse cx="60" cy="83" rx="34" ry="6" fill="rgba(62, 39, 35, 0.18)" />
      <path d="M34 73 Q60 80 86 73 L82 78 Q60 83 38 78 Z" fill="#C8AC8C" />
      <path d="M14 34 Q16 74 60 74 Q104 74 106 34 Z"
            fill="url(#ceramicOuter-${flavor.id})"
            stroke="#A67B55"
            stroke-width="2.4" />
      <ellipse cx="60" cy="34" rx="44" ry="11" fill="#E8D8C5" stroke="#B58B65" stroke-width="1.8" />
      <path d="M22 35 Q60 15 98 35 Q86 43 60 43 Q34 43 22 35 Z"
            fill="url(#toppingMound-${flavor.id})" />
      <circle cx="42" cy="30" r="4.5" fill="${flavor.secondaryColor}" />
      <circle cx="58" cy="26" r="5" fill="${flavor.primaryColor}" stroke="rgba(255,255,255,0.22)" stroke-width="1" />
      <circle cx="74" cy="31" r="4.2" fill="${flavor.secondaryColor}" />
      <circle cx="51" cy="35" r="3.8" fill="${flavor.secondaryColor}" />
      <path d="M13 34 Q60 46 107 34"
            fill="none"
            stroke="url(#ceramicRim-${flavor.id})"
            stroke-width="4"
            stroke-linecap="round" />
      <path d="M25 45 Q28 62 39 67"
            fill="none"
            stroke="#FFFFFF"
            stroke-width="2.8"
            stroke-linecap="round"
            opacity="0.65" />
    </svg>
  `;
}

// بناء زبديات النكهات
function renderBowls() {
  bowlsGrid.innerHTML = "";
  FLAVORS.forEach((flavor) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "bowl-card";
    if (selectedFlavors.has(flavor.id)) {
      card.classList.add("active");
    }
    card.dataset.id = flavor.id;
    card.innerHTML = `
      ${createBowlSVG(flavor)}
      <span class="bowl-name">${flavor.name}</span>
      <span class="bowl-tag">+${PRICING_CONFIG.toppingPrice} ${PRICING_CONFIG.currency}</span>
    `;

    card.addEventListener("click", () => toggleFlavor(flavor, card));
    bowlsGrid.appendChild(card);
  });
}

// إضافة أو إزالة نكهة عند النقر على الزبدية
function toggleFlavor(flavor, cardEl) {
  cardEl.classList.remove("pop");
  void cardEl.offsetWidth;
  cardEl.classList.add("pop");

  if (selectedFlavors.has(flavor.id)) {
    selectedFlavors.delete(flavor.id);
    cardEl.classList.remove("active");
    removeToppingBits(flavor.id);
  } else {
    selectedFlavors.add(flavor.id);
    cardEl.classList.add("active");
    addToppingBits(flavor);
  }

  cookieDough.classList.remove("knead");
  void cookieDough.offsetWidth;
  cookieDough.classList.add("knead");

  updatePriceDisplay();
}

// إضافة قطع النكهة بصرياً فوق العجينة
function addToppingBits(flavor) {
  const positions = [
    { top: "22%", left: "30%", size: 14 },
    { top: "36%", left: "58%", size: 12 },
    { top: "55%", left: "26%", size: 13 },
    { top: "62%", left: "54%", size: 15 },
    { top: "42%", left: "42%", size: 11 },
    { top: "26%", left: "50%", size: 10 }
  ];

  positions.forEach((pos, idx) => {
    const bit = document.createElement("span");
    bit.className = "topping-bit";
    bit.dataset.flavor = flavor.id;
    bit.style.top = pos.top;
    bit.style.left = pos.left;
    bit.style.width = `${pos.size}px`;
    bit.style.height = `${pos.size}px`;
    bit.style.background = idx % 2 === 0 ? flavor.primaryColor : flavor.secondaryColor;
    bit.style.animationDelay = `${idx * 0.04}s`;
    toppingsLayer.appendChild(bit);
  });
}

function removeToppingBits(flavorId) {
  const bits = toppingsLayer.querySelectorAll(`[data-flavor="${flavorId}"]`);
  bits.forEach((b) => b.remove());
}

// حساب السعر الإجمالي
function calculateTotal() {
  const baseTotal = quantity * PRICING_CONFIG.baseCookiePrice;
  const toppingsTotal = selectedFlavors.size * PRICING_CONFIG.toppingPrice * quantity;
  return baseTotal + toppingsTotal;
}

function updatePriceDisplay() {
  qtyValue.textContent = quantity;
  totalPriceEl.textContent = `${calculateTotal()} ${PRICING_CONFIG.currency}`;
}

// إعادة ضبط الطلب الحالي (زر إعادة تشكيل الطلب)
function clearCurrentOrder() {
  selectedFlavors.clear();
  quantity = 1;
  toppingsLayer.innerHTML = "";
  updatePriceDisplay();
  renderBowls();

  cookieDough.classList.remove("knead");
  void cookieDough.offsetWidth;
  cookieDough.classList.add("knead");
  stageInstruction.textContent = "انقر على الزبديات لإضافة النكهات فوق العجينة";
}

if (resetOrderBtn) {
  resetOrderBtn.addEventListener("click", clearCurrentOrder);
}

// التحكم بالكمية
decreaseQtyBtn.addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    updatePriceDisplay();
  }
});

increaseQtyBtn.addEventListener("click", () => {
  quantity++;
  updatePriceDisplay();
});

// تسلسل: أخذ العجينة -> اختفاء الزبديات -> ظهور الفرن -> الفاتورة
startBakeBtn.addEventListener("click", () => {
  startBakeBtn.disabled = true;
  stageInstruction.textContent = "يتم أخذ قسم من العجينة وتشكيلها...";
  scoopedBall.classList.add("scooping");

  setTimeout(() => {
    bowlsSection.classList.add("vanish");
    orderControls.classList.add("hidden");
    tableArea.classList.add("hidden");

    ovenArea.classList.add("visible");
    ovenArea.setAttribute("aria-hidden", "false");
    stageInstruction.textContent = "الكوكيز داخل الفرن الآن...";

    setTimeout(() => {
      bakingTray.classList.add("inside");
      ovenGlow.classList.add("on");
      bakingStatus.textContent = "يُخبز بحرارة مثالية...";
      bakingCookie.classList.add("baked");
    }, 300);

    let seconds = 4;
    ovenTimer.textContent = `00:0${seconds}`;
    const countdown = setInterval(() => {
      seconds--;
      ovenTimer.textContent = `00:0${Math.max(seconds, 0)}`;
      if (seconds <= 0) {
        clearInterval(countdown);
        bakingStatus.textContent = "جاهز! نجهز فاتورتك...";
        setTimeout(showReceipt, 550);
      }
    }, 1000);
  }, 950);
});

// إظهار ورقة الفاتورة المنبثقة
function showReceipt() {
  const chosenNames = FLAVORS
    .filter((f) => selectedFlavors.has(f.id))
    .map((f) => f.name);

  const flavorsText = chosenNames.length > 0 ? chosenNames.join("، ") : "كوكيز سادة (بدون إضافات)";
  const baseCost = quantity * PRICING_CONFIG.baseCookiePrice;
  const toppingsCost = selectedFlavors.size * PRICING_CONFIG.toppingPrice * quantity;
  const grandTotal = baseCost + toppingsCost;

  receiptDetails.innerHTML = `
    <div class="receipt-row">
      <span>عدد القطع:</span>
      <strong>${quantity} قطعة (${baseCost} ${PRICING_CONFIG.currency})</strong>
    </div>
    <div class="receipt-row">
      <span>الإضافات المختارة:</span>
      <strong>${flavorsText}</strong>
    </div>
    <div class="receipt-row">
      <span>تكلفة الإضافات:</span>
      <strong>${toppingsCost} ${PRICING_CONFIG.currency}</strong>
    </div>
  `;

  receiptTotal.textContent = `${grandTotal} ${PRICING_CONFIG.currency}`;
  receiptTime.textContent = PRICING_CONFIG.estimatedTime;

  const msgLines = [
    "مرحباً Chocorool، أود تأكيد طلب كوكيز:",
    `- عدد القطع: ${quantity}`,
    `- الإضافات: ${flavorsText}`,
    `- السعر الإجمالي: ${grandTotal} ${PRICING_CONFIG.currency}`,
    `- الوقت المتوقع: ${PRICING_CONFIG.estimatedTime}`
  ];
  const encodedMsg = encodeURIComponent(msgLines.join("\n"));
  const waBase = PRICING_CONFIG.whatsappNumber
    ? `https://wa.me/${PRICING_CONFIG.whatsappNumber}?text=${encodedMsg}`
    : `https://wa.me/?text=${encodedMsg}`;
  whatsappOrderBtn.href = waBase;

  receiptBackdrop.classList.add("show");
  receiptBackdrop.setAttribute("aria-hidden", "false");
}

// إعادة ضبط المشهد لطلب جديد بعد الفاتورة
newOrderBtn.addEventListener("click", () => {
  clearCurrentOrder();

  receiptBackdrop.classList.remove("show");
  receiptBackdrop.setAttribute("aria-hidden", "true");

  ovenArea.classList.remove("visible");
  ovenArea.setAttribute("aria-hidden", "true");
  ovenGlow.classList.remove("on");
  bakingTray.classList.remove("inside");
  bakingCookie.classList.remove("baked");

  scoopedBall.classList.remove("scooping");
  tableArea.classList.remove("hidden");
  bowlsSection.classList.remove("vanish");
  orderControls.classList.remove("hidden");

  startBakeBtn.disabled = false;
});

// التحكم بالقائمة الجانبية
const menuToggle = document.getElementById("menuToggle");
const sideDrawer = document.getElementById("sideDrawer");
const drawerBackdrop = document.getElementById("drawerBackdrop");
const drawerClose = document.getElementById("drawerClose");

function openDrawer() {
  if (!sideDrawer || !drawerBackdrop) return;
  sideDrawer.classList.add("open");
  drawerBackdrop.classList.add("open");
  sideDrawer.setAttribute("aria-hidden", "false");
}

function closeDrawer() {
  if (!sideDrawer || !drawerBackdrop) return;
  sideDrawer.classList.remove("open");
  drawerBackdrop.classList.remove("open");
  sideDrawer.setAttribute("aria-hidden", "true");
}

if (menuToggle) menuToggle.addEventListener("click", openDrawer);
if (drawerClose) drawerClose.addEventListener("click", closeDrawer);
if (drawerBackdrop) drawerBackdrop.addEventListener("click", closeDrawer);

if (sideDrawer) {
  sideDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}

// تشغيل أولي
renderBowls();
updatePriceDisplay();