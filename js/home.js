// 1. URL API Ngrok dari Back-End
const API_URL = "https://slab-silenced-riot.ngrok-free.dev/api/events";

// 2. Fungsi untuk mengambil dan merender data
async function muatDataMading() {
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

    // 3. Looping data dan buat HTML (TEMPAT FRONT-END NGEDIT UI)
    result.data.forEach((acara) => {
      // Cek jika acara gratis
      const hargaTeks =
        acara.harga == 0
          ? "Gratis"
          : `Rp ${parseInt(acara.harga).toLocaleString("id-ID")}`;

      // Struktur Card (Silakan di-obrak-abrik desainnya sesuka hati!)
      const cardHTML = `
                        <div class="bg-[#1e1e1e] border border-gray-800 rounded-xl overflow-hidden shadow-lg hover:border-gray-600 transition duration-300 flex flex-col">
                            
                            <div class="h-48 bg-gray-700 w-full overflow-hidden relative">
                                <div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                                    [Area Gambar Poster]
                                </div>
                            </div>

                            <div class="p-5 flex flex-col flex-grow">
                                <div class="flex justify-between items-start mb-2">
                                    <h3 class="text-lg font-bold text-white line-clamp-2">${acara.judul}</h3>
                                </div>
                                
                                <p class="text-sm text-blue-400 mb-3 font-medium">📅 ${acara.tanggal_acara}</p>
                                
                                <p class="text-gray-400 text-sm line-clamp-3 mb-4 flex-grow">
                                    ${acara.deskripsi}
                                </p>

                                <div class="flex items-center justify-between mt-auto pt-4 border-t border-gray-800">
                                    <span class="text-green-400 font-bold text-sm">${hargaTeks}</span>
                                    <button onclick="bukaDetail(${acara.id})" class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition">
                                        Lihat Detail
                                    </button>
                                </div>
                            </div>
                        </div>
                    `;

      // Suntikkan card ke dalam wadah HTML
      wadahPoster.innerHTML += cardHTML;
    });
  } catch (error) {
    console.error("Gagal konek ke API:", error);
    wadahPoster.innerHTML = `
                    <div class="col-span-full text-center py-20 text-red-400 bg-red-950/20 border border-red-900 rounded-xl">
                        <p class="font-bold mb-2">Gagal Mengambil Data</p>
                        <p class="text-sm">Pastikan server Laravel dan Ngrok lu lagi nyala bro.</p>
                    </div>
                `;
  }
}

// Fungsi dummy buat tombol detail
function bukaDetail(id) {
  alert("Nanti ini diarahkan ke halaman detail untuk ID Acara: " + id);
  // Contoh implementasi asli nanti: window.location.href = `detail.html?id=${id}`;
}

// 4. Panggil fungsinya saat web dibuka
muatDataMading();
