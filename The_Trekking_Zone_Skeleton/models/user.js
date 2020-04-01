export default {
    register: function (username, password) {
        return firebase.auth().createUserWithEmailAndPassword(username, password);
    },
    login: function (username, password) {
        return firebase.auth().signInWithEmailAndPassword(username, password);
    },
    logout: function(){
        return firebase.auth().signOut();
    },
};