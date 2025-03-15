// This is a makeshift solution to automate clicking the "Confirm" button in the Haha Wallet interface.
// Watches for changes on the page and clicks the button if it finds one with "Confirm" in the text.

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function clickConfirmButton() {
    const buttons = document.querySelectorAll('button');
    let confirmButton = null;
    buttons.forEach(button => {
        if (button.textContent.trim().toLowerCase().includes('confirm')) {
            confirmButton = button;
        }
    });
    if (confirmButton) {
        confirmButton.click();
        console.log('Button Clicked.');
        wait(4000);
    }
}

const observer = new MutationObserver(() => {
    clickConfirmButton();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

clickConfirmButton();
