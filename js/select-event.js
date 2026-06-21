// Konfigurasi URL API Utama
const API_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/api/events";
const STORAGE_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/storage/"; // Untuk mengatasi masalah gambar

// 1. Tangkap ID dari URL
const urlParams = new URLSearchParams(window.location.search);
const idAcara = urlParams.get("id");

// ==========================================
// PENGATURAN HEADER & ROLE USER
// ==========================================
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
      // Sembunyikan tombol
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

// ==========================================
// FITUR BOOKMARK (SIMPAN ACARA)
// ==========================================
window.toggleBookmarkEvent = async function () {
  const userAktif = JSON.parse(localStorage.getItem("user_mading"));
  
  if (!userAktif) {
      alert("Silakan login terlebih dahulu untuk menyimpan acara.");
      window.location.href = "login.html";
      return;
  }

  const btn = document.getElementById("btn-bookmark");
  const text = document.getElementById("bookmark-text");

  // 1. Ubah tampilan tombol langsung (Optimistic UI)
  const isBookmarked = text.innerText === "Tersimpan";

  if (isBookmarked) {
    text.innerText = "Simpan";
    btn.classList.replace("bg-yellow-50", "bg-white");
    btn.classList.replace("text-yellow-600", "text-gray-500");
    btn.classList.replace("border-yellow-400", "border-gray-300");
  } else {
    text.innerText = "Tersimpan";
    btn.classList.replace("bg-white", "bg-yellow-50");
    btn.classList.replace("text-gray-500", "text-yellow-600");
    btn.classList.replace("border-gray-300", "border-yellow-400");
  }

  // 2. Kirim data ke Background (API Laravel)
  try {
    const response = await fetch(`${API_BASE_URL}/${idAcara}/bookmark`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "ngrok-skip-browser-warning": "true",
      },
      // MENGGUNAKAN ID USER ASLI
      body: JSON.stringify({ user_id: userAktif.id }),
    });

    if (!response.ok) throw new Error("Gagal menyimpan ke server");
  } catch (error) {
    console.error("Gagal Bookmark:", error);
    alert("Terjadi kesalahan jaringan saat menyimpan bookmark.");
  }
};

// ==========================================
// RENDER DETAIL ACARA
// ==========================================
const initEventDetail = () => {
  function fungsiCreateEvents(data) {
    const container = document.getElementById("container-slect-event");

    // Logika Perbaikan Gambar: Jika URL gambar dari API tidak mengandung 'http'
    let imageUrl = data.gambar_poster;
    if (imageUrl && !imageUrl.startsWith("http")) {
      imageUrl = STORAGE_BASE_URL + imageUrl;
    }

    // Format Uang Rupiah (Jika ada kolom harga di API)
    const hargaFormat =
      !data.harga || data.harga == 0
        ? "GRATIS"
        : "Rp " + new Intl.NumberFormat("id-ID").format(data.harga);

    const textBookmark = data.is_bookmarked ? "Tersimpan" : "Simpan";
    const classBtnBookmark = data.is_bookmarked 
        ? "bg-yellow-50 text-yellow-600 border-yellow-400" 
        : "bg-white text-gray-500 border-gray-300";

    // Render HTML
    const html = `
    <div class="relative w-full rounded-lg overflow-hidden bg-gray-200">
        <span class="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded shadow-sm z-10 capitalize max-w-[70%] truncate">
            ${data.kategori}
        </span>
        <img src="${imageUrl}" 
             alt="${data.judul}" 
             class="w-full h-auto object-cover aspect-video transition-transform duration-500 hover:scale-105" 
             onerror="this.src='https://via.placeholder.com/800x450?text=Gambar+Tidak+Tersedia'" />
    </div>

    <div class="flex flex-col w-full gap-6 mb-6 mt-4">
        <div class="flex justify-between items-start gap-4 w-full">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900">${data.judul}</h1>
            <button onclick="window.toggleBookmarkEvent()" id="btn-bookmark" class="flex-shrink-0 flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 hover:bg-yellow-50 hover:text-yellow-600 rounded-lg font-semibold text-xs md:text-sm transition-colors border hover:border-yellow-400 shadow-sm ${classBtnBookmark}">
                <span class="text-lg">🔖</span> 
                <span id="bookmark-text">${textBookmark}</span>
            </button>
        </div>

        <div class="flex flex-wrap sm:flex-nowrap justify-between w-full mx-auto gap-4 py-3 border-gray-200 border-t-2 border-b-2 px-5 md:px-12 ">
            <div class="flex items-start space-x-3">
                <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">📅</div>
                <div>
                    <p class="text-xs text-gray-500 mb-0.5">Tanggal Acara</p>
                    <p class="font-semibold text-sm text-gray-800">${data.tanggal_acara}</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">🎟️</div>
                <div>
                    <p class="text-xs text-gray-500 mb-0.5">Biaya (HTM)</p>
                    <p class="font-semibold text-sm ${data.harga == 0 ? "text-green-600" : "text-gray-800"}">${hargaFormat}</p>
                </div>
            </div>
            <div class="flex items-start space-x-3">
                <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">📍</div>
                <div>
                    <p class="text-xs text-gray-500 mb-0.5">Link / Info</p>
                    <p class="font-semibold text-sm text-gray-800 truncate">
                        ${data.link_action ? `<a href="${data.link_action}" target="_blank" class="text-blue-500 hover:underline">Klik di sini</a>` : "Hubungi Panitia"}
                    </p>
                </div>
            </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <div class="flex items-center space-x-3">
                <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 text-gray-500 font-bold">
                    MK
                </div>
                <div>
                    <p class="text-sm font-bold text-gray-800">Mading Kampus</p>
                    <p class="text-xs text-gray-500 mt-0.5">Penyelenggara</p>
                </div>
            </div>
            <a href="${data.link_action || "#"}" target="_blank" class="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded font-semibold text-sm w-full sm:w-auto transition-colors text-center shadow-md">
                ${data.harga == 0 ? "DAFTAR SEKARANG" : "PESAN TIKET"}
            </a>
        </div>
    </div>

    <div class="bg-white p-5 md:p-6 rounded-lg shadow-sm border border-gray-200">
        <h2 class="text-base font-bold text-gray-900 mb-4">Tentang Acara</h2>
        <div class="text-gray-600 text-sm leading-relaxed space-y-4 whitespace-pre-line">
            ${data.deskripsi}
        </div>
    </div>
    `;
    container.innerHTML = html;
  }

  function renderBreadcrumb(data) {
    const container = document.getElementById("breadcrumb");
    container.innerHTML = `
        <a href="/" class="hover:text-blue-600">Beranda</a> <span class="mx-1">></span> 
        <span class="hover:text-blue-600 capitalize cursor-pointer">${data.kategori}</span> <span class="mx-1">></span>
        <span class="font-semibold text-gray-800 capitalize">${data.judul}</span>
    `;
    document.title = `${data.judul} - Mading Kampus`;
  }

  async function fetchDetailAcara(id) {
    const apiUrl = `${API_BASE_URL}/${id}`;

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
      const dataAsli = result.data !== undefined ? result.data : result;

      // Sisipkan is_bookmarked dari luar data utama jika strukturnya terpisah
      if (result.is_bookmarked !== undefined) {
          dataAsli.is_bookmarked = result.is_bookmarked;
      }

      fungsiCreateEvents(dataAsli);
      renderBreadcrumb(dataAsli);
    } catch (error) {
      console.error("Error Detail Acara:", error);
      document.getElementById("container-slect-event").innerHTML =
        `<div class="p-6 text-center text-red-500 bg-white rounded-lg shadow border border-red-200 font-bold">Gagal memuat acara. Pastikan server nyala.</div>`;
    }
  }

  if (idAcara) {
    fetchDetailAcara(idAcara);
  } else {
    document.getElementById("container-slect-event").innerHTML =
      `<div class="p-6 text-center text-gray-500 bg-white rounded-lg shadow border">Pilih event terlebih dahulu dari halaman utama.</div>`;
  }
};

// ==========================================
// BAGIAN 2: LOGIKA CHAT & KOMENTAR (INTEGRASI API)
// ==========================================

window.toggleReply = function (commentId) {
  const form = document.getElementById(`reply-form-${commentId}`);
  form.classList.toggle("hidden");
};

window.submitReply = async function (event, commentId) {
  event.preventDefault();
  const input = document.getElementById(`reply-input-${commentId}`);
  const btn = document.getElementById(`btn-reply-${commentId}`);
  const text = input.value.trim();
  if (!text) return;

  // AMBIL DATA USER DARI MEMORI
  const userAktif = JSON.parse(localStorage.getItem("user_mading"));
  if (!userAktif) {
      alert("Silakan login terlebih dahulu untuk membalas komentar.");
      window.location.href = "login.html";
      return;
  }

  btn.disabled = true;
  btn.innerHTML = "...";

  try {
    const response = await fetch(
      `https://slab-silenced-riot.ngrok-free.dev/api/comments/${commentId}/reply`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        // MENGGUNAKAN ID USER ASLI
        body: JSON.stringify({
          event_id: idAcara,
          isi_komentar: text,
          user_id: userAktif.id, 
        }),
      },
    );

    if (response.ok) {
      input.value = "";
      window.toggleReply(commentId); // Tutup form setelah sukses
      window.refreshComments(); // Refresh seluruh chat
    } else {
      alert("Gagal mengirim balasan.");
    }
  } catch (error) {
    console.error("Gagal reply:", error);
  } finally {
    btn.disabled = false;
    btn.innerHTML = "Kirim";
  }
};

const initChatSystem = () => {
  if (!idAcara) return;

  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input");
  const btnSubmit = chatForm.querySelector('button[type="submit"]');

  window.refreshComments = async function fetchComments() {
    try {
      const response = await fetch(`${API_BASE_URL}/${idAcara}/comments`, {
        headers: {
          "ngrok-skip-browser-warning": "true",
          Accept: "application/json",
        },
      });
      const result = await response.json();

      let chatHtml = "";

      if (!result.data || result.data.length === 0) {
        chatBox.innerHTML = `<div class="text-center text-sm text-gray-400 my-auto w-full">Belum ada diskusi. Jadilah yang pertama!</div>`;
        return;
      }

      // LOOP KOMENTAR UTAMA
      result.data.forEach((comment) => {
        const namaUser = comment.user_nama || "Anonim";
        const isPanitia = comment.role === "panitia" || comment.role === "admin";
        const initial = namaUser.charAt(0).toUpperCase();
        const jamFormat = comment.waktu_yang_lalu || "Baru saja";

        chatHtml += `
            <div class="flex gap-3 animate-fade-in mb-2">
                <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${isPanitia ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"}">
                    ${initial}
                </div>
                <div class="flex-1 border border-gray-100 rounded-xl p-4 ${isPanitia ? "bg-blue-50" : "bg-white shadow-sm"}">
                    <div class="flex justify-between items-start mb-2">
                        <span class="font-bold text-sm text-gray-800">${namaUser} ${isPanitia ? '<span class="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded ml-1 uppercase">Panitia</span>' : ""}</span>
                        <span class="text-xs text-gray-400">${jamFormat}</span>
                    </div>
                    <p class="text-gray-800 text-sm mb-3 leading-relaxed">${comment.isi_komentar}</p>
                    
                    <button onclick="window.toggleReply(${comment.id})" class="text-xs font-semibold text-blue-500 hover:text-blue-700 flex items-center gap-1 transition">
                        <span>↩️</span> Balas
                    </button>

                    <div id="reply-form-${comment.id}" class="hidden mt-3 pt-3 border-t border-gray-100">
                        <form onsubmit="window.submitReply(event, ${comment.id})" class="flex gap-2">
                            <input type="text" id="reply-input-${comment.id}" placeholder="Balas komentar ini..." class="w-full px-3 py-1.5 text-sm bg-gray-50 border border-gray-200 rounded outline-none focus:border-blue-400" required>
                            <button type="submit" id="btn-reply-${comment.id}" class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1.5 rounded text-sm font-semibold transition">Kirim</button>
                        </form>
                    </div>
                </div>
            </div>
        `;

        // LOOP BALASAN
        if (comment.replies && comment.replies.length > 0) {
          comment.replies.forEach((reply) => {
            const rNamaUser = reply.user_nama || "Anonim";
            const rIsPanitia = reply.role === "panitia" || reply.role === "admin";
            const rInitial = rNamaUser.charAt(0).toUpperCase();
            const rJam = reply.waktu_yang_lalu || "Baru saja";

            chatHtml += `
            <div class="flex gap-3 ml-12 mb-2 animate-fade-in border-l-2 border-gray-200 pl-4">
                <div class="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-xs ${rIsPanitia ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-500"}">
                    ${rInitial}
                </div>
                <div class="flex-1 rounded-xl p-3 bg-gray-50 border border-gray-100">
                    <div class="flex justify-between items-start mb-1">
                        <span class="font-bold text-xs text-gray-800">${rNamaUser} ${rIsPanitia ? '<span class="text-[9px] bg-blue-500 text-white px-1 rounded ml-1 uppercase">Panitia</span>' : ""}</span>
                        <span class="text-[10px] text-gray-400">${rJam}</span>
                    </div>
                    <p class="text-gray-600 text-xs leading-relaxed">${reply.isi_komentar}</p>
                </div>
            </div>
            `;
          });
        }
      });

      chatBox.innerHTML = chatHtml;
      chatBox.scrollTop = chatBox.scrollHeight;
    } catch (error) {
      console.error("Gagal load komentar:", error);
    }
  };

  // Fungsi Kirim Komentar Utama
  chatForm.addEventListener("submit", async function (e) {
    e.preventDefault();
    const messageText = chatInput.value.trim();
    if (!messageText) return;

    // AMBIL DATA USER DARI MEMORI
    const userAktif = JSON.parse(localStorage.getItem("user_mading"));
    if (!userAktif) {
        alert("Silakan login terlebih dahulu untuk berkomentar.");
        window.location.href = "login.html";
        return;
    }

    btnSubmit.disabled = true;
    btnSubmit.innerHTML = "...";

    try {
      const response = await fetch(`${API_BASE_URL}/${idAcara}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        // MENGGUNAKAN ID USER ASLI
        body: JSON.stringify({ 
            isi_komentar: messageText,
            user_id: userAktif.id
        }),
      });

      if (response.ok) {
        chatInput.value = "";
        window.refreshComments();
      } else {
        throw new Error("Gagal");
      }
    } catch (error) {
      alert("Gagal mengirim komentar.");
    } finally {
      btnSubmit.disabled = false;
      btnSubmit.innerHTML = "➤";
    }
  });

  // Jalankan load pertama
  window.refreshComments();
};

initEventDetail();
initChatSystem();
