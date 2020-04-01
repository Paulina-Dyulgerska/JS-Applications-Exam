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
        profile: function(context){
            console.log("Hi from get/user/profile");

        }
    },
    post: {
        login: function (context) {
            console.log("Hi from post/user/login");
            const { email, password } = context.params;

            models.user.login(email, password)
                .then((r) => {
                    console.log(context);
                    context.user = r;
                    context.email = r.email;
                    context.isLoggedIn = true;
                    context.redirect('#/trek/list');
                })
                .catch((e) => console.error(e))
        },
        register: function (context) {
            console.log("Hi from post/user/register")
            const { email, password, rePassword } = context.params;
            console.log(context.params);
            console.log(email);

            if (password === rePassword) {
                models.user.register(email, password)
                    .then((r) => {
                        console.log(r);
                        context.redirect('#/home');
                    })
                    .catch((e) => console.error(e))
            }
        }
    },
};