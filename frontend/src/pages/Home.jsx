import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { fetchGallery, fetchProducts } from '../api/api.js';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function Home() {
  const [gallery, setGallery] = useState([]);
  const [products, setProducts] = useState([]);
  const [displayedGallery, setDisplayedGallery] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalGalleryImages: 0,
    totalCafeItems: 0
  });
  const [showAllGallery, setShowAllGallery] = useState(false);
  const INITIAL_GALLERY_COUNT = 6;

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const [galleryData, productsData] = await Promise.all([
          fetchGallery(),
          fetchProducts()
        ]);
        if (!cancelled) {
          setGallery(galleryData);
          setProducts(productsData);
          
          const cafeItems = productsData.filter(p => ['COFFEE', 'FOOD'].includes(p.category));
          
          setStats({
            totalProducts: productsData.length,
            totalGalleryImages: galleryData.length,
            totalCafeItems: cafeItems.length
          });
          
          setDisplayedGallery(galleryData.slice(0, INITIAL_GALLERY_COUNT));
        }
      } catch {
        if (!cancelled) {
          setGallery([]);
          setProducts([]);
          setDisplayedGallery([]);
          setStats({ totalProducts: 0, totalGalleryImages: 0, totalCafeItems: 0 });
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleSeeMore = () => {
    setShowAllGallery(true);
    setDisplayedGallery(gallery);
  };

  const handleSeeLess = () => {
    setShowAllGallery(false);
    setDisplayedGallery(gallery.slice(0, INITIAL_GALLERY_COUNT));
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden bg-surface">
        <motion.div style={{ y: y1 }} className="absolute inset-0 z-0">
          <img 
            alt="Cinematic Cycling Hero" 
            className="w-full h-full object-cover opacity-20" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy-5nRYQ1toHnnNC7UDbqA5ytB6yrdkq-chYIAqqMpfq5HGy99aaCh4XTMnTCExflZrmb_6tsZfLAFYN2erCyegB5wgR6aYjdTx30qIRHOYLZ2ZRpL7IhkpbWcM60GKqOaWUVVbjYW4WKXAQWFvyGQbwKb5hvnHyjlbQ3csRCG6akcV6OD_1zFFYGITNmoGZLWNRmoG0crtuRxZ7u3QEElNyrfzhyqlcufNBvWUqKEJh1L2VyOgcsqMPIGSG26ggdrVhL3I3IQKF63"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-primary-bg/80 via-primary-bg/40 to-primary-bg/80"></div>
        </motion.div>

        <div className="relative z-10 w-full max-w-screen-2xl mx-auto px-8 md:px-12 pt-20 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="max-w-4xl"
          >
            <h1 className="text-on-surface font-headline font-black text-6xl md:text-9xl leading-none tracking-tighter uppercase mb-2">
              THE ROLLOUT
            </h1>
            <p className="text-accent font-label text-xs tracking-[0.5em] uppercase mb-12">
              Cycle Café & Boutique
            </p>
            
            <p className="text-on-surface/80 font-body text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed mb-6">
              A performance-led café, boutique, and community hub for cycling and active lifestyles.
            </p>
            <p className="text-on-surface/40 font-label text-[10px] tracking-[0.3em] uppercase mb-12">
              Shop 6, The Walk, Al Forzan, Khalifa City, Abu Dhabi
            </p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-col md:flex-row gap-4"
            >
              <Link 
                to="/shop" 
                className="bg-accent text-white px-10 py-4 font-headline text-xs tracking-widest uppercase hover:opacity-90 transition-all duration-300 flex items-center justify-center rounded-lg shadow-lg"
              >
                Browse shop
              </Link>
              <Link 
                to="/cafe" 
                className="border border-accent/40 text-on-surface px-10 py-4 font-headline text-xs tracking-widest uppercase hover:bg-accent/5 transition-all duration-300 flex items-center justify-center rounded-lg"
              >
                Cafe menu
              </Link>
              <Link 
                to="/events" 
                className="border border-accent/40 text-on-surface px-10 py-4 font-headline text-xs tracking-widest uppercase hover:bg-accent/5 transition-all duration-300 flex items-center justify-center rounded-lg"
              >
                Upcoming events
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Technical Spec-Bar */}
        <motion.div 
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, delay: 1 }}
          className="absolute bottom-0 w-full bg-surface-container-highest/10 backdrop-blur-md border-t border-white/10 z-20"
        >
          <div className="max-w-screen-2xl mx-auto px-12 py-6 flex flex-wrap justify-between items-center text-white/80 font-label text-xs tracking-widest uppercase">
            <div className="flex items-center gap-3">
              <span className="text-tertiary-fixed">●</span>
              CURRENT TEMP: 24°C
            </div>
            <div className="hidden md:block">WIND: 12KM/H NW</div>
            <div className="hidden md:block">NEXT RIDE: 05:15 AM (ZAYED CYCLING TRACK)</div>
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-sm">coffee</span>
              ROAST: ETHIOPIAN YIRGACHEFFE
            </div>
          </div>
        </motion.div>
      </section>

      {/* Featured Dual-Content Section */}
      <section className="bg-surface py-32 px-8">
        <div className="max-w-screen-2xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-7"
          >
            <div className="relative group">
              <img 
                alt="Luxury Espresso Pour" 
                className="w-full aspect-[4/5] object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCXOqeMCWRvgYfTYXXI7NOP5PRTuYRVXjdTMqn4zuldIMt4QuSlWoBMTpsJ140xfah433ATq8w6xWk3ZvoduXa8_RynBD-ITcZKOsOTROvdKGftV8jx5M1JiN53EjtZAw_dUA7i3EMFBj4SFUlaTelaVyZlFgTjtFzE6CYEYzmKb1tcP5Z1pNvmcKHTTwC3K7ZReTBCX2fvn__Zn8wSjLXqdfnm-mVgF2eabpAJ70JA-K4xdX6Bdg6N59P7mpbvn06u9_7_Zlh30kPW"
              />
              <motion.div 
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="absolute -bottom-8 -right-8 bg-secondary-container p-12 hidden lg:block shadow-xl"
              >
                <h3 className="font-headline font-bold text-3xl tracking-tighter uppercase mb-4 text-on-secondary-container">THE RITUAL</h3>
                <p className="font-body text-lg italic text-on-secondary-container/80 max-w-[200px]">Because the ride starts long before the first pedal stroke.</p>
              </motion.div>
            </div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="md:col-span-5 md:pl-12"
          >
            <span className="font-label text-tertiary text-sm tracking-[0.2em] uppercase mb-4 block">The Hub</span>
            <h2 className="font-headline font-black text-5xl leading-tight tracking-tighter uppercase mb-8">ENGINEERED FOR <br/> CONNECTION.</h2>
            <p className="font-body text-xl leading-relaxed text-on-surface/70 mb-10">
              Beyond the bike, The Rollout is a sanctuary for those who appreciate the intersection of high-cadence performance and slow-pour patience. Our flagship Abu Dhabi space combines a world-class workshop with a curated specialty coffee experience.
            </p>
            <Link to="/cafe" className="inline-block font-headline text-sm tracking-[0.2em] uppercase border-b-2 border-primary pb-2 hover:opacity-60 transition-all">Explore the space</Link>
          </motion.div>
        </div>
      </section>

      {/* Product Bento Grid */}
      <section className="bg-surface-container-low py-32 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20 text-center"
          >
            <h2 className="font-headline font-black text-4xl md:text-6xl tracking-tighter uppercase mb-4">THE CURATED KIT.</h2>
            <p className="font-body text-xl italic text-on-surface/60">A selection of technical apparel and high-performance hardware.</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]">
            {/* Large Card */}
            <motion.div 
              whileHover={{ y: -10 }}
              className="md:col-span-2 md:row-span-2 bg-surface-container-lowest relative group overflow-hidden"
            >
              <img 
                alt="Performance Bike" 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4mffHiK8z2xcm4kN3-o52jaRaYSPFFAq-9zWB7Ry0t9_q5RKD-2LEXX9zMnxYxNYYztNcuG-2K93UbykrPdXNBslKC4-Uz82RnSkh1v0dAPtaLNDWVl3VakE-uG0GSr3SXuWDBIW15K_kmy3PgK3PZ4r9mP6noHtfHn0eOn9KaUbotPozUR-sqlUbbmtEQ-QBkZF4qGIj4c58kdJgl4FUHxIBrMf8cT0n_c4h_UwPdnbJKqofoZTKD4hSEvAMGWizPfg3upUN57Yv"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-12">
                <span className="font-label text-white/70 text-xs tracking-widest uppercase mb-2">Technical Hardware</span>
                <h4 className="text-white font-headline font-bold text-3xl uppercase tracking-tighter">S-WORKS TARMAC SL8</h4>
                <Link to="/shop" className="mt-4 text-white font-label text-xs tracking-widest uppercase flex items-center gap-2 hover:translate-x-2 transition-transform">
                  View Detail <span className="material-symbols-outlined text-sm">north_east</span>
                </Link>
              </div>
            </motion.div>

            {/* Product Item 1 */}
            <motion.div whileHover={{ y: -5 }} className="bg-surface-container-lowest p-8 flex flex-col justify-between group">
              <div>
                <span className="font-label text-primary/40 text-xs tracking-widest uppercase">Apparel</span>
                <h4 className="font-headline font-bold text-xl uppercase mt-2">Pro Team Jersey</h4>
              </div>
              <div className="relative h-40 flex items-center justify-center">
                <img 
                  alt="Cycling Jersey" 
                  className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzzdWgPhJ08O2-RASwYUqHgyFSVSK4X9RDbg8z0_u-zeWxXQljWTvM8Ukc8b5afZoeb4mpyJ5AJ7c6TZsTtAar1tZqyaOcESA8vvzbwUvkcdlJPuOIUIY13soElvvJJY0cg_ln6ImrzqbII-SZEgQlL_tPE9GajfmN1AdQ4r3C5dUnt5eBpMsZ-CNAsHxTw7SRxBiwCjEZpbelewo6b5Tik_0zNM9e_FGN_MhmSXzsWIOYzT7fvjtzjEMHM0QW5oew2lpetSNMDhK8"
                />
              </div>
              <div className="flex justify-between items-center bg-zinc-50 p-2 border border-zinc-100">
                <span className="font-label text-sm font-bold">AED 750</span>
                <Link to="/shop" className="material-symbols-outlined text-zinc-400 hover:text-zinc-900 transition-colors">shopping_bag</Link>
              </div>
            </motion.div>

            {/* Product Item 2 */}
            <motion.div whileHover={{ y: -5 }} className="bg-surface-container-lowest p-8 flex flex-col justify-between group">
              <div>
                <span className="font-label text-primary/40 text-xs tracking-widest uppercase">Essentials</span>
                <h4 className="font-headline font-bold text-xl uppercase mt-2">Carbon Cage</h4>
              </div>
              <div className="relative h-40 flex items-center justify-center">
                <img 
                  alt="Water Bottle Cage" 
                  className="max-h-full object-contain group-hover:scale-110 transition-transform duration-500" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9ahDR0W-TANMNacuWZCsMFGnooS4eloWYqMkvwajYQ9X4RPJua-PhFidlr1GF8sKYaB31vwxpPa0Aim4uKMY-K93oxtT8d8OwOr6ykZGX428SlEC_bT8dJkTLa84Osuqwug_RENKMeJGPjaT58zHb3wFr_bfp-96ctacAWlyYdrPWK9OuNEHaMA0CkuRp42CL9_5wPsq1ogeeeRnxW0rO-7lxC_DudPmjA6xCBilQQnWnRsqW-H6ZdmRXMoxy-NK8o1YPIGFtzy9M"
                />
              </div>
              <div className="flex justify-between items-center bg-zinc-50 p-2 border border-zinc-100">
                <span className="font-label text-sm font-bold">AED 220</span>
                <Link to="/shop" className="material-symbols-outlined text-zinc-400 hover:text-zinc-900 transition-colors">shopping_bag</Link>
              </div>
            </motion.div>

            {/* Special Call to Action */}
            <motion.div 
              whileHover={{ scale: 1.02 }}
              className="md:col-span-2 bg-tertiary p-12 flex flex-col justify-center text-on-tertiary relative overflow-hidden"
            >
              <div className="relative z-10">
                <h4 className="font-headline font-black text-4xl uppercase tracking-tighter mb-4">THE PARTNER PORTAL</h4>
                <p className="font-body text-lg italic mb-8 max-w-md">Exclusive access for teams and corporate performance partners.</p>
                <Link to="/admin" className="inline-block border border-on-tertiary/30 px-8 py-4 font-headline text-xs tracking-widest uppercase hover:bg-on-tertiary hover:text-tertiary transition-all">Request Access</Link>
              </div>
              <span className="material-symbols-outlined absolute -right-8 -bottom-8 text-[200px] opacity-10 rotate-12 select-none">groups</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Community Gallery */}
      <section className="bg-surface py-32 px-8">
        <div className="max-w-screen-2xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="max-w-2xl"
            >
              <span className="font-label text-tertiary text-sm tracking-[0.2em] uppercase mb-4 block">Our Peloton</span>
              <h2 className="font-headline font-black text-4xl md:text-6xl tracking-tighter uppercase">MOVEMENT. CULTURE. <br/> CONNECTION.</h2>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-4 mb-4"
            >
              <div className="text-right">
                <div className="text-2xl font-black font-headline tracking-tighter">{stats.totalGalleryImages}+</div>
                <div className="font-label text-[10px] text-outline uppercase tracking-widest">Images Shared</div>
              </div>
              <div className="w-[1px] h-10 bg-outline/20"></div>
              <div className="text-right">
                <div className="text-2xl font-black font-headline tracking-tighter">05:00</div>
                <div className="font-label text-[10px] text-outline uppercase tracking-widest">First Pour</div>
              </div>
            </motion.div>
          </div>

          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {displayedGallery.map((item, idx) => (
              <motion.div 
                key={item.id}
                variants={itemVariants}
                whileHover={{ y: -10 }}
                className="relative group aspect-square overflow-hidden bg-surface-container-high"
              >
                <img 
                  src={item.imageUrl} 
                  alt="RollOut community" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-zinc-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="text-white font-label text-xs tracking-widest uppercase">View Momentum</span>
                </div>
              </motion.div>
            ))}
            {displayedGallery.length === 0 && (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-outline/20">
                <p className="text-outline font-body italic text-xl">Capturing the first few miles. Gallery loading...</p>
              </div>
            )}
          </motion.div>
          
          {gallery.length > INITIAL_GALLERY_COUNT && (
            <div className="text-center mt-20">
              <button 
                className="btn-orange-outline group"
                onClick={showAllGallery ? handleSeeLess : handleSeeMore}
              >
                {showAllGallery ? 'See Less' : `See More (+${gallery.length - INITIAL_GALLERY_COUNT})`}
                <span className={`material-symbols-outlined transition-transform ${showAllGallery ? 'rotate-180' : 'group-hover:translate-y-1'}`}>expand_more</span>
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
