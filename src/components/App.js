import React, { useState, useEffect } from "react";
import { HuePicker, AlphaPicker } from "react-color";
import API from "../api/API";

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
      if (isMounted) setMessages(data.messages);
    };

    load();

    return () => (isMounted = false);
  }, []);

  const handleSubmit = async () => {
    const response = await API.put("/", {
      messages: [{ text: message, color: parseInt(color.substring(1), 16), speed }],
    });
    console.log(response);
  };

  const handleColorChange = ({ hex }) => {
    setColor(hex);
  };

  return (
    <div className="min-h-screen min-w-screen p-8 md:p-24 bg-red-500">
      <div className="max-w-lg mx-auto px-4 pb-8">
        <img alt="Marquise logo" />
        {/* <p className="font-mono text-4xl text-purple-200">amplifii.us</p> */}
        <p className="text-sm text-justify">
          Marquise is a handy little LED sign you can command from your browser
          :)
        </p>
      </div>
      <div className="max-w-lg mx-auto flex p-6 bg-white rounded-lg shadow-xl">
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
              } rounded resize-y h-64 w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline`}
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
    </div>
  );
};

export default App;
