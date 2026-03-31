import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchGallery } from '../api/api.js';

export default function Home() {
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchGallery();
        if (!cancelled) setGallery(data.slice(0, 6));
      } catch {
        if (!cancelled) setGallery([]);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      {/* HERO SECTION */}
      <section className="rollout-hero mb-5">
        <div className="rollout-hero-overlay" />
        <div className="rollout-hero-content text-center">
          <h1 className="h2 fw-bolder text-dark d-block mb-0 tracking-widest">THE</h1>
          <h1 className="display-4 fw-bolder text-dark d-block tracking-tighter">ROLLOUT</h1>
          <span className="navbar-text small text-danger d-block py-2 tracking-widest">Cycle Café & Boutique</span>
          <p className="lead mb-2 text-muted mx-auto" style={{ maxWidth: '760px' }}>
            A performance-led cafe, boutique, and community hub for cycling and active lifestyles.
          </p>
          <p className="small text-muted mb-4">Shop 6, The Walk, Al Forzan, Khalifa City, Abu Dhabi</p>
          <div className="d-flex flex-wrap gap-3 justify-content-center">
            <Link to="/shop" className="btn btn-orange btn-lg shadow-sm">
              Browse shop
            </Link>
            <Link to="/cafe" className="btn btn-orange-outline btn-lg shadow-sm bg-white">
              Cafe menu
            </Link>
            <Link to="/events" className="btn btn-orange-outline btn-lg shadow-sm bg-white">
              Upcoming events
            </Link>
          </div>
        </div>
      </section>

      {/* BRAND STORY / ABOUT */}
      <section className="section-shell mb-4">
        <div className="section-kicker">MORE THAN A</div>
        <h2 className="section-title mb-3">Cafe</h2>
        <p className="text-muted-premium">
          The RollOut Cycle Cafe & Boutique is a premium lifestyle concept designed for today's active, performance-driven
          consumer. The brand integrates specialty coffee, health-focused food offerings, and a curated retail selection
          of leading cycling, running and sports nutrition brands within a single, experience-led destination.
        </p>
        <p className="text-muted-premium">
          More than a cafe or retail space, The RollOut is also a community hub that brings together movement, culture,
          and design before, during, and after every ride, run, or workout.
        </p>
      </section>

      {/* VISION / MISSION */}
      <section className="row g-4 mb-4">
        <div className="col-md-6">
          <div className="card-premium h-100 p-4">
            <div className="section-kicker">Our Vision</div>
            <p className="mb-0 text-muted-premium">
              To become Abu Dhabi's leading high-performance cycling cafe and community hub - a recognized destination for
              athletes, families, weekend riders, and health-conscious residents.
            </p>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card-premium h-100 p-4">
            <div className="section-kicker">Our Mission</div>
            <p className="mb-0 text-muted-premium">
              To create a European-inspired cycle cafe experience that delivers exceptional coffee, simple nutritious
              food, and access to progressive cycling and endurance brands in a calm, functional environment.
            </p>
          </div>
        </div>
      </section>

      {/* CAFE / BOUTIQUE / COMMUNITY / FUTURE SERVICES */}
      <section className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card-premium h-100 p-4">
            <h3 className="h5 fw-bold mb-3">Cafe</h3>
            <p className="text-muted mb-0">Specialty coffee and a concise quality-focused menu built for consistency and nutrition.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-premium h-100 p-4">
            <h3 className="h5 fw-bold mb-3">Boutique</h3>
            <p className="text-muted mb-0">Curated high-end cycling and running apparel, equipment, and accessories.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-premium h-100 p-4">
            <h3 className="h5 fw-bold mb-3">Community</h3>
            <p className="text-muted mb-0">A welcoming meeting point for rides, runs, talks, and shared experiences.</p>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card-premium h-100 p-4">
            <h3 className="h5 fw-bold mb-3">Future Services</h3>
            <p className="text-muted mb-0">Bike fitting and light servicing planned in later phases as the community grows.</p>
          </div>
        </div>
      </section>

      {/* CYCLING & LIFESTYLE HUB SECTION */}
      <section className="section-shell mb-5">
        <div className="section-kicker">A COMPLETE</div>
        <h2 className="section-title mb-3">Cycling & Lifestyle Hub</h2>
        <p className="text-muted-premium">
          Abu Dhabi's investment in cycling infrastructure and wellness has created a rapidly growing active community.
          The RollOut is built to close the gap between specialty coffee, healthy reliable food, niche high-performance
          retail, and authentic community events.
        </p>
        <p className="text-muted-premium mb-4">
          This hybrid model positions The RollOut at the intersection of hospitality, retail, and wellness creating
          multiple revenue streams and strong long-term brand loyalty.
        </p>
        <div className="d-flex flex-wrap gap-3">
          <Link to="/shop" className="btn btn-orange">Shop collection</Link>
          <Link to="/events" className="btn btn-orange-outline bg-white">Join community events</Link>
        </div>
      </section>
      <div className="row g-4 px-2">
        <div className="col-md-4">
          <div className="card-premium h-100 p-4 border-0 text-center">
            <h3 className="h5 fw-bold mb-3">E-commerce</h3>
            <p className="text-muted mb-0">
              Apparel, nutrition, and cycling gear. Add items to your cart and check out when you are ready.
            </p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-premium h-100 p-4 border-0 text-center">
            <h3 className="h5 fw-bold mb-3">Cafe</h3>
            <p className="text-muted mb-0">Coffee and food for before or after your ride. Same cart, same checkout flow.</p>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card-premium h-100 p-4 border-0 text-center">
            <h3 className="h5 fw-bold mb-3">Events</h3>
            <p className="text-muted mb-0">Social rides and workshops. Admins can post new events from the Events page.</p>
          </div>
        </div>
      </div>

      {/* COMMUNITY GALLERY FED FROM BACKEND */}
      <section className="section-shell mt-5">
        <div className="section-kicker">COMMUNITY GALLERY</div>
        <h2 className="section-title mb-3">Movement. Culture. Connection.</h2>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 g-3">
          {gallery.map((item) => (
            <div className="col" key={item.id}>
              <div className="gallery-card">
                <img src={item.imageUrl} alt="RollOut community" className="gallery-image" />
              </div>
            </div>
          ))}
          {gallery.length === 0 && (
            <div className="col-12">
              <p className="text-muted mb-0">Gallery images will appear here after admin uploads.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
