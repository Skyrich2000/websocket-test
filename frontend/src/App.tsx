import "./App.css";
import logo from "./logo.svg";

import { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";

const socket: Socket = io("http://localhost:3000");

socket.on("connect", function () {
  console.log("Connected");
});

socket.on("exception", function (data) {
  console.log("event", data);
});

socket.on("disconnect", function () {
  console.log("Disconnected");
});

const Input = () => {
  const [value, setValue] = useState("");

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("eventsToServer", value);
    setValue("");
  };

  return (
    <form onSubmit={onSubmit}>
      <input
        type="text"
        placeholder="Type a message"
        value={value}
        onChange={onChange}
      />
      <input type="submit" value="Send" />
    </form>
  );
};

function App() {
  const [value, setValue] = useState<string[]>([]);

  useEffect(() => {
    socket.on("eventsToClient", function (data) {
      console.log("event", data);

      setValue((prev) => [...prev, data]);
    });
  }, [socket]);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {value.map((v, i) => (
          <p key={i}>{v}</p>
        ))}
        <Input />
      </header>
    </div>
  );
}

export default App;
