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
