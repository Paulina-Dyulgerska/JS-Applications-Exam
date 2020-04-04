import extend from '../utils/context.js'

export default {
    get: {
        home: function (context) {
            console.log("Hi from home.");

            extend(context).then(function () { 
                this.partial("../views/home/home.hbs")

                console.log(context); //context_prototype {app: S…y.Application, verb: "get", path: "/index.html#/home", params: S…y.Object, target: undefined}
                console.log(this); //tova e Sammy.RenderContext {event_context: context_prototype, callbacks: Array(4), previous_content: 
            })
        }
    }
}