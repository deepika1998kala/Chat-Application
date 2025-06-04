import React, { useContext, useState } from 'react'
import img from '../img/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currState, setCurrState] = useState("Sign Up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const { login } = useContext(AuthContext)

  const validatePassword = (password) => {
    return {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      number: /\d/.test(password),
      specialChar: /[!@#$%^&*]/.test(password),
    }
  }

  const passwordValidation = validatePassword(password)
  const isPasswordValid = Object.values(passwordValidation).every(Boolean)

  const onSubmitHandler = (event) => {
    event.preventDefault()

    if (currState === "Sign Up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return
    }

    login(currState === 'Sign Up' ? 'signup' : 'login', { fullName, email, password, bio })
  }

  return (
    <div className='min-h-screen bg-cover bg-center flex items-center justify-center gap-8 *:sm:justify-evenly max-sm:flex-col backdrop-blur-2xl'>
      {/* -------------------left------------------ */}
      <img src={img.logo_big} alt="" className='w-[min(80vw, 80px)]' />

      {/* --------------------right--------------------- */}
      <form onSubmit={onSubmitHandler} className='border-2 bg-white/8 text-white border-gray-500
        p-6 flex flex-col gap-6 rounded-lg shadow-lg'>
        <h2 className='font-medium text-2xl flex justify-between items-center'>
          {currState}
          {isDataSubmitted && (
            <img onClick={() => setIsDataSubmitted(false)} src={img.arrow_icon} alt="" className='w-5 cursor-pointer' />
          )}
        </h2>

        {currState === "Sign Up" && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className='p-2 border border-gray-500 rounded-md focus:outline-none'
            placeholder='Full Name'
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              placeholder='Email Address'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              placeholder='Password'
              required
              className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            />

            {/* Password Requirements */}
            {currState === "Sign Up" && (
              <ul className="text-xs text-gray-300 space-y-1 ml-1">
                <li className={passwordValidation.length ? 'text-green-400' : 'text-red-400'}>• At least 8 characters</li>
                <li className={passwordValidation.uppercase ? 'text-green-400' : 'text-red-400'}>• One uppercase letter</li>
                <li className={passwordValidation.number ? 'text-green-400' : 'text-red-400'}>• One number</li>
                <li className={passwordValidation.specialChar ? 'text-green-400' : 'text-red-400'}>• One special character</li>
              </ul>
            )}
          </>
        )}

        {currState === "Sign Up" && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            rows={4}
            className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500'
            placeholder='Provide a Short Bio...'
            required
          ></textarea>
        )}

        <button
          type='Submit'
          disabled={currState === "Sign Up" && !isPasswordValid}
          className={`py-3 bg-gradient-to-r from-purple-400 to-violet-600
          text-white rounded-md ${currState === "Sign Up" && !isPasswordValid ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
          {currState === "Sign Up" ? "Create Account" : "Login Now"}
        </button>

        <div className='flex items-center gap-2 text-sm text-gray-500'>
          <input type="checkbox" required />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='flex flex-col gap-2'>
          {currState === "Sign Up" ? (
            <p className='text-sm text-gray-600'>Already have an account?
              <span onClick={() => { setCurrState("Login"); setIsDataSubmitted(false) }} className='font-medium text-violet-500 cursor-pointer'> Login here</span></p>
          ) : (
            <p className='text-sm text-gray-600'>Create an account
              <span onClick={() => { setCurrState("Sign Up"); setIsDataSubmitted(false) }} className='font-medium text-violet-500 cursor-pointer'> Click Here</span></p>
          )}
        </div>
      </form>
    </div>
  )
}

export default LoginPage
