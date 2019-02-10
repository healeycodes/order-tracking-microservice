// The query parameter `orderId` lets us provide order tracking
const orderId = new URLSearchParams(window.location.search).get('orderId');
const stages = document.querySelectorAll('.card');
let localStage = null; // Integer: 1-5 inclusive

/* While we are not at the end stage, check for new information every X seconds,
   if information is new, apply it */
const checkStage = () => {
    fetch(`/public/orders/${orderId}`)
        .then((res) => {
            try {
                const serverStage = res.json().stage;
                if (serverStage !== localStage) {
                    applyStage(serverStage);
                }
            } catch (e) {
                console.log(`Error fetching order tracking stage: ${e}`)
            }
            if (localStage < 5) {
                setTimeout(checkStage, 5000);
            }
        })
}

// Apply a given stage to the UI
const applyStage = (stage) => {
    localStage = stage;
    document.querySelectorAll('.current').forEach(div => div.classList.remove('current'));
    stages[localStage - 1].classList.add('current');
}

applyStage(1);
checkStage();
