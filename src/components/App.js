import React, { useState, useEffect } from "react";
import { HuePicker, AlphaPicker } from "react-color";

import API from "../api/API";
import logo from "../assets/icon.png";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("#F56565");
  const [speed, setSpeed] = useState(2);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { data } = await API.get("/latest");
      console.log(data);
      console.log(data.messages[0].color.toString(16));
      if (isMounted) setMessages(data.messages);
    };

    load();

    return () => (isMounted = false);
  }, []);

  const doSubmit = async (messages = {}) => {
    const { data } = await API.put("/", messages);
    console.log(data);
    setMessages(data.data.messages);
  };

  const handleSubmit = async () => {
    try {
      await doSubmit({
        messages: [
          ...messages,
          { text: message, color: parseInt(color.substring(1), 16), speed },
        ],
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleDismiss = async (message) => {
    const remaining = messages.filter((it) => it.text !== message);
    try {
      await doSubmit({ messages: remaining });
      setMessages(remaining);
    } catch (e) {
      console.error(e);
    }
  };

  const handleColorChange = ({ hex }) => {
    setColor(hex);
  };

  const renderMessage = (message, index) => (
    <div
      key={index}
      className="max-w-lg mx-auto flex p-2 bg-white rounded-lg shadow-xl mb-4"
    >
      <div
        className="inline-block rounded text-center px-4 py-2 m-2"
        style={{ backgroundColor: `#${message.color.toString(16)}` }}
      >
        {index + 1}
      </div>
      <div className="flex-1 px-4 py-2 m-2">{message.text}</div>
      <button
        className="inline-block rounded text-center px-4 py-2 m-2 bg-gray-500 hover:bg-red-700 text-white font-bold focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => handleDismiss(message.text)}
      >
        x
      </button>
    </div>
  );

  return (
    <div className="min-h-screen min-w-screen p-8 md:p-24 bg-red-500">
      <div className="max-w-lg mx-auto px-4 pb-8">
        {/* <img src={logo} alt="Marquise logo" /> */}
        <p className="font-mono text-4xl text-center text-red-200">Marquise</p>
        <p className="text-sm text-center text-red-200">
          A handy little LED sign you can command from your browser
          :)
        </p>
      </div>
      <div className="max-w-lg mx-auto flex p-6 bg-white rounded-lg shadow-xl mb-4">
        <form className="bg-white w-full">
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="message"
            >
              Message
            </label>
            <textarea
              className={`shadow appearance-none border ${
                false ? "border-red-600" : ""
              } rounded resize-y h-16 w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              id="message"
              type="text"
              value={message}
              onChange={({ target: { value } }) => setMessage(value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="color"
            >
              Color
            </label>
            <HuePicker
              id="color"
              className="mb-4"
              width="100%"
              color={color}
              onChange={handleColorChange}
            />
            <AlphaPicker width="100%" color={color} onChange={console.log} />
            {/* <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="color"
              type="number"
              value={color}
              onChange={({ target: { value } }) => setColor(value)}
            /> */}
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="speed"
            >
              Speed
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="speed"
              type="number"
              value={speed}
              min={1}
              max={5}
              onChange={({ target: { value } }) => setSpeed(value)}
            />
          </div>
          <div className="flex items-center">
            <button
              className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Beam it up!
            </button>
          </div>
        </form>
      </div>
      {messages.map(renderMessage)}
    </div>
  );
};

export default App;
