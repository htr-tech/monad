// This script is a console-based tool for Discord to monitor messages from a specific user
// (with a username prefix) and detect when they send messages containing country names.
// It checks if any word in the message matches a country name from the `countryToCapital` object
// and copies the corresponding capital to the clipboard.
// Use `startObserver()` to begin monitoring, `stopObserver()` to stop, and `changeName(newPrefix)` to update the target username prefix.

let usernamePrefix = "callmecatz";

const countryToCapital = {
    "Afghanistan": "Kabul",
    "Albania": "Tirana",
    "Algeria": "Algiers",
    "Andorra": "Andorra la Vella",
    "Angola": "Luanda",
    "Antigua and Barbuda": "Saint Johns",
    "Argentina": "Buenos Aires",
    "Armenia": "Yerevan",
    "Australia": "Canberra",
    "Austria": "Vienna",
    "Azerbaijan": "Baku",
    "Bahamas": "Nassau",
    "Bahrain": "Manama",
    "Bangladesh": "Dhaka",
    "Barbados": "Bridgetown",
    "Belarus": "Minsk",
    "Belgium": "Brussels",
    "Belize": "Belmopan",
    "Benin": "Porto Novo",
    "Bhutan": "Thimphu",
    "Bolivia": "La Paz , Sucre",
    "Bosnia and Herzegovina": "Sarajevo",
    "Botswana": "Gaborone",
    "Brazil": "Brasilia",
    "Brunei": "Bandar Seri Begawan",
    "Bulgaria": "Sofia",
    "Burkina Faso": "Ouagadougou",
    "Burundi": "Gitega",
    "Cambodia": "Phnom Penh",
    "Cameroon": "Yaounde",
    "Canada": "Ottawa",
    "Cape Verde": "Praia",
    "Central African Republic": "Bangui",
    "Chad": "NDjamena",
    "Chile": "Santiago",
    "China": "Beijing",
    "Colombia": "Bogota",
    "Comoros": "Moroni",
    "Congo, Democratic Republic of the": "Kinshasa",
    "Congo, Republic of the": "Brazzaville",
    "Costa Rica": "San Jose",
    "Ivory Coast": "Yamoussoukro",
    "Croatia": "Zagreb",
    "Cuba": "Havana",
    "Cyprus": "Nicosia",
    "Czech": "Prague",
    "Denmark": "Copenhagen",
    "Djibouti": "Djibouti",
    "Dominica": "Roseau",
    "Dominican Republic": "Santo Domingo",
    "East Timor": "Dili",
    "Ecuador": "Quito",
    "Egypt": "Cairo",
    "El Salvador": "San Salvador",
    "England": "London",
    "Equatorial Guinea": "Malabo",
    "Eritrea": "Asmara",
    "Estonia": "Tallinn",
    "Eswatini": "Mbabane",
    "Ethiopia": "Addis Ababa",
    "Federated States of Micronesia": "Palikir",
    "Fiji": "Suva",
    "Finland": "Helsinki",
    "France": "Paris",
    "Gabon": "Libreville",
    "Gambia": "Banjul",
    "Georgia": "Tbilisi",
    "Germany": "Berlin",
    "Ghana": "Accra",
    "Greece": "Athens",
    "Grenada": "Saint George",
    "Guatemala": "Guatemala City",
    "Guinea": "Conakry",
    "Guinea-Bissau": "Bissau",
    "Guyana": "Georgetown",
    "Haiti": "Port au Prince",
    "Honduras": "Tegucigalpa",
    "Hungary": "Budapest",
    "Iceland": "Reykjavik",
    "India": "New Delhi",
    "Indonesia": "Jakarta",
    "Iran": "Tehran",
    "Iraq": "Baghdad",
    "Ireland": "Dublin",
    "Israel": "Jerusalem ",
    "Italy": "Rome",
    "Jamaica": "Kingston",
    "Japan": "Tokyo",
    "Jordan": "Amman",
    "Kazakhstan": "Astana",
    "Kenya": "Nairobi",
    "Kiribati": "Tarawa Atoll",
    "Kosovo": "Pristina",
    "Kuwait": "Kuwait City",
    "Kyrgyzstan": "Bishkek",
    "Laos": "Vientiane",
    "Latvia": "Riga",
    "Lebanon": "Beirut",
    "Lesotho": "Maseru",
    "Liberia": "Monrovia",
    "Libya": "Tripoli",
    "Liechtenstein": "Vaduz",
    "Lithuania": "Vilnius",
    "Luxembourg": "Luxembourg",
    "Madagascar": "Antananarivo",
    "Malawi": "Lilongwe",
    "Malaysia": "Kuala Lumpur",
    "Maldives": "Male",
    "Mali": "Bamako",
    "Malta": "Valletta",
    "Marshall Islands": "Majuro",
    "Mauritania": "Nouakchott",
    "Mauritius": "Port Louis",
    "Mexico": "Mexico City",
    "Moldova": "Chisinau",
    "Monaco": "Monaco",
    "Mongolia": "Ulaanbaatar",
    "Montenegro": "Podgorica",
    "Morocco": "Rabat",
    "Mozambique": "Maputo",
    "Myanmar": "Nay Pyi Taw",
    "Namibia": "Windhoek",
    "Nauru": "No official capital",
    "Nepal": "Kathmandu",
    "Netherlands": "Amsterdam",
    "New Zealand": "Wellington",
    "Nicaragua": "Managua",
    "Niger": "Niamey",
    "Nigeria": "Abuja",
    "North Korea": "Pyongyang",
    "Macedonia": "Skopje",
    "Northern Ireland": "Belfast",
    "Norway": "Oslo",
    "Oman": "Muscat",
    "Pakistan": "Islamabad",
    "Palau": "Melekeok",
    "Palestine": "Jerusalem ",
    "Panama": "Panama City",
    "Papua New Guinea": "Port Moresby",
    "Paraguay": "Asuncion",
    "Peru": "Lima",
    "Philippines": "Manila",
    "Poland": "Warsaw",
    "Portugal": "Lisbon",
    "Qatar": "Doha",
    "Romania": "Bucharest",
    "Russia": "Moscow",
    "Rwanda": "Kigali",
    "Saint Kitts and Nevis": "Basseterre",
    "Saint Lucia": "Castries",
    "Saint Vincent and the Grenadines": "Kingstown",
    "Samoa": "Apia",
    "San Marino": "San Marino",
    "Sao Tome and Principe": "Sao Tome",
    "Saudi Arabia": "Riyadh",
    "Scotland": "Edinburgh",
    "Senegal": "Dakar",
    "Serbia": "Belgrade",
    "Seychelles": "Victoria",
    "Sierra Leone": "Freetown",
    "Singapore": "Singapore",
    "Slovakia": "Bratislava",
    "Slovenia": "Ljubljana",
    "Solomon Islands": "Honiara",
    "Somalia": "Mogadishu",
    "South Africa": "Pretoria, Bloemfontein, Cape Town",
    "South Korea": "Seoul",
    "South Sudan": "Juba",
    "Spain": "Madrid",
    "Sri Lanka": "Sri Jayawardenapura Kotte",
    "Sudan": "Khartoum",
    "Suriname": "Paramaribo",
    "Sweden": "Stockholm",
    "Switzerland": "Bern",
    "Syria": "Damascus",
    "Taiwan": "Taipei",
    "Tajikistan": "Dushanbe",
    "Tanzania": "Dodoma",
    "Thailand": "Bangkok",
    "Togo": "Lome",
    "Tonga": "Nukualofa",
    "Trinidad and Tobago": "Port of Spain",
    "Tunisia": "Tunis",
    "Turkey": "Ankara",
    "Turkmenistan": "Ashgabat",
    "Tuvalu": "Funafuti",
    "Uganda": "Kampala",
    "Ukraine": "Kyiv or Kiev",
    "United Arab Emirates": "Abu Dhabi",
    "United Kingdom": "London",
    "United States": "Washington D.C.",
    "Uruguay": "Montevideo",
    "Uzbekistan": "Tashkent",
    "Vanuatu": "Port Vila",
    "Vatican City": "Vatican City",
    "Venezuela": "Caracas",
    "Vietnam": "Hanoi",
    "Wales": "Cardiff",
    "Yemen": "Sana",
    "Zambia": "Lusaka",
    "Zimbabwe": "Harare"
};

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
                                    const words = messageText.split(/\s+/).filter(word => word.length >= 4);
                                    let matchFound = false; // Flag to track if a match is found

                                    for (const word of words) {
                                        if (matchFound) break; // Stop searching if a match is already found

                                        for (const country in countryToCapital) {
                                            if (country.toLowerCase().includes(word.toLowerCase())) {
                                                const capital = countryToCapital[country];
                                                console.log(`${username}:`, messageText);
                                                navigator.clipboard.writeText(capital)
                                                    .then(() => {
                                                        console.log(`Capital: "${capital}"`);
                                                    })
                                                    .catch((err) => {
                                                        console.error("Failed:", err);
                                                    });
                                                matchFound = true; // Set the flag to true
                                                break; // Exit the loop once a match is found
                                            }
                                        }
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
        console.log(`Watching for users with "${usernamePrefix}".`);
    }
};

const stopObserver = () => {
    if (observer) {
        observer.disconnect();
        console.log("STOPPED");
    } else {
        console.log("NOT RUNNING");
    }
};

startObserver();
window.stopObserver = stopObserver;

window.changeName = (newPrefix) => {
    if (typeof newPrefix === "string" && newPrefix.length > 0) {
        usernamePrefix = newPrefix.toLowerCase();
        console.log(`New User: "${usernamePrefix}".`);
    } else {
        console.log("Invalid prefix");
    }
};
