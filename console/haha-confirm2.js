const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function isOverlayPresent() {
    const overlay = document.querySelector('.fixed.top-0.left-0.w-screen.h-screen.bg-black.bg-opacity-30');
    return overlay !== null;
}

async function clickButtons() {
    const buttons = document.querySelectorAll('button.btn.btn-primary.w-full.mb-3');
    for (const button of buttons) {
        const buttonText = button.textContent.trim().toLowerCase();
        if (buttonText.includes('sign') || buttonText.includes('confirm')) {
            while (isOverlayPresent()) {
                console.log('Overlay detected, waiting...');
                await wait(5000);
            }
            await wait(2000);
            button.click();
            await wait(4000);
        }
    }
}

const observer = new MutationObserver(() => {
    clickButtons();
});

observer.observe(document.body, {
    childList: true,
    subtree: true,
});

clickButtons();
