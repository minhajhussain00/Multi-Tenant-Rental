import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <nav className="flex justify-between items-center px-8 py-4 border-b">
        <h1 className="text-2xl font-bold text-primary">GameRent</h1>
        <div className="hidden md:flex space-x-6">
          <a href="#features" className="text-sm font-medium hover:text-primary">
            Features
          </a>
          <a href="#how" className="text-sm font-medium hover:text-primary">
            How It Works
          </a>
          <a href="#partner" className="text-sm font-medium hover:text-primary">
            For Vendors
          </a>
        </div>
        <Button>Get Started</Button>
      </nav>
  )
}

export default Navbar
