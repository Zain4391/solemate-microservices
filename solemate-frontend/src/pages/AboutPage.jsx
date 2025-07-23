import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useAnimation, useInView } from 'framer-motion';
import { useRef } from 'react';

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

  // Refs for intersection observers
  const statsRef = useRef(null);
  const isStatsInView = useInView(statsRef, { once: true });

  // Trigger counters when stats section is in view
  useEffect(() => {
    if (isStatsInView) {
      setCustomersVisible(true);
      setBrandsVisible(true);
      setProductsVisible(true);
      setSatisfactionVisible(true);
    }
  }, [isStatsInView, setCustomersVisible, setBrandsVisible, setProductsVisible, setSatisfactionVisible]);

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

  // Animation variants
  const fadeInUp = {
    initial: { y: 60, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.6 }
  };

  return (
    <motion.div 
      className='bg-stone-50 min-h-screen'
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      {/* Hero Section */}
      <motion.div 
        className='relative bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 py-20 overflow-hidden'
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
      >
        {/* Background Image */}
        <motion.div 
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{ backgroundImage: 'url(/images/Side_2.png)' }}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ duration: 8, ease: "linear" }}
        />
        <div className='absolute inset-0 bg-black opacity-40'></div>
        <motion.div 
          className='relative max-w-7xl mx-auto px-6 text-center'
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          <motion.h1 
            className='text-5xl md:text-6xl font-bold text-white mb-6'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            About SoleMate
          </motion.h1>
          <motion.p 
            className='text-xl md:text-2xl text-amber-100 max-w-3xl mx-auto leading-relaxed'
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
          >
            Your trusted companion in finding the perfect footwear for every step of your journey
          </motion.p>
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className='max-w-7xl mx-auto px-6 py-16'>
        
        {/* Our Story Section */}
        <motion.div 
          className='mb-20'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-16 items-center'>
            <motion.div variants={fadeInUp}>
              <motion.h2 
                className='text-4xl font-bold text-stone-800 mb-6'
                initial={{ x: -50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                Our Story
              </motion.h2>
              <motion.p 
                className='text-lg text-stone-600 mb-6 leading-relaxed'
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2, duration: 0.8 }}
              >
                Founded in 2020, SoleMate began as a passion project by a group of footwear enthusiasts who believed that everyone deserves to find their perfect pair of shoes. What started as a small collection has grown into a comprehensive platform offering premium footwear from around the world.
              </motion.p>
              <motion.p 
                className='text-lg text-stone-600 leading-relaxed'
                initial={{ x: -30, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                We understand that shoes are more than just accessories – they're an extension of your personality, a companion on your adventures, and a foundation for your confidence. That's why we've curated a collection that celebrates diversity, quality, and style.
              </motion.p>
            </motion.div>
            
            <motion.div 
              className='relative'
              initial={{ x: 50, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              {/* Story Image */}
              <motion.div 
                className='bg-white rounded-3xl shadow-lg border border-stone-200 overflow-hidden'
                whileHover={{ scale: 1.02, y: -5 }}
                transition={{ duration: 0.3 }}
              >
                <motion.img 
                  src="/images/Side.png" 
                  alt="Shoe collection and craftsmanship" 
                  className='w-full h-80 object-cover'
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.4 }}
                />
                <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent'></div>
              </motion.div>
              {/* Floating card */}
              <motion.div 
                className='absolute -bottom-6 -right-6 bg-amber-600 text-white p-6 rounded-2xl shadow-xl'
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
              >
                <div className='text-center'>
                  <div className='text-3xl font-bold'>2020</div>
                  <div className='text-amber-100 text-sm'>Founded</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>

        {/* Values Section */}
        <motion.div 
          className='mb-20'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className='text-4xl font-bold text-stone-800 text-center mb-12'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Our Values
          </motion.h2>
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-3 gap-8'
            variants={staggerContainer}
          >
            {[
              { icon: '🌟', title: 'Excellence', description: 'We source only the finest footwear from trusted brands and emerging designers, ensuring every pair meets our high standards of quality and craftsmanship.' },
              { icon: '🤝', title: 'Community', description: 'We believe in building lasting relationships with our customers, creating a community of shoe lovers who share our passion for quality and style.' },
              { icon: '🌱', title: 'Sustainability', description: 'We\'re committed to promoting sustainable practices in the footwear industry, partnering with brands that prioritize environmental responsibility.' }
            ].map((value, index) => (
              <motion.div 
                key={index}
                className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'
                variants={cardVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.02,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className='w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:bg-amber-200 transition-colors duration-300'
                  whileHover={{ rotate: 360, scale: 1.1 }}
                  transition={{ duration: 0.6 }}
                >
                  <span className='text-3xl'>{value.icon}</span>
                </motion.div>
                <h3 className='text-2xl font-semibold text-stone-800 mb-4'>{value.title}</h3>
                <p className='text-stone-600 leading-relaxed'>
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Mission Section */}
        <motion.div 
          className='bg-white rounded-3xl p-12 shadow-lg border border-stone-200 mb-20'
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.01 }}
        >
          <div className='text-center max-w-4xl mx-auto'>
            <motion.h2 
              className='text-4xl font-bold text-stone-800 mb-8'
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              Our Mission
            </motion.h2>
            <motion.p 
              className='text-xl text-stone-600 leading-relaxed mb-8'
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              To make premium footwear accessible to everyone while fostering a community that celebrates individual style and quality craftsmanship. We strive to be more than just a marketplace – we're your trusted partner in finding shoes that fit not just your feet, but your lifestyle.
            </motion.p>
            <motion.div 
              className='bg-amber-50 rounded-2xl p-8 border border-amber-200'
              initial={{ scale: 0.9, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <p className='text-lg text-amber-800 font-medium italic'>
                "Every step matters, and we're here to make sure yours are taken in confidence and comfort."
              </p>
            </motion.div>
          </div>
        </motion.div>

        {/* Team Section */}
        <motion.div 
          className='mb-20'
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className='text-4xl font-bold text-stone-800 text-center mb-12'
            initial={{ y: 50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Meet Our Team
          </motion.h2>
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8'
            variants={staggerContainer}
          >
            {[
              { initials: 'AS', name: 'Alex Smith', role: 'Founder & CEO', description: 'Passionate about footwear design with 15+ years in the industry. Alex leads our vision of making quality shoes accessible to everyone.' },
              { initials: 'MJ', name: 'Maria Johnson', role: 'Head of Curation', description: 'With an eye for emerging trends and timeless classics, Maria ensures our collection represents the best in contemporary footwear.' },
              { initials: 'DL', name: 'David Lee', role: 'Customer Experience', description: 'David ensures every customer feels valued and supported throughout their journey with us, from browsing to delivery and beyond.' }
            ].map((member, index) => (
              <motion.div 
                key={index}
                className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200 text-center group hover:shadow-xl transition-all duration-300'
                variants={cardVariants}
                whileHover={{ 
                  y: -10, 
                  scale: 1.03,
                  boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)"
                }}
              >
                <motion.div 
                  className='w-24 h-24 bg-gradient-to-br from-amber-200 to-amber-300 rounded-full mx-auto mb-6 flex items-center justify-center'
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className='text-2xl font-bold text-amber-800'>{member.initials}</span>
                </motion.div>
                <h3 className='text-xl font-semibold text-stone-800 mb-2'>{member.name}</h3>
                <p className='text-amber-600 font-medium mb-3'>{member.role}</p>
                <p className='text-stone-600 text-sm leading-relaxed'>
                  {member.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Stats Section */}
        <motion.div 
          ref={statsRef}
          className='bg-gradient-to-r from-amber-700 to-amber-800 rounded-3xl p-12 text-white mb-20'
          initial={{ scale: 0.9, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className='text-4xl font-bold text-center mb-12'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Our Impact
          </motion.h2>
          <motion.div 
            className='grid grid-cols-1 md:grid-cols-4 gap-8 text-center'
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {[
              { count: customersCount, target: 50000, label: 'Happy Customers' },
              { count: brandsCount, target: 200, label: 'Brand Partners' },
              { count: productsCount, target: 10000, label: 'Products Available' },
              { count: satisfactionCount, target: 99, label: 'Customer Satisfaction', isPercent: true }
            ].map((stat, index) => (
              <motion.div 
                key={index}
                className='group'
                variants={cardVariants}
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div 
                  className='text-4xl font-bold mb-2 transition-all duration-300'
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, type: "spring", stiffness: 100 }}
                >
                  {stat.isPercent ? `${stat.count}%` : formatNumber(stat.count, stat.target)}
                </motion.div>
                <p className='text-amber-100'>{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Call to Action */}
        <motion.div 
          className='text-center'
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className='text-4xl font-bold text-stone-800 mb-6'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            Ready to Find Your Perfect Pair?
          </motion.h2>
          <motion.p 
            className='text-xl text-stone-600 mb-8 max-w-2xl mx-auto'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            Join thousands of satisfied customers who have found their sole mate with us. Browse our collection and discover your next favorite pair of shoes.
          </motion.p>
          <motion.button 
            onClick={handleShopNowClick} 
            className='bg-amber-700 hover:bg-amber-800 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-all duration-200 shadow-lg hover:shadow-xl'
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.6 }}
            whileHover={{ 
              scale: 1.05, 
              y: -2,
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            Shop Now
          </motion.button>
        </motion.div>

      </div>
    </motion.div>
  );
};

export default AboutUsPage;