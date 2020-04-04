export default function(e, notificator) {
    notificator.toggleLoading(false);
    notificator.showStatus('error', e.message, 3000)
    console.error(e)
}