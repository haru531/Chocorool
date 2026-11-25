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

// إغلاق القائمة تلقائياً عند الضغط على أي رابط بداخلها
if (sideDrawer) {
  sideDrawer.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeDrawer);
  });
}