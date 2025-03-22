const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const typeInInput = async (text) => {
    const input = document.querySelector('input[type="text"]');
    if (input) {
        input.focus();
        input.value = "";
        for (let char of text) {
            document.execCommand("insertText", false, char);
            await wait(50);
        }
    } else {
        console.log("Input box not found!");
    }
};

const clickSellButton = async () => {
    const sellButton = [...document.querySelectorAll('button')].find(b => b.innerText.includes("Sell"));
    if (sellButton) {
        sellButton.click();
    }
};

const sellCheck = async () => {
    const div = document.querySelector('div.flex.items-center.justify-between.rounded-lg.bg-gray-900.p-3');
    if (div) {
        const input = div.querySelector('input[placeholder="0.00"]');
        const span = div.querySelector('span.text-white');
        if (input && span && span.textContent.includes("KENZO")) {
            return true;
        }
    }
    return false;
};

const clickOrder = async () => {
    const placeOrderButton = document.querySelector('button.mt-3.w-full.rounded-lg.py-3.font-bold.bg-purple-600');
    if (placeOrderButton) {
        placeOrderButton.click();
    } else {
        console.log("Place Order not found!");
    }
};

const checkPopup = async () => {
    return new Promise((resolve) => {
        const selector = 'li[role="status"][data-state="open"]';
        const existing = document.querySelector(selector);
        if (existing && existing.textContent.includes("Sell Transaction Successful")) {
            resolve(true);
            return;
        }

        const observer = new MutationObserver((mutations) => {
            for (const mutation of mutations) {
                if (mutation.type === "childList") {
                    const popup = document.querySelector(selector);
                    if (popup && popup.textContent.includes("Sell Transaction Successful")) {
                        observer.disconnect();
                        resolve(true);
                        return;
                    }
                }
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            observer.disconnect();
            console.log("Popup not found.");
            resolve(false);
        }, 60000); // 1 Min Timeout
    });
};


const main = async () => {
    let number = 1;
    await wait(2000);

    while (true) {

        let sellFound = await sellCheck();

        if (!sellFound) {
            await clickSellButton();
            await wait(1000);
            sellFound = await sellCheck();
        }

        if (sellFound) {
            await typeInInput(number.toString());
            await wait(700);
            await clickOrder();
            await wait(5000);

            const popupFound = await checkPopup();
            if (!popupFound) {
                console.log("Stopping...");
                break;
            }

        }

        number++;
    }
};

main();
