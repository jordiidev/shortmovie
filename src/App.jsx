import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './components/Home.jsx'
import MeloloPlayer from './components/MeloloPlayer.jsx'
import DramaboxPlayer from './components/DramaboxPlayer.jsx'
import FlickReels from './components/FlickReels.jsx';

export default function App() {
  return (
     <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/melolo/:bookId" element={<MeloloPlayer />} />
        <Route path="/dramabox/:bookId" element={<DramaboxPlayer />} />
        <Route path="/flickreels/:id" element={<FlickReels />} />
      </Routes>
    </BrowserRouter>
  )
}
