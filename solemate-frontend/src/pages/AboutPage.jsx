import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AboutUsPage = () => {
  const navigate = useNavigate();

  // Counter animation hook
  const useCounter = (target, duration = 2000) => {
    const [count, setCount] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
      if (!isVisible) return;

      let startTime = null;
      const animate = (currentTime) => {
        if (startTime === null) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * target));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [isVisible, target, duration]);

    return [count, setIsVisible];
  };

  // Counter values
  const [customersCount, setCustomersVisible] = useCounter(50000, 2500);
  const [brandsCount, setBrandsVisible] = useCounter(200, 2000);
  const [productsCount, setProductsVisible] = useCounter(10000, 2200);
  const [satisfactionCount, setSatisfactionVisible] = useCounter(99, 1800);

  // Intersection Observer for triggering animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.dispatchEvent(new CustomEvent('startCounter'));
          }
        });
      },
      { threshold: 0.3 }
    );

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  }, []);

  // Handle counter trigger
  useEffect(() => {
    const handleCounterStart = () => {
      setCustomersVisible(true);
      setBrandsVisible(true);
      setProductsVisible(true);
      setSatisfactionVisible(true);
    };

    const statsSection = document.getElementById('stats-section');
    if (statsSection) {
      statsSection.addEventListener('startCounter', handleCounterStart);
      return () => statsSection.removeEventListener('startCounter', handleCounterStart);
    }
  }, [setCustomersVisible, setBrandsVisible, setProductsVisible, setSatisfactionVisible]);

  // Format numbers with K suffix
  const formatNumber = (num, target) => {
    if (target >= 1000) {
      return `${(num / 1000).toFixed(num === target ? 0 : 1)}K${num === target ? '+' : ''}`;
    }
    return `${num}${num === target && target < 100 ? '%' : (num === target ? '+' : '')}`;
  };

  // Handle Shop Now button click
  const handleShopNowClick = () => {
    navigate('/products');
  };

  return (
    <div className='bg-stone-50 min-h-screen'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 py-20 overflow-hidden'>
        {/* Background Image */}
        <div 
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: 'url(/images/Side_2.png)' }}
        ></div>
        <div className='absolute inset-0 bg-black opacity-40'></div>
        <div className='relative max-w-7xl mx-auto px-6 text-center'>
          <h1 className='text-5xl md:text-6xl font-bold text-white mb-6'>
            About SoleMate
          </h1>
          <p className='text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed'>
            Your trusted companion in finding the perfect footwear for every step of your journey
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-16'>
        
        {/* Our Story Section */}
        <div className='mb-20'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <div>
              <h2 className='text-4xl font-bold text-stone-800 mb-6'>Our Story</h2>
              <p className='text-lg text-stone-600 mb-6 leading-relaxed'>
                Founded in 2020, SoleMate began as a passion project by a group of footwear enthusiasts who believed that everyone deserves to find their perfect pair of shoes. What started as a small collection has grown into a comprehensive platform offering premium footwear from around the world.
              </p>
              <p className='text-lg text-stone-600 leading-relaxed'>
                We understand that shoes are more than just accessories – they're an extension of your personality, a companion on your adventures, and a foundation for your confidence. That's why we've curated a collection that celebrates diversity, quality, and style.
              </p>
            </div>
            <div className='relative'>
              {/* Story Image */}
              <div className='bg-white rounded-3xl shadow-lg border border-stone-200 overflow-hidden'>
                <img 
                  src="/images/Side.png" 
                  alt="Shoe collection and craftsmanship" 
                  className='w-full h-80 object-cover'
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
              </div>
              {/* Floating card */}
              <div className='absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-2xl shadow-xl'>
                <div className='text-center'>
                  <div className='text-3xl font-bold'>2020</div>
                  <div className='text-amber-100 text-sm'>Founded</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className='mb-20'>
          <h2 className='text-4xl font-bold text-stone-800 text-center mb-12'>Our Values</h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-8'>
            
            <div className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'>
              <div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors duration-300'>
                <span className='text-3xl'>🌟</span>
              </div>
              <h3 className='text-2xl font-semibold text-stone-800 mb-4'>Excellence</h3>
              <p className='text-stone-600 leading-relaxed'>
                We source only the finest footwear from trusted brands and emerging designers, ensuring every pair meets our high standards of quality and craftsmanship.
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'>
              <div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors duration-300'>
                <span className='text-3xl'>🤝</span>
              </div>
              <h3 className='text-2xl font-semibold text-stone-800 mb-4'>Community</h3>
              <p className='text-stone-600 leading-relaxed'>
                We believe in building lasting relationships with our customers, creating a community of shoe lovers who share our passion for quality and style.
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'>
              <div className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors duration-300'>
                <span className='text-3xl'>🌱</span>
              </div>
              <h3 className='text-2xl font-semibold text-stone-800 mb-4'>Sustainability</h3>
              <p className='text-stone-600 leading-relaxed'>
                We're committed to promoting sustainable practices in the footwear industry, partnering with brands that prioritize environmental responsibility.
              </p>
            </div>

          </div>
        </div>

        {/* Mission Section */}
        <div className='bg-white rounded-3xl p-12 shadow-lg border border-stone-200 mb-20'>
          <div className='text-center max-w-4xl mx-auto'>
            <h2 className='text-4xl font-bold text-stone-800 mb-8'>Our Mission</h2>
            <p className='text-xl text-stone-600 leading-relaxed mb-8'>
              To make premium footwear accessible to everyone while fostering a community that celebrates individual style and quality craftsmanship. We strive to be more than just a marketplace – we're your trusted partner in finding shoes that fit not just your feet, but your lifestyle.
            </p>
            <div className='bg-amber-50 rounded-2xl p-8 border border-amber-200'>
              <p className='text-lg text-amber-800 font-medium italic'>
                "Every step matters, and we're here to make sure yours are taken in confidence and comfort."
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className='mb-20'>
          <h2 className='text-4xl font-bold text-stone-800 text-center mb-12'>Meet Our Team</h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'>
            
            <div className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'>
              <div className='w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full mx-auto mb-6 flex items-center justify-center'>
                <span className='text-2xl font-bold text-amber-800'>AS</span>
              </div>
              <h3 className='text-xl font-semibold text-stone-800 mb-2'>Alex Smith</h3>
              <p className='text-amber-600 font-medium mb-3'>Founder & CEO</p>
              <p className='text-stone-600 text-sm leading-relaxed'>
                Passionate about footwear design with 15+ years in the industry. Alex leads our vision of making quality shoes accessible to everyone.
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'>
              <div className='w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full mx-auto mb-6 flex items-center justify-center'>
                <span className='text-2xl font-bold text-amber-800'>MJ</span>
              </div>
              <h3 className='text-xl font-semibold text-stone-800 mb-2'>Maria Johnson</h3>
              <p className='text-amber-600 font-medium mb-3'>Head of Curation</p>
              <p className='text-stone-600 text-sm leading-relaxed'>
                With an eye for emerging trends and timeless classics, Maria ensures our collection represents the best in contemporary footwear.
              </p>
            </div>

            <div className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'>
              <div className='w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full mx-auto mb-6 flex items-center justify-center'>
                <span className='text-2xl font-bold text-amber-800'>DL</span>
              </div>
              <h3 className='text-xl font-semibold text-stone-800 mb-2'>David Lee</h3>
              <p className='text-amber-600 font-medium mb-3'>Customer Experience</p>
              <p className='text-stone-600 text-sm leading-relaxed'>
                David ensures every customer feels valued and supported throughout their journey with us, from browsing to delivery and beyond.
              </p>
            </div>

          </div>
        </div>

        {/* Stats Section */}
        <div id="stats-section" className='bg-gradient-to-r from-amber-700 to-amber-800 rounded-3xl p-12 text-white mb-20'>
          <h2 className='text-4xl font-bold text-center mb-12'>Our Impact</h2>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-8 text-center'>
            
            <div className='group'>
              <div className='text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110'>
                {formatNumber(customersCount, 50000)}
              </div>
              <p className='text-amber-100'>Happy Customers</p>
            </div>

            <div className='group'>
              <div className='text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110'>
                {formatNumber(brandsCount, 200)}
              </div>
              <p className='text-amber-100'>Brand Partners</p>
            </div>

            <div className='group'>
              <div className='text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110'>
                {formatNumber(productsCount, 10000)}
              </div>
              <p className='text-amber-100'>Products Available</p>
            </div>

            <div className='group'>
              <div className='text-4xl font-bold mb-2 transition-all duration-300 group-hover:scale-110'>
                {satisfactionCount}%
              </div>
              <p className='text-amber-100'>Customer Satisfaction</p>
            </div>

          </div>
        </div>

        {/* Call to Action */}
        <div className='text-center'>
          <h2 className='text-4xl font-bold text-stone-800 mb-6'>Ready to Find Your Perfect Pair?</h2>
          <p className='text-xl text-stone-600 mb-8 max-w-2xl mx-auto'>
            Join thousands of satisfied customers who have found their sole mate with us. Browse our collection and discover your next favorite pair of shoes.
          </p>
          <button 
            onClick={handleShopNowClick} 
            className='bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl'
          >
            Shop Now
          </button>
        </div>

      </div>
    </div>
  );
};

export default AboutUsPage;