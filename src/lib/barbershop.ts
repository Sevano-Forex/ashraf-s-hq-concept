export const bookingUrl = "https://ashrafshqbarbershop.setmore.com/";
export const businessAddress = "Ashraf’s HQ Barbershop, Shop 5, Northpine Shopping Centre, Central Drive, Cape Town, Western Cape 7560";
export const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessAddress)}`;
export const mapEmbedUrl = `https://www.google.com/maps?q=${encodeURIComponent(businessAddress)}&output=embed`;

export const serviceGroups = [
  { title: "Cuts & fades", number: "01", services: [
    { name: "Blade / Super fades", price: "R140", duration: "30 min" },
    { name: "Fades", price: "R120", duration: "30 min" },
    { name: "Full scissor cuts", price: "R130", duration: "60 min" },
    { name: "Straight cuts", price: "R100", duration: "30 min" },
    { name: "Bald shaves", price: "R100", duration: "30 min" },
  ] },
  { title: "Beards & shaves", number: "02", services: [
    { name: "Clean facial shaves", price: "R60", duration: "30 min" },
    { name: "Beard line-up", price: "R50", duration: "30 min" },
    { name: "Fade with full beard", price: "R170", duration: "30 min" },
    { name: "Fade with beard trim / shave", price: "R170", duration: "30 min" },
    { name: "Machine shave", price: "R40", duration: "30 min" },
    { name: "Hot towel shave", price: "R80", duration: "30 min" },
    { name: "Steam shave", price: "R80", duration: "30 min" },
  ] },
  { title: "Pensioners & children", number: "03", note: "Pensioners / children under 12", services: [
    { name: "Straight cut", price: "R90", duration: "30 min" },
    { name: "Fade", price: "R100", duration: "30 min" },
    { name: "Full scissor", price: "R120", duration: "30 min" },
  ] },
  { title: "Finishing touches & visits", number: "04", services: [
    { name: "Full face wax", price: "R70", duration: "30 min" },
    { name: "Nose wax", price: "R30", duration: "30 min" },
    { name: "Hair dye", price: "R30", duration: "30 min" },
    { name: "House call", price: "≈ R250", duration: "Variable · price depends on distance" },
  ] },
];

export const openingHours = [
  { days: "Monday–Thursday", hours: "08:00–18:00" },
  { days: "Friday", hours: "08:00–18:30" },
  { days: "Saturday", hours: "07:30–14:00" },
  { days: "Sunday", hours: "Closed" },
];