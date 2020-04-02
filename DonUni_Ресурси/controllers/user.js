import models from '../models/index.js';
import extend from '../utils/context.js';

export default {
    get: {
        login: function (context) { //contexta mi se dawa ot Sammy
            console.log("Hi from get/user/login");
            console.log(context);
            console.log(this);
            //this i context dali sa edno i syshto neshto
            console.log(this === context); //true
            extend(context).then(function () {
                this.partial("../views/user/login.hbs")
            })
        },
        register: function (context) {
            console.log("Hi from get/user/register")
            extend(context).then(function () {
                this.partial("../views/user/register.hbs")
            })
        },
        logout: function (context) {
            console.log("Hi from get/user/logout");
            
            models.user.logout().then((r) => { 
                context.redirect('#/home');
            })
        },
    },
    post: {
        login: function (context) {
            console.log("Hi from post/user/login");
            const { username, password } = context.params;

            models.user.login(username, password)
                .then((r) => {
                    console.log(context);
                    context.user = r;
                    context.username = r.email;
                    context.isLoggedIn = true;
                    context.redirect('#/home');
                })
                .catch((e) => console.error(e))
        },
        register: function (context) {
            console.log("Hi from post/user/register")
            const { username, password, rePassword } = context.params;

            if (password === rePassword) {
                models.user.register(username, password)
                    .then((r) => {
                        console.log(r);
                        context.redirect('#/home');
                    })
                    .catch((e) => console.error(e))
            }
        }
    },
};