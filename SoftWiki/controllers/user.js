import models from '../models/index.js';
import extend from '../utils/context.js';

export default {
    get: {
        login: function (context) {
            console.log("Hi from get/user/login");

            if (localStorage.getItem('userId')) {
                context.redirect('#/item/list');
            } else {
                extend(context).then(function () {
                    this.partial("../views/user/login.hbs")
                })
            }
        },
        register: function (context) {
            console.log("Hi from get/user/register")

            if (localStorage.getItem('userId')) {
                context.redirect('#/item/list');
            } else {
                extend(context).then(function () {
                    this.partial("../views/user/register.hbs")
                })
            }
        },
        logout: function (context) {
            console.log("Hi from get/user/logout");

            models.user.logout()
                .then(r => {
                    context.redirect('#/home');
                })
                .catch(e => console.error(e));
        },
    },
    post: {
        login: function (context) {
            console.log("Hi from post/user/login");

            const { email, password } = context.params;

            models.user.login(email, password)
                .then(r => {
                    context.user = r;
                    context.email = r.email;
                    context.isLoggedIn = true;
                    context.redirect('#/item/list');
                })
                .catch(e => {
                    console.error(e);
                    alert('Resgister first or check credentials.')
                    context.redirect('#/home')
                });
        },
        register: function (context) {
            console.log("Hi from post/user/register")

            const { email, password, rePassword } = context.params;

            if (email.length >= 3 && password.length >= 3 && password === rePassword) {
                models.user.register(email, password)
                    .then(r => {
                       context.redirect('#/item/list');
                    })
                    .catch(e => console.error(e));
            } else {
                console.error({ message: 'Cridentials are not valid.' })
            }
        }
    },
};