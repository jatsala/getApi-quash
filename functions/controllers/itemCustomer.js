const functions = require('firebase-functions'),

    express = require('express'),
    cors = require('cors'),

    admin = require('firebase-admin')
admin.initializeApp()

const itemCustomerApp = express(),
    db = admin.firestore()

itemCustomerApp.use(cors({ origin: true }))

itemCustomerApp.get('/v1/item/', async (req, res) => {
    const snapshot = await db.collection('userCollection').get()
    let items = []
    snapshot.forEach(doc => {
        let id = doc.id
        let data = doc.data()

        items.push({ id, ...data })
    })

    res.status(200).send(JSON.stringify(items))
})

itemCustomerApp.get("/v1/item/:id", async (req, res) => {
    const snapshot = await db.collection('userCollection').doc(req.params.id).get()

    const itemId = snapshot.id
    const itemData = snapshot.data()

    res.status(200).send(JSON.stringify({ id: itemId, ...itemData }))
})

itemCustomerApp.put("/v1/item/:id", async (req, res) => {
    const body = req.body;

    await db.collection('userCollection').doc(req.params.id).update(body)

    res.status(200).send()
})

itemCustomerApp.delete("/v1/item/:id", async (req, res) => {
    await db.collection('userCollection').doc(req.params.id).delete()

    res.status(200).send()
})

itemCustomerApp.post('/v1/item/', async (req, res) => {
    const item = req.body

    await db.collection('userCollection').add(item)

    res.status(201).send()
})


exports.api = functions.https.onRequest(itemCustomerApp)