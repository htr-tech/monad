// This script automates sending a fixed amount of MON tokens to multiple addresses in the Haha Wallet.
// It processes each address in the array sequentially, performing the following steps:

(async () => {
    const addressText = `
    0xC31d7XXXXXXXXXXXXXXXXXXXXXXXX
    0xC31d7XXXXXXXXXXXXXXXXXXXXXXXX
    `;

    const amountToSend = "0.69";

    const addressArray = addressText.split('\n').map(line => line.trim()).filter(line => line !== "");
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    const clickButton = async (text) => {
        const findButton = async (text) => {
            let button = [...document.querySelectorAll('button')].find(b => b.innerText.includes(text));
            while (!button || button.disabled) {
                await wait(1500);
                button = [...document.querySelectorAll('button')].find(b => b.innerText.includes(text));
            }
            button.click();
        };
        await findButton(text);
    };

    const typeInInput = async (text) => {
        const input = document.querySelector('input[type="text"]');
        if (input) {
            input.focus();
            input.value = "";
            for (let char of text) {
                document.execCommand("insertText", false, char);
                await wait(50);
            }
            input.focus();
            document.execCommand("insertText", false, "X");
            await wait(500);
            document.execCommand("delete");
        } else {
            console.log("❌ Input box not found!");
        }
    };

    const uncheckBox = () => {
        const checkbox = document.querySelector('input[type="checkbox"]');
        if (checkbox && checkbox.checked) checkbox.click();
    };

    const processTransaction = async (address) => {
        await clickButton('Send');
        await wait(1000);
        await clickButton('MON');
        await wait(1000);
        await typeInInput(address);
        await wait(1300);
        uncheckBox();
        await wait(800);
        await clickButton('Continue');
        await wait(1000);
        await typeInInput(amountToSend);
        await wait(1000);
        await clickButton('Next');
        await wait(2000);
        await clickButton('Confirm');
    };

    for (let i = 0; i < addressArray.length; i++) {
        console.log(`[${i + 1}/${addressArray.length}] ${addressArray[i]}`);
        await processTransaction(addressArray[i]);
        console.log("Waiting for 5 seconds...");
        await wait(5000);
    }
    console.log("Done!");
})();