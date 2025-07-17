// Variabel untuk kalkulasi harga
let orderData = {
  size: null,
  taste: null,
  variant: null,
  quantity: 1,
  sizePrice: 0,
  variantPrice: 0,
  deliveryFee: 1000, // Default delivery fee
};

// Fungsi untuk memilih opsi
function selectOption(element, type) {
  // Hapus kelas 'selected' dari semua opsi dalam grup yang sama
  const parent = element.parentElement;
  const options = parent.querySelectorAll(".option-btn");
  options.forEach((opt) => opt.classList.remove("selected"));

  // Tambahkan kelas 'selected' ke opsi yang dipilih
  element.classList.add("selected");

  // Simpan nilai yang dipilih
  orderData[type] = element.getAttribute("data-value");

  // Simpan harga jika ada
  if (type === "size") {
    orderData.sizePrice = parseInt(element.getAttribute("data-price"));
  }
  if (type === "variant") {
    orderData.variantPrice = element.getAttribute("data-price")
      ? parseInt(element.getAttribute("data-price"))
      : 0;
  }

  // Hitung ulang total harga
  calculateTotal();
}

// Fungsi untuk menghitung total harga
function calculateTotal() {
  const quantity = parseInt(document.getElementById("quantity").value) || 1;
  orderData.quantity = quantity;

  // Calculate delivery fee (free for 4+ cups)
  orderData.deliveryFee = quantity < 4 ? 1000 : 0;

  if (orderData.size) {
    const basePrice = orderData.sizePrice + orderData.variantPrice;
    const subtotal = basePrice * quantity;
    const total = subtotal + orderData.deliveryFee;

    document.getElementById(
      "total-price"
    ).textContent = `Rp ${total.toLocaleString("id-ID")}`;
  } else {
    document.getElementById("total-price").textContent = "Rp 0";
  }
}

// Variabel untuk mengontrol perubahan kuantitas
let quantityInterval = null;
let quantityTimeout = null;
let isUpdating = false; // Variabel untuk mencegah update terlalu cepat

// Fungsi untuk memulai perubahan kuantitas berkelanjutan
function startQuantityChange(change) {
  // Cek apakah perubahan sedang berlangsung
  if (isUpdating) return;

  // Jalankan perubahan pertama kali
  updateQuantity(change);

  // Tandai perubahan sedang berlangsung
  isUpdating = true;

  // Set timeout untuk perubahan berkelanjutan
  quantityTimeout = setTimeout(function () {
    quantityInterval = setInterval(function () {
      updateQuantity(change);
    }, 200);
  }, 300);
}

// Fungsi untuk menghentikan perubahan kuantitas
function stopQuantityChange() {
  // Hentikan timeout dan interval
  clearTimeout(quantityTimeout);
  if (quantityInterval) {
    clearInterval(quantityInterval);
    quantityInterval = null;
  }
  isUpdating = false;
}

// Fungsi untuk mengupdate kuantitas
function updateQuantity(change) {
  const input = document.getElementById("quantity");
  let value = parseInt(input.value) || 1;
  value += change;

  // Pastikan nilai dalam rentang 1-99
  if (value < 1) value = 1;
  if (value > 99) value = 99;

  input.value = value;
  orderData.quantity = value;
  calculateTotal();
}

// Fungsi untuk menampilkan popup konfirmasi
function showConfirmation() {
  const nameInput = document.getElementById("name");
  const name = nameInput.value.trim();

  // Validasi form
  if (!name) {
    alert("Aja kelalen Jenenge Di tulis disit kang/yu..!");
    // Fokus ke field nama setelah alert ditutup
    setTimeout(() => {
      nameInput.focus();
      nameInput.scrollIntoView({ behavior: "smooth", block: "center" });
      nameInput.classList.add("error");
    }, 0);
    return;
  }

  if (!orderData.size) {
    alert("Harap pilih ukuran cup");
    return;
  }

  if (!orderData.taste) {
    alert("Harap pilih rasa");
    return;
  }

  if (!orderData.variant) {
    alert("Harap pilih varian");
    return;
  }

  // Hitung harga
  const basePrice = orderData.sizePrice + orderData.variantPrice;
  const subtotal = basePrice * orderData.quantity;
  const deliveryFee = orderData.quantity < 4 ? 1000 : 0;
  const total = subtotal + deliveryFee;

  // Isi data ringkasan di popup
  document.getElementById("summary-name").textContent = name;

  // Ukuran cup
  // Di dalam fungsi showConfirmation(), perbaiki logika tampilan harga:
  document.getElementById("summary-size").innerHTML =
    `${orderData.size === "tangung" ? "Tanggung" : "Jumbo"} ` +
    `(<span class="price">Rp ${orderData.sizePrice.toLocaleString(
      "id-ID"
    )}</span>)`;
  // Rasa
  document.getElementById("summary-taste").textContent =
    orderData.taste === "manis" ? "Manis" : "Tawar";

  // Varian
  const variantText =
    orderData.variant === "es"
      ? "Es"
      : `Hangat (+<span class="price">Rp ${orderData.variantPrice.toLocaleString(
          "id-ID"
        )}</span>)`;
  document.getElementById("summary-variant").innerHTML = variantText;

  // Jumlah
  document.getElementById(
    "summary-quantity"
  ).textContent = `${orderData.quantity} cup`;

  // Ongkos kirim
  const deliveryElement = document.getElementById("summary-delivery");
  deliveryElement.textContent =
    deliveryFee === 0 ? "Gratis" : `Rp ${deliveryFee.toLocaleString("id-ID")}`;

  // Tambahkan class yang sesuai
  const deliveryItem =
    document.querySelector("#summary-delivery").parentElement;
  deliveryItem.className = "summary-item delivery"; // Reset class
  if (deliveryFee > 0) {
    deliveryItem.classList.add("fee");
  }
  document.getElementById("summary-delivery").textContent =
    deliveryFee === 0 ? "Gratis" : `Rp ${deliveryFee.toLocaleString("id-ID")}`;

  // Total harga
  document.getElementById(
    "summary-total"
  ).textContent = `Rp ${total.toLocaleString("id-ID")}`;

  // Tampilkan popup
  const popup = document.getElementById("confirmationPopup");
  popup.style.display = "flex";
  document.body.style.overflow = "hidden";
}

// Fungsi untuk menutup popup
function closePopup() {
  const popup = document.getElementById("confirmationPopup");
  popup.style.display = "none";
  document.body.style.overflow = "auto";
}

// Fungsi untuk mengirim pesanan via WhatsApp
function sendOrder() {
  const name = document.getElementById("name").value;
  const basePrice = orderData.sizePrice + orderData.variantPrice;
  const subtotal = basePrice * orderData.quantity;
  const deliveryFee = orderData.quantity < 4 ? 1000 : 0;
  const total = subtotal + deliveryFee;

  // Format pesan WhatsApp
  const message = `Halo Warung Ammin, saya mau pesan:
    
Nama: ${name}
Ukuran Cup: ${
    orderData.size === "tangung" ? "Tanggung" : "Jumbo"
  } (Rp ${orderData.sizePrice.toLocaleString("id-ID")})
Rasa: ${orderData.taste === "manis" ? "Manis" : "Tawar"}
Varian: ${orderData.variant === "es" ? "Es" : "Hangat"} ${
    orderData.variantPrice > 0
      ? `(+Rp ${orderData.variantPrice.toLocaleString("id-ID")})`
      : ""
  }
Jumlah: ${orderData.quantity} cup
Ongkos Kirim: ${
    orderData.deliveryFee === 0
      ? "Gratis"
      : `Rp ${orderData.deliveryFee.toLocaleString("id-ID")}`
  }

Total Harga: Rp ${(
    basePrice * orderData.quantity +
    orderData.deliveryFee
  ).toLocaleString("id-ID")}

Mohon konfirmasi ketersediaan dan alamat pengantaran. Terima kasih.`;

  // Encode pesan untuk URL
  const encodedMessage = encodeURIComponent(message);

  // Nomor WhatsApp
  const phoneNumber = "6282147288734";

  // Buka WhatsApp
  window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, "_blank");

  // Tutup popup setelah mengirim pesan
  closePopup();
}

// Inisialisasi kalkulasi harga
document.addEventListener("DOMContentLoaded", function () {
  calculateTotal();

  // Efek scroll untuk header
  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    function () {
      let currentScroll = window.pageYOffset;
      if (currentScroll > lastScrollTop && currentScroll > 100) {
        document.querySelector("header").style.top = "-100px";
      } else {
        document.querySelector("header").style.top = "0";
      }
      lastScrollTop = currentScroll;
    },
    false
  );
});

document.addEventListener("DOMContentLoaded", function () {
  calculateTotal();

  // Auto-focus ke field nama saat halaman dimuat
  document.getElementById("name").focus();

  // Efek scroll untuk header
  let lastScrollTop = 0;
  window.addEventListener(
    "scroll",
    function () {
      let currentScroll = window.pageYOffset;
      if (currentScroll > lastScrollTop && currentScroll > 100) {
        document.querySelector("header").style.top = "-100px";
      } else {
        document.querySelector("header").style.top = "0";
      }
      lastScrollTop = currentScroll;
    },
    false
  );
});
// Inisialisasi dari localStorage atau default
let stokHariIni = localStorage.getItem("stokSerai") || 10;
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("stok-jumlah").textContent = stokHariIni;
});
