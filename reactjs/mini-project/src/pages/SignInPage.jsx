import React from 'react'
import { SignIn } from '@clerk/clerk-react'

const SignInPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Welcome Back 👋</h2>
        <p className="text-gray-500 mb-6">Sign in to continue to your dashboard</p>

        <SignIn
          path="/sign-in"
          routing="path"
          signUpUrl="/sign-up"
          appearance={{
            elements: {
              formButtonPrimary:
                'bg-black text-white hover:bg-gray-900 font-medium rounded-full transition',
              formFieldInput:
                'rounded-lg border-gray-300 focus:border-black focus:ring-black',
            },
            layout: {
              socialButtonsPlacement: 'bottom',
              socialButtonsVariant: 'blockButton',
            },
          }}
        />
      </div>
    </div>
  )
}

export default SignInPage
