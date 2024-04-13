import { useState } from 'react'
import './App.css'

import { Route, Routes } from 'react-router-dom'

import Header from './components/header'
import Add from './pages/add'
import Home from './pages/home'
import Fight from './pages/fight'

function App() {

  return (
    <div>
      <Routes>
        <Route path='/' element={<Header />}>
          <Route path='home' element={<Home />} />
          <Route path='add' element={<Add />}/>
          <Route path='fight' element={<Fight />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
