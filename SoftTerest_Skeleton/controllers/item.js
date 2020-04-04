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
                    notificator.showStatus('success', 'Loaded successfully.', 1000);
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
                    notificator.showStatus('success', 'Loaded successfully.', 1000);
                    context.item = docModifier(r);
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
                    context.item = docModifier(r);
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Idea edited successfully.', 1000)
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

            const hasValidData = data.title.length >= 6
                && data.description.length >= 10
                && (data.imageURL.startsWith('http://') || data.imageURL.startsWith('https://'));

            if (!hasValidData) {
                notificator.showStatus('error', 'Please fill the form correctly.', 1000)
                return false;
            }

            notificator.toggleLoading(true);

            models.item.create(data)
                .then(r => {
                    notificator.toggleLoading(false);
                    notificator.showStatus('success', 'Idea created successfully.', 1000)
                    setTimeout(() => context.redirect('#/item/list'), 1000);
                })
                .catch((e) => errorHandler(e, notificator));
            Array.from(document.querySelectorAll('form input')).forEach(i => i.value = '');
            // document.querySelectorAll('form input').reset();
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
                    notificator.showStatus('success', 'Comment created successfully.', 1000)
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

            models.item.get(itemId)
                .then(r => {
                    const item = docModifier(r);
                    console.log(item);
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