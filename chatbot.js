const API_KEY = "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"; // Replace with your OpenRouter API key
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

let conversationHistory = [];
let hasGreeted = false; // Flag to ensure greeting is shown only once

// Toggle Chatbot
document.getElementById("chatbot-toggle").addEventListener("click", function () {
    document.getElementById("chat-container").style.display = "flex";
    
    if (!hasGreeted) {
        displayGreeting();
        hasGreeted = true; // Set flag to true so it won't repeat
    }
});

document.getElementById("close-chat").addEventListener("click", function () {
    document.getElementById("chat-container").style.display = "none";
});

// Sending Message
document.getElementById("send-btn").addEventListener("click", sendMessage);
document.getElementById("user-input").addEventListener("keypress", function (event) {
    if (event.key === "Enter") sendMessage();
});

// Display Greeting with Typing Animation
function displayGreeting() {
    let chatBox = document.getElementById("chat-box");

    let typingMessage = document.createElement("div");
    typingMessage.classList.add("message", "bot");
    typingMessage.innerHTML = "<b>Komo Chatbot:</b> ";
    chatBox.appendChild(typingMessage);

    let text = "Hello, I'm Komo Chatbot. I will help you help you in every steps🥱";
    let i = 0;

    function type() {
        if (i < text.length) {
            typingMessage.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, 50); // Adjust speed of typing effect
        }
    }

    setTimeout(type, 500); // Delay before typing starts
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Sending and Displaying Bot Response with Typing Animation
async function sendMessage() {
    let userInput = document.getElementById("user-input").value.trim();
    if (!userInput) return;

    let chatBox = document.getElementById("chat-box");
    chatBox.innerHTML += `<div class="message user"><b>You:</b> ${userInput}</div>`;
    document.getElementById("user-input").value = "";
    chatBox.scrollTop = chatBox.scrollHeight;

    conversationHistory.push({ role: "user", content: userInput });

    // Check if user asked about the developer
    const lowerCaseInput = userInput.toLowerCase();
    if (lowerCaseInput.includes("who is the developer") || lowerCaseInput.includes("developer")) {
        displayBotResponse("The developer of this chatbot is Koninga Moshilning S/O Koninga Leirung and Koninga Tungnai. He lives in the North East state of Manipur state belongs to Maring tribe");
        return;
    }

    try {
        let response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${API_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ model: "deepseek/deepseek-chat", messages: conversationHistory })
        });

        let data = await response.json();
        let botText = data.choices[0].message.content;

        displayBotResponse(botText);

        // Add to conversation history
        conversationHistory.push({ role: "assistant", content: botText });

    } catch (error) {
        displayBotResponse("Sorry, connection failed.");
    }
}

// Function to display bot response with typing animation
function displayBotResponse(botText) {
    let chatBox = document.getElementById("chat-box");

    let botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot");
    botMessage.innerHTML = "<b>Komo Chatbot:</b> ";
    chatBox.appendChild(botMessage);

    let i = 0;
    function type() {
        if (i < botText.length) {
            botMessage.innerHTML += botText.charAt(i);
            i++;
            setTimeout(type, 50); // Adjust typing speed
        }
    }

    setTimeout(type, 500); // Delay before typing starts
    chatBox.scrollTop = chatBox.scrollHeight;
}
