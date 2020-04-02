export default {
    showStatus:   function (type, message, seconds = '3000') {
        const notEl = document.getElementById(`${type}Box`);
        notEl.textContent = message;
        notEl.style.display = 'block';

        setTimeout(() => { notEl.style.display = 'none';}, seconds);
    },
    toggleLoading: function (type = false) {
        const notEl = document.getElementById('loadingBox');
        notEl.style.display = type ? 'block' : 'none';
    }
}

// "successBox" 
// "loadingBox"
// "errorBox"