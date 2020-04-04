import models from '../models/index.js';
import extend from '../utils/context.js';
import docModifier from '../utils/doc-modifier.js';
import notificator from '../utils/notificator.js';
import errorHandler from '../utils/errorHandler.js';

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

            notificator.toggleLoading(true);

            models.user.logout()
                .then(r => {
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Logout successful.', 1000)
                    setTimeout(() => context.redirect('#/home'), 1000);
                })
                .catch(e => errorHandler(e, notificator));
        },
        profile: function (context) {
            console.log("Hi from get/user/profile");

            models.item.getAll()
                .then(r => {
                    const items = r.docs.map(c => docModifier(c));
                    context.email = localStorage.getItem('email');
                    context.useritems = [...items.filter(x => x.email === context.email)
                        .map(x => x.title)];
                    context.useritemsCount = context.useritems.length;
                    extend(context).then(function () {
                        this.partial("../views/user/profile.hbs")
                    })
                })
                .catch(e => errorHandler(e, notificator));
        },
    },
    post: {
        login: function (context) {
            console.log("Hi from post/user/login");

            const { email, password } = context.params;

            notificator.toggleLoading(true);

            models.user.login(email, password)
                .then(r => {
                    context.user = r;
                    context.email = r.email;
                    context.isLoggedIn = true;
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Login successful.', 2000)
                    setTimeout(() => context.redirect('#/item/list'), 2000);
                })
                .catch(e => errorHandler(e, notificator));

            Array.from(document.querySelectorAll('form input')).forEach(i => i.value = '');
        },
        register: function (context) {
            console.log("Hi from post/user/register")

            const { email, password, rePassword } = context.params;

            notificator.toggleLoading(true);

            if (password === rePassword) {
                models.user.register(email, password)
                    .then(r => {
                        notificator.toggleLoading(false);
                        notificator.showStatus('success', 'User registration successful.', 2000)
                        setTimeout(() => context.redirect('#/item/list'), 2000);
                    })
                    .catch(e => errorHandler(e, notificator));
            } else {
                errorHandler({ message: 'Passwords are different.' }, notificator)
            }

            Array.from(document.querySelectorAll('form input')).forEach(i => i.value = '');
        }
    },
};