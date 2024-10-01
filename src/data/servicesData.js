import agencyIcon from "../assets/icon/agency.svg";
import ecommerceIcon from "../assets/icon/ecommerce.svg";
import restaurantIcon from "../assets/icon/restaurant.svg";
import exampleImage1 from "../assets/example1.jpg";
import exampleImage2 from "../assets/example2.jpg";
import exampleImage3 from "../assets/example3.jpg";

const servicesData = [
  {
    id: "retail",
    title: "Retail",
    description: "Presenza online per negozi e attività commerciali.",
    icon: agencyIcon,
    templates: 29,
    images: [exampleImage1, exampleImage2, exampleImage3],
  },
  {
    id: "ristorazione",
    title: "Ristorazione",
    description: "Design raffinati per ristoranti e locali.",
    icon: restaurantIcon,
    templates: 45,
    images: [exampleImage1, exampleImage2, exampleImage3],
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    description: "Soluzioni ottimizzate per la vendita online.",
    icon: ecommerceIcon,
    templates: 101,
    images: [exampleImage1, exampleImage2, exampleImage3],
  },
];

export default servicesData;
