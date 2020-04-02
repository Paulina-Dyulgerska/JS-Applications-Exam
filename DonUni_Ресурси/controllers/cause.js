import models from '../models/index.js';
import extend from '../utils/context.js';
import docModifier from '../utils/doc-modifier.js';

export default {
    get: {
        dashboard: function (context) {
            models.cause.getAll()
                .then(r => {
                    const causes = r.docs.map(c => docModifier(c));
                    context.causes = causes;
                    console.log(causes);
                    extend(context).then(function () {
                        this.partial('../views/cause/dashboard.hbs')
                    })
                })
                .catch(e => console.error(e));
        },
        create: function (context) {
            extend(context)
                .then(function () {
                    this.partial('../views/cause/create.hbs')
                })
        },
        details: function (context) {
            // console.log(context.params); //Sammy.Object {causeId: "Amvwq0VZ4kqzwCebfROf"}
            const { causeId } = context.params;

            models.cause.get(causeId)
                .then(c => {
                    context.cause = docModifier(c);

                    console.log(context.cause);
                    console.log(localStorage.getItem('userId'));
                    context.canDonate = context.cause.uId !== localStorage.getItem('userId');

                    extend(context).then(function () {
                        this.partial('../views/cause/details.hbs');
                    })
                })
                .catch(e => console.error(e));
        },
    },
    post: {
        create: function (context) {
            // console.log(context.params);
            //Sammy.Object {cause: "1", pictureUrl: "2", neededFunds: "3", description: "4"}
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

            models.cause.create(data)
                .then(r => {
                    console.log(r);
                    context.redirect('#/cause/dashboard');
                })
        }
    },
    put: {
        donate: function (context) {
            console.log(context.params);
            const { causeId, currentDonation } = context.params;

            models.cause.get(causeId)
                .then(r => {
                    console.log(r);
                    const cause = docModifier(r);
                    cause.collectedFunds += Number(currentDonation);
                    const donorEmail = localStorage.getItem('userEmail');
                    if (!cause.donors.some(x => x === donorEmail)) {
                        cause.donors.push(donorEmail)
                    }
                    console.log(cause);
                    return models.cause.donate(causeId, cause);
                })
                .then(r => {
                    context.redirect(`#/cause/details/${causeId}`)
                })
        }
    },
    del: {
        close: function (context) {
            const { causeId } = context.params;
            console.log(causeId);


            models.cause.close(causeId)
                .then((r) => {
                    context.redirect('#/cause/dashboard');
                });
        }
    },
}