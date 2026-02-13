import React, { useState } from "react";
import Provider from "./components/ui/provider";
import { BrowserRouter,Routes,Route } from "react-router-dom";
import Home from "./Home";
import Login from "./Login";
import RentPage from "./RentPage/RentPage"; 
import GearPage from "./GearPage/GearPage";
import RequireAuth from "./RequireAuth";
import Navbar from "./components/ui/navbar";
import { Box } from "@chakra-ui/react";
import { Toaster } from "./components/ui/toaster";

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
                  <Box h="100vh" display="flex" flexDirection="column" overflow="hidden">
                    <Navbar/>
                    <Box flex="1" overflowY="auto" position="relative">
                      <RentPage />
                    </Box>      
                  </Box> 
                </RequireAuth>
              }
            />
             <Route 
              path="/gear"
              element={
                <RequireAuth>
                  <Box h="100vh" display="flex" flexDirection="column" overflow="hidden">
                    <Navbar/>
                    <Box flex="1" overflowY="auto" position="relative">
                      <GearPage />       
                      <Toaster />               
                    </Box>      
                  </Box> 
                </RequireAuth>
              }
            />
        </Routes>

      </BrowserRouter>
    </Provider>
  )
}

export default App;