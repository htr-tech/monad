// This script is a console-based tool for Discord to cheat in a flag-guessing game.
// It watches for new messages in the chat and automatically detects when a specific user
// (with a username prefix) sends a message containing country flag emojis.
// If the message contains valid flag emojis, it copies the corresponding country name to the clipboard.
// Use `startObserver()` to start watching and `fuckServer()` to stop.
// You can also change the target username prefix dynamically using `changeName(newPrefix)`.

let usernamePrefix = "callmecatz";

const emojiToCountry = {
    "🇦🇩": "Andorra",
    "🇦🇪": "United Arab Emirates",
    "🇦🇫": "Afghanistan",
    "🇦🇬": "Antigua and Barbuda",
    "🇦🇮": "Anguilla",
    "🇦🇱": "Albania",
    "🇦🇲": "Armenia",
    "🇦🇴": "Angola",
    "🇦🇶": "Antarctica",
    "🇦🇷": "Argentina",
    "🇦🇸": "American Samoa",
    "🇦🇹": "Austria",
    "🇦🇺": "Australia",
    "🇦🇼": "Aruba",
    "🇦🇽": "Åland Islands",
    "🇦🇿": "Azerbaijan",
    "🇧🇦": "Bosnia and Herzegovina",
    "🇧🇧": "Barbados",
    "🇧🇩": "Bangladesh",
    "🇧🇪": "Belgium",
    "🇧🇫": "Burkina Faso",
    "🇧🇬": "Bulgaria",
    "🇧🇭": "Bahrain",
    "🇧🇮": "Burundi",
    "🇧🇯": "Benin",
    "🇧🇱": "Saint Barthélemy",
    "🇧🇲": "Bermuda",
    "🇧🇳": "Brunei Darussalam",
    "🇧🇴": "Bolivia, Plurinational State of",
    "🇧🇶": "Bonaire, Sint Eustatius and Saba",
    "🇧🇷": "Brazil",
    "🇧🇸": "Bahamas",
    "🇧🇹": "Bhutan",
    "🇧🇻": "Bouvet Island",
    "🇧🇼": "Botswana",
    "🇧🇾": "Belarus",
    "🇧🇿": "Belize",
    "🇨🇦": "Canada",
    "🇨🇨": "Cocos (Keeling) Islands",
    "🇨🇩": "Congo, Democratic Republic of the",
    "🇨🇫": "Central African Republic",
    "🇨🇬": "Congo",
    "🇨🇭": "Switzerland",
    "🇨🇮": "Côte d'Ivoire",
    "🇨🇰": "Cook Islands",
    "🇨🇱": "Chile",
    "🇨🇲": "Cameroon",
    "🇨🇳": "China",
    "🇨🇴": "Colombia",
    "🇨🇷": "Costa Rica",
    "🇨🇺": "Cuba",
    "🇨🇻": "Cabo Verde",
    "🇨🇼": "Curaçao",
    "🇨🇽": "Christmas Island",
    "🇨🇾": "Cyprus",
    "🇨🇿": "Czechia",
    "🇩🇪": "Germany",
    "🇩🇯": "Djibouti",
    "🇩🇰": "Denmark",
    "🇩🇲": "Dominica",
    "🇩🇴": "Dominican Republic",
    "🇩🇿": "Algeria",
    "🇪🇨": "Ecuador",
    "🇪🇪": "Estonia",
    "🇪🇬": "Egypt",
    "🇪🇭": "Western Sahara",
    "🇪🇷": "Eritrea",
    "🇪🇸": "Spain",
    "🇪🇹": "Ethiopia",
    "🇫🇮": "Finland",
    "🇫🇯": "Fiji",
    "🇫🇰": "Falkland Islands (Malvinas)",
    "🇫🇲": "Micronesia, Federated States of",
    "🇫🇴": "Faroe Islands",
    "🇫🇷": "France",
    "🇬🇦": "Gabon",
    "🇬🇧": "United Kingdom of Great Britain and Northern Ireland",
    "🇬🇩": "Grenada",
    "🇬🇪": "Georgia",
    "🇬🇫": "French Guiana",
    "🇬🇬": "Guernsey",
    "🇬🇭": "Ghana",
    "🇬🇮": "Gibraltar",
    "🇬🇱": "Greenland",
    "🇬🇲": "Gambia",
    "🇬🇳": "Guinea",
    "🇬🇵": "Guadeloupe",
    "🇬🇶": "Equatorial Guinea",
    "🇬🇷": "Greece",
    "🇬🇸": "South Georgia and the South Sandwich Islands",
    "🇬🇹": "Guatemala",
    "🇬🇺": "Guam",
    "🇬🇼": "Guinea-Bissau",
    "🇬🇾": "Guyana",
    "🇭🇰": "Hong Kong",
    "🇭🇲": "Heard Island and McDonald Islands",
    "🇭🇳": "Honduras",
    "🇭🇷": "Croatia",
    "🇭🇹": "Haiti",
    "🇭🇺": "Hungary",
    "🇮🇩": "Indonesia",
    "🇮🇪": "Ireland",
    "🇮🇱": "Israel",
    "🇮🇲": "Isle of Man",
    "🇮🇳": "India",
    "🇮🇴": "British Indian Ocean Territory",
    "🇮🇶": "Iraq",
    "🇮🇷": "Iran, Islamic Republic of",
    "🇮🇸": "Iceland",
    "🇮🇹": "Italy",
    "🇯🇪": "Jersey",
    "🇯🇲": "Jamaica",
    "🇯🇴": "Jordan",
    "🇯🇵": "Japan",
    "🇰🇪": "Kenya",
    "🇰🇬": "Kyrgyzstan",
    "🇰🇭": "Cambodia",
    "🇰🇮": "Kiribati",
    "🇰🇲": "Comoros",
    "🇰🇳": "Saint Kitts and Nevis",
    "🇰🇵": "Korea, Democratic People's Republic of",
    "🇰🇷": "Korea, Republic of",
    "🇰🇼": "Kuwait",
    "🇰🇾": "Cayman Islands",
    "🇰🇿": "Kazakhstan",
    "🇱🇦": "Lao People's Democratic Republic",
    "🇱🇧": "Lebanon",
    "🇱🇨": "Saint Lucia",
    "🇱🇮": "Liechtenstein",
    "🇱🇰": "Sri Lanka",
    "🇱🇷": "Liberia",
    "🇱🇸": "Lesotho",
    "🇱🇹": "Lithuania",
    "🇱🇺": "Luxembourg",
    "🇱🇻": "Latvia",
    "🇱🇾": "Libya",
    "🇲🇦": "Morocco",
    "🇲🇨": "Monaco",
    "🇲🇩": "Moldova, Republic of",
    "🇲🇪": "Montenegro",
    "🇲🇫": "Saint Martin (French part)",
    "🇲🇬": "Madagascar",
    "🇲🇭": "Marshall Islands",
    "🇲🇰": "North Macedonia",
    "🇲🇱": "Mali",
    "🇲🇲": "Myanmar",
    "🇲🇳": "Mongolia",
    "🇲🇴": "Macao",
    "🇲🇵": "Northern Mariana Islands",
    "🇲🇶": "Martinique",
    "🇲🇷": "Mauritania",
    "🇲🇸": "Montserrat",
    "🇲🇹": "Malta",
    "🇲🇺": "Mauritius",
    "🇲🇻": "Maldives",
    "🇲🇼": "Malawi",
    "🇲🇽": "Mexico",
    "🇲🇾": "Malaysia",
    "🇲🇿": "Mozambique",
    "🇳🇦": "Namibia",
    "🇳🇨": "New Caledonia",
    "🇳🇪": "Niger",
    "🇳🇫": "Norfolk Island",
    "🇳🇬": "Nigeria",
    "🇳🇮": "Nicaragua",
    "🇳🇱": "Netherlands, Kingdom of the",
    "🇳🇴": "Norway",
    "🇳🇵": "Nepal",
    "🇳🇷": "Nauru",
    "🇳🇺": "Niue",
    "🇳🇿": "New Zealand",
    "🇴🇲": "Oman",
    "🇵🇦": "Panama",
    "🇵🇪": "Peru",
    "🇵🇫": "French Polynesia",
    "🇵🇬": "Papua New Guinea",
    "🇵🇭": "Philippines",
    "🇵🇰": "Pakistan",
    "🇵🇱": "Poland",
    "🇵🇲": "Saint Pierre and Miquelon",
    "🇵🇳": "Pitcairn",
    "🇵🇷": "Puerto Rico",
    "🇵🇸": "Palestine, State of",
    "🇵🇹": "Portugal",
    "🇵🇼": "Palau",
    "🇵🇾": "Paraguay",
    "🇶🇦": "Qatar",
    "🇷🇪": "Réunion",
    "🇷🇴": "Romania",
    "🇷🇸": "Serbia",
    "🇷🇺": "Russian Federation",
    "🇷🇼": "Rwanda",
    "🇸🇦": "Saudi Arabia",
    "🇸🇧": "Solomon Islands",
    "🇸🇨": "Seychelles",
    "🇸🇩": "Sudan",
    "🇸🇪": "Sweden",
    "🇸🇬": "Singapore",
    "🇸🇭": "Saint Helena, Ascension and Tristan da Cunha",
    "🇸🇮": "Slovenia",
    "🇸🇯": "Svalbard and Jan Mayen",
    "🇸🇰": "Slovakia",
    "🇸🇱": "Sierra Leone",
    "🇸🇲": "San Marino",
    "🇸🇳": "Senegal",
    "🇸🇴": "Somalia",
    "🇸🇷": "Suriname",
    "🇸🇸": "South Sudan",
    "🇸🇹": "Sao Tome and Principe",
    "🇸🇻": "El Salvador",
    "🇸🇽": "Sint Maarten (Dutch part)",
    "🇸🇾": "Syrian Arab Republic",
    "🇸🇿": "Eswatini",
    "🇹🇨": "Turks and Caicos Islands",
    "🇹🇩": "Chad",
    "🇹🇫": "French Southern Territories",
    "🇹🇬": "Togo",
    "🇹🇭": "Thailand",
    "🇹🇯": "Tajikistan",
    "🇹🇰": "Tokelau",
    "🇹🇱": "Timor-Leste",
    "🇹🇲": "Turkmenistan",
    "🇹🇳": "Tunisia",
    "🇹🇴": "Tonga",
    "🇹🇷": "Türkiye",
    "🇹🇹": "Trinidad and Tobago",
    "🇹🇻": "Tuvalu",
    "🇹🇼": "Taiwan, Province of China",
    "🇹🇿": "Tanzania, United Republic of",
    "🇺🇦": "Ukraine",
    "🇺🇬": "Uganda",
    "🇺🇲": "United States Minor Outlying Islands",
    "🇺🇸": "United States of America",
    "🇺🇾": "Uruguay",
    "🇺🇿": "Uzbekistan",
    "🇻🇦": "Holy See",
    "🇻🇨": "Saint Vincent and the Grenadines",
    "🇻🇪": "Venezuela, Bolivarian Republic of",
    "🇻🇬": "Virgin Islands (British)",
    "🇻🇮": "Virgin Islands (U.S.)",
    "🇻🇳": "Viet Nam",
    "🇻🇺": "Vanuatu",
    "🇼🇫": "Wallis and Futuna",
    "🇼🇸": "Samoa",
    "🇾🇪": "Yemen",
    "🇾🇹": "Mayotte",
    "🇿🇦": "South Africa",
    "🇿🇲": "Zambia",
    "🇿🇼": "Zimbabwe"
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
                                    const emojis = messageContentDiv.querySelectorAll("img.emoji");
                                    const emojiCountries = [];
                                    emojis.forEach((emoji) => {
                                        const ariaLabel = emoji.getAttribute("aria-label");
                                        if (ariaLabel && emojiToCountry[ariaLabel]) {
                                            emojiCountries.push(emojiToCountry[ariaLabel]);
                                        }
                                    });
                                    const containsOnlyEmoji = messageText.trim() === "" && emojis.length > 0;
                                    if (!containsOnlyEmoji && emojiCountries.length > 0) {
                                        console.log(`${username}:`, messageText);
                                        const countryName = emojiCountries[0];
                                        navigator.clipboard.writeText(countryName)
                                            .then(() => {
                                                console.log(`Country: "${countryName}"`);
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
        console.log(`Watching for users with "${usernamePrefix}".`);
    }
};

const fuckServer = () => {
    if (observer) {
        observer.disconnect();
        console.log("STOPPED");
    } else {
        console.log("NOT RUNNING");
    }
};

startObserver();
window.fuckServer = fuckServer;

window.changeName = (newPrefix) => {
    if (typeof newPrefix === "string" && newPrefix.length > 0) {
        usernamePrefix = newPrefix.toLowerCase();
        console.log(`New User: "${usernamePrefix}".`);
    } else {
        console.log("Invalid prefix");
    }
};
