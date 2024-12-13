"use client";
import Link from "next/link";
import Logo from "./Logo";
import { FaDribbble, FaGithub, FaLinkedin, FaMoon, FaSun, FaTwitter } from "react-icons/fa";
import { useThemeSwitch } from "../Hooks/useThemeSwitch";
import { useState, useEffect } from "react";
import { cx } from "../../utils";
import siteMetadata from "../../utils/siteMetaData";
const Header = () => {
  const [mode, setMode] = useThemeSwitch();
  const [click, setClick] = useState(false);
  const [isSticky, setIsSticky] = useState(false); // Nouveau state pour gérer la sticky behavior

  // Fonction pour détecter le scroll
  const handleScroll = () => {
    if (window.scrollY > 50) { // Se déclenche lorsque l'utilisateur scrolle à plus de 50px du haut
      setIsSticky(true);
    } else {
      setIsSticky(false);
    }
  };

  // Utilisation de useEffect pour ajouter un event listener au scroll
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    // Nettoyer l'event listener lors du démontage du composant
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggle = () => {
    setClick(!click);
  };

  return (
    <header className={`w-full p-4 px-5 sm:px-10 flex items-center justify-between transition-all duration-300 ease-in-out 
  ${isSticky ? 'fixed top-0 left-0 right-0 z-50 bg-white text-black shadow-md' : 'bg-black text-white'}`}>
  
  <Logo className={`transition-colors duration-300 ${isSticky ? 'text-black' : 'text-white'}`} />
  
  <button className="inline-block sm:hidden z-50" onClick={toggle} aria-label="Hamburger Menu">
  <div className="w-6 cursor-pointer transition-all ease duration-300">
    <div className="relative">
      <span
        className={`absolute top-0 inline-block w-full h-0.5 rounded transition-all ease duration-200 ${
          isSticky ? 'bg-black' : 'bg-white'
        }`}
        style={{
          transform: click ? "rotate(-45deg) translateY(0)" : "rotate(0deg) translateY(6px)",
        }}
      />
      <span
        className={`absolute top-0 inline-block w-full h-0.5 rounded transition-all ease duration-200 ${
          isSticky ? 'bg-black' : 'bg-white'
        }`}
        style={{
          opacity: click ? 0 : 1,
        }}
      />
      <span
        className={`absolute top-0 inline-block w-full h-0.5 rounded transition-all ease duration-200 ${
          isSticky ? 'bg-black' : 'bg-white'
        }`}
        style={{
          transform: click ? "rotate(45deg) translateY(0)" : "rotate(0deg) translateY(-6px)",
        }}
      />
    </div>
  </div>
</button>


  <nav className={`w-max py-3 px-6 sm:px-8 border border-solid border-dark rounded-full font-medium capitalize items-center flex sm:hidden
    fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-50 transition-all ease duration-300 ${isSticky ? 'bg-white text-black' : ''}`}
    style={{
      top: click ? "1rem" : "-5rem"
    }}
  >
    <Link href="/" className="mr-2">Home</Link>
    <Link href="/about" className="mx-2">About</Link>
    <Link href="/contact" className="mx-2">Contact</Link>
  
 
  </nav>

  <nav className={`w-max py-3 px-8 border border-solid border-dark rounded-full font-medium capitalize items-center hidden sm:flex
    fixed top-6 right-1/2 translate-x-1/2 bg-light/80 backdrop-blur-sm z-50 ${isSticky ? 'bg-white text-black' : ''}`}>
    <Link href="/" className="mr-2">Home</Link>
    <Link href="/about" className="mx-2">About</Link>
    <Link href="/contact" className="mx-2">Contact</Link>
   
  </nav>

  <div className="hidden sm:flex items-center">
    <a href={siteMetadata.linkedin} rel="noopener noreferrer" className="inline-block w-6 h-6 mr-4" aria-label="Reach out to me via LinkedIn" target="_blank"><FaLinkedin className="hover:scale-125 transition-all ease duration-200" /></a>
    <a href={siteMetadata.twitter} rel="noopener noreferrer" className="inline-block w-6 h-6 mr-4" aria-label="Reach out to me via Twitter" target="_blank"><FaTwitter className="hover:scale-125 transition-all ease duration-200" /></a>
    <a href={siteMetadata.github} rel="noopener noreferrer" className="inline-block w-6 h-6 mr-4" aria-label="Check my profile on Github" target="_blank"><FaGithub className="hover:scale-125 transition-all ease duration-200 dark:fill-light" /></a>
    <a href={siteMetadata.dribbble} rel="noopener noreferrer" className="inline-block w-6 h-6 mr-4" aria-label="Check my profile on Dribbble" target="_blank"><FaDribbble className="hover:scale-125 transition-all ease duration-200" /></a>
  </div>
</header>

  );
};

export default Header;
