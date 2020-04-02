import models from '../models/index.js';
import extend from '../utils/context.js';
import docModifier from '../utils/doc-modifier.js';
import notificator from '../utils/notificator.js';
import errorHandler from '../utils/errorHandler.js';

export default {
    get: {
        list: function (context) {
            console.log('Hi from item/get/list');

            notificator.toggleLoading(true);

            models.item.getAll()
                .then(r => {
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Loaded successfully.', 2000)
                    return r;
                })
                .then(r => {
                    const items = r.docs.map(c => docModifier(c));
                    context.items = items;

                    extend(context).then(function () {
                        this.partial('../views/item/list.hbs')
                    })
                })
                .catch(e => errorHandler(e, notificator));
        },
        create: function (context) {
            console.log('Hi from item/get/create');

            extend(context)
                .then(function () {
                    this.partial('../views/item/create.hbs')
                })
        },
        details: function (context) {
            console.log('Hi from item/get/details');

            const { itemId } = context.params;

            notificator.toggleLoading(true);

            models.item.get(itemId)
                .then(r => {
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Loaded successfully.', 2000)
                    return r;
                })
                .then(c => {
                    context.item = docModifier(c);
                    context.canEdititem = context.item.uId === localStorage.getItem('userId');

                    extend(context).then(function () {
                        this.partial('../views/item/details.hbs');
                    })
                })
                .catch(e => errorHandler(e, notificator));
        },
        edit: function (context) {
            console.log('Hi from item/get/edit');

            const { itemId } = context.params;

            notificator.toggleLoading(true);

            models.item.get(itemId)
                .then(r => {
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Idea edited successfully.', 2000)
                    return r;
                })
                .then(r => {
                    context.item = docModifier(r);
                    extend(context).then(function () {
                        this.partial('../views/item/edit.hbs');
                    })
                })
                .catch(e => errorHandler(e, notificator));
        }
    },
    post: {
        create: function (context) {
            console.log('Hi from item/post/create');

            const inputData = { ...context.params };
            if (Object.values(inputData).some(x => x === '')) {
                return errorHandler({ message: 'Empty input in not a comment.' }, notificator);
            }

            const data = {
                ...context.params,
                uId: localStorage.getItem('userId'),
                email: localStorage.getItem('email'),
                creator: localStorage.getItem('email').split('@')[0],
                likes: 0,
                comments: [],
            }

            notificator.toggleLoading(true);

            models.item.create(data)
                .then(r => {
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Idea created successfully.', 2000)
                    context.redirect('#/item/list');
                })
                .catch((e) => errorHandler(e, notificator));
            Array.from(document.querySelectorAll('form input')).forEach(i => i.value = '');

        },
        edit: function (context) {
            console.log('Hi from item/post/edit');

            const { itemId } = context.params;

            notificator.toggleLoading(true);

            models.item.get(itemId)
                .then(r => {
                    const item = docModifier(r);
                    const inputData = { ...context.params };
                    console.log(item);

                    if (Object.values(inputData).some(x => x === '')) {
                        return errorHandler({ message: 'Empty input in not a comment.' }, notificator);
                    }

                    const commentor = localStorage.getItem('email').split('@')[0];

                    item.comments.push(`${commentor}: ${inputData.newComment}`);

                    const data = {
                        ...context.params,
                        uId: item.uId,
                        email: item.email,
                        creator: item.likes,
                        likes: item.likes,
                        comments: item.comments,
                    }
                    notificator.toggleLoading(false);

                    return models.item.edit(itemId, data);
                })
                .then(r => {
                    context.redirect(`#/item/details/${itemId}`)
                })
                .catch(e => errorHandler(e, notificator));

        },
    },
    put: {
        like: function (context) {
            console.log('Hi from item/put/like');

            const { itemId } = context.params;

            notificator.toggleLoading(true);

            models.item.get(itemId)
                .then((r) => {
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Like created successfully.', 3000);
                    return r;
                })
                .then(r => {
                    const item = docModifier(r);
                    item.likes = item.likes + 1;
                    return models.item.edit(itemId, item);
                })
                .then(r => {
                    context.redirect(`#/item/details/${itemId}`)
                })
                .catch(e => errorHandler(e, notificator));
        },
    },
    del: {
        close: function (context) {
            console.log('Hi from item/del/close');

            const { itemId } = context.params;

            models.item.close(itemId)
                .then(r => {
                    context.redirect('#/item/list');
                })
                .catch(e => errorHandler(e, notificator));
        }
    },
}