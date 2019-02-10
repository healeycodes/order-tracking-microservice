window.orderTracking = {};

// The query parameter `orderId` lets us provide order tracking
window.orderId = new URLSearchParams(window.location.search).get('orderId');

/* While we are not at the end stage, check for new information every X seconds,
   if information is new, apply it */
window.localStage = null; // Integer: 1-5 inclusive
const checkStage = () => {
    fetch(`/public/orders/${window.orderId}`)
        .then(res => res.json())
        .then(data => {
            applyStage(data.stage);
        })
        .catch(err => console.error(`Error connecting to server: ${err}`))
    if (window.localStage < 5) {
        setTimeout(checkStage, 10000);
    }
}

// Apply a given stage to the UI
const stages = document.querySelectorAll('.card');
const applyStage = (stage) => {
    window.localStage = stage;
    document.querySelectorAll('.current').forEach(div => div.classList.remove('current'));
    stages[window.localStage - 1].classList.add('current');
}

applyStage(1);
checkStage();
