const functions = require('firebase-functions'),

    express = require('express'),
    cors = require('cors'),

    admin = require('firebase-admin'),

    AppError = require('../utils/appError')

admin.initializeApp()

const itemCustomerApp = express(),
    db = admin.firestore()

itemCustomerApp.use(cors({ origin: true }))

itemCustomerApp.get('/v1/item/', async (req, res) => {
    try {
        const snapshot = await db.collection('userCollection').get()
        let items = []
        snapshot.forEach(doc => {
            let id = doc.id
            let data = doc.data()

            items.push({ id, ...data })
        })

        // res.status(200).send(JSON.stringify(items))
        res.status(200).json({
            status: 'success',
            results: items.length,
            data: {
                items
            }
        })
    } catch (err) {
        console.log(err)
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
})

itemCustomerApp.get("/v1/item/:id", async (req, res, next) => {
    try {
        const snapshot = await db.collection('userCollection').doc(req.params.id).get()

        const itemId = snapshot.id
        const itemData = snapshot.data()

        if (!snapshot.exists) {
            // res.status(404).json({
            //     success: '💥 No document found with that ID'
            // })
            return next(new AppError('No document found with that ID', 404))
        }
        // res.status(200).send(JSON.stringify({ id: itemId, ...itemData }))
        res.status(200).json({
            status: 'success',
            data: {
                itemId, ...itemData
            }
        })

    } catch (err) {
        return console.log(err)
    }
})

itemCustomerApp.put("/v1/item/:id", async (req, res, next) => {
    try {
        const body = req.body

        let snapshot = await db.collection('userCollection').doc(req.params.id).get()

        if (!snapshot.exists) {
            // res.status(404).json({
            //     success: '💥 No document found with that ID'
            // })
            return next(new AppError('No document found with that ID', 404))
        }

        await db.collection('userCollection').doc(req.params.id).update(body)

        res.status(200).send()

    } catch (err) {
        console.log(err)
    }
})

itemCustomerApp.delete("/v1/item/:id", async (req, res, next) => {
    try {
        const snapshot = await db.collection('userCollection').doc(req.params.id).get()

        if (!snapshot.exists) {
            // res.status(404).json({
            //     success: '💥 No document found with that ID'
            // })
            return next(new AppError('No document found with that ID', 404))
        }

        await db.collection('userCollection').doc(req.params.id).delete()

        // res.status(200).send()
        res.status(204).json({
            status: 'success',
            data: null
        })

    } catch (err) {
        console.log(err)
    }
})

itemCustomerApp.post('/v1/item/', async (req, res) => {
    try {
        const item = req.body

        await db.collection('userCollection').add(item)
        // res.status(201).send()
        res.status(201).json({
            status: 'success'
        })

    } catch (err) {
        console.log(err)
    }
})


exports.api = functions.https.onRequest(itemCustomerApp)