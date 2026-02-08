import React, { useState } from "react";
import Provider from "./components/ui/provider";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import Rent from "./Rent" ; 
import RequireAuth from "./RequireAuth";
import Navbar from "./components/ui/navbar";
import { HStack } from "@chakra-ui/react";


function App() {
  return (
    <Provider>
      <BrowserRouter>
        
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <RequireAuth>
                    <Navbar/>
                    <Home />                
                </RequireAuth>
              }
            />
            <Route 
              path="/rent"
              element={
                <RequireAuth>
                    <Navbar/>
                    <Rent />                
                </RequireAuth>
              }
            />
        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App;