document.addEventListener("DOMContentLoaded", () => {
  // Ambil semua elemen berdasarkan IDcons

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

  const initCheckout = () => {
    const container = document.getElementById("container-checkout");

    function htmlCheckout() {
      return `
         <div class="mb-6">
            <h1 class="text-2xl sm:text-3xl font-bold text-slate-900 mb-1">
              Konfirmasi Pesanan
            </h1>
            <p class="text-slate-500 text-sm md:text-base">
              Tinjau kembali detail pesanan Anda sebelum melanjutkan.
            </p>
          </div>

          <div
            class="bg-white border border-slate-200 rounded-xl p-4 sm:p-5 mb-5 shadow-sm overflow-hidden"
          >
            <h2
              class="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-200"
            >
              Ringkasan Pesanan
            </h2>

            <div class="flex items-start gap-3 sm:gap-4">
              <img
                src="https://via.placeholder.com/150x150?text=Poster"
                alt="Poster Talkshow"
                class="w-20 h-24 sm:w-24 sm:h-24 object-cover rounded-md border border-slate-100 shadow-sm shrink-0"
              />

              <div
                class="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4"
              >
                <div class="flex-1 min-w-0">
                  <h3
                    class="font-bold text-base sm:text-lg text-slate-900 leading-tight truncate"
                  >
                    Tiket Talkshow Karir
                  </h3>
                  <p
                    class="text-xs sm:text-sm text-slate-500 mt-1 mb-2.5 truncate"
                  >
                    Fakultas Ekonomi dan Bisnis
                  </p>
                  <div>
                    <span
                      class="bg-slate-200 text-slate-600 text-[11px] sm:text-xs font-medium px-2.5 py-1 rounded inline-block whitespace-nowrap"
                    >
                      Tiket Masuk
                    </span>
                  </div>
                </div>

                <div
                  class="text-md sm:text-lg lg:text-xl font-bold text-blue-600 shrink-0 max-sm:pl-2.5"
                >
                  Gratis
                </div>
              </div>
            </div>
          </div>

          <div
            class="bg-white border border-slate-200 rounded-xl p-5 mb-5 shadow-sm"
          >
            <h2
              class="text-lg font-semibold text-slate-800 mb-4 pb-3 border-b border-slate-200"
            >
              Detail Pemesan
            </h2>

            <div class="mb-5">
              <label class="block text-sm font-semibold text-slate-800 mb-2"
                >Jumlah Peserta</label
              >
              <div
                class="flex items-center border border-slate-300 rounded-md w-max overflow-hidden"
              >
                <button
                  id="btn-min"
                  class="px-4 py-2 text-slate-600 hover:bg-slate-100 transition focus:outline-none"
                >
                  &minus;
                </button>
                <input
                  type="number"
                  id="input-qty"
                  value="1"
                  min="1"
                  class="w-12 text-center text-sm font-medium text-slate-800 focus:outline-none border-x border-slate-300 py-2 pointer-events-none"
                  readonly
                />
                <button
                  id="btn-plus"
                  class="px-4 py-2 text-slate-600 hover:bg-slate-100 transition focus:outline-none"
                >
                  &plus;
                </button>
              </div>
            </div>

            <div class="mb-5">
              <label class="block text-sm font-semibold text-slate-800 mb-2"
                >Nama Lengkap</label
              >
              <input
                type="text"
                id="input-nama"
                placeholder="Masukkan nama lengkap Anda"
                class="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>

            <div class="mb-2">
              <label class="block text-sm font-semibold text-slate-800 mb-2"
                >Nomor Induk Mahasiswa (Opsional)</label
              >
              <input
                type="text"
                id="input-nim"
                placeholder="Masukkan NIM Anda"
                class="w-full border border-slate-300 rounded-md px-4 py-2.5 text-sm placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
              />
            </div>
          </div>

          <div
            class="bg-white border border-slate-200 rounded-xl p-5 mb-6  shadow-sm"
          >
            <div class="flex justify-between items-center mb-4 px-2">
              <h2 class="text-lg font-semibold text-slate-800">Subtotal</h2>
              <div class="text-md sm:text-lg lg:text-xl font-bold text-blue-600">Gratis</div>
            </div>

            <div
              class="bg-[#f0f7ff] border border-blue-200 rounded-lg p-4 flex gap-3 items-start"
            >
              <svg
                class="w-5 h-5 text-blue-600 shrink-0 mt-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                ></path>
              </svg>
              <p class="text-sm text-slate-600 leading-relaxed">
                Pembayaran dan konfirmasi pesanan dilakukan langsung melalui
                WhatsApp dengan penjual/panitia.
              </p>
            </div>
          </div>

          <button
            id="btn-submit"
            class="w-full bg-[#2a9cf5] hover:bg-blue-600 text-white font-semibold text-sm sm:text-base py-3.5 rounded-lg flex justify-center items-center gap-2 transition shadow-md focus:outline-none"
          >
            <svg
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
              ></path>
            </svg>
            PESAN VIA WHATSAPP
          </button>
      `;
    }

    container.insertAdjacentHTML("beforeend", htmlCheckout());
  };

  initCheckout();

  const btnMin = document.getElementById("btn-min");
  const btnPlus = document.getElementById("btn-plus");
  const inputQty = document.getElementById("input-qty");

  const inputNama = document.getElementById("input-nama");
  const inputNim = document.getElementById("input-nim");
  const btnSubmit = document.getElementById("btn-submit");

  // Fungsi Event Listener Tombol + dan -
  btnPlus.addEventListener("click", () => {
    let currentValue = parseInt(inputQty.value);
    inputQty.value = currentValue + 1;
  });

  btnMin.addEventListener("click", () => {
    let currentValue = parseInt(inputQty.value);
    if (currentValue > 1) {
      inputQty.value = currentValue - 1;
    }
  });

  // Fungsi Event Listener Pesan WhatsApp
  btnSubmit.addEventListener("click", () => {
    // Ganti nomor ini dengan nomor WhatsApp yang dituju (Format: 628...)
    const nomorWhatsApp = "6281234567890";

    // Ambil data dari inputan
    const jumlahPeserta = inputQty.value;
    const namaLengkap = inputNama.value.trim();
    const nim = inputNim.value.trim();

    // Validasi: Pastikan nama tidak kosong
    if (!namaLengkap) {
      alert("Mohon isi Nama Lengkap terlebih dahulu sebelum memesan.");
      return;
    }

    // Susun teks pesan
    let teksPesan = `Halo, saya ingin memesan tiket acara:\n\n`;
    teksPesan += `*Acara:* Tiket Talkshow Karir\n`;
    teksPesan += `*Jumlah Peserta:* ${jumlahPeserta} Orang\n`;
    teksPesan += `*Nama Lengkap:* ${namaLengkap}\n`;

    // Masukkan NIM ke pesan hanya jika diisi
    if (nim) {
      teksPesan += `*NIM:* ${nim}\n`;
    }

    teksPesan += `\nMohon instruksi selanjutnya. Terima kasih!`;

    // Buat Link dan Buka di Tab Baru
    const urlWhatsApp = `https://wa.me/${6285692097048}?text=${encodeURIComponent(teksPesan)}`;
    window.open(urlWhatsApp, "_blank");
  });
});
