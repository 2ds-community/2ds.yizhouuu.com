document.querySelectorAll('.server-address[data-copy]').forEach(el => {
    el.addEventListener('click', () => {
        const text = el.dataset.copy;
        const toast = el.querySelector('.copy-toast');
        if (!text || !toast) return;
        navigator.clipboard.writeText(text).then(() => {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 1500);
        });
    });
});
