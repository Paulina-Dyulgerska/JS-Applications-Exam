import models from '../models/index.js';
import extend from '../utils/context.js';
import docModifier from '../utils/doc-modifier.js';

export default {
    get: {
        list: function (context) {
            console.log('Hi from trek/get/list');

            models.trek.getAll()
                .then(r => {
                    const treks = r.docs.map(c => docModifier(c));
                    context.treks = treks;

                    extend(context).then(function () {
                        this.partial('../views/trek/list.hbs')
                    })
                })
                .catch(e => console.error(e));
        },
        create: function (context) {
            console.log('Hi from trek/get/create');

            extend(context)
                .then(function () {
                    this.partial('../views/trek/create.hbs')
                })
        },
        details: function (context) {
            console.log('Hi from trek/get/details');
            const { trekId } = context.params;

            models.trek.get(trekId)
                .then(c => {
                    context.trek = docModifier(c);
                    context.canEditTrek = context.trek.uId === localStorage.getItem('userId');

                    extend(context).then(function () {
                        this.partial('../views/trek/details.hbs');
                    })
                })
                .catch(e => console.error(e));
        },
        edit: function (context) {
            console.log('Hi from trek/get/edit');
            const { trekId } = context.params;

            models.trek.get(trekId)
                .then(c => {
                    context.trek = docModifier(c);
                    extend(context).then(function () {
                        this.partial('../views/trek/edit.hbs');
                    })
                })
                .catch(e => console.error(e));
        }
    },
    post: {
        create: function (context) {
            console.log('Hi from trek/post/create');

            const inputData = { ...context.params };
            if (Object.values(inputData).some(x => x === '')) {
                alert('Empty input is not allowed');
                return;
            }

            const data = {
                ...context.params,
                uId: localStorage.getItem('userId'),
                email: localStorage.getItem('email'),
                likes: 0,
            }

            models.trek.create(data)
                .then(r => {
                    context.redirect('#/trek/list');
                })
                .catch((e) => console.error(e));

        },
        edit: function (context) {
            console.log('Hi from trek/post/edit');

            const { trekId } = context.params;

            models.trek.get(trekId)
                .then(r => {
                    //!!! to do the alert and fill the forms!!!!
                    const trek = docModifier(r);
                    const inputData = { ...context.params };

                    if (Object.values(inputData).some(x => x === '')) {
                        alert('Empty input is not allowed');
                        return;
                    }

                    const data = {
                        ...context.params,
                        uId: trek.uId,
                        email: trek.email,
                        likes: trek.likes,
                    }

                    return models.trek.edit(trekId, data);
                })
                .then(r => {
                    context.redirect(`#/trek/list`)
                })
                .catch((e) => console.error(e));

        },
    },
    put: {
        like: function (context) {
            console.log('Hi from trek/put/like');

            const { trekId } = context.params;

            models.trek.get(trekId)
                .then(r => {
                    const trek = docModifier(r);
                    
                    if (trek.email === localStorage.getItem('email')) {
                        console.log('Cannot like your own treks.');
                    
                        return;
                    }
                    trek.likes = trek.likes + 1;
                    
                    return models.trek.edit(trekId, trek);
                })
                .then(r => {
                    context.redirect(`#/trek/details/${trekId}`)
                })
                .catch((e) => console.error(e));

        },
    },
    del: {
        close: function (context) {
            console.log('Hi from trek/del/close');

            const { trekId } = context.params;

            models.trek.close(trekId)
                .then((r) => {
                    context.redirect('#/trek/list');
                })
                .catch((e) => console.error(e));
        }
    },
}