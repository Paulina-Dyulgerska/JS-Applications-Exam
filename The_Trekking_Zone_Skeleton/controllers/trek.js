import models from '../models/index.js';
import extend from '../utils/context.js';
import docModifier from '../utils/doc-modifier.js';

export default {
    get: {
        dashboard: function (context) {
            models.trek.getAll()
                .then(r => {
                    const treks = r.docs.map(c => docModifier(c));
                    context.treks = treks;
                    console.log(treks);
                    extend(context).then(function () {
                        this.partial('../views/trek/dashboard.hbs')
                    })
                })
                .catch(e => console.error(e));
        },
        create: function (context) {
            extend(context)
                .then(function () {
                    this.partial('../views/trek/create.hbs')
                })
        },
        details: function (context) {
            // console.log(context.params); //Sammy.Object {trekId: "Amvwq0VZ4kqzwCebfROf"}
            const { trekId } = context.params;

            models.trek.get(trekId)
                .then(c => {
                    context.trek = docModifier(c);

                    console.log(context.trek);
                    console.log(localStorage.getItem('userId'));
                    context.canDonate = context.trek.uId !== localStorage.getItem('userId');

                    extend(context).then(function () {
                        this.partial('../views/trek/details.hbs');
                    })
                })
                .catch(e => console.error(e));
        },
    },
    post: {
        create: function (context) {
            // console.log(context.params);
            //Sammy.Object {trek: "1", pictureUrl: "2", neededFunds: "3", description: "4"}
            console.log(context.params); //context.params ne e obiknoven obekt, a e Sammy obekt
            console.log({ ...context.params }); //context.params ne e obiknoven obekt, a e Sammy obekt

            const inputData = { ...context.params };
            if (Object.values(inputData).some(x => x === '')) {
                alert('Empty input is not allowed');
                return;
            }

            const data = {
                ...context.params,
                uId: localStorage.getItem('userId'),
                collectedFunds: 0,
                donors: []
            }

            models.trek.create(data)
                .then(r => {
                    console.log(r);
                    context.redirect('#/trek/dashboard');
                })
        }
    },
    put: {
        donate: function (context) {
            console.log(context.params);
            const { trekId, currentDonation } = context.params;

            models.trek.get(trekId)
                .then(r => {
                    console.log(r);
                    const trek = docModifier(r);
                    trek.collectedFunds += Number(currentDonation);
                    const donorEmail = localStorage.getItem('userEmail');
                    if (!trek.donors.some(x => x === donorEmail)) {
                        trek.donors.push(donorEmail)
                    }
                    console.log(trek);
                    return models.trek.donate(trekId, trek);
                })
                .then(r => {
                    context.redirect(`#/trek/details/${trekId}`)
                })
        }
    },
    del: {
        close: function (context) {
            const { trekId } = context.params;
            console.log(trekId);


            models.trek.close(trekId)
                .then((r) => {
                    context.redirect('#/trek/dashboard');
                });
        }
    },
}