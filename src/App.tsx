import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  Search, 
  Heart, 
  User, 
  ShoppingBag, 
  Menu, 
  X, 
  Phone,
  Home,
  ArrowRight, 
  Send,
  CheckCircle2, 
  ShieldCheck, 
  Truck, 
  RefreshCw, 
  MessageSquare,
  Star,
  Plus,
  Minus,
  Trash2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Facebook,
  Instagram,
  Youtube,
  Twitter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import { PRODUCTS } from './data/products';
import { TRUSTED_TALES, INFO_PAGES, INGREDIENTS, MOCK_REVIEWS } from './constants';
import { Product, CartItem } from './types';

// --- Components ---

const AnnouncementBar = () => (
  <div className="bg-[#f5f2ed] text-[#1a1a1a] text-center py-2 px-4 text-[10px] tracking-[2px] font-medium uppercase border-b border-gray-200">
    10% off on first order above Rs. 1500. Use Code : DIVYA10
  </div>
);

export default function App() {
  const [view, setView] = useState<{ type: 'home' | 'product' | 'info' | 'checkout' | 'order-success'; id?: string }>({ type: 'home' });
  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('divya_cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('divya_wishlist');
    return saved ? JSON.parse(saved) : [];
  });
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [openAccordion, setOpenAccordion] = useState<string | null>('description');
  const [selectedSize, setSelectedSize] = useState('200g');
  const [pincode, setPincode] = useState('');
  const [isWellnessPopupOpen, setIsWellnessPopupOpen] = useState(false);
  const talesScrollRef = useRef<HTMLDivElement>(null);

  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const heroBanners = useMemo(() => {
    if (isMobile) {
      return [
        {
          desktop: 'https://static.wixstatic.com/media/7fa905_d81e4b0ccfdf4a549770256de087229a~mv2.png',
          mobile: 'https://static.wixstatic.com/media/7fa905_6b4b2a8dceaf456ea6202a781b46b696~mv2.png'
        },
        {
          desktop: 'https://static.wixstatic.com/media/7fa905_86e2dbb47ab84177868a9c28269620c7~mv2.png',
          mobile: 'https://static.wixstatic.com/media/7fa905_6d7d59dcdb234377827fb0d22cb061f0~mv2.png'
        },
        {
          desktop: 'https://static.wixstatic.com/media/7fa905_afd984aef76543ffb6941211ce32c673~mv2.png',
          mobile: 'https://static.wixstatic.com/media/7fa905_6b4b2a8dceaf456ea6202a781b46b696~mv2.png'
        }
      ];
    }
    return [
      {
        desktop: 'https://static.wixstatic.com/media/7fa905_1766c9e6553b4f459c2bef99c3415775~mv2.png',
        mobile: ''
      },
      {
        desktop: 'https://static.wixstatic.com/media/7fa905_afd984aef76543ffb6941211ce32c673~mv2.png',
        mobile: ''
      }
    ];
  }, [isMobile]);

  useEffect(() => {
    if (currentHeroSlide >= heroBanners.length) {
      setCurrentHeroSlide(0);
    }
  }, [heroBanners.length]);

  const nextHeroSlide = () => {
    setSlideDirection(1);
    setCurrentHeroSlide((prev) => (prev + 1) % heroBanners.length);
  };

  const prevHeroSlide = () => {
    setSlideDirection(-1);
    setCurrentHeroSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length);
  };

  useEffect(() => {
    // Preload first hero banner
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = heroBanners[0].desktop;
    document.head.appendChild(link);

    const timer = setInterval(nextHeroSlide, 6000);

    // Wellness Popup logic
    const hasSeenPopup = localStorage.getItem('divya_wellness_popup_seen');
    if (!hasSeenPopup) {
      const popupTimer = setTimeout(() => {
        setIsWellnessPopupOpen(true);
      }, 3000);
      return () => {
        clearInterval(timer);
        clearTimeout(popupTimer);
        document.head.removeChild(link);
      };
    }

    return () => {
      clearInterval(timer);
      document.head.removeChild(link);
    };
  }, []);

  const scrollTales = (direction: 'left' | 'right') => {
    if (talesScrollRef.current) {
      const scrollAmount = 324; // Card width (300) + gap (24)
      const { scrollLeft } = talesScrollRef.current;
      const scrollTo = direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount;
      talesScrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    localStorage.setItem('divya_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('divya_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const addToCart = (product: Product, variantIdx = 0, qty = 1) => {
    const variant = product.variants[variantIdx];
    const key = `${product.handle}-${variantIdx}`;
    setCart(prev => {
      const existing = prev.find(item => item.key === key);
      if (existing) {
        return prev.map(item => item.key === key ? { ...item, qty: item.qty + qty } : item);
      }
      return [...prev, {
        key,
        handle: product.handle,
        title: product.title,
        image: product.image,
        vendor: product.vendor,
        option: variant.option,
        price: variant.price,
        qty
      }];
    });
    showToast(`Added to cart: ${product.title}`);
  };

  const toggleWishlist = (handle: string) => {
    setWishlist(prev => {
      if (prev.includes(handle)) {
        showToast('Removed from wishlist');
        return prev.filter(h => h !== handle);
      }
      showToast('Added to wishlist');
      return [...prev, handle];
    });
  };

  const filteredProducts = useMemo(() => {
    let result = PRODUCTS;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p => 
        p.title.toLowerCase().includes(q) || 
        p.tags.toLowerCase().includes(q) || 
        p.vendor.toLowerCase().includes(q)
      );
    }
    if (activeCategory !== 'all') {
      const cat = activeCategory.toLowerCase();
      result = result.filter(p => {
        const type = p.type.toLowerCase();
        const tags = p.tags.toLowerCase();
        
        // Custom mapping for UI categories to data
        if (cat === 'heart' || cat === 'cardiac' || cat === 'bp care') {
          return type === 'heart' || tags.includes('heart') || tags.includes('blood pressure') || tags.includes('cardiac');
        }
        if (cat === 'immunity') {
          return tags.includes('immunity') || tags.includes('immune');
        }
        if (cat === 'digestion') {
          return tags.includes('digestion') || tags.includes('digestive') || tags.includes('stomach');
        }
        if (cat === 'joints' || cat === 'pain relief') {
          return tags.includes('pain') || tags.includes('relief') || tags.includes('joint') || tags.includes('joints');
        }
        if (cat === 'skin') {
          return tags.includes('skin') || tags.includes('dermatology');
        }
        if (cat === 'respiratory') {
          return tags.includes('respiratory') || tags.includes('cough') || tags.includes('breathing') || type === 'liquid' || type === 'tablet';
        }
        if (cat === 'rituals' || cat === 'pooja') {
          return tags.includes('ritual') || tags.includes('pooja') || tags.includes('havan') || type === 'rituals' || type === 'ghee';
        }
        
        return type === cat || tags.includes(cat);
      });
    }
    return result;
  }, [searchQuery, activeCategory]);

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.qty, 0);

  const navigateTo = (type: 'home' | 'product' | 'info' | 'checkout' | 'order-success', id?: string, sectionId?: string) => {
    setView({ type, id });
    setIsMobileNavOpen(false);
    
    if (sectionId) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  };

  const currentProduct = view.type === 'product' ? PRODUCTS.find(p => p.handle === view.id) : null;
  const currentInfoPage = view.type === 'info' ? INFO_PAGES[view.id as keyof typeof INFO_PAGES] : null;

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar />
      
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 bg-[image:var(--image-paper)]">
        <div className="max-w-[1400px] mx-auto px-4 h-16 sm:h-20 flex items-center justify-between relative">
          <div className="flex items-center gap-1 sm:gap-4">
            <button onClick={() => setIsMobileNavOpen(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors">
              <Menu size={20} className="text-charcoal" />
            </button>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <Search size={20} className="text-charcoal" />
            </button>
          </div>
          
          <div className="absolute left-1/2 -translate-x-1/2 cursor-pointer" onClick={() => { navigateTo('home'); setActiveCategory('all'); setSearchQuery(''); }}>
            <div className="flex flex-col items-center">
              <h1 className="font-serif text-xl sm:text-3xl tracking-[4px] text-charcoal font-normal uppercase">DIVYA</h1>
              <p className="text-[7px] tracking-[3px] text-center text-charcoal/60 -mt-1">AYURVEDA</p>
              <div className="w-4 h-1 bg-red-800 mt-1 opacity-20 rounded-full blur-[1px]"></div>
            </div>
          </div>

          <div className="flex items-center gap-1 sm:gap-4">
            <button onClick={() => setIsAuthOpen(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors hidden sm:block">
              <User size={20} className="text-charcoal" />
            </button>
            <button onClick={() => setIsWishlistOpen(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors relative hidden sm:block">
              <Heart size={20} className="text-charcoal" />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-800 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>
            <button onClick={() => setIsCartOpen(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors relative">
              <ShoppingBag size={20} className="text-charcoal" />
              {cart.length > 0 && (
                <span className="absolute top-1 right-1 bg-red-800 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center">
                  {cart.reduce((s, i) => s + i.qty, 0)}
                </span>
              )}
            </button>
            <button onClick={() => setIsAuthOpen(true)} className="p-2 hover:bg-gray-50 rounded-full transition-colors sm:hidden">
              <User size={20} className="text-charcoal" />
            </button>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 px-4 py-3 overflow-hidden"
              >
                <div className="relative flex items-center">
                  <input 
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-50 border-none px-4 py-2 text-sm focus:ring-1 focus:ring-charcoal/10 rounded-none font-sans"
                    autoFocus
                  />
                  <button 
                    onClick={() => setIsSearchOpen(false)}
                    className="absolute right-2 text-charcoal/40"
                  >
                    <X size={16} />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Sub-navigation */}
        <div className="border-t border-charcoal bg-white/80 backdrop-blur-sm overflow-x-auto no-scrollbar bg-[image:var(--image-paper)]">
          <nav className="flex items-center justify-start sm:justify-center gap-6 px-4 py-3 text-[13px] tracking-[1px] uppercase font-serif font-bold text-charcoal whitespace-nowrap flex-nowrap">
            {['Immunity', 'Respiratory', 'BP Care', 'Brain Health', 'Digestion', 'Rituals', 'All Products'].map((item, idx, arr) => (
              <React.Fragment key={item}>
                <div className="relative group/nav">
                  {item === 'Brain Health' && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-red-800 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-bold tracking-[1px] animate-pulse">NEW</span>
                  )}
                  <button 
                    className="hover:text-red-800 transition-colors uppercase"
                    onClick={() => {
                      if (item === 'All Products') setActiveCategory('all');
                      else setActiveCategory(item);
                      navigateTo('home', undefined, 'shop');
                    }}
                  >
                    {item}
                  </button>
                </div>
                {idx < arr.length - 1 && (
                  <div className="w-1 h-1 bg-red-800 rotate-45 flex-shrink-0" />
                )}
              </React.Fragment>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow">
        {view.type === 'home' && (
          <>
            {/* Hero Section */}
            <section className="relative bg-[#f5f2ed] overflow-hidden">
              {/* Ghost image to maintain aspect ratio without cropping */}
              <picture className="invisible pointer-events-none">
                <source media="(max-width: 640px)" srcSet={heroBanners[0].mobile} />
                <img 
                  src={heroBanners[0].desktop} 
                  alt="Sizing Ghost" 
                  className="w-full h-auto"
                />
              </picture>

              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.div
                  key={currentHeroSlide}
                  custom={slideDirection}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8 }}
                  className="absolute inset-0"
                >
                  <picture>
                    <source media="(max-width: 640px)" srcSet={heroBanners[currentHeroSlide].mobile} />
                    <img 
                      src={heroBanners[currentHeroSlide].desktop} 
                      alt={`Slide ${currentHeroSlide + 1}`} 
                      className="w-full h-full object-cover sm:object-cover"
                    />
                  </picture>
                  
                  {/* Content Overlay - Only show Shop Now button at bottom left */}
                  <div className="absolute inset-0">
                    <div className="max-w-[1400px] mx-auto h-full flex items-end justify-start p-6 sm:p-16">
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                      >
                        <button 
                          className="bg-white border border-charcoal/10 px-10 py-3 sm:px-12 sm:py-4 text-[10px] tracking-[3px] uppercase font-bold text-charcoal hover:bg-charcoal hover:text-white transition-all shadow-sm"
                          onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                          SHOP NOW
                        </button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Slider Controls */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-10">
                {heroBanners.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setSlideDirection(i > currentHeroSlide ? 1 : -1);
                      setCurrentHeroSlide(i);
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${i === currentHeroSlide ? 'bg-charcoal w-6' : 'bg-charcoal/20'}`}
                  />
                ))}
              </div>
              
              <button 
                onClick={prevHeroSlide}
                className="absolute left-4 sm:left-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:bg-white/50 transition-all z-10"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={nextHeroSlide}
                className="absolute right-4 sm:right-10 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full border border-charcoal/10 flex items-center justify-center text-charcoal/40 hover:text-charcoal hover:bg-white/50 transition-all z-10"
              >
                <ChevronRight size={20} />
              </button>
            </section>

            {/* Benefits Strip */}
            <div className="bg-white py-6 px-6 sm:px-10 border-b border-gray-100">
              <div className="max-w-[1400px] mx-auto flex flex-nowrap overflow-x-auto no-scrollbar justify-start sm:justify-around gap-8 sm:gap-4 text-[10px] text-charcoal font-black tracking-[2px] uppercase whitespace-nowrap">
                {[
                  { icon: CheckCircle2, text: "Authentic Ayurveda" },
                  { icon: ShieldCheck, text: "100% Secure Payment" },
                  { icon: RefreshCw, text: "Easy Returns" },
                  { icon: Truck, text: "Free Shipping" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 flex-shrink-0">
                    <item.icon size={14} className="text-charcoal" />
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Categories */}
            <section className="py-12 px-4 bg-white relative group">
              <div className="max-w-[1400px] mx-auto relative">
                <div 
                  id="category-scroll"
                  className="flex justify-start sm:justify-center gap-6 sm:gap-12 overflow-x-auto no-scrollbar flex-nowrap scroll-smooth px-4"
                >
                  {[
                    { name: 'Immunity', image: 'https://krishnaayurved.com/cdn/shop/collections/Category_banner-05.jpg?v=1754030368&width=450' },
                    { name: 'Respiratory', image: 'https://static.wixstatic.com/media/7fa905_e3cd3b37178a40f28c6a44d08bfaf77b~mv2.jpg' },
                    { name: 'BP Care', image: 'https://krishnaayurved.com/cdn/shop/collections/Category_banner-01.jpg?v=1754030903&width=450' },
                    { name: 'Brain Health', image: 'https://static.wixstatic.com/media/7fa905_7cb8ed2806a74428bbd4f10200968bee~mv2.jpg' },
                    { name: 'Digestion', image: 'https://nutraceuticalbusinessreview.com/article-image-alias/bone-and-joint-health-ingredients-for.jpg' },
                    { name: 'Rituals', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQmspG1BtS1AqnxyXg042a615ud3DT3NSLDg' }
                  ].map((cat, i) => (
                    <div 
                      key={i} 
                      className="flex-shrink-0 text-center group/item cursor-pointer"
                      onClick={() => {
                        setActiveCategory(cat.name);
                        const element = document.getElementById('shop');
                        if (element) {
                          element.scrollIntoView({ behavior: 'smooth' });
                        }
                      }}
                    >
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full overflow-hidden mb-3 border border-gray-100 group-hover/item:border-charcoal transition-all duration-300">
                        <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-[8px] tracking-[2px] uppercase font-black text-charcoal group-hover/item:text-charcoal transition-colors">{cat.name}</p>
                    </div>
                  ))}
                </div>

                {/* Scroll Arrows */}
                <button 
                  onClick={() => document.getElementById('category-scroll')?.scrollBy({ left: -200, behavior: 'smooth' })}
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-charcoal/40 hover:text-charcoal sm:hidden"
                >
                  <ChevronLeft size={16} />
                </button>
                <button 
                  onClick={() => document.getElementById('category-scroll')?.scrollBy({ left: 200, behavior: 'smooth' })}
                  className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-charcoal/40 hover:text-charcoal sm:hidden"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </section>

            {/* Iconic Bestsellers */}
            <section id="shop" className="py-20 px-4 sm:px-10 bg-white bg-[image:var(--image-paper)]">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex flex-col items-center mb-12">
                  <h2 className="font-serif text-2xl sm:text-3xl text-charcoal font-normal mb-6">
                    {activeCategory === 'all' ? 'Our Bestsellers' : `${activeCategory} Care`}
                  </h2>
                  <button 
                    className="border border-charcoal/20 px-10 py-2 text-[10px] tracking-[2px] uppercase font-bold text-charcoal hover:bg-charcoal hover:text-white transition-all"
                    onClick={() => setActiveCategory('all')}
                  >
                    View All
                  </button>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-12">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => (
                      <div 
                        key={product.handle} 
                        className="group cursor-pointer flex flex-col" 
                      >
                        <div className="aspect-[4/5] bg-white mb-4 relative overflow-hidden shadow-sm border border-gray-50" onClick={() => navigateTo('product', product.handle)}>
                          <img 
                            src={product.image} 
                            alt={product.title} 
                            className="w-full h-full object-contain p-4 sm:p-8 group-hover:scale-105 transition-transform duration-700" 
                            referrerPolicy="no-referrer"
                          />
                          <button 
                            className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-charcoal/40 hover:text-red-800 transition-colors shadow-sm"
                            onClick={(e) => { e.stopPropagation(); toggleWishlist(product.handle); }}
                          >
                            <Heart size={16} fill={wishlist.includes(product.handle) ? "currentColor" : "none"} className={wishlist.includes(product.handle) ? "text-red-800" : ""} />
                          </button>
                          {/* Badges */}
                          <div className="absolute top-3 left-3 flex flex-col gap-2">
                            <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gold/10 flex items-center justify-center border border-gold/20">
                              <Star size={10} className="text-gold" fill="currentColor" />
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col flex-grow">
                          <div className="flex justify-between items-start mb-1">
                            <span className="text-[8px] tracking-[2px] uppercase font-bold text-charcoal/40">{product.type}</span>
                            <div className="flex items-center gap-1">
                              <span className="text-[8px] font-bold text-charcoal">4.9</span>
                              <Star size={8} className="text-charcoal" fill="currentColor" />
                              <span className="text-[8px] text-charcoal/40">(40)</span>
                            </div>
                          </div>
                          <h3 className="font-serif text-xs sm:text-sm text-charcoal mb-2 leading-tight min-h-[2rem] line-clamp-2" onClick={() => navigateTo('product', product.handle)}>{product.title}</h3>
                          <p className="font-bold text-charcoal text-sm mb-4">₹{product.price}.00</p>
                          <button 
                            className="mt-auto border border-charcoal/20 py-2 text-[9px] tracking-[2px] uppercase font-bold text-charcoal hover:bg-charcoal hover:text-white transition-all"
                            onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          >
                            Add to Bag
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full py-20 text-center">
                      <p className="font-serif text-xl text-gray-400">No products found for this concern.</p>
                    </div>
                  )}
                </div>
              </div>
            </section>

            {/* Our Story */}
            <section className="py-20 bg-[#f9f9f9] bg-[image:var(--image-paper)]">
              <div className="max-w-[1400px] mx-auto px-4 flex flex-col sm:flex-row items-center gap-12">
                <div className="w-full sm:w-1/2 text-center sm:text-left">
                  <span className="text-[10px] tracking-[4px] uppercase text-charcoal/60 mb-4 block font-bold">OUR JOURNEY</span>
                  <h2 className="font-serif text-4xl text-charcoal mb-6 leading-tight">Authentic Ayurveda, <br /> Rooted in Wisdom</h2>
                  <p className="text-sm text-charcoal/60 mb-8 leading-relaxed">
                    Divya Ayurveda was sought to bring authentic health and wellness to the world, promoting the message of Ayurveda. We believe in the power of nature to heal and rejuvenate, bringing you the purest formulations inspired by ancient wisdom.
                  </p>
                  <div className="grid grid-cols-2 gap-8 mb-10">
                    <div>
                      <h4 className="font-serif text-3xl text-charcoal mb-1">100%</h4>
                      <p className="text-[8px] tracking-[2px] uppercase text-charcoal/60 font-bold">NATURAL<br/>INGREDIENTS</p>
                    </div>
                    <div>
                      <h4 className="font-serif text-3xl text-charcoal mb-1">20+</h4>
                      <p className="text-[8px] tracking-[2px] uppercase text-charcoal/60 font-bold">YEARS OF<br/>HERITAGE</p>
                    </div>
                  </div>
                  <button 
                    className="border border-charcoal/20 px-12 py-4 text-[10px] tracking-[3px] uppercase font-bold text-charcoal hover:bg-charcoal hover:text-white transition-all"
                    onClick={() => navigateTo('info', 'our-story')}
                  >
                    DISCOVER OUR STORY
                  </button>
                </div>
                <div className="w-full sm:w-1/2 aspect-square overflow-hidden relative">
                  <img src="https://static.wixstatic.com/media/7fa905_56d41c05b8294b2d93bb0f16c833ee8d~mv2.png" className="w-full h-full object-cover" />
                  <div className="absolute top-10 right-10 w-24 h-24 border border-white/20 rounded-full flex items-center justify-center">
                    <span className="font-serif text-4xl text-white/20 italic">D</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Rituals Section */}
            <section className="py-20 bg-[#f5f2ed] px-4 sm:px-10">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <h2 className="font-serif text-3xl text-charcoal font-normal">Daily Rituals</h2>
                  <button className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/60 border-b border-charcoal/20 pb-1 hover:text-charcoal transition-all">Explore Rituals</button>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                  {PRODUCTS.filter(p => p.vendor === 'Aastha' || p.tags.includes('ritual') || p.tags.includes('pooja')).map((product) => (
                    <div 
                      key={product.handle} 
                      className="group cursor-pointer" 
                      onClick={() => navigateTo('product', product.handle)}
                    >
                      <div className="aspect-[4/5] bg-white mb-6 relative overflow-hidden shadow-sm">
                        <img 
                          src={product.image} 
                          alt={product.title} 
                          className="w-full h-full object-contain p-8 group-hover:scale-105 transition-transform duration-700" 
                        />
                      </div>
                      <div className="text-center sm:text-left">
                        <span className="text-[8px] tracking-[2px] uppercase font-bold text-charcoal/40 mb-1 block">{product.vendor}</span>
                        <h3 className="font-serif text-sm text-charcoal mb-2 leading-tight min-h-[2.5rem] flex items-center">{product.title}</h3>
                        <p className="font-bold text-charcoal">₹{product.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Trusted Tales */}
            <section className="py-20 px-4 sm:px-10 bg-white overflow-hidden">
              <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                  <span className="text-[10px] tracking-[4px] uppercase text-charcoal/60 mb-4 block font-bold">COMMUNITY</span>
                  <h2 className="font-serif text-3xl text-charcoal font-normal">Trusted Tales</h2>
                </div>
                
                <div 
                  ref={talesScrollRef}
                  className="flex gap-8 overflow-x-auto pb-8 no-scrollbar scroll-smooth"
                >
                  {TRUSTED_TALES.map((tale) => (
                    <div key={tale.id} className="min-w-[280px] sm:min-w-[320px] group cursor-pointer">
                      <div className="relative aspect-[9/16] overflow-hidden mb-6">
                        <img src={tale.videoUrl} alt={tale.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 rounded-full border border-white/40 flex items-center justify-center backdrop-blur-sm">
                            <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-4 items-start">
                        <img src={tale.productIcon} className="w-12 h-12 object-cover border border-gray-100" />
                        <div>
                          <h4 className="text-[10px] font-bold text-charcoal uppercase tracking-widest mb-1">{tale.title}</h4>
                          <p className="text-[11px] text-charcoal/60 mb-2 line-clamp-2 leading-relaxed">{tale.desc}</p>
                          <p className="text-xs font-bold text-charcoal">{tale.price}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Video Background Section */}
            <section className="relative h-[400px] sm:h-[500px] flex items-center justify-center overflow-hidden">
              <video 
                autoPlay 
                loop 
                muted 
                playsInline 
                className="absolute inset-0 w-full h-full object-cover"
              >
                <source src="https://video.wixstatic.com/video/7fa905_bba61bd3dcb344ba83743232824c277c/1080p/mp4/file.mp4" type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-black/30"></div>
              <div className="relative z-10 text-center px-6 max-w-4xl">
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-white tracking-[4px] uppercase text-[10px] sm:text-xs font-bold mb-4 block"
                >
                  Nourished by Nature
                </motion.span>
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                  className="font-serif text-3xl sm:text-5xl text-white mb-6"
                >
                  Inspired by Ayurveda
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className="text-white/90 text-sm sm:text-lg mb-10 max-w-2xl mx-auto leading-relaxed"
                >
                  We combine the wisdom of Ayurveda with pure, natural ingredients to craft health & beauty products that nurture you—inside & out.
                </motion.p>
                <motion.button 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 }}
                  onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-charcoal px-8 py-4 rounded-full text-[10px] sm:text-xs tracking-[2px] uppercase font-bold hover:bg-gold hover:text-white transition-all shadow-xl"
                >
                  Discover Our Bestsellers
                </motion.button>
              </div>
            </section>

            {/* About Divya Pharmacy Section */}
            <section className="py-24 px-4 sm:px-10 bg-white overflow-hidden">
              <div className="max-w-[1400px] mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                  <motion.div 
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="relative"
                  >
                    <div className="aspect-[4/5] overflow-hidden">
                      <img 
                        src="https://static.wixstatic.com/media/7fa905_e40eaf3ffd7a4730816e2c7e30ea2ea0~mv2.jpg" 
                        alt="Divya Pharmacy Heritage" 
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-[#f5f2ed] -z-10 hidden lg:block"></div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                  >
                    <span className="text-[10px] tracking-[4px] uppercase font-bold text-charcoal/40 mb-6 block">OUR HERITAGE</span>
                    <h2 className="font-serif text-4xl sm:text-5xl text-charcoal mb-8 leading-tight">About Divya Pharmacy</h2>
                    <div className="space-y-6 text-charcoal/70 leading-relaxed">
                      <p>
                        Divya Pharmacy is one of the largest Ayurvedic pharmacies in India, dedicated to the mission of making the world disease-free through the ancient wisdom of Ayurveda.
                      </p>
                      <p>
                        Founded with the vision of bringing the benefits of traditional herbal medicine to the modern world, we combine age-old recipes with state-of-the-art manufacturing processes. Every product is a testament to our commitment to purity, efficacy, and authenticity.
                      </p>
                      <p>
                        Our herbs are sourced from the pristine valleys of the Himalayas and processed with utmost care to ensure that their natural healing properties are preserved.
                      </p>
                    </div>
                    <div className="mt-12 grid grid-cols-2 gap-8">
                      <div>
                        <h4 className="font-serif text-3xl text-charcoal mb-2">100%</h4>
                        <p className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/40">Natural Ingredients</p>
                      </div>
                      <div>
                        <h4 className="font-serif text-3xl text-charcoal mb-2">Traditional</h4>
                        <p className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/40">Processing Methods</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </section>

            {/* Journal Section */}
            <section className="py-20 px-4 sm:px-10 bg-white">
              <div className="max-w-[1400px] mx-auto">
                <div className="flex justify-between items-end mb-12">
                  <h2 className="font-serif text-3xl text-charcoal font-normal">Ayurvedic Journal</h2>
                  <button className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/60 border-b border-charcoal/20 pb-1 hover:text-charcoal transition-all">View All Articles</button>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                  {[
                    { title: "Understanding Your Dosha", category: "Ayurveda 101", image: "https://static.wixstatic.com/media/7fa905_e40eaf3ffd7a4730816e2c7e30ea2ea0~mv2.jpg" },
                    { title: "The Power of Ashwagandha", category: "Herb Spotlight", image: "https://static.wixstatic.com/media/7fa905_ed2e76c525384cc88086930d77581bdb~mv2.jpg" },
                    { title: "Morning Ritual with Copper", category: "Wellness", image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRQmspG1BtS1AqnxyXg042a615ud3DT3NSLDg" }
                  ].map((post, i) => (
                    <div key={i} className="group cursor-pointer">
                      <div className="aspect-[16/10] overflow-hidden mb-6">
                        <img src={post.image} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <span className="text-[8px] tracking-[2px] uppercase font-bold text-charcoal/40 mb-2 block">{post.category}</span>
                      <h3 className="font-serif text-xl text-charcoal mb-3 leading-tight group-hover:text-charcoal/60 transition-colors">{post.title}</h3>
                      <p className="text-xs text-charcoal/60 leading-relaxed mb-4">Discover the ancient secrets to a balanced life and holistic well-being...</p>
                      <button className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal flex items-center gap-2">
                        READ MORE <ArrowRight size={12} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-[#f5f2ed] px-4 sm:px-10">
              <div className="max-w-[1400px] mx-auto">
                <div className="text-center mb-16">
                  <span className="text-[10px] tracking-[4px] uppercase text-charcoal/60 mb-4 block font-bold">REVIEWS</span>
                  <h2 className="font-serif text-3xl text-charcoal font-normal">Trusted by Thousands</h2>
                </div>
                <div className="grid md:grid-cols-3 gap-12">
                  {[
                    { name: "Ramesh Gupta", city: "Lucknow", text: "My HbA1c came down from 9.2 to 6.8 in three months with consistent use. This is genuinely remarkable." },
                    { name: "Sunita Sharma", city: "Delhi", text: "My blood pressure has been under control for over six months. Mukta Vati has completely changed my perspective." },
                    { name: "Vikram Patel", city: "Ahmedabad", text: "The Ashwagandha Churna is pure quality. My gym recovery is faster and my sleep has improved tremendously." }
                  ].map((t, i) => (
                    <div key={i} className="text-center">
                      <div className="flex justify-center gap-1 mb-6">
                        {[...Array(5)].map((_, i) => <Star key={i} size={12} className="fill-gold text-gold" />)}
                      </div>
                      <p className="font-serif italic text-charcoal/80 leading-relaxed mb-6">"{t.text}"</p>
                      <div className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal">{t.name}, {t.city}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Newsletter */}
            <section className="py-20 bg-white px-4 text-center border-t border-gray-100">
              <div className="max-w-2xl mx-auto">
                <span className="text-[10px] tracking-[4px] uppercase text-charcoal/60 mb-4 block font-bold">NEWSLETTER</span>
                <h2 className="font-serif text-3xl text-charcoal mb-6">Ayurvedic Wisdom, Delivered</h2>
                <p className="text-sm text-charcoal/60 mb-10">Subscribe for seasonal health tips and exclusive offers.</p>
                <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="flex-1 px-6 py-4 bg-[#f9f9f9] border border-gray-100 text-charcoal placeholder:text-charcoal/40 outline-none focus:border-charcoal transition-all"
                  />
                  <button className="bg-charcoal text-white px-10 py-4 text-[10px] tracking-[2px] uppercase font-bold hover:bg-charcoal/90 transition-all">
                    Subscribe
                  </button>
                </div>
              </div>
            </section>
          </>
        )}

        {view.type === 'product' && currentProduct && (
          <div className="bg-white min-h-screen font-serif">
            {/* Breadcrumbs */}
            <div className="bg-white border-b border-gray-100">
              <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-4 flex items-center gap-2 text-[10px] uppercase tracking-[2px] text-gray-400 font-sans">
                <button onClick={() => navigateTo('home')} className="hover:text-charcoal transition-colors">Home</button>
                <ChevronRight size={10} />
                <span className="text-charcoal font-bold">{currentProduct.title}</span>
              </div>
            </div>
            
            <div className="max-w-[1400px] mx-auto px-4 sm:px-10 py-12">
              <div className="grid lg:grid-cols-12 gap-12">
                {/* Left: Image Gallery */}
                <div className="lg:col-span-7">
                  <div className="flex flex-col-reverse sm:flex-row gap-4">
                    {/* Thumbnails */}
                    <div className="flex sm:flex-col gap-3 overflow-x-auto sm:overflow-y-auto no-scrollbar sm:max-h-[600px]">
                      {currentProduct.images.map((img, i) => (
                        <div 
                          key={i} 
                          className={`w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 border cursor-pointer p-1 transition-all ${i === 0 ? 'border-charcoal' : 'border-gray-100 hover:border-charcoal/30'}`}
                        >
                          <img src={img} alt="" className="w-full h-full object-contain" />
                        </div>
                      ))}
                    </div>

                    {/* Main Image */}
                    <div className="flex-1 relative bg-[#f9f9f9] aspect-[4/5] overflow-hidden group">
                      <img 
                        src={currentProduct.image} 
                        alt={currentProduct.title} 
                        className="w-full h-full object-contain p-8 sm:p-16"
                      />
                      
                      {/* Badges */}
                      <div className="absolute top-6 left-6 w-16 sm:w-20">
                        <img src="https://static.kamaayurveda.in/cdn-cgi/image/width=200,format=auto/pub/media/characterstic/image/default/Vogue-Badge.png" alt="Vogue Badge" className="w-full h-auto" />
                      </div>

                      {/* Zoom Icon */}
                      <button className="absolute bottom-6 right-6 p-2 bg-white/80 rounded-full text-charcoal shadow-sm">
                        <Search size={18} />
                      </button>

                      {/* Wishlist & Share */}
                      <div className="absolute top-6 right-6 flex flex-col gap-3">
                        <button 
                          className="p-2 bg-white/80 rounded-full text-charcoal shadow-sm hover:text-red-500 transition-colors"
                          onClick={() => toggleWishlist(currentProduct.handle)}
                        >
                          <Heart size={20} fill={wishlist.includes(currentProduct.handle) ? "currentColor" : "none"} />
                        </button>
                        <button className="p-2 bg-white/80 rounded-full text-charcoal shadow-sm">
                          <Send size={18} />
                        </button>
                      </div>

                      {/* Pagination Dots */}
                      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                        {[...Array(6)].map((_, i) => (
                          <div key={i} className={`w-1.5 h-1.5 rounded-full ${i === 0 ? 'bg-red-800' : 'bg-red-800/20'}`} />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-charcoal/40 mt-4 text-center italic font-sans">Disclaimer: The image is for representation purposes only. Actual packaging and appearance may vary.</p>
                </div>

                {/* Right: Product Details */}
                <div className="lg:col-span-5 font-sans">
                  <h1 className="font-serif text-3xl sm:text-4xl text-charcoal mb-4 leading-tight">{currentProduct.title}</h1>
                  
                  <div className="flex items-center gap-4 mb-6">
                    <div className="flex items-center gap-1 bg-green-700 text-white px-2 py-0.5 rounded text-[10px] font-bold">
                      4.5 <Star size={10} fill="currentColor" />
                    </div>
                    <button className="text-[10px] text-charcoal/60 underline font-bold">10 Reviews</button>
                    <button className="text-[10px] text-charcoal/60 underline font-bold">Write a Review</button>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-[10px] text-charcoal/40 font-bold">Share</span>
                      <div className="flex gap-2">
                        <Facebook size={14} className="text-charcoal/40" />
                        <Twitter size={14} className="text-charcoal/40" />
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] text-red-800 font-bold mb-4">Country of Origin: India</p>
                  
                  <p className="text-xs text-charcoal/70 leading-relaxed mb-8">
                    A lightweight aromatic cleansing foam for deep purification. It dries out active acne, unclogs and tightens skin pores, and reduces the frequency of breakouts.
                  </p>

                  <div className="mb-8">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="text-[10px] text-charcoal/60 font-bold">MRP</span>
                      <span className="text-2xl font-bold text-charcoal">₹{currentProduct.price}.00</span>
                    </div>
                    <p className="text-[10px] text-charcoal/40 italic">(incl. of all taxes)</p>
                  </div>

                  <div className="mb-10">
                    <p className="text-[11px] text-charcoal/60 font-bold mb-6 uppercase tracking-[2px]">Available in: (Net Quantity)</p>
                    <div className="flex gap-4">
                      {['50 ml', '100 ml'].map(size => (
                        <button 
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className="relative w-20 h-20 group outline-none"
                        >
                          {selectedSize === size && (
                            <motion.div 
                              layoutId="active-size-bg"
                              className="absolute inset-0 bg-charcoal shadow-xl"
                              transition={{ type: 'spring', bounce: 0.15, duration: 0.6 }}
                            />
                          )}
                          <div className={`relative z-10 w-full h-full border flex flex-col items-center justify-center transition-all duration-500 ${
                            selectedSize === size 
                              ? 'text-white border-transparent' 
                              : 'text-charcoal border-gray-100 group-hover:border-charcoal/20 bg-white'
                          }`}>
                            <span className="text-xl font-serif leading-none">{size.split(' ')[0]}</span>
                            <span className={`text-[9px] uppercase tracking-[2px] font-bold mt-1.5 transition-opacity duration-500 ${selectedSize === size ? 'opacity-60' : 'opacity-30'}`}>
                              {size.split(' ')[1]}
                            </span>
                          </div>
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="absolute inset-0 pointer-events-none"
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 mb-8">
                    <div className="flex items-center gap-4">
                      <span className="text-[11px] text-charcoal/60 font-bold">Quantity</span>
                      <div className="flex items-center border border-gray-200 rounded">
                        <button className="px-3 py-1 text-charcoal/40 hover:text-charcoal"><Minus size={14} /></button>
                        <span className="w-8 text-center text-xs font-bold">1</span>
                        <button className="px-3 py-1 text-charcoal/40 hover:text-charcoal"><Plus size={14} /></button>
                      </div>
                    </div>
                  </div>

                  <div className="mb-8">
                    <p className="text-[11px] text-charcoal/80">Or <span className="font-bold">3</span> Monthly Payments of <span className="font-bold">₹442</span> <span className="text-charcoal/40">ⓘ</span></p>
                    <p className="text-[11px] text-charcoal/80 font-bold">0% EMI on <span className="text-blue-600">UPI</span> • <span className="text-green-600">snapmint</span></p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-12">
                    <button className="border border-charcoal text-charcoal py-4 text-[11px] font-bold uppercase tracking-[2px] hover:bg-charcoal hover:text-white transition-all">
                      BUY NOW
                    </button>
                    <button 
                      className="bg-[#333a3f] text-white py-4 text-[11px] font-bold uppercase tracking-[2px] flex items-center justify-center gap-2 hover:bg-[#2a3035] transition-all"
                      onClick={() => addToCart(currentProduct)}
                    >
                      <ShoppingBag size={16} />
                      ADD TO BAG
                    </button>
                  </div>
                </div>
              </div>

              {/* Brand Icons Section */}
              <div className="mt-20 py-16 border-t border-gray-100">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                  {[
                    { title: "Original Ayurvedic recipes", icon: "https://static.kamaayurveda.in/cdn-cgi/image/width=1920,format=auto/pub/media/characterstic/image/default/Brand-Icons_D.png", pos: "0% 0%" },
                    { title: "Clean formulas with natural origin ingredients", icon: "https://static.kamaayurveda.in/cdn-cgi/image/width=1920,format=auto/pub/media/characterstic/image/default/Brand-Icons_D.png", pos: "33.33% 0%" },
                    { title: "Dermatologically tested on all skin types", icon: "https://static.kamaayurveda.in/cdn-cgi/image/width=1920,format=auto/pub/media/characterstic/image/default/Brand-Icons_D.png", pos: "66.66% 0%" },
                    { title: "100% recycled outer boxes & recyclable labels", icon: "https://static.kamaayurveda.in/cdn-cgi/image/width=1920,format=auto/pub/media/characterstic/image/default/Brand-Icons_D.png", pos: "100% 0%" }
                  ].map((item, i) => (
                    <div key={i} className="flex flex-col items-center text-center">
                      <div className="w-24 h-24 mb-6 overflow-hidden">
                        <div 
                          className="w-[400%] h-full bg-no-repeat bg-contain" 
                          style={{ 
                            backgroundImage: `url(${item.icon})`,
                            backgroundPosition: item.pos
                          }}
                        />
                      </div>
                      <p className="font-serif text-sm text-charcoal/80 max-w-[180px] leading-snug">{item.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Offers & Pincode/Rewards Section */}
              <div className="grid lg:grid-cols-12 gap-12 mt-12">
                {/* Offers */}
                <div className="lg:col-span-7">
                  <div className="border border-charcoal p-8 h-full">
                    <h3 className="font-serif text-3xl text-charcoal mb-8">Offers</h3>
                    <div className="space-y-6">
                      {[
                        "Exclusive Offer: Complimentary Gifts Worth Rs 6240 On Shopping Above Rs 8000*",
                        "10% off on first order above Rs. 1500. Use Code - KAMA10",
                        "Avail Complimentary NEW Premium Sample on every order!",
                        "Flat Rs 200 cashback on first Mobikwik UPI transaction*",
                        "Get up to Rs.750 cashback on paying via Mobikwik wallet",
                        "Enjoy 10X Membership Rewards® points on purchases with American Express*"
                      ].map((offer, i) => (
                        <div key={i} className="flex items-start gap-4">
                          <div className="mt-1 text-red-800"><ShoppingBag size={14} /></div>
                          <p className="text-xs text-charcoal/80 font-sans leading-relaxed">{offer}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Pincode & Rewards */}
                <div className="lg:col-span-5 space-y-8">
                  {/* Pincode */}
                  <div className="border border-charcoal p-8">
                    <h3 className="font-serif text-xl text-charcoal mb-6">Check Pincode Availability</h3>
                    <div className="border-b border-charcoal pb-2 flex items-center justify-between mb-4">
                      <input 
                        type="text" 
                        placeholder="Check Estimated Delivery" 
                        className="bg-transparent outline-none text-xs w-full font-sans"
                      />
                      <button className="text-[10px] font-bold uppercase tracking-[1px]">Check</button>
                    </div>
                    <p className="text-[10px] text-charcoal/60 font-sans">Guaranteed Shipping Within 24 hours</p>
                  </div>

                  {/* Rewards */}
                  <div className="border border-charcoal p-8">
                    <h3 className="font-serif text-xl text-charcoal mb-6">Rewards</h3>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 flex-shrink-0">
                        <img src="https://static.kamaayurveda.in/cdn-cgi/image/width=100,format=auto/pub/media/characterstic/image/default/Loyalty-Icon.png" alt="Loyalty" className="w-full h-auto" />
                      </div>
                      <div>
                        <p className="text-xs text-charcoal/80 font-sans leading-relaxed mb-4">
                          Kama Ayurveda Loyalty Members can earn up to 79 points on purchase of this product.
                        </p>
                        <button className="text-[10px] font-bold uppercase tracking-[1px] underline">Know More</button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Ingredients Section */}
              <div className="mt-32 pt-32 border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center mb-20">
                  <span className="text-[10px] text-charcoal/40 uppercase tracking-[4px] mb-4 block font-bold font-sans">INGREDIENTS</span>
                  <h2 className="font-serif text-4xl text-charcoal mb-6">What's inside that really matters</h2>
                  <p className="text-sm text-charcoal/60 leading-relaxed font-sans">We believe in the power of nature. Our ingredients are sourced ethically and processed traditionally to retain their healing properties.</p>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-12">
                  {INGREDIENTS.map((ing, i) => (
                    <div key={i} className="text-center group">
                      <div className="aspect-square overflow-hidden mb-8 bg-[#f9f9f9] p-4">
                        <img src={ing.image} alt={ing.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <h4 className="font-serif text-xl text-charcoal mb-3">{ing.name}</h4>
                      <p className="text-[10px] text-charcoal/60 leading-relaxed uppercase tracking-[1px] font-bold font-sans">{ing.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reviews Section */}
              <div className="mt-24 pt-24 border-t border-gray-100 font-sans">
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                  <div>
                    <h2 className="font-serif text-4xl text-charcoal mb-4">Customer Reviews</h2>
                    <div className="flex items-center gap-4">
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => <Star key={i} size={20} className="fill-gold text-gold" />)}
                      </div>
                      <span className="text-lg font-bold text-charcoal">4.8 out of 5</span>
                      <span className="text-sm text-gray-400">Based on 1,240 reviews</span>
                    </div>
                  </div>
                  <button className="bg-charcoal text-white px-10 py-4 text-[11px] font-bold uppercase tracking-[2px] hover:bg-charcoal/90 transition-all">Write a Review</button>
                </div>

                <div className="space-y-10">
                  {MOCK_REVIEWS.map((review) => (
                    <div key={review.id} className="pb-10 border-b border-gray-100 last:border-0">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <div className="flex gap-0.5 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={14} className={i < review.rating ? "fill-gold text-gold" : "text-gray-200"} />
                            ))}
                          </div>
                          <h4 className="font-bold text-charcoal text-sm mb-1">{review.title}</h4>
                          <div className="text-[11px] text-gray-400">
                            <span className="font-bold text-gray-600">{review.name}</span> on <span>{review.date}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] text-charcoal/60 font-bold uppercase tracking-widest">
                          <CheckCircle2 size={14} /> Verified Purchase
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {view.type === 'checkout' && (
          <div className="bg-[#f9f9f9] min-h-screen py-16 px-4 sm:px-10">
            <div className="max-w-6xl mx-auto">
              <div className="flex items-center gap-6 mb-12">
                <button 
                  onClick={() => navigateTo('home')}
                  className="p-2 hover:bg-white transition-colors text-charcoal/40"
                >
                  <ChevronLeft size={24} />
                </button>
                <h1 className="font-serif text-3xl text-charcoal">Secure Checkout</h1>
              </div>

              <div className="grid lg:grid-cols-12 gap-12">
                <div className="lg:col-span-7 space-y-12">
                  {/* Shipping Info */}
                  <div className="bg-white p-10 border border-gray-100">
                    <h2 className="font-serif text-xl text-charcoal mb-8">Shipping Address</h2>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="col-span-2">
                        <label className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/40 mb-2 block">Full Name</label>
                        <input type="text" className="w-full px-6 py-4 text-[10px] tracking-[2px] border border-gray-100 outline-none focus:border-charcoal bg-white" placeholder="ENTER YOUR FULL NAME" />
                      </div>
                      <div className="col-span-2">
                        <label className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/40 mb-2 block">Street Address</label>
                        <input type="text" className="w-full px-6 py-4 text-[10px] tracking-[2px] border border-gray-100 outline-none focus:border-charcoal bg-white" placeholder="HOUSE NO, STREET, AREA" />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/40 mb-2 block">City</label>
                        <input type="text" className="w-full px-6 py-4 text-[10px] tracking-[2px] border border-gray-100 outline-none focus:border-charcoal bg-white" placeholder="CITY" />
                      </div>
                      <div>
                        <label className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/40 mb-2 block">Pincode</label>
                        <input type="text" className="w-full px-6 py-4 text-[10px] tracking-[2px] border border-gray-100 outline-none focus:border-charcoal bg-white" placeholder="PINCODE" />
                      </div>
                    </div>
                  </div>

                  {/* Payment Method */}
                  <div className="bg-white p-10 border border-gray-100">
                    <h2 className="font-serif text-xl text-charcoal mb-8">Payment Method</h2>
                    <div className="space-y-4">
                      {[
                        { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when you receive the order' },
                        { id: 'upi', label: 'UPI / Net Banking', desc: 'Secure online payment' },
                        { id: 'card', label: 'Credit / Debit Card', desc: 'All major cards accepted' }
                      ].map((method) => (
                        <label key={method.id} className="flex items-start gap-6 p-6 border border-gray-100 hover:border-charcoal cursor-pointer transition-all">
                          <input type="radio" name="payment" defaultChecked={method.id === 'cod'} className="mt-1 accent-charcoal" />
                          <div>
                            <span className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal block mb-1">{method.label}</span>
                            <span className="text-[10px] text-charcoal/40 font-medium">{method.desc}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="lg:col-span-5">
                  <div className="bg-white p-10 border border-gray-100 sticky top-32">
                    <h2 className="font-serif text-xl text-charcoal mb-8">Order Summary</h2>
                    <div className="space-y-6 mb-8 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                      {cart.map((item) => (
                        <div key={item.handle} className="flex gap-6">
                          <div className="w-16 h-16 bg-[#f9f9f9] flex-shrink-0 p-2">
                            <img src={item.image} className="w-full h-full object-contain" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-[10px] font-bold text-charcoal tracking-[1px] uppercase">{item.title}</h4>
                            <div className="flex justify-between text-[10px] text-charcoal/40 font-bold mt-2">
                              <span>QTY: {item.qty}</span>
                              <span>₹{parseFloat(item.price) * item.qty}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-4 pt-8 border-t border-gray-100">
                      <div className="flex justify-between text-[10px] tracking-[1px] font-bold uppercase">
                        <span className="text-charcoal/40">Subtotal</span>
                        <span className="text-charcoal">₹{cartTotal}</span>
                      </div>
                      <div className="flex justify-between text-[10px] tracking-[1px] font-bold uppercase">
                        <span className="text-charcoal/40">Shipping</span>
                        <span className="text-charcoal">{cartTotal >= 399 ? 'FREE' : '₹50'}</span>
                      </div>
                      <div className="flex justify-between text-lg pt-6 border-t border-gray-100">
                        <span className="font-serif text-charcoal">Total</span>
                        <span className="font-bold text-charcoal">₹{cartTotal >= 399 ? cartTotal : cartTotal + 50}</span>
                      </div>
                    </div>

                    <button 
                      className="w-full bg-charcoal text-white py-5 text-[10px] tracking-[3px] uppercase font-bold transition-all mt-10 hover:bg-charcoal/90"
                      onClick={() => {
                        showToast('Placing your order...');
                        setTimeout(() => {
                          setCart([]);
                          localStorage.removeItem('divya_cart');
                          navigateTo('order-success');
                        }, 1500);
                      }}
                    >
                      PLACE ORDER
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view.type === 'order-success' && (
          <div className="bg-[#f9f9f9] min-h-screen flex items-center justify-center py-20 px-6">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-md w-full bg-white p-16 text-center border border-gray-100"
            >
              <div className="w-20 h-20 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto mb-10 text-charcoal">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="font-serif text-4xl text-charcoal mb-6">Order Placed!</h1>
              <p className="text-charcoal/60 mb-12 leading-relaxed text-sm">
                Thank you for choosing Divya Ayurveda. Your journey to holistic wellness has begun. We've sent a confirmation email with your order details.
              </p>
              <div className="space-y-4">
                <button 
                  onClick={() => navigateTo('home')}
                  className="w-full bg-charcoal text-white py-5 text-[10px] font-bold uppercase tracking-[3px] hover:bg-charcoal/90 transition-all"
                >
                  CONTINUE SHOPPING
                </button>
                <button 
                  className="w-full border border-charcoal/10 py-5 text-[10px] font-bold uppercase tracking-[3px] text-charcoal/60 hover:border-charcoal transition-all"
                >
                  TRACK MY ORDER
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {view.type === 'info' && currentInfoPage && (
          <div className="bg-[#f9f9f9] min-h-screen">
            {/* Info Hero */}
            <div className="bg-charcoal py-24 px-6 sm:px-10 text-center relative overflow-hidden">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 max-w-[1400px] mx-auto"
              >
                <h1 className="font-serif text-4xl sm:text-6xl text-white mb-6">{currentInfoPage.title}</h1>
                <div className="w-24 h-0.5 bg-white/20 mx-auto"></div>
              </motion.div>
            </div>

            <div className="max-w-[1400px] mx-auto px-6 sm:px-10 py-20">
              <div className="flex flex-col lg:flex-row gap-20">
                {/* Side Nav */}
                <aside className="lg:w-72 flex-shrink-0">
                  <div className="sticky top-32">
                    <h4 className="text-[10px] tracking-[3px] uppercase font-bold text-charcoal/40 mb-8">EXPLORE</h4>
                    <nav className="space-y-2">
                      {Object.entries(INFO_PAGES).map(([id, page]) => (
                        <button
                          key={id}
                          onClick={() => navigateTo('info', id)}
                          className={`w-full text-left px-6 py-4 text-[10px] tracking-[2px] uppercase font-bold transition-all flex items-center justify-between group ${
                            view.id === id 
                              ? 'bg-charcoal text-white' 
                              : 'text-charcoal/40 hover:bg-white hover:text-charcoal'
                          }`}
                        >
                          {page.title}
                          <ChevronRight size={12} className={`transition-transform ${view.id === id ? 'translate-x-0' : '-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                        </button>
                      ))}
                    </nav>
                  </div>
                </aside>

                {/* Content */}
                <div className="flex-grow bg-white p-10 sm:p-20 border border-gray-100">
                  <button 
                    onClick={() => navigateTo('home')}
                    className="text-[10px] font-bold uppercase tracking-[3px] text-charcoal/40 hover:text-charcoal mb-16 flex items-center gap-3 group transition-colors"
                  >
                    <ChevronLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
                    BACK TO HOME
                  </button>
                  <div className="markdown-body max-w-none">
                    <ReactMarkdown>{currentInfoPage.content}</ReactMarkdown>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-[#333a3f] text-white/60 pt-20 relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto px-6 sm:px-10 relative z-20">
          {/* Warning Text */}
          <div className="text-center mb-20 max-w-2xl mx-auto">
            <p className="text-[10px] sm:text-xs tracking-[1px] text-white/40 leading-relaxed italic">
              Please beware of fraudulent messages and phone calls on behalf of Divya Ayurveda. <br/>
              We NEVER ask for bank details, OTPs, advance cash payments or engage in lotteries.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-12 pb-20 border-b border-white/10">
            <div className="col-span-1">
              <h4 className="text-[10px] tracking-[3px] uppercase text-white font-bold mb-8">SHOP</h4>
              <ul className="space-y-4 text-[11px] font-medium tracking-[0.5px]">
                <li><button onClick={() => { setActiveCategory('all'); navigateTo('home', undefined, 'shop'); }} className="hover:text-white transition-colors">All Products</button></li>
                <li><button onClick={() => { setActiveCategory('Immunity'); navigateTo('home', undefined, 'shop'); }} className="hover:text-white transition-colors">Immunity</button></li>
                <li><button onClick={() => { setActiveCategory('Respiratory'); navigateTo('home', undefined, 'shop'); }} className="hover:text-white transition-colors">Respiratory</button></li>
                <li><button onClick={() => { setActiveCategory('BP Care'); navigateTo('home', undefined, 'shop'); }} className="hover:text-white transition-colors">BP Care</button></li>
                <li><button onClick={() => { setActiveCategory('Brain Health'); navigateTo('home', undefined, 'shop'); }} className="hover:text-white transition-colors">Brain Health</button></li>
                <li><button onClick={() => { setActiveCategory('Digestion'); navigateTo('home', undefined, 'shop'); }} className="hover:text-white transition-colors">Digestion</button></li>
                <li><button onClick={() => { setActiveCategory('Rituals'); navigateTo('home', undefined, 'shop'); }} className="hover:text-white transition-colors">Rituals</button></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[10px] tracking-[3px] uppercase text-white font-bold mb-8">CUSTOMER CARE</h4>
              <ul className="space-y-4 text-[11px] font-medium tracking-[0.5px]">
                <li><button className="hover:text-white transition-colors">Contact Us</button></li>
                <li><button className="hover:text-white transition-colors">News & Media</button></li>
                <li><button className="hover:text-white transition-colors">Delivery and Returns</button></li>
                <li><button className="hover:text-white transition-colors">FAQs</button></li>
                <li><button className="hover:text-white transition-colors">Privacy Policy</button></li>
                <li><button className="hover:text-white transition-colors">Terms of Use</button></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[10px] tracking-[3px] uppercase text-white font-bold mb-8">QUICK LINKS</h4>
              <ul className="space-y-4 text-[11px] font-medium tracking-[0.5px]">
                <li><button className="hover:text-white transition-colors">About Us</button></li>
                <li><button className="hover:text-white transition-colors">Complimentary Ritual</button></li>
                <li><button className="hover:text-white transition-colors">Loyalty Program</button></li>
                <li><button className="hover:text-white transition-colors">Kama Cares</button></li>
                <li><button className="hover:text-white transition-colors">Corporate Gifting</button></li>
                <li><button className="hover:text-white transition-colors">International Presence</button></li>
                <li><button className="hover:text-white transition-colors">Store Locator</button></li>
                <li><button className="hover:text-white transition-colors">Careers</button></li>
                <li><button className="hover:text-white transition-colors">Promotions</button></li>
                <li><button className="hover:text-white transition-colors">Blog</button></li>
                <li><button className="hover:text-white transition-colors">GST Reform</button></li>
              </ul>
            </div>
            <div className="col-span-1">
              <h4 className="text-[10px] tracking-[3px] uppercase text-white font-bold mb-8">MY ACCOUNT</h4>
              <ul className="space-y-4 text-[11px] font-medium tracking-[0.5px]">
                <li><button className="hover:text-white transition-colors">My Profile</button></li>
                <li><button className="hover:text-white transition-colors">My Orders</button></li>
                <li><button className="hover:text-white transition-colors">Track My Order</button></li>
              </ul>
            </div>
            <div className="col-span-2 md:col-span-1">
              <h4 className="text-[10px] tracking-[3px] uppercase text-white font-bold mb-8">SIGN UP FOR OUR NEWSLETTER!</h4>
              <div className="space-y-4">
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-[1px]">Your Email Id*</p>
                <div className="flex">
                  <input 
                    type="email" 
                    placeholder="Enter Your Email" 
                    className="bg-white text-charcoal px-4 py-2 text-xs w-full outline-none"
                  />
                  <button className="bg-white text-charcoal border-l border-gray-200 px-4 py-2 text-[10px] font-bold uppercase tracking-[1px] hover:bg-gray-100 transition-colors">
                    SUBSCRIBE
                  </button>
                </div>
                <div className="flex items-start gap-3 mt-4">
                  <input type="checkbox" className="mt-1" id="consent" />
                  <label htmlFor="consent" className="text-[8px] text-white/40 leading-relaxed uppercase tracking-[0.5px]">
                    By Checking This Box, You Consent To Our <a href="#" className="underline">Privacy Policy</a> And <a href="#" className="underline">Terms Of Use</a>.
                  </label>
                </div>
              </div>
              <div className="mt-12">
                <h4 className="text-[10px] tracking-[3px] uppercase text-white font-bold mb-6">Follow us on</h4>
                <div className="flex gap-6">
                  {[Facebook, Twitter, Instagram, Youtube].map((Icon, i) => (
                    <a key={i} href="#" className="text-white/40 hover:text-white transition-all">
                      <Icon size={18} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="py-10 text-center">
            <p className="text-[9px] tracking-[2px] text-white/20 uppercase font-bold">© 2025 DIVYA AYURVEDA. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      </footer>

      {/* --- Modals & Sidebars --- */}

      {/* Cart Sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50"
              onClick={() => setIsCartOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-charcoal text-white flex items-center justify-between">
                <h3 className="text-[10px] tracking-[3px] uppercase font-bold">YOUR BAG</h3>
                <button onClick={() => setIsCartOpen(false)}><X size={20} /></button>
              </div>
              
              <div className="flex-grow overflow-y-auto p-8">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-charcoal/40">
                    <ShoppingBag size={48} strokeWidth={1} className="mb-6 opacity-20" />
                    <p className="text-[10px] tracking-[2px] uppercase font-bold">Your bag is empty</p>
                    <button 
                      className="mt-8 text-charcoal border border-charcoal/20 px-8 py-3 text-[10px] tracking-[2px] uppercase font-bold hover:bg-charcoal hover:text-white transition-all"
                      onClick={() => setIsCartOpen(false)}
                    >
                      START SHOPPING
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {cart.map((item) => (
                      <div key={item.key} className="flex gap-6 pb-8 border-b border-gray-100">
                        <img src={item.image} alt={item.title} className="w-24 h-24 object-contain bg-[#f9f9f9] p-2" />
                        <div className="flex-grow">
                          <h4 className="font-serif text-charcoal text-sm leading-tight mb-1">{item.title}</h4>
                          <p className="text-[8px] tracking-[2px] uppercase font-bold text-charcoal/40 mb-4">{item.option}</p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center border border-charcoal/10">
                              <button 
                                className="px-3 py-1 hover:bg-gray-50"
                                onClick={() => setCart(prev => prev.map(i => i.key === item.key ? { ...i, qty: Math.max(1, i.qty - 1) } : i))}
                              >
                                <Minus size={12} />
                              </button>
                              <span className="w-8 text-center text-xs font-bold">{item.qty}</span>
                              <button 
                                className="px-3 py-1 hover:bg-gray-50"
                                onClick={() => setCart(prev => prev.map(i => i.key === item.key ? { ...i, qty: i.qty + 1 } : i))}
                              >
                                <Plus size={12} />
                              </button>
                            </div>
                            <span className="text-sm font-bold text-charcoal">₹{parseFloat(item.price) * item.qty}</span>
                          </div>
                          <button 
                            className="text-[8px] tracking-[2px] uppercase font-bold text-charcoal/40 underline mt-4 hover:text-charcoal transition-colors"
                            onClick={() => setCart(prev => prev.filter(i => i.key !== item.key))}
                          >
                            REMOVE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 border-t border-gray-100 bg-[#f9f9f9]">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/60">SUBTOTAL</span>
                    <span className="text-xl font-bold text-charcoal">₹{cartTotal}</span>
                  </div>
                  <p className="text-[9px] tracking-[1px] text-center text-charcoal/40 mb-8 font-bold uppercase">
                    {cartTotal >= 399 ? 'YOU QUALIFY FOR FREE SHIPPING!' : `ADD ₹${399 - cartTotal} MORE FOR FREE SHIPPING`}
                  </p>
                  <button 
                    className="w-full bg-charcoal text-white py-5 text-[10px] tracking-[3px] uppercase font-bold hover:bg-charcoal/90 transition-all mb-4"
                    onClick={() => { navigateTo('checkout'); setIsCartOpen(false); }}
                  >
                    PROCEED TO CHECKOUT
                  </button>
                  <button 
                    className="w-full text-center text-[9px] tracking-[2px] uppercase font-bold text-charcoal/40 hover:text-charcoal transition-colors"
                    onClick={() => setIsCartOpen(false)}
                  >
                    CONTINUE SHOPPING
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Wishlist Sidebar */}
      <AnimatePresence>
        {isWishlistOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/50"
              onClick={() => setIsWishlistOpen(false)}
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-[101] shadow-2xl flex flex-col"
            >
              <div className="p-6 bg-charcoal text-white flex items-center justify-between">
                <h3 className="text-[10px] tracking-[3px] uppercase font-bold">YOUR WISHLIST</h3>
                <button onClick={() => setIsWishlistOpen(false)}><X size={20} /></button>
              </div>
              <div className="flex-grow overflow-y-auto p-8">
                {wishlist.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-charcoal/40">
                    <Heart size={48} strokeWidth={1} className="mb-6 opacity-20" />
                    <p className="text-[10px] tracking-[2px] uppercase font-bold">Your wishlist is empty</p>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {wishlist.map((handle) => {
                      const product = PRODUCTS.find(p => p.handle === handle);
                      if (!product) return null;
                      return (
                        <div key={handle} className="flex gap-6 pb-8 border-b border-gray-100">
                          <img src={product.image} alt={product.title} className="w-24 h-24 object-contain bg-[#f9f9f9] p-2" />
                          <div className="flex-grow">
                            <h4 className="font-serif text-charcoal text-sm leading-tight mb-1">{product.title}</h4>
                            <p className="text-sm font-bold text-charcoal mb-4">₹{product.price}</p>
                            <div className="flex gap-4">
                              <button 
                                className="text-[9px] tracking-[2px] uppercase font-bold bg-charcoal text-white px-4 py-2 hover:bg-charcoal/90 transition-all"
                                onClick={() => { addToCart(product); toggleWishlist(handle); }}
                              >
                                MOVE TO BAG
                              </button>
                              <button 
                                className="text-[9px] tracking-[2px] uppercase font-bold text-charcoal/40 underline hover:text-charcoal transition-colors"
                                onClick={() => toggleWishlist(handle)}
                              >
                                REMOVE
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Auth Modal */}
      <AnimatePresence>
        {isAuthOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsAuthOpen(false)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-white w-full max-w-md p-10 sm:p-16 shadow-2xl"
            >
              <button 
                className="absolute top-6 right-6 text-charcoal/40 hover:text-charcoal transition-all"
                onClick={() => setIsAuthOpen(false)}
              >
                <X size={20} />
              </button>
              
              <div className="text-center mb-10">
                <h2 className="font-serif text-3xl text-charcoal mb-4">{user ? 'Welcome Back' : 'Join Divya Ayurveda'}</h2>
                <p className="text-[10px] tracking-[2px] uppercase font-bold text-charcoal/40 leading-relaxed">{user ? user.email : 'Create an account for faster checkout and exclusive offers.'}</p>
              </div>

              {user ? (
                <div className="space-y-4">
                  <button className="w-full bg-charcoal text-white py-5 text-[10px] font-bold uppercase tracking-[3px] hover:bg-charcoal/90 transition-all">MY ORDERS</button>
                  <button className="w-full border border-charcoal/10 py-5 text-[10px] font-bold uppercase tracking-[3px] text-charcoal/60 hover:border-charcoal transition-all" onClick={() => setUser(null)}>LOGOUT</button>
                </div>
              ) : (
                <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); setUser({ email: 'user@example.com' }); setIsAuthOpen(false); showToast('Logged in successfully'); }}>
                  <div>
                    <label className="text-[10px] uppercase tracking-[2px] font-bold text-charcoal/40 mb-2 block">Email Address</label>
                    <input type="email" required className="w-full px-6 py-4 bg-[#f9f9f9] border border-gray-100 outline-none focus:border-charcoal text-xs transition-all" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-[2px] font-bold text-charcoal/40 mb-2 block">Password</label>
                    <input type="password" required className="w-full px-6 py-4 bg-[#f9f9f9] border border-gray-100 outline-none focus:border-charcoal text-xs transition-all" />
                  </div>
                  <button type="submit" className="w-full bg-charcoal text-white py-5 text-[10px] font-bold uppercase tracking-[3px] hover:bg-charcoal/90 transition-all">
                    LOGIN / CREATE ACCOUNT
                  </button>
                  <div className="text-center">
                    <a href="#" className="text-[9px] tracking-[2px] uppercase font-bold text-charcoal/40 hover:text-charcoal transition-colors">Forgot Password?</a>
                  </div>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Actions */}
      <div className="fixed bottom-6 right-6 z-[400] flex flex-col gap-3">
        <AnimatePresence>
          {showScrollTop && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-10 h-10 rounded-full bg-white shadow-xl border border-gray-100 flex items-center justify-center text-charcoal hover:bg-gray-50 transition-colors"
            >
              <ChevronDown className="rotate-180" size={18} />
            </motion.button>
          )}
        </AnimatePresence>
        <button className="w-10 h-10 rounded-full bg-charcoal shadow-xl flex items-center justify-center text-white hover:bg-charcoal/90 transition-colors">
          <Phone size={18} />
        </button>
        <button className="w-10 h-10 rounded-full bg-charcoal shadow-xl flex items-center justify-center text-white hover:bg-charcoal/90 transition-colors">
          <MessageSquare size={18} />
        </button>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isMobileNavOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[300] bg-black/60"
              onClick={() => setIsMobileNavOpen(false)}
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-[300px] bg-white z-[301] shadow-2xl flex flex-col overflow-y-auto no-scrollbar"
            >
              <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-[image:var(--image-paper)]">
                <div className="flex flex-col">
                  <span className="font-serif text-xl text-charcoal tracking-[2px] font-normal uppercase leading-tight">DIVYA</span>
                  <span className="text-[7px] tracking-[3px] text-charcoal/60 uppercase">AYURVEDA</span>
                </div>
                <button onClick={() => setIsMobileNavOpen(false)} className="text-charcoal/40"><X size={20} /></button>
              </div>

              <div className="grid grid-cols-2 border-b border-gray-100">
                <button 
                  onClick={() => { setIsAuthOpen(true); setIsMobileNavOpen(false); }}
                  className="py-4 text-[10px] tracking-[1px] font-bold text-charcoal/60 hover:text-charcoal border-r border-gray-100 transition-colors"
                >
                  Sign in
                </button>
                <button 
                  onClick={() => { setIsAuthOpen(true); setIsMobileNavOpen(false); }}
                  className="py-4 text-[10px] tracking-[1px] font-bold text-charcoal/60 hover:text-charcoal transition-colors"
                >
                  Register
                </button>
              </div>

              <div className="flex-grow">
                <nav className="flex flex-col">
                  {[
                    { name: 'Home', icon: Home, type: 'home' },
                    { name: 'Immunity', icon: ChevronRight, type: 'cat' },
                    { name: 'Respiratory', icon: ChevronRight, type: 'cat' },
                    { name: 'BP Care', icon: ChevronRight, type: 'cat' },
                    { name: 'Brain Health', icon: ChevronRight, type: 'cat', badge: 'NEW' },
                    { name: 'Digestion', icon: ChevronRight, type: 'cat' },
                    { name: 'Rituals', icon: ChevronRight, type: 'cat' },
                    { name: 'All Products', icon: null, type: 'cat' },
                    { name: 'Blogs & More', icon: ChevronRight, type: 'link' },
                    { name: 'Quick Links', icon: ChevronRight, type: 'link' },
                    { name: 'Careers', icon: null, type: 'link' },
                    { name: 'Wishlist', icon: null, type: 'link' },
                    { name: 'Loyalty Program', icon: null, type: 'link' },
                    { name: 'Offers', icon: null, type: 'link' }
                  ].map((item, i) => (
                    <button 
                      key={i}
                      className="flex items-center justify-between px-6 py-4 border-b border-gray-50 text-left text-charcoal/80 hover:bg-gray-50 transition-all group"
                      onClick={() => {
                        if (item.type === 'home') { navigateTo('home'); setActiveCategory('all'); setSearchQuery(''); }
                        else if (item.type === 'cat') { 
                          if (item.name === 'All Products') setActiveCategory('all');
                          else setActiveCategory(item.name); 
                          navigateTo('home', undefined, 'shop'); 
                        }
                        setIsMobileNavOpen(false);
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-[20px] tracking-[1px] font-medium">{item.name}</span>
                        {item.badge && (
                          <span className="bg-red-800 text-white text-[7px] px-1.5 py-0.5 rounded-sm font-bold tracking-[1px]">{item.badge}</span>
                        )}
                      </div>
                      {item.icon && <item.icon size={14} className="text-charcoal/30 group-hover:text-charcoal transition-colors" />}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-[500] bg-charcoal text-white px-8 py-4 text-[10px] tracking-[2px] uppercase font-bold shadow-2xl"
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wellness Offer Popup */}
      <AnimatePresence>
        {isWellnessPopupOpen && (
          <div className="fixed inset-0 z-[600] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => {
                setIsWellnessPopupOpen(false);
                localStorage.setItem('divya_wellness_popup_seen', 'true');
              }}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-4xl overflow-hidden shadow-2xl flex flex-col md:flex-row"
            >
              <button 
                className="absolute top-4 right-4 z-10 text-charcoal/40 hover:text-charcoal transition-all"
                onClick={() => {
                  setIsWellnessPopupOpen(false);
                  localStorage.setItem('divya_wellness_popup_seen', 'true');
                }}
              >
                <X size={20} />
              </button>

              {/* Left: Image */}
              <div className="hidden md:block md:w-1/2 relative">
                <img 
                  src="https://static.wixstatic.com/media/7fa905_e3cd3b37178a40f28c6a44d08bfaf77b~mv2.jpg" 
                  alt="Wellness Offer" 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Right: Content */}
              <div className="w-full md:w-1/2 p-12 flex flex-col justify-center text-center md:text-left">
                <span className="text-[10px] tracking-[4px] uppercase text-charcoal/60 mb-4 block font-bold">EXCLUSIVE OFFER</span>
                <h2 className="font-serif text-3xl sm:text-4xl text-charcoal mb-6 leading-tight">
                  Unlock <span className="text-gold">20% Off</span> Your First Order
                </h2>
                <p className="text-xs text-charcoal/60 mb-10 leading-relaxed">
                  Join the DIVYA tribe today. Subscribe to our newsletter and receive an exclusive discount code for your journey to holistic wellness.
                </p>

                <form 
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsWellnessPopupOpen(false);
                    localStorage.setItem('divya_wellness_popup_seen', 'true');
                    showToast('Welcome to the tribe! Check your email for the code.');
                  }}
                >
                  <input 
                    type="email" 
                    required 
                    placeholder="Enter your email address" 
                    className="w-full px-6 py-4 bg-[#f9f9f9] border border-gray-100 outline-none focus:border-charcoal text-xs transition-all"
                  />
                  <button 
                    type="submit" 
                    className="w-full bg-charcoal text-white py-4 text-[10px] tracking-[2px] uppercase font-bold hover:bg-charcoal/90 transition-all"
                  >
                    GET MY 20% DISCOUNT
                  </button>
                </form>

                <button 
                  className="mt-6 text-[9px] text-charcoal/40 uppercase tracking-[2px] font-bold hover:text-charcoal transition-colors"
                  onClick={() => {
                    setIsWellnessPopupOpen(false);
                    localStorage.setItem('divya_wellness_popup_seen', 'true');
                  }}
                >
                  NO THANKS, I'LL PAY FULL PRICE
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
