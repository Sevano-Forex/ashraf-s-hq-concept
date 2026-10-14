import { useState } from "react";
import { ExternalLink, CircleHelp, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { bookingUrl } from "@/lib/barbershop";

export function BookingEmbed() {
  const [embedFailed, setEmbedFailed] = useState(false);

  return (
    <>
      <p className="booking-security"><ShieldCheck size={17} aria-hidden="true" />Bookings securely managed by existing Setmore system</p>
      <p className="saturday-note">Saturday: no online bookings. Walk-ins welcomed.</p>
      <div className="booking-frame-wrap">
        <iframe
          className="booking-frame"
          src={bookingUrl}
          title="Book an appointment with Ashraf’s HQ Barbershop through Setmore"
          allow="web-share; payment"
          loading="lazy"
          onError={() => setEmbedFailed(true)}
        />
      </div>
      <p className="book-small">Appointment availability is provided by Setmore. Booking details are handled by Setmore, not stored by this concept site.</p>
      {!embedFailed && (
        <Button variant="barberOutline" className="booking-help" onClick={() => setEmbedFailed(true)} aria-controls="booking-fallback">
          <CircleHelp aria-hidden="true" />Booking panel not loading?
        </Button>
      )}
      {embedFailed && (
        <div id="booking-fallback" className="booking-fallback" role="status">
          <p>If the embedded booking panel is unavailable, you can open the existing Setmore page instead.</p>
          <Button asChild variant="brass"><a href={bookingUrl} target="_blank" rel="noopener noreferrer">Open Setmore fallback<ExternalLink aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></Button>
        </div>
      )}
    </>
  );
}