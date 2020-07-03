const functions = require('firebase-functions'),
    admin = require('firebase-admin')

admin.initializeApp()

const express = require('express'),
    app = express()

app.get('/items', (req, res) => {
    admin
        .firestore()
        .collection("quashOper")
        .orderBy('registered', 'desc')
        .get()
        .then(data => {
            let items = []
            data.forEach(doc => {
                items.push({
                    itemId: doc.id,
                    isActive: doc.data().isActive,
                    balance: doc.data().balance,
                    picture: doc.data().picture,
                    age: doc.data().age,
                    name: doc.data().name,
                    gender: doc.data().gender,
                    company: doc.data().company,
                    email: doc.data().email,
                    phone: doc.data().phone,
                    address: doc.data().address,
                    registered: doc.data().registered,
                    employmentstatus: doc.data().employmentstatus,
                    monthlyincome: doc.data().monthlyincome,
                    annualincome: doc.data().annualincome,
                    creditscore: doc.data().creditscore,
                    loanamount: doc.data().loanamount,
                    interestrate: doc.data().interestrate,
                    scoreapc: doc.data().scoreapc,
                    paymentmehod: doc.data().paymentmehod

                })
            })
            return res.json(items)
        })
        .catch(err => console.error(err))
})

exports.api = functions.https.onRequest(app)