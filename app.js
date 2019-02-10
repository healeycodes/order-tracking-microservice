/* Firebase */
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://bominos-ccaaa.firebaseio.com'
});
const db = admin.database();

/* Express */
const express = require('express');
const app = express();
const server = require('http').Server(app);
app.use(express.static('public'));
app.use(express.json());

const uuidv4 = require('uuid/v4');

// Create a tracking instance
app.put('/private/orders', (req, res) => {
    const orderId = uuidv4();
    db.ref(`orders/${orderId}`).set({
        started: Date.now(),
        stage: 0 // Integer: 1-5 inclusive
    }, (err) => {
        if (err) {
            console.error(`Error creating tracking instance: ${err}`);
            return res.status(500).send('Server error');
        } else {
            return res.send(orderId);
        }
    })
});

// Set a tracking instance's state
app.post('/private/orders', (req, res) => {
    db.ref('orders').child(req.body.orderId).set({
        stage: req.body.stage
    }, (err) => {
        if (err) {
            console.error(`Error setting tracking instance state: ${err}`);
            return res.status(500).send('Server error');
        } else {
            return res.send('OK');
        }
    })
});

// Client access to a tracking insance
app.get('/public/orders/:orderId', (req, res) => {
    db.ref(`orders/${req.params.orderId}`)
        .once('value')
        .then(data => {
            if (data.val()) {
                return res.send(instance);
            } else {
                console.error(`Unknown tracking instance requested.`);
                return res.status(500).send('Server error');
            }
        })
});

if (module === require.main) {
    const PORT = process.env.PORT || 3000;
    server.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
}
