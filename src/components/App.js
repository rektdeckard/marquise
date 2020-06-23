import React, { useState, useEffect } from "react";
import { HuePicker, AlphaPicker } from "react-color";

import API from "../api/API";
import logo from "../assets/icon.png";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [on, setOn] = useState(true);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("#F56565");
  const [speed, setSpeed] = useState(2);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { data } = await API.get("/latest");
      console.log(data);
      if (isMounted) {
        setMessages(data.messages);
        setOn(data.on);
      }
    };

    load();

    return () => (isMounted = false);
  }, []);

  const doSubmit = async (state = { on: false }) => {
    const { data } = await API.put("/", state);
    console.log(data);
    setMessages(data?.data?.messages ?? []);
    setOn(data?.data?.on ?? true);
  };

  const handleSubmit = async () => {
    try {
      await doSubmit({
        messages: [
          ...messages,
          { text: message, color: parseInt(color.substring(1), 16), speed },
        ],
        on,
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

  const handleClear = () => {
    doSubmit({ on, messages: [] });
  }

  const handleColorChange = ({ hex }) => {
    setColor(hex);
  };

  const toggleOn = () => {
    doSubmit({ on: !on, messages });
  };

  const renderMessage = (message, index) => (
    <div
      key={index}
      className="max-w-lg mx-auto flex p-2 bg-gray-900 text-gray-400 rounded-lg shadow-xl mb-4"
    >
      <div
        className="inline-block rounded text-center text-gray-900 px-4 py-2 m-2"
        style={{ backgroundColor: `#${message.color.toString(16)}` }}
      >
        {index + 1}
      </div>
      <div className="flex-1 px-4 py-2 m-2 font-mono">{message.text}</div>
      <button
        className="inline-block rounded text-center px-4 py-2 m-2 bg-gray-500 hover:bg-red-700 font-bold text-gray-900 focus:outline-none focus:shadow-outline"
        type="button"
        onClick={() => handleDismiss(message.text)}
      >
        x
      </button>
    </div>
  );

  return (
    <div className="min-h-screen min-w-screen p-8 md:p-24 bg-gray-700">
      <div className="max-w-lg mx-auto px-4 pb-8 text-gray-400 font-mono text-center">
        {/* <img src={logo} alt="Marquise logo" /> */}
        <p className="text-4xl">Marquise</p>
        <p className="text-sm">
          A handy little LED sign you can command from your browser :)
        </p>
      </div>
      <div className="max-w-lg mx-auto flex p-6 bg-gray-900 rounded-lg shadow-xl mb-4">
        <form className="w-full">
          <div className="mb-4">
            <label
              className="block font-mono text-gray-400 text-sm font-bold mb-2"
              htmlFor="message"
            >
              MESSAGE
            </label>
            <textarea
              className={`shadow appearance-none ${
                false ? "border-red-600" : ""
              } rounded resize-y h-16 w-full py-2 px-3 bg-green-200 text-gray-900 font-mono mb-3 leading-tight focus:outline-none focus:shadow-outline`}
              id="message"
              type="text"
              value={message}
              onChange={({ target: { value } }) => setMessage(value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-mono text-gray-400 text-sm font-bold mb-2"
              htmlFor="speed"
            >
              SPEED
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-green-200 text-gray-900 font-mono mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="speed"
              type="number"
              value={speed}
              min={1}
              max={5}
              onChange={({ target: { value } }) => setSpeed(value)}
            />
          </div>
          <div className="mb-4">
            <label
              className="block font-mono text-gray-400 text-sm font-bold mb-2"
              htmlFor="color"
            >
              COLOR
            </label>
            <HuePicker
              id="color"
              className="mb-4"
              width="100%"
              color={color}
              onChange={handleColorChange}
            />
            {/* <AlphaPicker width="100%" color={color} onChange={console.log} /> */}
            {/* <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="color"
              type="number"
              value={color}
              onChange={({ target: { value } }) => setColor(value)}
            /> */}
          </div>
          <div className="flex items-center space-x-3">
            <button
              className={`w-full ${
                on
                  ? "bg-gray-700 hover:bg-gray-800"
                  : "bg-gray-500 hover:bg-gray-700"
              } text-white text-lg font-mono py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
              type="button"
              onClick={toggleOn}
            >
              {on ? "ON" : "OFF"}
            </button>
            <button
              className="w-full bg-gray-500 hover:bg-gray-700 text-white text-lg font-mono py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleClear}
            >
              CLEAR
            </button>
            <button
              className="w-full bg-red-500 hover:bg-red-700 text-white text-lg font-mono py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              SEND
            </button>
          </div>
        </form>
      </div>
      {messages.map(renderMessage)}
    </div>
  );
};

export default App;
