// This script is a console-based tool for Discord to monitor messages from a specific user
// (with a username prefix) and detect when they send messages containing emojis.
// It extracts the emoji's "data-name" attribute and copies it to the clipboard.
// Use `startObserver()` to begin monitoring, `stopObserver()` to stop, and `changePrefix(newPrefix)` to update the target username prefix.

let usernamePrefix = "callmecatz";

let observer;
const startObserver = () => {
    observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === 1 && node.tagName === 'LI' && node.classList.contains('messageListItem__5126c')) {
                    const contentsDiv = node.querySelector("div[class^='contents_']");
                    if (contentsDiv) {
                        const usernameSpan = contentsDiv.querySelector("span[class^='username_']");
                        if (usernameSpan) {
                            const username = usernameSpan.innerText || "";
                            if (username.toLowerCase().startsWith(usernamePrefix)) {
                                const messageContentDiv = contentsDiv.querySelector("div[id^='message-content-']");
                                if (messageContentDiv) {
                                    const messageText = messageContentDiv.innerText || "";
                                    const emojis = messageContentDiv.querySelectorAll("img.emoji");
                                    const emojiDataNames = [];
                                    emojis.forEach((emoji) => {
                                        const dataName = emoji.getAttribute("data-name");
                                        if (dataName) {
                                            const trimmedDataName = dataName.trim().replace(/^:+|:+$/g, '').trim();
                                            emojiDataNames.push(trimmedDataName);
                                        }
                                    });
                                    const containsOnlyEmoji = messageText.trim() === "" && emojis.length > 0;
                                    if (!containsOnlyEmoji && emojiDataNames.length > 0) {
                                        console.log(`${username}:`, messageText);
                                        const emojiName = emojiDataNames[0];
                                        navigator.clipboard.writeText(emojiName)
                                            .then(() => {
                                                console.log(`Emoji: "${emojiName}"`);
                                            })
                                            .catch((err) => {
                                                console.error("Failed:", err);
                                            });
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });
    });

    const targetNode = document.querySelector(".scrollerContent__36d07.content_d125d2");
    if (targetNode) {
        observer.observe(targetNode, {
            childList: true,
            subtree: true
        });
        console.log(`Username: "${usernamePrefix}".`);
    } else {
        console.log("Not started.");
    }
};

const stopObserver = () => {
    if (observer) {
        observer.disconnect();
        console.log("Observer stopped.");
    } else {
        console.log("Not Running.");
    }
};

const changePrefix = (newPrefix) => {
    if (typeof newPrefix === "string" && newPrefix.length > 0) {
        usernamePrefix = newPrefix.toLowerCase();
        console.log(`New User: "${usernamePrefix}".`);
    } else {
        console.log("Invalid");
    }
};

window.startObserver = startObserver;
window.stopObserver = stopObserver;
window.changePrefix = changePrefix;

startObserver();

const targetNode = document.querySelector(".scrollerContent__36d07.content_d125d2");
if (targetNode) {
    observer.observe(targetNode, {
        childList: true,
        subtree: true
    });
}
