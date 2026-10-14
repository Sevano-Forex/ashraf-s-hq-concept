import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, ArrowDown, CalendarDays, MapPin, Menu, X, Scissors, ExternalLink, Phone, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import interior from "@/assets/barber-interior.jpg";
import tools from "@/assets/barber-tools.jpg";

import { BookingEmbed } from "@/components/booking-embed";
import { businessAddress, mapsUrl, mapEmbedUrl, serviceGroups, openingHours } from "@/lib/barbershop";
const navigation = [{ label: "Services", id: "services" }, { label: "Why Us", id: "why-us" }, { label: "Gallery / Look", id: "gallery" }, { label: "Location", id: "location" }, { label: "Book", id: "book" }];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Ashraf’s HQ Barbershop | Northpine — Unofficial Demo" },
    { name: "description", content: "An unofficial concept for Ashraf’s HQ Barbershop in Northpine Shopping Centre, Cape Town. Browse advertised services, prices, opening hours and on-page Setmore booking." },
    { property: "og:title", content: "Ashraf’s HQ Barbershop | Unofficial Northpine Concept" },
    { property: "og:description", content: "A speculative barbershop website concept. Not affiliated with Ashraf’s HQ Barbershop. Bookings securely managed by existing Setmore system, embedded on this page." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function BookingButton({ outline = false, label = "Book Now", className = "" }: { outline?: boolean; label?: string; className?: string }) {
  return <Button asChild variant={outline ? "barberOutline" : "brass"} className={`booking-button ${className}`}><a href="#book" aria-label={`${label} — go to on-page booking`}>{label}<ArrowUpRight aria-hidden="true" /></a></Button>;
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
              <p className="booking-note"><CalendarDays size={14} aria-hidden="true" />Book here, powered by Setmore</p>
            </div>
            <div className="hero-bottom"><a href="#location"><MapPin size={15} aria-hidden="true" />Northpine Shopping Centre, Cape Town</a><span>Illustrative concept image · not the actual shop</span></div>
          </div>
        </section>

        <div className="signature-strip"><div className="container"><span>MEN’S GROOMING</span><span className="strip-star">✦</span><span>NORTHPINE, CAPE TOWN</span><span className="strip-star">✦</span><span>YOUR NEXT FRESH START</span></div></div>

        <section id="services" className="services section-light">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">THE SERVICE MENU</p><h2>THE CUT.<br /><span>THE DETAILS. THE PRICE.</span></h2></div><div className="section-intro"><p>Advertised prices from the business’s public Setmore service names. All prices are in South African rand; durations are approximate.</p><a className="text-link" href="#book">Choose your service below<ArrowDown size={17} /></a></div></div>
            <div className="menu-grid">
              {serviceGroups.map(group => <div className="menu-group" key={group.number}><div className="menu-heading"><h3>{group.title}</h3><span>{group.number}</span></div>{group.note && <p className="menu-group-note">{group.note}</p>}<dl>{group.services.map(service => <div className="menu-row" key={service.name}><dt>{service.name}<span>{service.duration}</span></dt><dd>{service.price}</dd></div>)}</dl></div>)}
            </div>
            <p className="service-disclaimer">Illustrative publicly listed prices, subject to owner confirmation. Prices above come from service names, not the separate Setmore price field; that field may not reflect the advertised treatment charge. Confirm final charges with the shop before your appointment. House-call pricing varies with distance.</p>
          </div>
        </section>

        <section id="why-us" className="why-section"><div className="container why-grid"><div><p className="eyebrow">IN THEIR OWN WORDS</p><h2>A CUT ABOVE.<br /><span>A WAY OF LIFE.</span></h2><blockquote className="about-quote">“BARBERSHOP IS NOT A HOBBY ITS A LIFESTYLE”<cite>— Ashraf’s HQ Barbershop · Setmore About listing</cite></blockquote><BookingButton label="Find Your Appointment" /></div><div className="reason-list">{[{ icon: CalendarDays, title: "Your booking, right here.", text: "Choose a service and appointment through the existing Setmore booking panel on this page." }, { icon: MapPin, title: "Right here in Northpine.", text: "Shop 5, Northpine Shopping Centre, Central Drive, Cape Town." }, { icon: Scissors, title: "Saturdays are for walk-ins.", text: "No online bookings on Saturdays. Walk-ins welcomed, 07:30–14:00." }].map(({ icon: Icon, title, text }) => <div className="reason" key={title}><Icon aria-hidden="true" size={23} strokeWidth={1.4} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

        <section id="gallery" className="gallery-section section-light"><div className="container"><div className="section-heading"><div><p className="eyebrow">THE LOOK & FEEL</p><h2>CLASSIC ROOTS.<br /><span>MODERN ATTITUDE.</span></h2></div><p className="section-intro gallery-note">A visual moodboard for this concept.<br />AI-generated illustrative images, not photographs of the shop or its customers.</p></div><div className="gallery-grid"><figure><img src={interior} loading="lazy" width={1536} height={1024} alt="Fictional barber interior moodboard with a classic leather chair" /><figcaption><span>01 / THE CHAIR</span><span>Concept inspiration</span></figcaption></figure><figure><img src={tools} loading="lazy" width={1024} height={1024} alt="Illustrative still life of scissors, clipper, comb and shaving brush" /><figcaption><span>02 / THE DETAILS</span><span>Concept inspiration</span></figcaption></figure></div></div></section>

        <section id="location" className="location-section"><div className="container location-grid"><div><p className="eyebrow">IN THE NEIGHBOURHOOD</p><h2>FIND US IN<br /><span>NORTHPINE.</span></h2><div className="location-address"><MapPin size={23} aria-hidden="true" /><div><h3>Ashraf’s HQ Barbershop</h3><address>Shop 5, Northpine Shopping Centre<br />Central Drive, Cape Town<br />Western Cape 7560</address></div></div><p className="location-note">Saturday: no online bookings. Walk-ins welcomed.</p><a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">Get directions on Google Maps<ExternalLink size={16} /></a></div><iframe className="location-map" src={mapEmbedUrl} title={`Google Maps location: ${businessAddress}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer" /></div></section>

        <section id="book" className="book-section"><div className="container book-inner"><p className="eyebrow">MAKE TIME FOR A FRESH START</p><h2>YOUR NEXT LOOK<br />STARTS HERE.</h2><BookingEmbed /></div></section>
      </main>
      <footer className="site-footer"><div className="container"><div className="footer-top"><div><a href="#" className="brand-name">ASHRAF’S HQ<span>BARBERSHOP · NORTHPINE</span></a><address className="footer-address">Shop 5, Northpine Shopping Centre<br />Central Drive, Cape Town<br />Western Cape 7560</address></div><div className="footer-hours"><h3><Clock size={16} aria-hidden="true" />Operating hours</h3><dl>{openingHours.map(item => <div key={item.days}><dt>{item.days}</dt><dd>{item.hours}</dd></div>)}</dl><p>Saturday: walk-ins welcomed · no online bookings</p></div><div className="footer-contact"><h3>Contact the shop</h3><a href="tel:+27814652086"><Phone size={15} aria-hidden="true" />+27 81 465 2086</a><a href="mailto:ashraf.thebus100@gmail.com"><Mail size={15} aria-hidden="true" />ashraf.thebus100@gmail.com</a><a className="footer-book" href="#book">Book an appointment<ArrowDown size={16} /></a></div></div><div className="footer-bottom"><p>Unofficial demo concept — not affiliated with Ashraf’s HQ Barbershop</p><span>Business details: public Setmore listing · Bookings handled by Setmore</span></div></div></footer>
    </div>
  );
}
