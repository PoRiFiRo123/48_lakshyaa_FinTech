import { useState, useEffect } from "react";

interface ChatBotProps {
  pageContent: string; // The content that includes event details
}

const ChatBot: React.FC<ChatBotProps> = ({ pageContent }) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: "bot", content: `Welcome! You can ask me about upcoming events, past events, or a summary of the page.` },
  ]);
  const [userInput, setUserInput] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false); // To manage chat visibility

  const handleSendMessage = () => {
    if (userInput.trim()) {
      const newMessages = [
        ...messages,
        { role: "user", content: userInput },
      ];
      setMessages(newMessages);
      setUserInput("");

      // Bot response logic
      const botResponse = generateResponse(userInput);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: "bot", content: botResponse },
      ]);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission
      handleSendMessage();
    }
  };

  const generateResponse = (input: string) => {
    // Check if the question matches a known command
    if (input.toLowerCase().includes("upcoming events")) {
      return getUpcomingEvents();
    } else if (input.toLowerCase().includes("past events")) {
      return getPastEvents();
    } else if (input.toLowerCase().includes("summary")) {
      return generateSummary();
    } else {
      // If the question is random, reply with the list of questions the bot can answer
      return getRandomQuestionResponse();
    }
  };

  const getUpcomingEvents = () => {
    return extractEvents("Upcoming Events");
  };

  const getPastEvents = () => {
    return extractEvents("Past Events");
  };

  const extractEvents = (eventType: string) => {
    const eventSections = pageContent.split(`${eventType}:`);
    if (eventSections.length < 2) {
      return `Sorry, I couldn't find any ${eventType.toLowerCase()}.`;
    }
    const events = eventSections[1].split("\n\n").filter((event) => event.trim() !== "");
    if (events.length === 0) {
      return `Sorry, I couldn't find any ${eventType.toLowerCase()}.`;
    }
    return events.map((event) => formatEventDetails(event)).join("\n\n");
  };

  const formatEventDetails = (eventDetails: string) => {
    const eventInfo = eventDetails.split("\n");
    const name = eventInfo.find((line) => line.startsWith("Name:"))?.replace("Name:", "").trim();
    const date = eventInfo.find((line) => line.startsWith("Date:"))?.replace("Date:", "").trim();
    const location = eventInfo.find((line) => line.startsWith("Location:"))?.replace("Location:", "").trim();
    const price = eventInfo.find((line) => line.startsWith("Price:"))?.replace("Price:", "").trim();

    return `
      • Name: ${name}
      • Date: ${date}
      • Location: ${location}
      • Price: ${price}
    `;
  };

  const generateSummary = () => {
    return `This page provides details about upcoming and past events. You can explore the events, view their details, and book tickets.`;
  };

  const getRandomQuestionResponse = () => {
    return `
      I'm sorry, I didn't quite understand that. Here are some questions I can answer:

      • What are the upcoming events?
      • What are the past events?
      • Tell me a summary of the page.
      
      You can ask me about these topics or try rephrasing your question!
    `;
  };

  // Toggle chat window visibility
  const toggleChatWindow = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div>
      {/* Chat Button */}
      <button
        onClick={toggleChatWindow}
        className="fixed bottom-6 right-6 p-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 transition-all"
        style={{ zIndex: 999 }}
      >
        Chat Here
      </button>

      {/* Chat Window */}
      {isChatOpen && (
        <div className="fixed bottom-16 right-6 p-4 bg-white shadow-lg rounded-lg w-80 h-96 flex flex-col">
          {/* Close Button */}
          <button
            onClick={toggleChatWindow}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>

          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`p-2 ${message.role === "bot" ? "bg-gray-200" : "bg-green-200"} rounded-lg`}
                >
                  <p className={message.role === "bot" ? "text-gray-900" : "text-white"}>
                    {message.content}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              placeholder="Ask me anything..."
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={handleKeyPress} // Detect Enter key press
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-500 text-white p-2 rounded-lg"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
