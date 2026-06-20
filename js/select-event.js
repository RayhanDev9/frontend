// const API_URL = "https://slab-silenced-riot.ngrok-free.dev/api/events";

const chatForm = () => {
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const chatBox = document.getElementById("chat-box");

  chatForm.addEventListener("submit", function (e) {
    e.preventDefault(); // Mencegah reload halaman

    const messageText = chatInput.value.trim();
    if (messageText === "") return;

    // Template HTML untuk pesan baru
    const newMessageHTML = `
            <div class="flex gap-3 animate-fade-in">
                <div class="w-10 h-10 rounded-full bg-blue-600 flex-shrink-0 flex items-center justify-center text-white font-bold text-sm">S</div>
                <div class="flex-1 border border-blue-100 rounded-xl p-4 bg-blue-50 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-sm text-gray-800">Saya (Anda)</span>
                        <span class="text-xs text-gray-400">Baru saja</span>
                    </div>
                    <p class="text-gray-800 text-sm mb-3 leading-relaxed">${messageText}</p>
                    <div class="flex items-center gap-5 text-sm font-medium text-gray-500">
                        <button class="flex items-center gap-1.5 hover:text-blue-600 transition-colors">
                            <span>👍</span> <span>0</span>
                        </button>
                        <button class="flex items-center gap-1.5 hover:text-blue-600 transition-colors text-blue-500">
                            <span class="text-blue-500 font-bold">↩️</span> <span>Balas</span>
                        </button>
                    </div>
                </div>
            </div>
            `;

    // Tambahkan pesan ke dalam kotak chat
    chatBox.insertAdjacentHTML("beforeend", newMessageHTML);

    // Kosongkan input
    chatInput.value = "";

    // Scroll otomatis ke bawah
    chatBox.scrollTop = chatBox.scrollHeight;
  });
};

chatForm();

const selectProduct = () => {
  // 1. Tangkap ID dari URL
  const urlParams = new URLSearchParams(window.location.search);
  const idAcara = urlParams.get("id");

  function fungsiCreateEvents(data) {
    const container = document.getElementById("container-slect-event");
    console.info(data.kategori);

    const html = `
      <div class="relative w-full rounded-lg overflow-hidden bg-gray-200">
            <span
              class="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded shadow-sm z-10"
            >
              ${data.kategori}
            </span>
            <img
              src="${data.gambar_poster}"
              alt="${data.kategori}"
              class="w-full h-auto object-cover aspect-video"
            />
          </div>

          <div
            class="bg-white p-5 md:p-6 rounded-lg shadow-sm border border-gray-200 border-t-2 border-b-2"
          >
            <h1 class="text-2xl md:text-3xl font-bold mb-6 text-gray-900">
              ${data.judul}
            </h1>

            <div
              class="grid grid-cols-1 sm:grid-cols-3 gap-2 xs:gap-4 mb-6 py-1 xs:py-2 border-gray-100 border-t-2 border-b-2"
            >
              <div class="flex items-start space-x-3 p-2 xs:p-3">
                <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">
                  📅
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-0.5">Tanggal</p>
                  <p class="font-semibold text-sm text-gray-800">${data.tanggal_acara}</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 p-2 xs:p-3">
                <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">
                  🕒
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-0.5">Waktu</p>
                  <p class="font-semibold text-sm text-gray-800">14:00 WIB</p>
                </div>
              </div>
              <div class="flex items-start space-x-3 p-2 xs:p-3">
                <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">
                  📍
                </div>
                <div>
                  <p class="text-xs text-gray-500 mb-0.5">Lokasi</p>
                  <p class="font-semibold text-sm text-gray-800">Aula Utama</p>
                </div>
              </div>
            </div>

            <div
              class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
            >
              <div class="flex items-center space-x-3">
                <div
                  class="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border border-gray-300"
                >
                  <img
                    src="https://via.placeholder.com/48"
                    alt="Logo"
                    class="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-800">
                    Diselenggarakan oleh BEM Fakultas Ekonomi
                  </p>
                  <p class="text-xs text-gray-500 mt-0.5">1.2k Pengikut</p>
                </div>
              </div>
              <button
                class="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded font-semibold text-sm w-full sm:w-auto transition-colors"
              >
                PESAN TIKET
              </button>
            </div>
          </div>

          <div
            class="bg-white p-5 md:p-6 rounded-lg shadow-sm border border-gray-200"
          >
            <h2 class="text-base font-bold text-gray-900 mb-4">
              Tentang Acara
            </h2>
            <div class="text-gray-600 text-sm leading-relaxed space-y-4">
              <p>
               ${data.deskripsi}
              </p>
            </div>
          </div>
    `;
    container.insertAdjacentHTML("beforeend", html);
  }

  function breadcrumb(data) {
    const container = document.getElementById("breadcrumb");

    const html = `
      Beranda <span class="mx-1 capitalize">></span> Acara <span class="mx-1">></span>
        <span class="font-semibold text-gray-800 capitalize">${data.judul}</span>
    `;

    container.insertAdjacentHTML("beforeend", html);
  }

  // 2. Buat fungsi Asynchronous untuk memanggil API
  async function fetchDetailAcara(id) {
    // PERBAIKAN: Menambahkan /${id} di akhir URL untuk memanggil data spesifik
    const apiUrl = `https://slab-silenced-riot.ngrok-free.dev/api/events/${id}`;

    try {
      console.log("Sedang mengambil data dari:", apiUrl);

      // PERBAIKAN: Menambahkan header 'ngrok-skip-browser-warning'
      // agar tidak terblokir halaman peringatan ngrok
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "ngrok-skip-browser-warning": "true", // Wajib jika pakai ngrok free tier
          "Content-Type": "application/json",
        },
      });

      console.info("Respons mentah API:", response);

      // Mengecek apakah respons dari server berstatus sukses (misal: 200 OK)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Mengubah respons API mentah menjadi objek JavaScript
      const result = await response.json();

      // Melihat respons utuh dari API (yang masih terbungkus { status: ..., data: ... })
      console.log("Data Detail Acara Mentah:", result);

      // Mengupas bungkusnya: Kita ambil isinya saja yang ada di dalam properti 'data'
      const dataAsli = result.data;

      // Mengecek apakah datanya sudah benar-benar terkupas
      console.log("Data Siap Pakai:", dataAsli);

      // Mengirimkan data yang sudah bersih ke dalam function
      fungsiCreateEvents(dataAsli);
      breadcrumb(dataAsli)

      // --- Contoh Penggunaan Data ke dalam HTML ---
      // document.getElementById('judul-acara').innerText = data.judul;
    } catch (error) {
      console.error("Gagal mengambil data dari API:", error);
      alert("Maaf, gagal memuat detail acara.");
    }
  }

  // 4. Jalankan fungsinya hanya jika ID benar-benar ada di URL
  if (idAcara) {
    fetchDetailAcara(idAcara);
  } else {
    document.body.innerHTML = "<h1>Data acara tidak ditemukan (ID kosong)</h1>";
  }
};

selectProduct();
