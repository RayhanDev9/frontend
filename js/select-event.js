// Konfigurasi URL API Utama
const API_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/api/events";
const STORAGE_BASE_URL = "https://slab-silenced-riot.ngrok-free.dev/storage/"; // Untuk mengatasi masalah gambar

// 1. Tangkap ID dari URL
const urlParams = new URLSearchParams(window.location.search);
const idAcara = urlParams.get("id");

// ==========================================
// BAGIAN 1: RENDER DETAIL ACARA
// ==========================================

const initEventDetail = () => {
    function fungsiCreateEvents(data) {
        const container = document.getElementById("container-slect-event");
        
        // Logika Perbaikan Gambar: Jika URL gambar dari API tidak mengandung 'http', 
        // kita tambahkan manual base URL storage-nya agar gambarnya muncul
        let imageUrl = data.gambar_poster;
        if (imageUrl && !imageUrl.startsWith('http')) {
            imageUrl = STORAGE_BASE_URL + imageUrl;
        }

        // Format Uang Rupiah (Jika ada kolom harga di API)
        const hargaFormat = (!data.harga || data.harga == 0) ? 'GRATIS' : 'Rp ' + new Intl.NumberFormat('id-ID').format(data.harga);

        // Render HTML
        const html = `
            <div class="relative w-full rounded-lg overflow-hidden bg-gray-200">
                <span class="absolute top-4 right-4 bg-blue-500 text-white text-xs font-semibold px-3 py-1 rounded shadow-sm z-10 capitalize">
                ${data.kategori}
                </span>
                <img src="${imageUrl}" alt="${data.judul}" class="w-full h-auto object-cover aspect-video" onerror="this.src='https://via.placeholder.com/800x450?text=Gambar+Tidak+Tersedia'" />
            </div>

            <div class="bg-white p-5 md:p-6 rounded-lg shadow-sm border border-gray-200 border-t-2 border-b-2">
                <h1 class="text-2xl md:text-3xl font-bold mb-6 text-gray-900">${data.judul}</h1>

                <div class="grid grid-cols-1 sm:grid-cols-3 gap-2 xs:gap-4 mb-6 py-1 xs:py-2 border-gray-100 border-t-2 border-b-2">
                    <div class="flex items-start space-x-3 p-2 xs:p-3">
                        <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">📅</div>
                        <div>
                            <p class="text-xs text-gray-500 mb-0.5">Tanggal Acara</p>
                            <p class="font-semibold text-sm text-gray-800">${data.tanggal_acara}</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-3 p-2 xs:p-3">
                        <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">🎟️</div>
                        <div>
                            <p class="text-xs text-gray-500 mb-0.5">Biaya (HTM)</p>
                            <p class="font-semibold text-sm ${data.harga == 0 ? 'text-green-600' : 'text-gray-800'}">${hargaFormat}</p>
                        </div>
                    </div>
                    <div class="flex items-start space-x-3 p-2 xs:p-3">
                        <div class="text-blue-500 text-xl bg-gray-50 rounded p-1">📍</div>
                        <div>
                            <p class="text-xs text-gray-500 mb-0.5">Link / Info</p>
                            <p class="font-semibold text-sm text-gray-800 truncate">
                                ${data.link_action ? `<a href="${data.link_action}" target="_blank" class="text-blue-500 hover:underline">Klik di sini</a>` : 'Hubungi Panitia'}
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div class="flex items-center space-x-3">
                        <div class="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center border border-gray-300 text-gray-500 font-bold">
                            MK
                        </div>
                        <div>
                            <p class="text-sm font-bold text-gray-800">Mading Kampus</p>
                            <p class="text-xs text-gray-500 mt-0.5">Penyelenggara</p>
                        </div>
                    </div>
                    <a href="${data.link_action || '#'}" target="_blank" class="bg-[#3b82f6] hover:bg-blue-600 text-white px-6 py-2.5 rounded font-semibold text-sm w-full sm:w-auto transition-colors text-center shadow-md">
                        ${data.harga == 0 ? 'DAFTAR SEKARANG' : 'PESAN TIKET'}
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
        // Bersihkan loading state lalu masukkan HTML baru
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
                headers: { "ngrok-skip-browser-warning": "true", "Accept": "application/json" }
            });

            if (!response.ok) throw new Error("Gagal mengambil data dari API");

            const result = await response.json();
            const dataAsli = result.data;

            fungsiCreateEvents(dataAsli);
            renderBreadcrumb(dataAsli);
        } catch (error) {
            console.error("Error Detail Acara:", error);
            document.getElementById("container-slect-event").innerHTML = `<div class="p-6 text-center text-red-500 bg-white rounded-lg shadow border border-red-200 font-bold">Gagal memuat acara. Pastikan server nyala.</div>`;
        }
    }

    if (idAcara) {
        fetchDetailAcara(idAcara);
    } else {
        document.getElementById("container-slect-event").innerHTML = `<div class="p-6 text-center text-gray-500 bg-white rounded-lg shadow border">Pilih event terlebih dahulu dari halaman utama.</div>`;
    }
};


// ==========================================
// BAGIAN 2: LOGIKA CHAT & KOMENTAR (INTEGRASI API)
// ==========================================

const initChatSystem = () => {
    if (!idAcara) return; // Jangan inisiasi chat kalau tidak ada ID Acara

    const chatBox = document.getElementById("chat-box");
    const chatForm = document.getElementById("chat-form");
    const chatInput = document.getElementById("chat-input");
    const btnSubmit = chatForm.querySelector('button[type="submit"]');

    // 1. Fungsi Ambil Komentar dari Database (GET)
    async function fetchComments() {
        try {
            // Asumsi Endpoint API Laravel: /api/events/{id}/comments
            const response = await fetch(`${API_BASE_URL}/${idAcara}/comments`, {
                headers: { "ngrok-skip-browser-warning": "true", "Accept": "application/json" }
            });
            
            const result = await response.json();
            
            // Bersihkan box chat
            chatBox.innerHTML = ''; 

            if (!result.data || result.data.length === 0) {
                chatBox.innerHTML = `<div class="text-center text-sm text-gray-400 my-auto w-full">Belum ada diskusi. Jadilah yang pertama!</div>`;
                return;
            }

            // Loop data komentar dan masukkan ke HTML
            result.data.forEach(comment => {
                // Mengecek apakah yang komentar itu panitia atau user biasa
                // (Ini asumsi properti dari API, sesuaikan jika beda nama kolomnya)
                const namaUser = comment.user ? comment.user.nama_lengkap : (comment.user_nama || 'Anonim');
                const isPanitia = comment.role === 'panitia' || (comment.user && comment.user.role === 'admin');
                const initial = namaUser.charAt(0).toUpperCase();
                
                // Format Waktu sederhana
                const d = new Date(comment.created_at);
                const jamFormat = `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`;

                const chatHtml = `
                    <div class="flex gap-3 ${isPanitia ? 'ml-12' : ''} animate-fade-in">
                        <div class="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center font-bold text-sm ${isPanitia ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'}">
                            ${initial}
                        </div>
                        <div class="flex-1 border border-gray-100 rounded-xl p-4 ${isPanitia ? 'bg-blue-50' : 'bg-white shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]'}">
                            <div class="flex justify-between items-start mb-2">
                                <span class="font-bold text-sm text-gray-800">${namaUser} ${isPanitia ? '<span class="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded ml-1 uppercase">Panitia</span>' : ''}</span>
                                <span class="text-xs text-gray-400">${jamFormat}</span>
                            </div>
                            <p class="text-gray-800 text-sm mb-3 leading-relaxed">${comment.isi_komentar}</p>
                        </div>
                    </div>
                `;
                chatBox.insertAdjacentHTML("beforeend", chatHtml);
            });

            // Scroll ke bawah
            chatBox.scrollTop = chatBox.scrollHeight;

        } catch (error) {
            console.error("Gagal load komentar:", error);
            // Jangan timpa tampilan jika gagal load, biarkan apa adanya
        }
    }

    // 2. Fungsi Kirim Komentar ke Database (POST)
    chatForm.addEventListener("submit", async function (e) {
        e.preventDefault(); 
        const messageText = chatInput.value.trim();
        if (messageText === "") return;

        // Kunci input sementara
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '...';

        try {
            // Asumsi Endpoint API Laravel: /api/events/{id}/comment
            const response = await fetch(`${API_BASE_URL}/${idAcara}/comment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    "ngrok-skip-browser-warning": "true",
                    // "Authorization": `Bearer ${localStorage.getItem('token')}` // Buka baris ini jika API wajib login
                },
                body: JSON.stringify({ isi_komentar: messageText })
            });

            if (!response.ok) {
                // Jika API menolak (misal karena belum login/401)
                throw new Error(response.status);
            }

            // Kosongkan form dan reload komentar dari server
            chatInput.value = "";
            fetchComments(); 

        } catch (error) {
            console.error("Gagal kirim komentar:", error);
            alert(error.message == '401' ? "Anda harus login untuk berkomentar!" : "Gagal mengirim pesan ke server.");
        } finally {
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '➤';
        }
    });

    // Jalankan load komentar pertama kali
    fetchComments();

    // (Opsional) Refresh komentar otomatis setiap 5 detik agar realtime untuk semua pengunjung
    // setInterval(fetchComments, 5000); 
};


// ==========================================
// 3. JALANKAN SEMUA FUNGSI
// ==========================================
initEventDetail();
initChatSystem();
