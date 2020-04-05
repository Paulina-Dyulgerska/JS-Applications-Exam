import controllers from '../controllers/index.js'

const app = Sammy('#main', function () {
    this.use('Handlebars', 'hbs');

    //Home
    this.get('#/home', controllers.home.get.home);

    //User
    this.get('#/user/login', controllers.user.get.login);
    this.post('#/user/login', controllers.user.post.login);
    
    this.get('#/user/register', controllers.user.get.register);
    this.post('#/user/register', controllers.user.post.register);
    
    this.get('#/user/logout', controllers.user.get.logout);

    //Item
    this.get('#/item/list', controllers.item.get.list);

    this.get('#/item/create', controllers.item.get.create);
    this.post('#/item/create', controllers.item.post.create);

    this.get('#/item/details/:itemId', controllers.item.get.details);

    this.get('#/item/edit/:itemId', controllers.item.get.edit);
    this.post('#/item/edit/:itemId', controllers.item.post.edit);

    this.get('#/item/close/:itemId', controllers.item.del.close);
});

app.run('#/home');