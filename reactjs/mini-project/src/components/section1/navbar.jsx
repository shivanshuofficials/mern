import React from 'react'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  return (
    <div className="flex items-center justify-between py-8 px-12 bg-white">
      {/* Left side */}
      <h4 className="bg-black text-white px-6 py-2 rounded-full uppercase">
        Target Audience
      </h4>

      {/* Right side */}
      <div className="flex items-center gap-4">
        <button
          className="bg-gray-200 px-6 py-2 rounded-full uppercase tracking-wider text-sm"
          style={{ WebkitAppearance: 'none' }}
        >
          Digital Banking Platform
        </button>

        {/* When user is signed in */}
        <SignedIn>
          <UserButton afterSignOutUrl="/" />
        </SignedIn>

        {/* When user is signed out */}
        <SignedOut>
          <button
            onClick={() => navigate('/sign-in')}
            className="bg-black text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-900 transition"
          >
            Sign In
          </button>
          <button
            onClick={() => navigate('/sign-up')}
            className="bg-gray-200 text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-300 transition"
          >
            Sign Up
          </button>
        </SignedOut>
      </div>
    </div>
  )
}

export default Navbar
