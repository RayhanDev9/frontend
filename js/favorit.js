const API_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/api/events";
const STORAGE_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/storage/";

// Ambil elemen berdasarkan ID DOM
const emptyState = document.getElementById("empty-state");
const dataState = document.getElementById("data-state");
// Pastikan kamu punya variabel wadahPoster, misalnya:
const wadahPoster = document.getElementById("tempat-poster");

// ==========================================
// 1. LOGIKA TOGGLE EMPTY STATE & DATA STATE
// ==========================================
function toggleState(hasData) {
  if (hasData) {
    emptyState.classList.add("hidden"); // Sembunyikan state kosong
    dataState.classList.remove("hidden"); // Tampilkan wadah card
  } else {
    emptyState.classList.remove("hidden"); // Tampilkan state kosong
    dataState.classList.add("hidden"); // Sembunyikan wadah card
  }
}

// ==========================================
// 2. FUNGSI RENDER CARD KE HTML
// ==========================================
function renderCards(dataArray) {
  // Jika dataArray bernilai null, undefined, atau panjangnya 0 -> Tampilkan Empty State
  if (!dataArray || dataArray.length === 0) {
    toggleState(false);
    return;
  }

  // Jika ada data -> Tampilkan Data State
  toggleState(true);

  function cardFungsi(acara) {
    const hargaTeks =
      acara.harga == 0
        ? "Gratis"
        : `Rp ${parseInt(acara.harga).toLocaleString("id-ID")}`;

    let paletWarnaHTML = "";

    // Perbaikan: STORAGE_URL diganti ke STORAGE_BASE_URL
    return `
      <div data-id="${acara.id}" class="card-acara w-[100%] xs:w-80 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 flex flex-col cursor-pointer group max-sm:mx-auto">
          
          <div class="h-48 bg-slate-100 w-full relative overflow-hidden">
              <div class="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
                  <img src="${STORAGE_BASE_URL}${acara.gambar_poster}" alt="${acara.judul}" class="w-full h-full object-cover">
              </div>
              <div class="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded shadow-sm uppercase tracking-wider">
                  ${acara.kategori || "ACARA"}
              </div>
          </div>

          <div class="p-5 flex flex-col flex-grow">
              <div class="flex items-center justify-between gap-x-2 text-sm text-blue-600 font-semibold mb-3">
                    <span class="font-semibold inline-block text-black/50">${hargaTeks}</span>
                   <div class="flex items-center gap-x-2">
                  <svg class="w-4 h-4 shrink-0" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                  </svg>
                  <span>${acara.tanggal_acara}</span>
                </div>
              </div>
              
              <h3 class="text-lg font-bold text-slate-900 leading-snug line-clamp-2 mb-3 transition-colors ">
                  ${acara.judul}
              </h3>
              
              ${paletWarnaHTML}
              
              <div class="mt-auto flex items-start gap-x-2 text-sm text-slate-500 pt-3 border-t border-slate-100">
                  <svg class="w-4 h-4 shrink-0 mt-0.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                  <div class="flex justify-between w-full items-center">
                    <span class="line-clamp-1 w-2/3">${acara.link_action || "Lokasi belum ditentukan"}</span>
                  </div>
              </div>
          </div>
      </div>
    `;
  }

  // Menggabungkan array dan render ke DOM
  const semuaCardHTML = dataArray.map((acara) => cardFungsi(acara)).join("");
  wadahPoster.innerHTML = semuaCardHTML;
}

// ==========================================
// 3. INISIALISASI (FETCH API)
// ==========================================
const initFavorit = async () => {
  async function fetchSemuaAcara() {
    const apiUrl = API_BASE_URL;

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true",
          Accept: "application/json",
        },
      });

      if (!response.ok) throw new Error("Gagal mengambil data dari API");

      const result = await response.json();
      console.info(result.data);
      return result.data !== undefined ? result.data : result;
    } catch (error) {
      console.error("Error Mengambil Semua Acara:", error);
      return null;
    }
  }

  // Secara default (sementara ambil API/loading), anggap data kosong dulu
  toggleState(false);

  // Ambil semua data karena data favorit masih kosong
  const dataAcara = await fetchSemuaAcara();

  // Render hasilnya (fungsi ini akan otomatis memanggil toggleState ke `true` jika data sukses didapat)
  renderCards(dataAcara);
};

// Jalankan sistem
initFavorit();

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
    // Ambil data user yang sedang login dari memori browser
    const userAktif = JSON.parse(localStorage.getItem("user_mading"));

    // Tangkap elemen tombol unggah
    const btnDesktop = document.getElementById("btn-unggah-desktop");
    const btnMobile = document.getElementById("btn-unggah-mobile");

    // Jika user belum login ATAU user bukan admin (misal: mahasiswa)
    if (!userAktif || userAktif.role !== "admin") {
      // Sembunyikan tombol dengan class 'hidden' bawaan Tailwind
      if (btnDesktop) btnDesktop.classList.add("hidden");
      if (btnMobile) btnMobile.classList.add("hidden");
    } else {
      // Jika Admin, pastikan tombolnya muncul
      if (btnDesktop) btnDesktop.classList.remove("hidden");
      if (btnMobile) btnMobile.classList.remove("hidden");
    }
  };

  // Panggil fungsinya saat web dibuka
  checkUserRole();
};
header();
