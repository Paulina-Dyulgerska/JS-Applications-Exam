export default function (context) {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            context.isLoggedIn = true;
            context.userId = user.uid;
            context.email = user.email;

            localStorage.setItem('userId', user.uid); 
            localStorage.setItem('email', user.email);
        } else {
            context.isLoggedIn = false;
            context.userId = null;
            context.email = null;

            localStorage.removeItem('userId'); 
            localStorage.removeItem('email'); 
        }
    });

    return context.loadPartials({
        header: "../views/common/header.hbs",
        footer: "../views/common/footer.hbs",
    })
}