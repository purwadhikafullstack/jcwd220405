import React from "react";
import ReactDOM from "react-dom/client";

// app
import "./index.css";
import App from "./App";

// redux
import store from "./redux/store";
import { Provider } from "react-redux";

import { BrowserRouter } from "react-router-dom";

// chakra
import { ChakraProvider, extendTheme } from "@chakra-ui/react";

import reportWebVitals from "./reportWebVitals";

const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        // bg: "",
        bgGradient:
          "linear(150.64deg, #3B0D2C 0%, rgba(74, 10, 71, 1) 16.61%, #2F0C39 61.16%, rgba(38, 8, 67, 1)  92.29%)",
      },
    }),
  },
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <Provider store={store}>
      <ChakraProvider theme={theme}>
        <App />
      </ChakraProvider>
    </Provider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
