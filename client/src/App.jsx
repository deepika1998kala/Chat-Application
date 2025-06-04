import React, { useContext } from 'react'
import { Navigate, Route, Routes} from 'react-router-dom'
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import { Toaster } from 'react-hot-toast';
import { AuthContext } from "../context/AuthContext.jsx";



const App = () => {
  const { authUser } = useContext(AuthContext);

  return (

    // <div className="bg-[url('/bgImage.svg')] bg-contain">
    <div className="bg-gray-900">
    {/* <div className="bg-[url('https://www.transparenttextures.com/patterns/dark-mosaic.png')] bg-gray-900 bg-repeat"> */}
      <Toaster />
      <Routes>

        <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login"/>} />                 {/* Home */}
        <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/"/> } />           {/* Login */}
        <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login"/>} />       {/* PRofile */}
      </Routes>
    </div>
  )
}

export default App
