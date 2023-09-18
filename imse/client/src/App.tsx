import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navbar/Navigation";
import ReportOne from "./pages/ReportOne";
import ReportTwo from "./pages/ReportTwo";
import Recipe from "./pages/Recipe";
import Cuisine from "./pages/Cuisine";
import { QueryClient, QueryClientProvider } from "react-query";
import MainPage from "./pages/MainPage";
import Ingredient from "./pages/Ingredient";
import Friends from "./pages/Friends";

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Navigation />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/friend" element={<Friends />} />
          <Route path="/recipe" element={<Recipe />} />
          <Route path="/cuisine" element={<Cuisine />} />
          <Route path="/ingredient" element={<Ingredient />} />
          <Route path="/report-one" element={<ReportOne />} />
          <Route path="/report-two" element={<ReportTwo />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
