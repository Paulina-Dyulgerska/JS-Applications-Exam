import extend from '../utils/context.js'

export default {
    get: {
        home: function (context) {
            console.log("Hi from home.");
            // console.log(context); //vryshta mi context.prototype!!!
            //tuk sammy zarejda partial templates, koito mu zadam i kogato te sa gotovi, togava zarejda home
            //template, t.e. kogato na headers i footers zarejdaneto e gotovo, zarejda home.hbs.
            //sammy izpolzwa handlebars behind the scenes!!!

            extend(context).then(function () { //tuk e function, zashtoto trqbva da polzwame this-a, ako e ()=>{} nqma da polzwam this-a
                this.partial("../views/home/home.hbs")
            })
        }
    }
}