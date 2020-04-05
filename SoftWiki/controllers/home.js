import extend from '../utils/context.js'

export default {
    get: {
        home: function (context) {
            console.log("Hi from home.");

            extend(context).then(function () {
                this.partial("../views/home/home.hbs")
            });
        }
    }
}