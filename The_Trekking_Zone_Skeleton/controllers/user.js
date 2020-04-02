import models from '../models/index.js';
import extend from '../utils/context.js';
import docModifier from '../utils/doc-modifier.js';

export default {
    get: {
        login: function (context) {
            console.log("Hi from get/user/login");

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

            models.user.logout()
            .then((r) => {
                context.redirect('#/home');
            })
                .catch((e) => console.error(e));
        },
        profile: function (context) {
            console.log("Hi from get/user/profile");

            models.trek.getAll()
                .then(r => {
                    const treks = r.docs.map(c => docModifier(c));
                    context.userTreks = [...treks.filter(x => x.email === localStorage.getItem('email'))
                        .map(x => x.location)];
                    context.email = localStorage.getItem('email');
                    context.userTreksCount = context.userTreks.length;
                    extend(context).then(function (r) {
                        this.partial("../views/user/profile.hbs")
                    })
                })
                .catch(e => console.error(e));
        },
    },
    post: {
        login: function (context) {
            console.log("Hi from post/user/login");

            const { email, password } = context.params;

            models.user.login(email, password)
                .then((r) => {
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

            if (password === rePassword) {
                models.user.register(email, password)
                    .then((r) => {
                        context.redirect('#/home');
                    })
                    .catch((e) => console.error(e))
            }
        }
    },
};