function togglePasswordView() {
  const passwordInput = document.getElementById("password");
  const eyeOpenIcon = document.getElementById("eyeOpenIcon");
  const eyeCloseIcon = document.getElementById("eyeCloseIcon");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    eyeOpenIcon.classList.remove("hidden");
    eyeCloseIcon.classList.add("hidden");
  } else {
    passwordInput.type = "password";
    eyeOpenIcon.classList.add("hidden");
    eyeCloseIcon.classList.remove("hidden");
  }
}
document.getElementById("eye").addEventListener("click", togglePasswordView);

const API_LOGIN_URL = "https://slab-silenced-riot.ngrok-free.dev/api/login";

document
  .getElementById("form-login")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    console.info(API_LOGIN_URL);

    const usernameInput = document.getElementById("username").value;
    const passwordInput = document.getElementById("password").value;
    const pesanError = document.getElementById("pesan-error");
    const tombol = document.getElementById("tombol-login");

    tombol.innerText = "Mengecek...";
    pesanError.classList.add("hidden");

    try {
      const response = await fetch(API_LOGIN_URL, {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "true",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: usernameInput,
          password: passwordInput,
        }),
      });

      const result = await response.json();
      console.info(JSON.stringify(result.data_user));

      if (response.ok && result.status === "success") {
        localStorage.setItem("user_mading", JSON.stringify(result.data_user));
        alert("Login Berhasil! Mengalihkan ke Beranda...");
        window.location.href = "index.html";
      } else {
        pesanError.innerText =
          result.pesan || "Login gagal, periksa kembali data Anda.";
        pesanError.classList.remove("hidden");
        tombol.innerText = "Masuk";
      }
    } catch (error) {
      console.error("Error:", error);
      pesanError.innerText = "Gagal terhubung ke server. Pastikan Ngrok nyala.";
      pesanError.classList.remove("hidden");
      tombol.innerText = "Masuk";
    }
  });
