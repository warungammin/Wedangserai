

document.addEventListener('DOMContentLoaded', function() {
    // Animasi untuk kartu fitur
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 200 * index);
    });
    
    // Animasi untuk menu cards
    const menuCards = document.querySelectorAll('.menu-card');
    menuCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 300 + (200 * index));
    });
    
    // Animasi untuk testimonial
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonialCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 500 + (200 * index));
    });
    
    // Efek scroll untuk header
    let lastScrollTop = 0;
    window.addEventListener("scroll", function() {
        let currentScroll = window.pageYOffset;
        if (currentScroll > lastScrollTop && currentScroll > 100){
            document.querySelector("header").style.top = "-100px";
        } else {
            document.querySelector("header").style.top = "0";
        }
        lastScrollTop = currentScroll;
    }, false);
});
document.addEventListener('DOMContentLoaded', function () {
    const orderBtn = document.querySelector('.order-button');
    if (orderBtn) {
        orderBtn.addEventListener('click', function (e) {
            e.preventDefault(); // mencegah pindah halaman langsung
            document.body.classList.add('fade-out');
            setTimeout(() => {
                window.location.href = orderBtn.href;
            }, 400); // waktu harus sama dengan durasi animasi
        });
    }
});
// Inisialisasi dari localStorage atau default
let stokHariIni = localStorage.getItem('stokSerai') || 10;
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('stok-jumlah').textContent = stokHariIni;
});
