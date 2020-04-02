export function sendThreeSecNotifyMessage(mes){
    const ctn = document.getElementById('infoBox');
    ctn.textContent = mes;
    setTimeout(()=>{ ctn.textContent ="";}, 3000);
}

const ctn = document.getElementById('loadingBox');
ctn.style.display = 'block';
console.log('Hi from logging out')
ctn.textContent = 'Logging out....';
ctn.style.display = 'none';
