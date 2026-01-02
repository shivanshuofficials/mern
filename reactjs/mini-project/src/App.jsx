import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { SignedIn, SignedOut } from '@clerk/clerk-react'

import Section1 from './components/section1/section1'
import Section2 from './components/section2/section2'
import SignInPage from './pages/SignInPage'
import SignUpPage from './pages/SignUpPage'

const App = () => {
  const users = [
    {
      img: 'https://plus.unsplash.com/premium_photo-1706561439918-424f60089f17?auto=format&fit=crop&q=60&w=500',
      tags: 'Satisfied',
      color: 'darkorange',
    },
    {
      img: 'https://plus.unsplash.com/premium_photo-1661641353075-f0eaf2d82aae?auto=format&fit=crop&q=60&w=500',
      tags: 'UnderServed',
      color: 'darkred',
    },
    {
      img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=60&w=500',
      tags: 'Developer',
      color: 'darkblue',
    },
    {
      img: 'https://images.unsplash.com/photo-1524330685423-3e1966445abe?auto=format&fit=crop&q=60&w=500',
      tags: 'UnderBanked',
      color: 'lightseagreen',
    },
    {
      img: 'https://images.unsplash.com/photo-1666305103177-79269fe480bf?auto=format&fit=crop&q=60&w=500',
      tags: 'Professional',
      color: 'purple',
    },
  ]

  return (
    <Routes>
      {/* Public routes for sign-in / sign-up */}
      <Route path="/sign-in/*" element={<SignInPage />} />
      <Route path="/sign-up/*" element={<SignUpPage />} />

      {/* Default homepage (visible to everyone) */}
      <Route
        path="/"
        element={
          <>
            {/* Everyone sees the same homepage */}
            <Section1 users={users} />
            <Section2 />
          </>
        }
      />
    </Routes>
  )
}

export default App
