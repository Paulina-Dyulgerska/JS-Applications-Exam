export default function (context) {
    //tazi function shte se izpylnqwa vinagi, kogato se sluchva nqkakwa zaqwka
    //tazi function predi towa trqbwa da sym q zakachila za samiq context.

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            // console.log(user);
            context.isLoggedIn = true;
            context.userId = user.uid;
            context.email = user.email;

            localStorage.setItem('userId', user.uid); //zakacham userId za localStorage
            localStorage.setItem('email', user.email); //zakacham userEmail za localStorage
        } else {
            // User is signed out.
            // console.log("not logged in")
            context.isLoggedIn = false;
            context.userId = null;
            context.email = null;

            localStorage.removeItem('userId'); //triq userId za localStorage
            localStorage.removeItem('email'); //triq userEmail za localStorage
        }
    });

    return context.loadPartials({
        // notifications: "../views/common/notifications.hbs",
        header: "../views/common/header.hbs",
        footer: "../views/common/footer.hbs",
    })
}
//v tozi file imam js logika, koqto shte mi obrabotva systoqnieto na usera!!!!