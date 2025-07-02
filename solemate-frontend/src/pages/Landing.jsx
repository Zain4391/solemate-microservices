import { Link } from 'react-router-dom';

const Landing = () => {
  const featuredProducts = [
    {
      id: 1,
      name: "Urban Runner Pro",
      price: "$129.99",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=300&fit=crop",
      category: "Running"
    },
    {
      id: 2,
      name: "Classic Leather Boots",
      price: "$189.99",
      image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5d?w=400&h=300&fit=crop",
      category: "Casual"
    },
    {
      id: 3,
      name: "Sport Elite Sneakers",
      price: "$159.99",
      image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=300&fit=crop",
      category: "Athletic"
    }
  ];

  const categories = [
    { name: "Running", icon: "🏃‍♂️", count: "120+ styles" },
    { name: "Casual", icon: "👟", count: "200+ styles" },
    { name: "Formal", icon: "👞", count: "85+ styles" },
    { name: "Athletic", icon: "⚡", count: "150+ styles" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
        {/* Hero Section */}
<div className="hero min-h-screen relative overflow-hidden">
  {/* Background Image with multiple fallback options */}
  <div 
    className="absolute inset-0 bg-cover bg-center bg-no-repeat"
    style={{
      backgroundImage: `
        url('https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80'),
        url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=1926&q=80'),
        linear-gradient(135deg, #78716c 0%, #d97706 100%)
      `
    }}
  >
    {/* Overlay for better text readability */}
    <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-stone-900/40 to-amber-900/30"></div>
  </div>
  
  
  {/* Content */}
  <div className="hero-content text-center relative z-10">
    <div className="max-w-4xl">
      <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 drop-shadow-2xl">
        Find Your Perfect
        <span className="text-amber-700 block drop-shadow-2xl">SOLEMATE</span>
      </h1>
      <p className="text-xl md:text-2xl text-stone-100 mb-8 max-w-2xl mx-auto drop-shadow-lg">
        Step into comfort, style, and quality. Discover our curated collection 
        of premium footwear for every occasion.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link to="/products" className="btn btn-primary btn-lg bg-amber-800 hover:bg-amber-900 border-amber-800 text-white shadow-xl transform hover:scale-105 transition-all">
          Shop Now
        </Link>
        <Link to="/register" className="btn btn-outline btn-lg border-white text-white hover:bg-white hover:text-stone-800 shadow-xl transform hover:scale-105 transition-all">
          Join SOLEMATE
        </Link>
      </div>
    </div>
  </div>
</div>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-800 mb-12">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category) => (
              <div key={category.name} className="card bg-stone-50 shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                <div className="card-body items-center text-center p-6">
                  <div className="text-4xl mb-3">{category.icon}</div>
                  <h3 className="card-title text-stone-800 text-lg">{category.name}</h3>
                  <p className="text-stone-600 text-sm">{category.count}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Quotes Section */}
      <section className="py-16 bg-stone-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-800 mb-12">
            What Our Customers Say
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Quote 1 */}
            <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                    <circle cx="50" cy="50" r="50" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
                    <circle cx="50" cy="35" r="15" fill="#78716c"/>
                    <path d="M20 85 C20 70, 35 60, 50 60 S80 70, 80 85" fill="#78716c"/>
                  </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-stone-800">Sarah Martinez</h3>
                    <div className="rating rating-sm">
                      <input type="radio" name="rating-1" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-1" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-1" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-1" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-1" className="mask mask-star-2 bg-amber-700" disabled checked />
                    </div>
                  </div>
                </div>
                <blockquote className="text-stone-600 italic leading-relaxed">
                  "SOLEMATE completely transformed my shoe shopping experience. The quality is incredible and the fit is perfect every time. I've never been happier with my footwear!"
                </blockquote>
                <div className="badge badge-outline text-amber-700 border-amber-800 mt-4">
                  Verified Purchase
                </div>
              </div>
            </div>

            {/* Quote 2 */}
            <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                      <circle cx="50" cy="50" r="50" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
                      <circle cx="50" cy="35" r="15" fill="#78716c"/>
                      <path d="M20 85 C20 70, 35 60, 50 60 S80 70, 80 85" fill="#78716c"/>
                    </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-stone-800">Michael Johnson</h3>
                    <div className="rating rating-sm">
                      <input type="radio" name="rating-2" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-2" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-2" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-2" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-2" className="mask mask-star-2 bg-amber-700" disabled checked />
                    </div>
                  </div>
                </div>
                <blockquote className="text-stone-600 italic leading-relaxed">
                  "As a runner, finding the right shoes is crucial. SOLEMATE's athletic collection is top-notch. Great customer service and lightning-fast delivery too!"
                </blockquote>
                <div className="badge badge-outline text-amber-700 border-amber-700 mt-4">
                  Verified Purchase
                </div>
              </div>
            </div>

            {/* Quote 3 */}
            <div className="card bg-white shadow-lg hover:shadow-xl transition-shadow">
              <div className="card-body">
                <div className="flex items-center mb-4">
                  <div className="avatar">
                    <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-12 h-12">
                      <circle cx="50" cy="50" r="50" fill="#fef3c7" stroke="#d97706" strokeWidth="2"/>
                      <circle cx="50" cy="35" r="15" fill="#78716c"/>
                      <path d="M20 85 C20 70, 35 60, 50 60 S80 70, 80 85" fill="#78716c"/>
                    </svg>
                    </div>
                  </div>
                  <div className="ml-3">
                    <h3 className="font-semibold text-stone-800">Emily Parker</h3>
                    <div className="rating rating-sm">
                      <input type="radio" name="rating-3" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-3" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-3" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-3" className="mask mask-star-2 bg-amber-700" disabled checked />
                      <input type="radio" name="rating-3" className="mask mask-star-2 bg-amber-700" disabled checked />
                    </div>
                  </div>
                </div>
                <blockquote className="text-stone-600 italic leading-relaxed">
                  "I love how SOLEMATE curates their collection. Every pair I've bought has been stylish, comfortable, and durable. They truly understand what customers want."
                </blockquote>
                <div className="badge badge-outline text-amber-700 border-amber-300 mt-4">
                  Verified Purchase
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-stone-800 mb-12">
            Why Choose SOLEMATE?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚚</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Free Shipping</h3>
              <p className="text-stone-600">Free shipping on all orders over $75. Fast and reliable delivery.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">↩️</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Easy Returns</h3>
              <p className="text-stone-600">30-day hassle-free returns. Your satisfaction is guaranteed.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">⭐</span>
              </div>
              <h3 className="text-xl font-semibold text-stone-800 mb-3">Premium Quality</h3>
              <p className="text-stone-600">Carefully curated collection of high-quality footwear brands.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-amber-800 to-stone-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Find Your Perfect Pair?
          </h2>
          <p className="text-xl text-amber-100 mb-8 max-w-2xl mx-auto">
            Join thousands of satisfied customers who have found their perfect SOLEMATE.
          </p>
          <Link to="/register" className="btn btn-primary btn-lg bg-white text-amber-700 hover:bg-amber-700 border-white hover:text-white">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Landing;