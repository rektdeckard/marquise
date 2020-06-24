import React, { useState, useEffect, useRef } from "react";
import { HuePicker, AlphaPicker } from "react-color";
import Huebee from "huebee";

import "../assets/huebee.css";
import API from "../api/API";
import logo from "../assets/icon.png";

const App = () => {
  const [messages, setMessages] = useState([]);
  const [on, setOn] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("#F56565");
  const [speed, setSpeed] = useState(2);

  const huebee = useRef();

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      const { data } = await API.get("/latest");
      console.log(data);
      if (isMounted) {
        setMessages(data.messages);
        setOn(data.on);
        setIsOfflineMode(data.isOfflineMode);
      }
    };

    const setupPicker = () => {
      huebee.current = new Huebee(".color-input", {
        notation: "hex",
        saturations: 1,
        hues: 20,
        hue0: 210,
      });
      huebee.current.on("change", (color, hue, sat, lum) => {
        if (isMounted) setColor(color);
      });
    };

    load();
    setupPicker();

    return () => (isMounted = false);
  }, []);

  useEffect(() => {
    huebee.current?.setColor(color); // eslint-disable-line no-unused-expressions
  }, [color]);

  const doSubmit = async (state = { on: false }) => {
    const { data } = await API.put("/", state);
    console.log(data);
    setMessages(data?.data?.messages ?? []);
    setOn(data?.data?.on ?? true);
    setIsOfflineMode(data?.data?.isOfflineMode ?? false);
  };

  const handleSubmit = () => {
    doSubmit({
      messages: [
        ...messages,
        { text: message, color: parseInt(color.substring(1), 16), speed },
      ],
      on,
      isOfflineMode,
    });
  };

  const handleDismiss = (message) => {
    const remaining = messages.filter((it) => it.text !== message);
    doSubmit({ on, isOfflineMode, messages: remaining });
  };

  const handleClear = () => {
    doSubmit({ on, isOfflineMode, messages: [] });
  };

  const toggleOn = () => {
    doSubmit({ on: !on, isOfflineMode, messages });
  };

  const toggleisOffline = () => {
    doSubmit({ on, messages, isOfflineMode: !isOfflineMode });
  };

  const handleColorChange = ({ hex }) => {
    setColor(hex);
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
      <div className="flex-1 px-4 py-2 m-2 font-mono truncate">
        {message.text}
      </div>
      <button
        className="inline-block rounded text-center px-4 py-2 m-2 bg-gray-800 hover:bg-red-700 font-bold text-white focus:outline-none focus:shadow-outline"
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
      <div className="max-w-lg mx-auto flex p-4 bg-gray-900 rounded-lg shadow-xl mb-4">
        <form className="w-full">
          <div className="rounded bg-gray-800 p-4 mb-2">
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
              <input
                ref={huebee}
                id="color2"
                className="color-input shadow appearance-none rounded w-full py-2 px-3 bg-green-200 text-gray-900 font-mono mb-3 leading-tight focus:outline-none focus:shadow-outline"
                style={{ cursor: "pointer" }}
                value={color}
                onChange={handleColorChange}
              />
              {/* <HuePicker
                id="color"
                className="mb-4"
                width="100%"
                color={color}
                onChange={handleColorChange}
              />
              <AlphaPicker width="100%" onChange={console.log} /> */}
            </div>
          </div>
          <div className="rounded bg-gray-800 p-2">
            <div className="flex items-center space-x-3 mb-3">
              <button
                className={`w-full ${
                  on
                    ? "bg-gray-700 hover:bg-gray-500"
                    : "bg-gray-500 hover:bg-gray-700"
                } text-white text-sm font-mono py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="button"
                title="Screen power. When 'OFF', checks every 10 seconds for power state."
                onClick={toggleOn}
              >
                {on ? "ON" : "OFF"}
              </button>
              <button
                className={`w-full ${
                  isOfflineMode
                    ? "bg-gray-500 hover:bg-gray-700"
                    : "bg-gray-700 hover:bg-gray-500"
                } text-white text-sm font-mono py-2 px-4 rounded focus:outline-none focus:shadow-outline`}
                type="button"
                title="When 'LIVE', device will check for new messages once a minute. Use 'OFFLINE' mode if you want to set messages to use on the go. Requires hard-reset."
                onClick={toggleisOffline}
              >
                {isOfflineMode ? "OFFLINE" : "LIVE"}
              </button>
              <button
                className="w-full bg-gray-500 hover:bg-gray-700 text-white text-sm font-mono py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="button"
                title="Delete all custom messages. Will revert to device's default message."
                onClick={handleClear}
              >
                CLEAR
              </button>
            </div>
            <button
              className="w-full bg-red-500 hover:bg-red-700 text-white text-sm font-mono py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              title="Upload a message to the device."
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
