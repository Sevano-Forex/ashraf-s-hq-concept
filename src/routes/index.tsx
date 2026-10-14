import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ArrowDown, CalendarDays, MapPin, Menu, X, Scissors, Sparkles, Check, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import interior from "@/assets/barber-interior.jpg";
import tools from "@/assets/barber-tools.jpg";

const bookingUrl = "https://ashrafshqbarbershop.setmore.com/";
const navigation = [{ label: "Services", id: "services" }, { label: "Why Us", id: "why-us" }, { label: "Gallery / Look", id: "gallery" }, { label: "Location", id: "location" }, { label: "Book", id: "book" }];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Ashraf’s HQ Barbershop | Northpine — Unofficial Demo" },
    { name: "description", content: "An unofficial concept for Ashraf’s HQ Barbershop in Northpine Shopping Centre, Cape Town. Explore men's grooming and book through the existing Setmore page." },
    { property: "og:title", content: "Ashraf’s HQ Barbershop | Unofficial Northpine Concept" },
    { property: "og:description", content: "A speculative barbershop website concept. Not affiliated with Ashraf’s HQ Barbershop. Booking links go to the existing Setmore page." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function BookingButton({ outline = false, label = "Book Now", className = "" }: { outline?: boolean; label?: string; className?: string }) {
  return <Button asChild variant={outline ? "barberOutline" : "brass"} className={`booking-button ${className}`}><a href={bookingUrl} target="_blank" rel="noopener noreferrer" aria-label={`${label} on Setmore (opens in a new tab)`}>{label}<ArrowUpRight aria-hidden="true" /></a></Button>;
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <div className="barber-site">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="demo-banner"><span className="demo-indicator" aria-hidden="true" />Unofficial demo concept — not affiliated with Ashraf’s HQ Barbershop</div>
      <header className="site-header">
        <div className="container header-inner">
          <a className="brand-name" href="#" aria-label="Ashraf’s HQ Barbershop home">ASHRAF’S HQ<span>BARBERSHOP · NORTHPINE</span></a>
          <nav className="desktop-nav" aria-label="Main navigation">{navigation.map(item => <a key={item.id} href={`#${item.id}`}>{item.label}</a>)}</nav>
          <div className="header-actions"><BookingButton /><Button variant="barberOutline" size="icon" className="mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
        </div>
        {menuOpen && <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">{navigation.map(item => <a key={item.id} href={`#${item.id}`} onClick={() => setMenuOpen(false)}>{item.label}<ArrowUpRight size={16} /></a>)}</nav>}
      </header>

      <main id="main">
        <section className="hero" aria-labelledby="hero-title">
          <img className="hero-image" src={interior} width={1536} height={1024} alt="Illustrative concept interior with a leather barber chair and brass details; not the actual shop" fetchPriority="high" />
          <div className="hero-shade" />
          <div className="container hero-inner">
            <div className="hero-copy">
              <p className="eyebrow"><span />NORTHPINE, CAPE TOWN</p>
              <h1 id="hero-title">ASHRAF’S HQ<span>BARBERSHOP.</span></h1>
              <p className="hero-tagline">A fresh cut. A sharper you.</p>
              <p className="hero-description">Your next chapter in men’s grooming.<br />Find your next appointment in Northpine.</p>
              <div className="hero-buttons"><BookingButton label="Book Your Appointment" /><Button variant="barberOutline" asChild className="explore-button"><a href="#services">Explore Services<ArrowDown aria-hidden="true" /></a></Button></div>
              <p className="booking-note"><CalendarDays size={14} aria-hidden="true" />Easy online booking via Setmore</p>
            </div>
            <div className="hero-bottom"><a href="#location"><MapPin size={15} aria-hidden="true" />Northpine Shopping Centre, Cape Town</a><span>Illustrative concept image · not the actual shop</span></div>
          </div>
        </section>

        <div className="signature-strip"><div className="container"><span>MEN’S GROOMING</span><span className="strip-star">✦</span><span>NORTHPINE, CAPE TOWN</span><span className="strip-star">✦</span><span>YOUR NEXT FRESH START</span></div></div>

        <section id="services" className="services section-light">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">THE GROOMING EDIT</p><h2>GOOD STYLE.<br /><span>DOWN TO THE DETAILS.</span></h2></div><div className="section-intro"><p>A clean look starts with the little things. Explore the grooming inspiration below, then find the current service menu on Setmore.</p><a className="text-link" href={bookingUrl} target="_blank" rel="noopener noreferrer">View current services and prices on Setmore<ArrowUpRight size={17} /></a></div></div>
            <div className="service-grid">
              {[{ number: "01", icon: Scissors, title: "THE CUT", text: "From a classic shape to a fresh new direction. A look that feels like you." }, { number: "02", icon: Sparkles, title: "THE BEARD", text: "Clean lines. Considered shape. The finishing detail of your everyday look." }, { number: "03", icon: Check, title: "THE FINISH", text: "A little attention to the details. A fresh start for whatever comes next." }].map(({ number, icon: Icon, title, text }) => <article className="service-item" key={number}><div className="service-top"><Icon size={27} strokeWidth={1.3} aria-hidden="true" /><span>{number}</span></div><h3>{title}</h3><p>{text}</p></article>)}
            </div>
            <p className="service-disclaimer">Grooming themes shown for this concept, not a confirmed service list. Check Setmore for available treatments, prices and times.</p>
          </div>
        </section>

        <section id="why-us" className="why-section"><div className="container why-grid"><div><p className="eyebrow">KEEP IT SIMPLE. KEEP IT SHARP.</p><h2>YOUR LOOK.<br /><span>YOUR NEXT MOVE.</span></h2><p className="why-intro">Men’s grooming, close to home in Northpine.<br />Your next appointment is just a few clicks away.</p><BookingButton label="Find Your Appointment" /></div><div className="reason-list">{[{ icon: CalendarDays, title: "Booking, without the back-and-forth.", text: "Head to the existing Setmore page to browse services and choose an available appointment." }, { icon: MapPin, title: "Right here in Northpine.", text: "Find Ashraf’s HQ Barbershop at Northpine Shopping Centre, Cape Town." }, { icon: Scissors, title: "A fresh focus on you.", text: "Make time for men’s grooming. Explore the current options and pick what fits your next look." }].map(({ icon: Icon, title, text }) => <div className="reason" key={title}><Icon aria-hidden="true" size={23} strokeWidth={1.4} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

        <section id="gallery" className="gallery-section section-light"><div className="container"><div className="section-heading"><div><p className="eyebrow">THE LOOK & FEEL</p><h2>CLASSIC ROOTS.<br /><span>MODERN ATTITUDE.</span></h2></div><p className="section-intro gallery-note">A visual moodboard for this concept.<br />AI-generated illustrative images, not photographs of the shop or its customers.</p></div><div className="gallery-grid"><figure><img src={interior} loading="lazy" width={1536} height={1024} alt="Fictional barber interior moodboard with a classic leather chair" /><figcaption><span>01 / THE CHAIR</span><span>Concept inspiration</span></figcaption></figure><figure><img src={tools} loading="lazy" width={1024} height={1024} alt="Illustrative still life of scissors, clipper, comb and shaving brush" /><figcaption><span>02 / THE DETAILS</span><span>Concept inspiration</span></figcaption></figure></div></div></section>

        <section id="location" className="location-section"><div className="container location-grid"><div><p className="eyebrow">IN THE NEIGHBOURHOOD</p><h2>FIND US IN<br /><span>NORTHPINE.</span></h2><div className="location-address"><MapPin size={23} aria-hidden="true" /><div><h3>Northpine Shopping Centre</h3><p>Northpine, Cape Town</p></div></div><p className="location-note">For current services, prices and appointment availability, visit the existing booking page.</p><a className="text-link" href="https://www.google.com/maps/search/?api=1&query=Northpine+Shopping+Centre+Cape+Town" target="_blank" rel="noopener noreferrer">Find the shopping centre on Google Maps<ExternalLink size={16} /></a></div><div className="location-art" aria-label="Northpine, Cape Town location design; not a geographical map"><div className="location-lines" aria-hidden="true" /><MapPin size={40} strokeWidth={1.2} /><span>NORTHPINE</span><p>CAPE TOWN, SOUTH AFRICA</p><div className="location-art-bottom">NORTHPINE SHOPPING CENTRE<ArrowUpRight size={20} /></div></div></div></section>

        <section id="book" className="book-section"><div className="container book-inner"><p className="eyebrow">MAKE TIME FOR A FRESH START</p><h2>YOUR NEXT LOOK<br />STARTS HERE.</h2><p>Choose your service. Find your time. Book online.</p><BookingButton label="Book Now on Setmore" /><span className="book-small">Opens the existing public booking page in a new tab.</span></div></section>
      </main>
      <footer className="site-footer"><div className="container"><div className="footer-top"><a href="#" className="brand-name">ASHRAF’S HQ<span>BARBERSHOP · NORTHPINE</span></a><p>Northpine Shopping Centre<br />Cape Town, South Africa</p><a className="footer-book" href={bookingUrl} target="_blank" rel="noopener noreferrer">Book on Setmore<ArrowUpRight size={16} /></a></div><div className="footer-bottom"><p>Unofficial demo concept — not affiliated with Ashraf’s HQ Barbershop</p><span>Independent speculative design · No personal data collected</span></div></div></footer>
    </div>
  );
}
