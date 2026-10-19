import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowUp, ArrowUpRight, ArrowDown, CalendarDays, MapPin, Menu, X, Scissors, ExternalLink, Phone, Mail, Clock, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import interior from "@/assets/barber-interior.jpg";
import tools from "@/assets/barber-tools.jpg";

import { bookingUrl, businessAddress, mapsUrl, mapEmbedUrl, serviceGroups, openingHours } from "@/lib/barbershop";
const navigation = [{ label: "Services", id: "services" }, { label: "Why Us", id: "why-us" }, { label: "Gallery / Look", id: "gallery" }, { label: "Location", id: "location" }, { label: "Book", id: "book", url: bookingUrl }];

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Ashraf’s HQ Barbershop | Northpine — Unofficial Demo" },
    { name: "description", content: "An unofficial concept for Ashraf’s HQ Barbershop in Northpine Shopping Centre, Cape Town. Browse advertised services, prices, opening hours and direct Setmore booking." },
    { property: "og:title", content: "Ashraf’s HQ Barbershop | Unofficial Northpine Concept" },
    { property: "og:description", content: "A speculative barbershop website concept. Not affiliated with Ashraf’s HQ Barbershop. All appointments are booked securely through Ashraf’s existing Setmore booking page." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

function BookingButton({ outline = false, label = "Book Now", className = "" }: { outline?: boolean; label?: string; className?: string }) {
  return <Button asChild variant={outline ? "barberOutline" : "brass"} className={`booking-button ${className}`}>
    <a href={bookingUrl} target="_blank" rel="noopener noreferrer" aria-label={`${label} — opens Setmore in a new tab`}>
      {label}<ArrowUpRight aria-hidden="true" />
    </a>
  </Button>;
}

function Index() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const updateScrollPosition = () => {
      setShowBackToTop(window.scrollY > 0);
      const header = headerRef.current;
      setShowFloatingNav(header ? window.scrollY > header.offsetTop + header.offsetHeight : false);
    };
    updateScrollPosition();
    window.addEventListener("scroll", updateScrollPosition, { passive: true });
    window.addEventListener("resize", updateScrollPosition);
    return () => {
      window.removeEventListener("scroll", updateScrollPosition);
      window.removeEventListener("resize", updateScrollPosition);
    };
  }, []);

  const scrollToTop = () => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "instant" : "smooth" });
  };
  return (
    <div className="barber-site">
      <a className="skip-link" href="#main">Skip to content</a>
      <div className="demo-banner"><span className="demo-indicator" aria-hidden="true" />Unofficial demo concept — not affiliated with Ashraf’s HQ Barbershop</div>
      <header ref={headerRef} className="site-header">
        <div className="container header-inner">
          <a className="brand-name" href="#" aria-label="Ashraf’s HQ Barbershop home">ASHRAF’S HQ<span>BARBERSHOP · NORTHPINE</span></a>
          <nav className={`desktop-nav${showFloatingNav ? " desktop-nav-floating" : ""}`} aria-label="Main navigation">
            {navigation.map(item => (
              <a
                key={item.id}
                href={item.url ?? `#${item.id}`}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noopener noreferrer" : undefined}
              >
                {item.label}
               </a>
             ))}
           </nav>
          <div className="header-actions"><BookingButton /><Button variant="barberOutline" size="icon" className="mobile-menu-button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</Button></div>
        </div>
        {menuOpen && (
          <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
            {navigation.map(item => (
              <a
                key={item.id}
                href={item.url ?? `#${item.id}`}
                target={item.url ? "_blank" : undefined}
                rel={item.url ? "noopener noreferrer" : undefined}
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
                <ArrowUpRight size={16} />
            </a>
          ))}
        </nav>
      )}
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
              <p className="booking-note"><CalendarDays size={14} aria-hidden="true" />Book securely on Setmore</p>
            </div>
            <div className="hero-bottom"><a href="#location"><MapPin size={15} aria-hidden="true" />Northpine Shopping Centre, Cape Town</a><span>Illustrative concept image · not the actual shop</span></div>
          </div>
        </section>

        <div className="signature-strip"><div className="container"><span>MEN’S GROOMING</span><span className="strip-star">✦</span><span>NORTHPINE, CAPE TOWN</span><span className="strip-star">✦</span><span>YOUR NEXT FRESH START</span></div></div>

        <section id="services" className="services section-light">
          <div className="container">
            <div className="section-heading"><div><p className="eyebrow">THE SERVICE MENU</p><h2>THE CUT.<br /><span>THE DETAILS. THE PRICE.</span></h2></div><div className="section-intro"><p>Advertised prices from the business’s public Setmore service names. All prices are in South African rand; durations are approximate.</p><a   className="text-link"   href={bookingUrl}   target="_blank"   rel="noopener noreferrer" >   Choose your service on Setmore   <ArrowUpRight size={17} /> </a></div></div>
            <div className="menu-grid">
              {serviceGroups.map(group => <div className="menu-group" key={group.number}><div className="menu-heading"><h3>{group.title}</h3><span>{group.number}</span></div>{group.note && <p className="menu-group-note">{group.note}</p>}<dl>{group.services.map(service => <div className="menu-row" key={service.name}><dt>{service.name}<span>{service.duration}</span></dt><dd>{service.price}</dd></div>)}</dl></div>)}
            </div>
            <p className="service-disclaimer">Illustrative publicly listed prices, subject to owner confirmation. Prices above come from service names, not the separate Setmore price field; that field may not reflect the advertised treatment charge. Confirm final charges with the shop before your appointment. House-call pricing varies with distance.</p>
          </div>
        </section>

        <section id="testimonials" aria-labelledby="testimonials-title" style={{ background: "#171614", color: "#f7f1e6", padding: "clamp(56px, 8vw, 104px) 0" }}>
          <div className="container">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", flexWrap: "wrap", gap: 24, marginBottom: 32 }}>
              <div>
                <p className="eyebrow" style={{ color: "#c5a36b" }}>WHAT CLIENTS ARE SAYING</p>
                <h2 id="testimonials-title" style={{ color: "#f7f1e6", margin: "12px 0 0", fontSize: "clamp(2rem, 4vw, 3.4rem)", lineHeight: 1.08 }}>THE WORD<br /><span style={{ color: "#c5a36b" }}>ON THE STREET.</span></h2>
              </div>
              <div aria-label="Setmore customer rating: 4.9 out of 5 from 13 reviews at the time of capture" style={{ textAlign: "left" }}>
                <div style={{ fontSize: "2.5rem", fontWeight: 700, lineHeight: 1 }}>4.9<span style={{ fontSize: "1rem", fontWeight: 400, color: "#c6bfb4" }}>/5</span></div>
                <div aria-hidden="true" style={{ color: "#d4ae70", letterSpacing: 3, fontSize: "1.25rem", margin: "6px 0" }}>★★★★★</div>
                <p style={{ color: "#c6bfb4", margin: 0 }}>13 reviews on Setmore*</p>
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", gap: 16 }}>
              {[
                { name: "Craig", quote: "Been cutting at Ashraf’s since the barbershop’s opening. Their precise, detailed cuts is what its about. Not forgetting the entertaining vibes. I could not go to any other." },
                { name: "Gresh", quote: "Ashraf’s Barber consistently delivers professional, precise cuts. The experience is always smooth, and you leave feeling sharp and refreshed. Highly recommend." },
                { name: "Kevin", quote: "Makes it easier to schedule appointments." },
              ].map(review => (
                <figure key={review.name} style={{ margin: 0, padding: "28px 24px", border: "1px solid rgba(197,163,107,.35)", background: "#211f1c", display: "flex", flexDirection: "column", gap: 16 }}>
                  <div aria-label="5 out of 5 stars" style={{ color: "#d4ae70", letterSpacing: 3 }}>★★★★★</div>
                  <blockquote style={{ margin: 0, lineHeight: 1.7, flex: 1, color: "#f2eee7" }}>“{review.quote}”</blockquote>
                  <figcaption style={{ color: "#c5a36b", fontWeight: 600 }}>— {review.name} <span style={{ color: "#c6bfb4", fontWeight: 400 }}>· Setmore review</span></figcaption>
                </figure>
              ))}
            </div>
            <div style={{ marginTop: 28, display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
              <p style={{ color: "#c6bfb4", margin: 0, fontSize: ".85rem" }}>*Rating and review count captured from the public Setmore listing; figures may change.</p>
              <a href="https://ashrafshqbarbershop.setmore.com/" target="_blank" rel="noopener noreferrer" style={{ color: "#d4ae70", display: "inline-flex", alignItems: "center", gap: 8, fontWeight: 600, textDecoration: "underline", textUnderlineOffset: 4 }}>Read all reviews on Setmore <ArrowUpRight size={17} aria-hidden="true" /></a>
            </div>
          </div>
        </section>

         <section id="why-us" className="why-section"><div className="container why-grid"><div><p className="eyebrow">IN THEIR OWN WORDS</p><h2>A CUT ABOVE.<br /><span>A WAY OF LIFE.</span></h2><blockquote className="about-quote">“BARBERSHOP IS NOT A HOBBY ITS A LIFESTYLE”<cite>— Ashraf’s HQ Barbershop · Setmore About listing</cite></blockquote><BookingButton label="Find Your Appointment" /></div><div className="reason-list">{[{icon: CalendarDays,title: "Booking made simple.",text: "Choose your service and appointment on Ashraf's existing Setmore booking page."}, { icon: MapPin, title: "Right here in Northpine.", text: "Shop 5, Northpine Shopping Centre, Central Drive, Cape Town." }, { icon: Scissors, title: "Saturdays are for walk-ins.", text: "No online bookings on Saturdays. Walk-ins welcomed, 07:30–14:00." }].map(({ icon: Icon, title, text }) => <div className="reason" key={title}><Icon aria-hidden="true" size={23} strokeWidth={1.4} /><div><h3>{title}</h3><p>{text}</p></div></div>)}</div></div></section>

        <section id="gallery" className="gallery-section section-light"><div className="container"><div className="section-heading"><div><p className="eyebrow">THE LOOK & FEEL</p><h2>CLASSIC ROOTS.<br /><span>MODERN ATTITUDE.</span></h2></div><p className="section-intro gallery-note">A visual moodboard for this concept.<br />AI-generated illustrative images, not photographs of the shop or its customers.</p></div><div className="gallery-grid"><figure><img src={interior} loading="lazy" width={1536} height={1024} alt="Fictional barber interior moodboard with a classic leather chair" /><figcaption><span>01 / THE CHAIR</span><span>Concept inspiration</span></figcaption></figure><figure><img src={tools} loading="lazy" width={1024} height={1024} alt="Illustrative still life of scissors, clipper, comb and shaving brush" /><figcaption><span>02 / THE DETAILS</span><span>Concept inspiration</span></figcaption></figure></div></div></section>

        <section id="location" className="location-section"><div className="container location-grid"><div><p className="eyebrow">IN THE NEIGHBOURHOOD</p><h2>FIND US IN<br /><span>NORTHPINE.</span></h2><div className="location-address"><MapPin size={23} aria-hidden="true" /><div><h3>Ashraf’s HQ Barbershop</h3><address>Shop 5, Northpine Shopping Centre<br />Central Drive, Cape Town<br />Western Cape 7560</address></div></div><p className="location-note">Saturday: no online bookings. Walk-ins welcomed.</p><a className="text-link" href={mapsUrl} target="_blank" rel="noopener noreferrer">Get directions on Google Maps<ExternalLink size={16} /></a></div><iframe className="location-map" src={mapEmbedUrl} title={`Google Maps location: ${businessAddress}`} loading="lazy" allowFullScreen referrerPolicy="no-referrer" /></div></section>

        <section id="faq" className="faq-section section-light" aria-labelledby="faq-title">
          <div className="container">
            <p className="eyebrow">BEFORE YOUR VISIT</p>
            <h2 id="faq-title">A FEW QUICK<br /><span>ANSWERS.</span></h2>
            <div className="faq-list">
              <details name="shop-faq">
                <summary>How do I book an appointment?</summary>
                <p>Choose your service and appointment on the shop’s existing Setmore page. <a href={bookingUrl} target="_blank" rel="noopener noreferrer">Book on Setmore <span className="sr-only">(opens in a new tab)</span></a>.</p>
              </details>
              <details name="shop-faq">
                <summary>Can I book online for Saturday?</summary>
                <p>Saturday is for walk-ins, with no online bookings. The advertised Saturday hours are 07:30–14:00.</p>
              </details>
              <details name="shop-faq">
                <summary>Where is the shop?</summary>
                <p>{businessAddress}. <a href={mapsUrl} target="_blank" rel="noopener noreferrer">Get directions <span className="sr-only">(opens in a new tab)</span></a>.</p>
              </details>
              <details name="shop-faq">
                <summary>Where can I check services and prices?</summary>
                <p>Browse the <a href="#services">service menu above</a> and confirm current services and final prices with the shop before your appointment.</p>
              </details>
            </div>
          </div>
        </section>

        <section id="book" className="book-section"><div className="container book-inner"><p className="eyebrow">MAKE TIME FOR A FRESH START</p><h2>YOUR NEXT LOOK<br />STARTS HERE.</h2><BookingButton label="Book Your Appointment" /></div></section>
      </main>
      <footer className="site-footer"><div className="container"><div className="footer-top"><div><a href="#" className="brand-name">ASHRAF’S HQ<span>BARBERSHOP · NORTHPINE</span></a><address className="footer-address">Shop 5, Northpine Shopping Centre<br />Central Drive, Cape Town<br />Western Cape 7560</address></div><div className="footer-hours"><h3><Clock size={16} aria-hidden="true" />Operating hours</h3><dl>{openingHours.map(item => <div key={item.days}><dt>{item.days}</dt><dd>{item.hours}</dd></div>)}</dl><p>Saturday: walk-ins welcomed · no online bookings</p></div><div className="footer-contact"><h3>Contact the shop</h3><a href="tel:+27814652086"><Phone size={15} aria-hidden="true" />+27 81 465 2086</a><a href="mailto:ashraf.thebus100@gmail.com"><Mail size={15} aria-hidden="true" />ashraf.thebus100@gmail.com</a><a href="https://www.facebook.com/p/Ashraf-HQ-BarberShop-100063633908953/" target="_blank" rel="noopener noreferrer" aria-label="Visit Ashraf’s HQ Barbershop on Facebook — opens in a new tab"><Facebook size={15} aria-hidden="true" />Facebook</a><a
  className="footer-book"
  href={bookingUrl}
  target="_blank"
  rel="noopener noreferrer"
>
  Book an appointment<ArrowUpRight size={16} />
</a></div></div><div className="footer-bottom"><p>Unofficial demo concept — not affiliated with Ashraf’s HQ Barbershop</p><span>Business details: public Setmore listing · Bookings handled by Setmore</span></div></div></footer>
      <nav className="mobile-action-bar" aria-label="Quick shop actions">
        <Button asChild variant="barberOutline"><a href="tel:+27814652086"><Phone aria-hidden="true" />Call</a></Button>
        <Button asChild variant="barberOutline"><a href={mapsUrl} target="_blank" rel="noopener noreferrer" aria-label="Get directions on Google Maps (opens in a new tab)"><MapPin aria-hidden="true" />Directions</a></Button>
        <Button asChild variant="brass"><a href={bookingUrl} target="_blank" rel="noopener noreferrer" aria-label="Book on Setmore (opens in a new tab)"><CalendarDays aria-hidden="true" />Book</a></Button>
      </nav>
      {showBackToTop && (
        <Button
          type="button"
          variant="brass"
          size="icon"
          className="back-to-top"
          aria-label="Back to top"
          title="Back to top"
          onClick={scrollToTop}
        >
          <ArrowUp aria-hidden="true" />
        </Button>
      )}
    </div>
  );
}
