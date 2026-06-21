const header = () => {
  const initMobileMenu = () => {
    const menuBtn = document.getElementById("mobile-menu-btn");
    const mobileMenu = document.getElementById("mobile-menu");

    if (!menuBtn || !mobileMenu) return;

    menuBtn.addEventListener("click", () => {
      mobileMenu.classList.toggle("opacity-0");
      mobileMenu.classList.toggle("pointer-events-none");
      mobileMenu.classList.toggle("-translate-y-4");
      mobileMenu.classList.toggle("opacity-100");
      mobileMenu.classList.toggle("pointer-events-auto");
      mobileMenu.classList.toggle("translate-y-0");
    });
  };
  initMobileMenu();

  const checkUserRole = () => {
    const userAktif = JSON.parse(localStorage.getItem("user_mading"));

    const btnDesktop = document.getElementById("btn-unggah-desktop");
    const btnMobile = document.getElementById("btn-unggah-mobile");

    if (!userAktif || userAktif.role !== "admin") {
      if (btnDesktop) btnDesktop.classList.add("hidden");
      if (btnMobile) btnMobile.classList.add("hidden");
    } else {
      // Jika Admin, pastikan tombolnya muncul
      if (btnDesktop) btnDesktop.classList.remove("hidden");
      if (btnMobile) btnMobile.classList.remove("hidden");
    }
  };

  checkUserRole();
};
header();
