
"use client"
import { useState } from "react"
import { Menu, X, Search, ChevronDown } from "lucide-react"
import Link from "next/link"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isMegaMenuOpen, setIsMegaMenuOpen] = useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleMegaMenu = () => {
    setIsMegaMenuOpen(!isMegaMenuOpen)
  }

  const megaMenuItems = {
    "Web Development": [
      { name: "React Fundamentals", level: "Beginner" },
      { name: "Next.js Mastery", level: "Intermediate" },
      { name: "Full Stack Development", level: "Advanced" },
      { name: "TypeScript Deep Dive", level: "Intermediate" },
    ],
    "Mobile Development": [
      { name: "React Native Basics", level: "Beginner" },
      { name: "Flutter Development", level: "Intermediate" },
      { name: "iOS Development", level: "Advanced" },
      { name: "Android Development", level: "Intermediate" },
    ],
    "Backend Development": [
      { name: "Node.js Fundamentals", level: "Beginner" },
      { name: "Database Design", level: "Intermediate" },
      { name: "API Development", level: "Advanced" },
      { name: "DevOps Essentials", level: "Advanced" },
    ],
  }

  return (
    <div className="relative">
   
      {/* Main Navbar */}
      <nav className="bg-black border-b border-neutral-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <img src="https://www.chaicode.com/chaicode-white.svg" alt="ChaiCode" className="h-12 w-auto" />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="/"
                className="text-white hover:text-orange-400 px-3 py-2 font-medium transition-colors duration-200"
              >
                Home
              </Link>

              {/* Mega Menu Trigger */}
              <div className="relative">
                <button
                  onClick={toggleMegaMenu}
                  className="flex items-center space-x-1 text-white hover:text-orange-400 px-3 py-2 font-medium transition-colors duration-200"
                >
                  <span>Courses</span>
                  <ChevronDown className="w-4 h-4" />
                </button>

                {/* Mega Menu */}
                {isMegaMenuOpen && (
                  <div className="absolute top-full left-0 mt-2 w-screen max-w-4xl bg-neutral-900 border border-neutral-700 rounded-lg shadow-2xl p-8">
                    <div className="grid grid-cols-3 gap-8">
                      {Object.entries(megaMenuItems).map(([category, courses]) => (
                        <div key={category}>
                          <h3 className="text-orange-400 font-semibold mb-4 text-lg">{category}</h3>
                          <div className="space-y-3">
                            {courses.map((course) => (
                              <a
                                key={course.name}
                                href="#"
                                className="block group hover:bg-neutral-800 p-3 rounded-lg transition-colors duration-200"
                              >
                                <div className="text-white group-hover:text-orange-400 font-medium">{course.name}</div>
                                <div className="text-neutral-400 text-sm mt-1">{course.level}</div>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="border-t border-neutral-700 mt-8 pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-semibold mb-2">New to programming?</h4>
                          <p className="text-neutral-400 text-sm">Start with our beginner-friendly courses</p>
                        </div>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200">
                          View All Courses
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <a
                href="#"
                className="text-white hover:text-orange-400 px-3 py-2 font-medium transition-colors duration-200"
              >
                Projects
              </a>
              
            </div>

            {/* Desktop Right Side */}
            <div className="hidden lg:flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <input
                  type="text"
                  placeholder="Search courses..."
                  className="pl-10 pr-4 py-2.5 bg-neutral-800 border border-neutral-600 rounded-full text-white placeholder-neutral-500 outline-none focus:border-orange-500 transition-colors duration-200 w-72"
                />
              </div>

              {/* Auth Buttons */}
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="text-white hover:text-orange-400 px-4 py-2 font-medium transition-colors duration-200">
                  Login
                </Link>
                <Link href="/auth/register" className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-6 py-2.5 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap">
                  Sign Up
                </Link>
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={toggleMenu}
                className="text-white hover:text-orange-400 p-2 rounded-lg transition-colors duration-200"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden border-t border-neutral-800">
              <div className="px-2 pt-4 pb-6 space-y-2">
                {/* Mobile Search */}
                <div className="px-3 py-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search courses..."
                      className="w-full pl-10 pr-4 py-3 bg-neutral-800 border border-neutral-600 rounded-full text-white placeholder-neutral-500 outline-none focus:border-orange-500 transition-colors duration-200"
                    />
                  </div>
                </div>

                {/* Mobile Navigation Links */}
                <a
                  href="#"
                  className="block text-white hover:text-orange-400 hover:bg-neutral-800 px-3 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Home
                </a>
                <Link
                  href="/"
                  className="block text-white hover:text-orange-400 hover:bg-neutral-800 px-3 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Courses
                </Link>
                <a
                  href="#"
                  className="block text-white hover:text-orange-400 hover:bg-neutral-800 px-3 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Projects
                </a>
                <a
                  href="#"
                  className="block text-white hover:text-orange-400 hover:bg-neutral-800 px-3 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Community
                </a>
                <a
                  href="#"
                  className="block text-white hover:text-orange-400 hover:bg-neutral-800 px-3 py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Blog
                </a>

                {/* Mobile Auth Buttons */}
                <div className="border-t border-neutral-700 pt-4 mt-4 space-y-2">
                  <button className="block w-full text-left text-white hover:text-orange-400 hover:bg-neutral-800 px-3 py-3 rounded-lg font-medium transition-colors duration-200">
                    Login
                  </button>
                  <button className="block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-3 py-3 rounded-lg font-medium transition-all duration-200">
                    Sign Up
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </nav>
    </div>
  )
}

