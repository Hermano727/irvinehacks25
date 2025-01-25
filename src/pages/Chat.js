// Create WebSocket connection
const socket = new WebSocket("ws://localhost:3001");

// Get references to DOM elements
const usernameInput = document.getElementById("username");
const setUsernameButton = document.getElementById("set-username");
const chatSection = document.getElementById("chat-section");
const messagesDiv = document.getElementById("messages");
const sendButton = document.getElementById("send");
const messageInput = document.getElementById("message");

// Store the user's username
let username = "";

// Set username and show chat section
setUsernameButton.addEventListener("click", () => {
  const enteredUsername = usernameInput.value.trim();
  if (enteredUsername) {
    username = enteredUsername;
    document.getElementById("username-section").style.display = "none";
    chatSection.style.display = "block";
  } else {
    alert("Please enter a username!");
  }
});

// Event: Connection established
socket.onopen = () => {
  console.log("Connected to WebSocket server");
};

// Event: Message received from server
socket.onmessage = async (event) => {
  let message;

  // Check if the received message is a Blob
  if (event.data instanceof Blob) {
    message = await event.data.text(); // Convert Blob to text
  } else {
    message = event.data; // If it's already a string, use it directly
  }

  // Display the received message
  const messageDiv = document.createElement("div");
  messageDiv.textContent = message;
  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight; // Auto-scroll to the latest message
};

// Event: WebSocket error
socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

// Event: Connection closed
socket.onclose = () => {
  console.log("Disconnected from WebSocket server");
};

// Send message when button is clicked
sendButton.addEventListener("click", () => {
  const messageText = messageInput.value.trim();
  if (messageText && username) {
    const timestamp = new Date().toLocaleTimeString();
    const messageToSend = `[${timestamp}] ${username}: ${messageText}`;
    socket.send(messageToSend); // Send the message to the WebSocket server
    messageInput.value = ""; // Clear the input field
  }
});
