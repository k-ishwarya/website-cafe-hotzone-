import { useEffect, useRef, useState } from 'react'
import Navbar from '../components/Navbar.jsx'
import Home from '../components/Home.jsx'
import About from '../components/About.jsx'
import Menu from '../components/Menu.jsx'
import Footer from '../components/Footer.jsx'
import { API } from '../api.js'

export default function CustomerSite() {
  const [menuItems, setMenuItems] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [activePage, setActivePage] = useState('home')
  const isClickScroll = useRef(false)

  useEffect(() => {
    async function fetchMenu() {
      try {
        const res = await fetch(`${API}/menu`)
        const data = await res.json()
        setMenuItems(data)
      } catch (err) {
        console.error('Error fetching menu:', err)
      }
    }
    fetchMenu()
  }, [])

  const showPage = (pageId) => {
    const target = document.getElementById('page-' + pageId)
    if (target) {
      isClickScroll.current = true
      target.scrollIntoView({ behavior: 'smooth' })
      setActivePage(pageId)
      window.setTimeout(() => {
        isClickScroll.current = false
      }, 700)
    }
  }

  const filterCat = (cat) => setActiveCategory(cat)

  useEffect(() => {
    function updateNavOnScroll() {
      if (isClickScroll.current) return
      const sections = ['home', 'about', 'menu']
      const navHeight = 75
      let current = 'home'
      for (const id of sections) {
        const el = document.getElementById('page-' + id)
        if (el) {
          const top = el.getBoundingClientRect().top
          if (top <= navHeight + 60) current = id
        }
      }
      setActivePage(current)
    }
    window.addEventListener('scroll', updateNavOnScroll, { passive: true })
    return () => window.removeEventListener('scroll', updateNavOnScroll)
  }, [])

  return (
    <>
      <Navbar activePage={activePage} showPage={showPage} />
      <Home showPage={showPage} filterCat={filterCat} />
      <About />
      <Menu menuItems={menuItems} activeCategory={activeCategory} filterCat={filterCat} />
      <Footer />
    </>
  )
}
