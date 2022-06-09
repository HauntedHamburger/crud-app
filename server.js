const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient
const app = express();

app.listen(3000, () => {console.log('listening on 3000')}) 

const connectionString = 'mongodb+srv://HauntedHamburger:4nT$1nTh3$Ky@cluster0.l100rhw.mongodb.net/?retryWrites=true&w=majority'

MongoClient.connect(connectionString, { useUnifiedTopology: true })
    .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        const quotesCollection = db.collection('quotes')

        /* ------------- */
        /*  Middlewares  */
        /* ------------- */

        
        // informs express EJS is template engine
        app.set('view engine', 'ejs')
        // Body-parser !BEFORE! CRUD Handlers
        // urlencoded extracts data from <form> and adds to the body property in request obj
        app.use(bodyParser.urlencoded({ extended: true }))
        // let server read json
        app.use(bodyParser.json())
        // makes public folder accessible
        app.use(express.static('public'))
        
        

        /* ------------ */
        /*    Routes    */
        /* ------------ */

        // app.use(/* */)
        app.get('/', (req, res) => {
            db.collection('quotes').find().toArray()
                .then(quotes => {
                    res.render('index.ejs', { quotes: quotes })
                })
                .catch(error => console.error(error))
        })

        app.post('/quotes', (req, res) => {
            quotesCollection.insertOne(req.body)
                .then(result => {
                    res.redirect('/')
                })
                .catch(error => console.error(error))
        })

        app.put('/quotes', (req, res) => {
            quotesCollection.findOneAndUpdate(
                // -- query -- lets us filter the collection with key-value pairs
                { name: 'Yoda' },
                // -- update -- tells MongoDB what to change $set, $inc, $push
                {
                    $set: {
                        name: req.body.name,
                        quote: req.body.quote
                    }
                },
                // -- options -- tells MongoDB to define addition options for the request
                // upsert: inserts a document if no documents can be updated
                { upsert: true }                
            )
            .then(result => {console.log('Success')})
            .catch(error => console.error(error))
        })

        app.delete('/quotes', (req, res) => {
            quotesCollection.deleteOne({ name: req.body.name })
                .then(result => {
                    if (result.deletedCount === 0) {
                        return res.json('No quote to delete')
                    }
                    res.json(`Deleted Darth Vadar's quote`)
                })
                .catch(error => console.error(error))
        })

        // app.listen(/* */)
    })
    .catch(error => console.error(error))



// CRUD Handlers
