export default {
    register: function (email, password) {
        return firebase.auth().createUserWithEmailAndPassword(email, password);
    },
    login: function (email, password) {
        return firebase.auth().signInWithEmailAndPassword(email, password);
    },
    logout: function () {
        return firebase.auth().signOut();
    },
};