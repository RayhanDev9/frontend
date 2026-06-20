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

// Sesuaikan URL API dengan port Back-End (Contoh: http://127.0.0.1:8000/api)
const API_BASE_URL = 'http://127.0.0.1:8000/api';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Logika untuk mengubah teks saat file gambar dipilih
    const inputFile = document.getElementById('gambar_poster');
    const namaFileTeks = document.getElementById('nama-file');

    inputFile.addEventListener('change', function() {
        if (this.files && this.files[0]) {
            namaFileTeks.innerText = "File terpilih: " + this.files[0].name;
            namaFileTeks.classList.replace('text-slate-700', 'text-blue-600');
        } else {
            namaFileTeks.innerText = "Klik untuk pilih poster";
            namaFileTeks.classList.replace('text-blue-600', 'text-slate-700');
        }
    });

    // 2. Logika submit form ke API Laravel
    const formUnggah = document.getElementById('form-unggah');
    const btnSubmit = document.getElementById('btn-submit');

    formUnggah.addEventListener('submit', async (e) => {
        e.preventDefault(); // Mencegah halaman refresh

        // Ambil data user yang login untuk tau siapa yang upload
        const userAktif = JSON.parse(localStorage.getItem('user_mading'));
        if (!userAktif) {
            alert('Lu harus login dulu buat unggah acara!');
            window.location.href = 'login.html';
            return;
        }

        // Ubah tombol jadi loading
        const teksAsliTombol = btnSubmit.innerHTML;
        btnSubmit.innerHTML = 'Sedang Mengunggah... Tunggu ya...';
        btnSubmit.disabled = true;
        btnSubmit.classList.replace('bg-blue-600', 'bg-gray-400');

        try {
            // Karena kita ngirim file gambar, WAJIB pakai FormData, bukan JSON stringify
            const formData = new FormData();
            formData.append('user_id', userAktif.id);
            formData.append('judul', document.getElementById('judul').value);
            formData.append('kategori', document.getElementById('kategori').value); // HIMA, UMKO, atau UMKM
            formData.append('tanggal_acara', document.getElementById('tanggal').value);
            formData.append('harga', document.getElementById('harga').value);
            formData.append('link_action', document.getElementById('link_action').value);
            formData.append('deskripsi', document.getElementById('deskripsi').value);
            
            // Ambil file fisiknya
            const filePoster = document.getElementById('gambar_poster').files[0];
            formData.append('gambar_poster', filePoster);

            // Tembak API POST
            const response = await fetch(`${API_BASE_URL}/events`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: formData // Masukin FormData di sini
            });

            const result = await response.json();

            if (response.ok) {
                alert('Yess! Acara lu berhasil diunggah!');
                window.location.href = 'index.html'; // Balik ke halaman utama
            } else {
                console.error("Validasi Error:", result);
                alert('Gagal unggah: ' + (result.message || 'Cek form lu lagi.'));
            }

        } catch (error) {
            console.error('Error nyambung ke API:', error);
            alert('Gagal terhubung ke server Back-End!');
        } finally {
            // Kembalikan tombol ke semula jika terjadi error
            btnSubmit.innerHTML = teksAsliTombol;
            btnSubmit.disabled = false;
            btnSubmit.classList.replace('bg-gray-400', 'bg-blue-600');
        }
    });
});
