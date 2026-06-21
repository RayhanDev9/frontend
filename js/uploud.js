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

// Sesuaikan URL API dengan port Back-End (Contoh: http://127.0.0.1:8000/api)
// Catatan: Kalau dites via HP, ganti ini pakai alamat ngrok Back-End ya
const API_BASE_URL = "http://127.0.0.1:8000/api";

document.addEventListener("DOMContentLoaded", () => {
  // 1. Logika untuk mengubah teks saat file gambar dipilih
  const inputFile = document.getElementById("gambar_poster");
  const namaFileTeks = document.getElementById("nama-file");

  inputFile.addEventListener("change", function () {
    if (this.files && this.files[0]) {
      namaFileTeks.innerText = "File terpilih: " + this.files[0].name;
      namaFileTeks.classList.replace("text-slate-700", "text-blue-600");
    } else {
      namaFileTeks.innerText = "Klik untuk pilih poster";
      namaFileTeks.classList.replace("text-blue-600", "text-slate-700");
    }
  });

  //LOGIKA DRAG AND DROP (SERET FOTO)
  const areaDrop = document.getElementById("area-drop-file");

  ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
    areaDrop.addEventListener(eventName, preventDefaults, false);
  });

  function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
  }

  ["dragenter", "dragover"].forEach((eventName) => {
    areaDrop.addEventListener(eventName, highlight, false);
  });

  ["dragleave", "drop"].forEach((eventName) => {
    areaDrop.addEventListener(eventName, unhighlight, false);
  });

  function highlight(e) {
    areaDrop.classList.add("border-blue-500", "bg-blue-50");
  }

  function unhighlight(e) {
    areaDrop.classList.remove("border-blue-500", "bg-blue-50");
  }

  areaDrop.addEventListener(
    "drop",
    function (e) {
      let dt = e.dataTransfer;
      let files = dt.files;

      inputFile.files = files;

      const event = new Event("change");
      inputFile.dispatchEvent(event);
    },
    false,
  );

  // 2. Logika submit form ke API Laravel
  const formUnggah = document.getElementById("form-unggah");
  const btnSubmit = document.getElementById("btn-submit");

  formUnggah.addEventListener("submit", async (e) => {
    e.preventDefault();

    const userAktif = JSON.parse(localStorage.getItem("user_mading"));
    if (!userAktif) {
      alert("Lu harus login dulu buat unggah acara!");
      window.location.href = "login.html";
      return;
    }

    const teksAsliTombol = btnSubmit.innerHTML;
    btnSubmit.innerHTML = "Sedang Mengunggah... Tunggu ya...";
    btnSubmit.disabled = true;
    btnSubmit.classList.replace("bg-blue-600", "bg-gray-400");

    try {
      const formData = new FormData();
      formData.append("user_id", userAktif.id);
      formData.append("judul", document.getElementById("judul").value);
      formData.append("kategori", document.getElementById("kategori").value);

      // BAGIAN YANG DIUBAH: Menangkap waktu_acara untuk dikirim ke Laravel
      formData.append(
        "tanggal_acara",
        document.getElementById("tanggal").value,
      );
      formData.append(
        "waktu_acara",
        document.getElementById("waktu_acara").value,
      );

      formData.append("harga", document.getElementById("harga").value);
      formData.append(
        "link_action",
        document.getElementById("link_action").value,
      );
      formData.append("deskripsi", document.getElementById("deskripsi").value);

      const filePoster = document.getElementById("gambar_poster").files[0];
      formData.append("gambar_poster", filePoster);

      const response = await fetch(`${API_BASE_URL}/events`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        alert("Yess! Acara lu berhasil diunggah!");
        window.location.href = "index.html";
      } else {
        console.error("Validasi Error:", result);
        alert("Gagal unggah: " + (result.message || "Cek form lu lagi."));
      }
    } catch (error) {
      console.error("Error nyambung ke API:", error);
      alert("Gagal terhubung ke server Back-End!");
    } finally {
      btnSubmit.innerHTML = teksAsliTombol;
      btnSubmit.disabled = false;
      btnSubmit.classList.replace("bg-gray-400", "bg-blue-600");
    }
  });
});
