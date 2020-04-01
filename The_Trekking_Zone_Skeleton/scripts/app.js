import controllers from '../controllers/index.js'

// Sammy - initialize the application - main is the div(id="main") tuk Sammy shte vizualizira templatite.
const app = Sammy('#main', function () {
    // include a plugin:
    // Set handlebars as template engine if used
    this.use('Handlebars', 'hbs'); //kazwam kakyv e template engina i kakyv e extention-a na samite templates

    // define a 'route', / is the base of the routing, t.e. home/local/..., razdeleni sa s / chastite na path-q
    // this.get('#/', function (ctx) { //functiona e podavane na context, podobno na templating-a
    //     // load some data
    //     // this.load('posts.json')
    //     //     // render a template
    //     //     .renderEach('post.mustache')
    //     //     // swap the DOM with the new content
    //     //     .swap()
    // });

    //Home
    this.get('#/home', controllers.home.get.home); //get request s endpoint na path '#/home' 
    //stava izpylnenie na handler-function-a, kojto sym zadala tuk. A kakvo stava na praktika:
    //pri get request na #/home URL az izwikawam home controller-a s action get i iskam da get-na home-a 
    //Sammy podava by default na handler-functionite context-a!!! Ako zakacha na context objecta dadena
    //bool promenliva, to moga posle da go vikam i polzwam.

    //User
    this.get('#/user/login', controllers.user.get.login);
    this.get('#/user/register', controllers.user.get.register);

    this.post('#/user/login', controllers.user.post.login);
    this.post('#/user/register', controllers.user.post.register);
    this.get('#/user/logout', controllers.user.get.logout);

    //trek
    this.get('#/trek/list', controllers.trek.get.list);
    this.get('#/trek/create', controllers.trek.get.create);
    this.get('#/trek/details/:trekId', controllers.trek.get.details);

    this.post('#/trek/create', controllers.trek.post.create);

    this.put('#/trek/edit/:trekId', controllers.trek.put.edit);
    this.put('#/trek/like/:trekId', controllers.trek.put.like);
    this.get('#/trek/close/:trekId', controllers.trek.del.close);

    console.log(this);
});

// // start the application - nqma li da trygne i bez IIFE?
// (() => {
//     app.run('#/home'); //shte startiram routera na home!!!
// })()

app.run('#/home'); //shte startiram routera na home!!! Sammy-to syzdava negov this, kojto az posle
//si podavam kato context po-natatyk v logikata! 
//This-a, kojto mi vryshta Sammy, mi stava context v context.js
//tozi this, kojto generira Sammy-to e vse edno dyrjaven obekt, kojto Sammy-to mi dava i az posle moga
//da go manipuliram i da mu dobavqm propertyta, kato mi trqbwat.
//V tozi this, kojto az naricham context posle, se dyrji vsichko, koeto definiram v Sammy-to, t.e.
//context-a mi e samiqt router, samiqt router kato obekt az go razkarvam napred nazad posle!!!!
//i izpolzwam negowite methods i t.n.!!!!
//towa e:
//Sammy.Application {routes: {…}, listeners: S…y.Object, arounds: Array(0), befores: Array(0), namespace: "1585691931593-647", …}
// These are equivalent:
// get('#/by_name/:name', function() {
//         this.redirect('#', this.params['name']);
//       });
      
// get('#/by_name/:name', function(context) {
//         context.redirect('#', this.params['name']);
//       });