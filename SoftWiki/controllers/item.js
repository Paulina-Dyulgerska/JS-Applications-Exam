import models from '../models/index.js';
import extend from '../utils/context.js';
import docModifier from '../utils/doc-modifier.js';

export default {
    get: {
        list: function (context) {
            console.log('Hi from item/get/list');

            models.item.getAll()
                .then(r => {
                    const items = r.docs.map(c => docModifier(c));
                    context.items = items;
                    context.itemsJS = items.filter(x => x.category === 'JavaScript')
                    .sort((a,b) => (a.title).localeCompare(b.title));
                    context.itemsC = items.filter(x => x.category === 'C#')
                    .sort((a,b) => (a.title).localeCompare(b.title));
                    context.itemsJava = items.filter(x => x.category === 'Java')
                    .sort((a,b) => (a.title).localeCompare(b.title));
                    context.itemsPyton = items.filter(x => x.category === 'Pyton')
                    .sort((a,b) => (a.title).localeCompare(b.title));

                    extend(context).then(function () {
                        this.partial('../views/item/list.hbs')
                    })
                })
                .catch(e => console.error(e));
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

            models.item.get(itemId)
                .then(r => {
                    context.item = docModifier(r);
                    context.canEdititem = context.item.uId === localStorage.getItem('userId');
                    extend(context).then(function () {  
                        this.partial('../views/item/details.hbs');
                    })
                })
                .catch(e => console.error(e));

        },
        edit: function (context) {
            console.log('Hi from item/get/edit');

            const { itemId } = context.params;

            models.item.get(itemId)
                .then(r => {
                    context.item = docModifier(r);
                    extend(context).then(function () {
                        this.partial('../views/item/edit.hbs');
                    })
                })
                .catch(e => console.error(e));
        }
    },
    post: {
        create: function (context) {
            console.log('Hi from item/post/create');

            const inputData = { ...context.params };
            if (Object.values(inputData).some(x => x === '')) {
                return alert('Empty input fields are not allowed.')
            }

            const data = {
                ...context.params,
                uId: localStorage.getItem('userId'),
                creator: localStorage.getItem('email'),
            }

            models.item.create(data)
                .then(r => {
                    context.redirect('#/item/list');
                })
                .catch(e => console.error(e));
        },
        edit: function (context) {
            console.log('Hi from item/post/edit');

            const { itemId } = context.params;

            models.item.get(itemId)
                .then(r => {
                    const item = docModifier(r);
                    const inputData = { ...context.params };
                    if (Object.values(inputData).some(x => x === '')) {
                        return alert('Empty input fields are not allowed.')
                    }
                    console.log(item);

                    const data = {
                        ...context.params,
                        uId: item.uId,
                        creator: item.creator,
                    }
                    console.log(data);
                    return models.item.edit(itemId, data);
                })
                .then(r => {
                    context.redirect(`#/item/list`)
                })
                .catch(e => console.error(e));
        },
    },
    del: {
        close: function (context) {
            console.log('Hi from item/del/close');

            const { itemId } = context.params;
            if(confirm('Are you sure?')) {
            models.item.close(itemId)
                .then(r => {
                    context.redirect('#/item/list');
                })
                .catch(e => console.error(e));
            }
        }
    },
}