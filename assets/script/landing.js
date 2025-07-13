// Animasi untuk teks di landing page
document.addEventListener('DOMContentLoaded', function() {
    const heroContent = document.querySelector('.hero-content');
    setTimeout(() => {
        heroContent.style.opacity = '1';
        heroContent.style.transform = 'translateY(0)';
    }, 300);
    
    // Efek paralaks sederhana
    document.addEventListener('mousemove', function(e) {
        const x = (window.innerWidth - e.pageX * 2) / 100;
        const y = (window.innerHeight - e.pageY * 2) / 100;
        document.querySelector('.hero').style.backgroundPosition = `${x}px ${y}px`;
    });
});