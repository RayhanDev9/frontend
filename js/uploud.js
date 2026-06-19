const initMobileMenu = () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  console.info(mobileMenu);

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener("click", () => {
    // 1. Hapus state "Tertutup" (Transparan & terangkat)
    mobileMenu.classList.toggle("opacity-0");
    mobileMenu.classList.toggle("pointer-events-none");
    mobileMenu.classList.toggle("-translate-y-4");

    // 2. Tambahkan state "Terbuka" (Kelihatan penuh & posisi normal)
    mobileMenu.classList.toggle("opacity-100");
    mobileMenu.classList.toggle("pointer-events-auto");
    mobileMenu.classList.toggle("translate-y-0");
  });
};

initMobileMenu();
