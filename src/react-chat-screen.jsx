// A simple, self-contained React chat application.
// This single component manages the UI, state, and API calls to a backend.

import React, { useState, useRef, useEffect } from 'react';

// Main application component
function App() {
  // Use state to manage the list of chat messages.
  // Each message is an object with 'sender' (user or ai) and 'text'.
  const [messages, setMessages] = useState([]);
  
  // Use state to manage the user's current input in the text box.
  const [input, setInput] = useState('');
  
  // Use state to show a loading indicator while waiting for the AI response.
  const [isLoading, setIsLoading] = useState(false);

  // A ref to the chat container, used for auto-scrolling to the bottom.
  const chatContainerRef = useRef(null);

  // IMPORTANT: Replace this URL with the actual endpoint of your local service.
  // The endpoint should be a POST request that accepts a JSON body with a 'text' field
  // and returns a JSON response with the AI's 'text'.
  const backendUrl = "http://localhost:8080/ai";

  // Function to handle sending a message.
  const handleSendMessage = async () => {
    // Trim whitespace from the input and check if it's empty.
    const trimmedInput = input.trim();
    if (!trimmedInput) return;

    // Add the user's message to the chat history immediately.
    const userMessage = { sender: 'user', text: trimmedInput };
    setMessages(prevMessages => [...prevMessages, userMessage]);

    // Clear the input field and set the loading state.
    setInput('');
    setIsLoading(true);

    try {
      // Send the message to the backend using a POST request.
      const response = await fetch(backendUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: trimmedInput }),
      });

      // Check for a successful response.
      if (!response.ok) {
        throw new Error('Network response was not ok. ' + 'Status: ' + response.status + ', status test: ' + response.statusText);
      }

      // Parse the JSON response from the backend.
      const data = await response.json();

      // Add the AI's response to the chat history.
      const aiMessage = { sender: 'ai', text: data.generatedText };
      setMessages(prevMessages => [...prevMessages, aiMessage]);

    } catch (error) {
      // Log any errors and add an error message to the chat.
      console.log('Error fetching AI response:', error);
      const errorMessage = { sender: 'ai', text: "Sorry, I'm having trouble connecting right now. Please try again later." };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      // Reset the loading state regardless of success or failure.
      setIsLoading(false);
    }
  };

  // Function to handle the 'Enter' key press in the input field.
  const handleKeyDown = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent a newline in the input field.
      handleSendMessage();
    }
  };

  // Effect to auto-scroll the chat to the bottom when new messages are added.
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex flex-col h-screen bg-gray-100 antialiased">
      {/* Header section with a title and a logo */}
      <div className="bg-gray-800 text-white p-4 flex items-center justify-center shadow-md rounded-b-xl">
        <h1 className="text-2xl font-bold font-inter">AI Chat Assistant</h1>
      </div>

      {/* Main chat container with a scrollable area for messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4" ref={chatContainerRef}>
        {messages.map((message, index) => (
          // Message bubble, dynamically styled based on the sender
          <div
            key={index}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs md:max-w-md lg:max-w-lg p-4 rounded-3xl shadow-lg transition-transform transform ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white rounded-br-none'
                  : 'bg-white text-gray-800 rounded-bl-none'
              }`}
            >
              <p className="font-medium text-sm md:text-base">{message.text}</p>
            </div>
          </div>
        ))}

        {/* Loading indicator message from AI */}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white text-gray-800 max-w-xs md:max-w-md lg:max-w-lg p-4 rounded-3xl shadow-lg animate-pulse rounded-bl-none">
              <p className="font-medium text-sm md:text-base">...</p>
            </div>
          </div>
        )}
      </div>

      {/* Input area for new messages */}
      <div className="p-4 bg-white border-t border-gray-200 shadow-inner">
        <div className="flex items-center space-x-4">
          <textarea
            className="flex-1 p-3 border border-gray-300 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            rows="1"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
          />
          <button
            onClick={handleSendMessage}
            disabled={isLoading}
            className="bg-blue-500 text-white p-3 rounded-2xl shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
