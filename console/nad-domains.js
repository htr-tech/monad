// This script automates the registration of .nad domains on app.nad.domains.
// It types names serially (e.g., kenzo3264, kenzo3265, etc.), checks availability,
// and registers available domains. It also handles cases like skipping already registered names.

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// The function types text character by character to simulate human typing.
// It adds and deletes an "X" at the end to ensure the input field registers the value correctly.
// Some input fields require this "trigger" to update their internal state.
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

const clickRegisterAnother = async () => {
	const findLink = async () => {
		let link = [...document.querySelectorAll('a.btn-primary')].find(a => a.textContent.includes("Register another"));
		while (!link) {
			await wait(1500);
			link = [...document.querySelectorAll('a.btn-primary')].find(a => a.textContent.includes("Register another"));
		}
		return link;
	};

	const link = await findLink();
	if (link) {
		link.click();
	}
};

const waitForAvailability = async () => {
	while (true) {
		const linkElement = document.querySelector('a.flex.space-x-4.items-center.justify-between');
		if (linkElement) {
			const statusText = linkElement.textContent.trim();
			if (statusText.includes("Available")) {
				linkElement.click();
				return true;
			} else if (statusText.includes("Registered")) {
				console.log("❌ Registered link found. Skipping...");
				return false;
			}
		}
		await wait(100);
	}
};

const main = async () => {
	let counter = 3264;

	while (true) {
		console.log(`Running iteration ${counter}`);
		await typeInInput(`kenzo${counter}`);
		const isAvailable = await waitForAvailability();

		if (isAvailable) {
			await wait(1000);
			uncheckBox();
			await clickButton("Register");
			await wait(4000);
			await clickRegisterAnother();
		}

		counter++;
		await wait(2000);
	}
};

main();
