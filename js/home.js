// 1. URL API Ngrok dari Back-End & URL Storage untuk Gambar
const API_URL = "https://slab-silenced-riot.ngrok-free.dev/api/events";
// Catatan: Kalau gambar nggak muncul, ganti 127.0.0.1 ini pakai link Ngrok lu juga ya
const STORAGE_URL = "http://127.0.0.1:8000/storage/";

///Tanda
/**
 * Mengambil data acara dari API dengan format response standar
 * @returns {Promise<{success: boolean, data: any, error: string|null}>}
 */
async function fetchEventsData() {
  try {
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true",
        "Content-Type": "application/json",
      },
    });

    // Pengecekan status HTTP (404, 500, dll)
    if (!response.ok) {
      throw new Error(`Server merespon dengan status: ${response.status}`);
    }

    const result = await response.json();

    // Mengembalikan objek sukses
    return {
      success: true,
      data: result.data,
      error: null,
    };
  } catch (error) {
    // Mengembalikan objek gagal
    console.error("Gagal konek ke API:", error);
    return {
      success: false,
      data: [],
      error: error.message,
    };
  }
}

/**
 * Mengurutkan array acara berdasarkan tanggal dan waktu
 * @param {Array} events - Array data acara dari API
 * @returns {Array} - Array yang sudah terurut
 */
function urutkanAcaraTercepat(events) {
  return [...events].sort((a, b) => {
    const dateA = new Date(`${a.tanggal_acara}T${a.waktu_acara}:00`);
    const dateB = new Date(`${b.tanggal_acara}T${b.waktu_acara}:00`);
    return dateA - dateB;
  });
}

// Pastikan kurungnya lengkap seperti ini:
await fetchEventsData();
///Tanda

// 2. Fungsi untuk mengambil dan merender data
const EvenCardLogic = async () => {
  const wadahPoster = document.getElementById("tempat-poster");

  try {
    // Tarik data dari Laravel
    const response = await fetch(API_URL, {
      method: "GET",
      headers: {
        "ngrok-skip-browser-warning": "true", // WAJIB ADA!
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();

    // Hapus tulisan loading
    wadahPoster.innerHTML = "";

    // Cek apakah data kosong
    if (result.data.length === 0) {
      wadahPoster.innerHTML =
        '<p class="col-span-full text-center py-10 text-gray-500">Belum ada acara yang dipublikasikan.</p>';
      return;
    }

    function cardFungsi(acara) {
      const hargaTeks =
        acara.harga == 0
          ? "Gratis"
          : `Rp ${parseInt(acara.harga).toLocaleString("id-ID")}`;

      // ==========================================
      // >>> LOGIKA PEMBUAT PALET WARNA DIMULAI <<<
      // ==========================================
      let paletWarnaHTML = "";

      // ==========================================

      const cardHTML = `
  <div data-id="${acara.id}" class="card-acara w-[100%] xs:w-80 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-slate-300 transition duration-300 flex flex-col cursor-pointer group max-sm:mx-auto">
      
      <div class="h-48 bg-slate-100 w-full relative overflow-hidden">
          <div class="absolute inset-0 flex items-center justify-center text-slate-400 text-sm">
              <img src="${STORAGE_URL}${acara.gambar_poster}" alt="${acara.judul}" class="w-full h-full object-cover">
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

      return cardHTML;
    }
    const semuaCardHTML = result.data
      .map((acara) => {
        // Kita panggil fungsi cardFungsi untuk setiap elemen data
        return cardFungsi(acara);
      })
      .join(""); // Menggabungkan semua array hasil mapping menjadi satu string raksasa

    // Memasukkan ke container hanya satu kali
    wadahPoster.innerHTML = semuaCardHTML;

    // 1. Buat fungsinya di luar
    function initCardClickListener() {
      const containerPoster = document.getElementById("tempat-poster");

      // Guard clause: Hentikan fungsi jika kontainer tidak ditemukan di halaman ini
      if (!containerPoster) return;

      containerPoster.addEventListener("click", (e) => {
        const diklik = e.target.closest(".card-acara");

        if (diklik) {
          const idAcara = diklik.getAttribute("data-id");
          bukaDetail(idAcara);
        }
      });
    }

    initCardClickListener();
  } catch (error) {
    console.error("Gagal konek ke API:", error);
    wadahPoster.innerHTML = `
                    <div class="col-span-full text-center py-20 text-red-400 bg-red-950/20 border border-red-900 rounded-xl">
                        <p class="font-bold mb-2">Gagal Mengambil Data</p>
                        <p class="text-sm">Pastikan server Laravel dan Ngrok lu lagi nyala bro.</p>
                    </div>
                `;
  }
};

// Fungsi dummy buat tombol detail
function bukaDetail(id) {
  // alert("Nanti ini diarahkan ke halaman detail untuk ID Acara: " + id);
  // Contoh implementasi asli nanti: window.location.href = `detail.html?id=${id}`;

  window.location.href = `select-event.html?id=${id}`;
}

// 4. Panggil fungsinya saat web dibuka
EvenCardLogic();

const eventFilterLogic = () => {
  // 1. DEFINISIKAN DULU VARIABEL KELAS-NYA DI SINI
  const tabActive = [
    "bg-white",
    "text-blue-700",
    "font-bold",
    "shadow-sm",
    "border-slate-200",
  ];
  const tabInactive = [
    "text-slate-500",
    "font-medium",
    "border-transparent",
    "hover:text-slate-900",
    "hover:bg-slate-200/50",
  ];

  const timeActive = [
    "bg-blue-50",
    "text-blue-700",
    "border-blue-200",
    "font-semibold",
    "hover:bg-blue-100",
  ];
  const timeInactive = [
    "bg-white",
    "text-slate-600",
    "border-slate-200",
    "font-medium",
    "hover:bg-slate-50",
    "hover:border-slate-300",
  ];

  // 2. FUNGSI LOGIKA (Nama yang profesional)
  function initFilterGroup(containerId, activeClasses, inactiveClasses) {
    const container = document.getElementById(containerId);

    // console.info(container) -> Ini bisa kamu hapus kalau sudah tidak butuh debugging
    if (!container) return;

    const buttons = container.querySelectorAll("button");

    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((btn) => {
          btn.classList.remove(...activeClasses);
          btn.classList.add(...inactiveClasses);
        });
        button.classList.remove(...inactiveClasses);
        button.classList.add(...activeClasses);
      });
    });
  }

  // 3. PANGGIL FUNGSINYA
  initFilterGroup("tab-group", tabActive, tabInactive);
  initFilterGroup("time-group", timeActive, timeInactive);
};

eventFilterLogic();

const initMobileMenu = () => {
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");

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
