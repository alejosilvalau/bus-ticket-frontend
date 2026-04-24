import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Banner from "../img/Banner.jpg";
import Img1 from "../img/img1.jpg";
import LogoImg from "../img/Logo.jpg";
import "../styles/Sliderbar.css";

const slides = [
  { src: Banner, alt: "Banner Busticket 1" },
  { src: Img1, alt: "Banner Busticket 2" },
  { src: LogoImg, alt: "Banner Busticket 3" },
];

function Sliderbar() {
  const trackRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 3500);

    return () => {
      window.clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const slideWidth = track.children[0]?.clientWidth + 16 || track.clientWidth;
    track.scrollTo({ left: slideWidth * currentIndex, behavior: "smooth" });
  }, [currentIndex]);

  return (
    <div className="sliderbar-container">
      <div ref={trackRef} className="slider-track">
        {slides.map((slide, index) => (
          <Link key={index} to="/ofertas" className="slider-item">
            <img className="slider" src={slide.src} alt={slide.alt} />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Sliderbar;