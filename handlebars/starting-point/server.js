const express = require("express");
const { check, validationResult } = require('express-validator');
const Handlebars = require('handlebars')
const expressHandlebars = require('express-handlebars')
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access')

const Restaurant = require('./models/restaurant');
const Menu = require('./models/menu');
const MenuItem = require('./models/menuItem');

const initialiseDb = require('./initialiseDb');
initialiseDb();

const app = express();
const port = 3000;



app.use(express.static('public'));

const handlebars = expressHandlebars({
    handlebars : allowInsecurePrototypeAccess(Handlebars)
})


app.engine('handlebars', handlebars);
app.set('view engine', 'handlebars')

//serve static assets from public folder
app.use(express.static('public')) //

//body parser so req.body is not undefined
app.use(require('body-parser').urlencoded());
app.use(express.json())
app.use(express.urlencoded({extended:false}))


const restaurantChecks = [
    check('name').not().isEmpty().trim().escape(),
    check('image').isURL(),
    check('name').isLength({ max: 50 })
]

app.get("/", (req, res) => {
    res.redirect ("/restaurants") 
})

app.get('/restaurants', async (req, res) => {
    const restaurants = await Restaurant.findAll();
    res.render("restaurant",{restaurants});
});

app.get('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id, {include: {
            model: Menu,
            include: MenuItem
        }
    });
    res.render("onerestaurant",{restaurant});
});

app.post('/restaurants', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    await Restaurant.create(req.body);
    res.sendStatus(201);
});

app.delete('/restaurants/:id', async (req, res) => {
    const resDelete = await Restaurant.destroy({
        where: {
            id: req.params.id
        }
    });console.log(resDelete)
    res.send(resDelete ? "Deleted Restaurant" : "Deleted Failed");
    
});
  //  res.sendStatus(200);
    



app.put('/restaurants/:id', restaurantChecks, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});

app.patch('/restaurants/:id', async (req, res) => {
    const restaurant = await Restaurant.findByPk(req.params.id);
    await restaurant.update(req.body);
    res.sendStatus(200);
});

app.get("/new-restaurant",(req,res) =>{
    const restaurantAlert = ""
    res.render("addrestaurantForm",{restaurantAlert})
})

app.post("/new-restaurant",async(req,res)=>{
    //Add restaurant to db based on html form data
    const newRestaurant = await Restaurant.create(req.body)
//create a restaurantAlert to pass to the template
let restaurantAlert = `${newRestaurant.name} added to your database`
   const foundRestaurant = await Restaurant.findByPk(newRestaurant.id)
   if(foundRestaurant){
       res.render('addrestaurantForm',{restaurantAlert})
   }else{
       restaurantAlert = "Failed to add sauce"
       res.render('addrestaurantForm',{restaurantAlert})
   }
    console.log(newRestaurant)
})

// app.delete('/restaurants/:id', async(req,res)=>{
//     const deleteRestaurant = await Restaurant.destroy({
//         where: {id:req.params.id}
//     })
//     const restaurants = await Restaurant.findAll();
//     res.render("restaurant",{restaurants})
// })

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});