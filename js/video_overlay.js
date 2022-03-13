const cooldownTime = 2500;
let cooldown = false;

let main;
let token;
let channelId;

(function () {
    console.log('Extension loaded.');

    main = document.getElementById('main');

    // Handle direct clicks.
    main.addEventListener('click', (event) => {
        handleClick(event);
    });

})();

// Click handler.
function handleClick(event) {

    if (cooldown) return;

    // Check modifier states.
    let modifiers = null;
    if (event.altKey || event.ctrlKey || event.shiftKey) {
        modifiers = {};
        if (event.altKey) modifiers.alt = true;
        if (event.ctrlKey) modifiers.ctrl = true;
        if (event.shiftKey) modifiers.shift = true;
    }

    // Get normalized coordinates for click.
    let normalizedX = (event.clientX * 1.0 / main.offsetWidth).toPrecision(3);
    let normalizedY = (event.clientY * 1.0 / main.offsetHeight).toPrecision(3);

    // Send clicks to ESB.
    sendClick(normalizedX, normalizedY, modifiers);

    // Draw clicks to screen.
    drawClick(event.clientX, event.clientY, modifiers);

    // Cooldown.
    cooldown = true;
    main.classList.add("cooldown");
    setTimeout(() => {
        cooldown = false;
        main.classList.remove("cooldown");
    }, cooldownTime);
}

function drawClick(clickX, clickY, modifiers) {
    let delay = 1000;

    let clickIndicator = document.createElement('div');
    clickIndicator.classList.add("clickIndicator");
    if (modifiers) clickIndicator.classList.add("clickIndicatorModifier");
    main.appendChild(clickIndicator);

    // Position click and start animation.
    let drawX = clickX - (clickIndicator.offsetWidth / 2.0);
    let drawY = clickY - (clickIndicator.offsetHeight / 2.0);

    clickIndicator.style.left = drawX + "px";
    clickIndicator.style.top = drawY + "px";
    clickIndicator.style.transitionDuration = (delay / 1000) + "s";

    clickIndicator.classList.add("clickIndicatorFade");

    // Destroy click after animation.
    setTimeout(() => {
        main.removeChild(clickIndicator);
    }, delay);
}

function sendClick(clickX, clickY, modifiers) {
    //const url = `https://heat-ebs.j38.net/click/${clickX}/${clickY}`;
    //const url = `https://heat-api.j38.workers.dev/channel/${channelId}`;
    //const url = `https://heat-api.j38.net/channel/${channelId}`;
    const url = `https://q7um85s62l.execute-api.eu-west-2.amazonaws.com/test/v1/click?MessageGroupId=${channelId}&MessageBody=${clickX}`;

    console.log(token);

    const method = "POST";
    const headers = { Authorization: `Bearer ${token}` };
    const data = {
        type: "click",
        x: clickX,
        y: clickY
    };
    
    if (modifiers) data.modifiers = modifiers;
    const body = JSON.stringify(data);

    // Post data to EBS.
    console.log(url);
    fetch(url, { method, headers, body })
        .then(async (response) => {
            let text = await response.text();
            console.log("Status: " + response.status);
            console.log("Status Text: " + response.statusText);
            console.log("Response: " + text);
        })
        .catch((error) => { console.log(error) });
}