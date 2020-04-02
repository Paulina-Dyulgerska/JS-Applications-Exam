const dbCollection = firebase.firestore().collection('causes');

export default {
    create: function (data) {
        return dbCollection.add(data)
    },
    getAll: function(){
        return dbCollection.get();
    },                              
    get: function(id) {
        return dbCollection.doc(id).get();
    },
    donate: function(id, data) {
        return dbCollection.doc(id).update(data);
    },
    close: function(id){
        return dbCollection.doc(id).delete();
    },
}