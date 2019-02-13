/* Firebase */
const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // .gitignored
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.DB
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
app.get('/private/orders', (req, res) => {
    const orderId = uuidv4();
    db.ref(`orders/${orderId}`).set({
        started: Date.now(),
        // Integer: 1-5 inclusive
        stage: 1
    })
        .then(() => {
            return res.send(orderId);
        })
        .catch((err) => {
            console.error(`Error creating tracking instance: ${err}`);
            return res.status(500).send('Server error');
        })
});

// Set a tracking instance's state
app.post('/private/orders', (req, res) => {
    db.ref('orders').child(req.body.orderId).set({
        // Clamp stage
        stage: Math.max(1, Math.min(5, req.body.stage))
    })
        .then(() => {
            return res.send('OK');
        })
        .catch((err) => {
            console.error(`Error setting tracking instance state: ${err}`);
            return res.status(500).send('Server error');
        })
});

// Client access to a tracking insance
app.get('/public/orders/:orderId', (req, res) => {
    const orderId = req.params.orderId;
    db.ref(`orders/${orderId}`)
        .once('value')
        .then(data => {
            order = data.val();
            if (order !== null) {
                return res.send(order);
            } else {
                console.error(`Unknown tracking instance requested.`);
                return res.status(500).send('Server error');
            }
        })
        .catch((err) => console.error(`Order: ${orderId} errored: ${err}`));
});

if (module === require.main) {
    const PORT = process.env.PORT || 80;
    server.listen(PORT, () => {
        console.log(`App listening on port ${PORT}`);
    });
} else {
    module.exports = app;
}
