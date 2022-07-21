import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Blog from "./components/page-components/home/Blog";
import PageNotFound from "./components/pageNotFound/PageNotFound";
import Home from "./components/pages/home/Home";
import Todos from "./components/pages/todos/Todos";


const App = () => {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />;
          <Route path="/blog/:blogPost" element={<Blog />} />;
          <Route path="/todos" element={<Todos />} />;
          <Route path="*" element={<PageNotFound />} />;
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
