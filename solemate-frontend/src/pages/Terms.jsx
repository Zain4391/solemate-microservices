import React from 'react';
import { useNavigate } from 'react-router-dom';

const Terms = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  const handleShopNowClick = () => {
    navigate('/products');
  };

  return (
    <div className='bg-stone-50 min-h-screen'>
      {/* Hero Section */}
      <div className='relative bg-gradient-to-br from-amber-700 via-amber-600 to-amber-800 py-16'>
        <div className='absolute inset-0 bg-black opacity-20'></div>
        <div className='relative max-w-7xl mx-auto px-6 text-center'>
          <h1 className='text-4xl md:text-5xl font-bold text-white mb-4'>
            Terms & Conditions
          </h1>
          <p className='text-lg md:text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed'>
            Please read these terms and conditions carefully before using our service
          </p>
        </div>
      </div>

      {/* Back Button */}
      <div className='max-w-7xl mx-auto px-6 pt-8'>
        <button 
          onClick={handleBackClick}
          className='flex items-center text-amber-700 hover:text-amber-800 font-medium transition-colors duration-200'
        >
          <span className='mr-2'>←</span>
          Back
        </button>
      </div>

      {/* Main Content */}
      <div className='max-w-4xl mx-auto px-6 py-12'>
        
        {/* Last Updated */}
        <div className='bg-amber-50 rounded-xl p-6 mb-12 border border-amber-200'>
          <p className='text-amber-800 font-medium'>
            <strong>Last Updated:</strong> January 15, 2025
          </p>
          <p className='text-amber-700 mt-2 text-sm'>
            These terms and conditions are effective immediately and apply to all users of the SoleMate platform.
          </p>
        </div>

        {/* Terms Sections */}
        <div className='space-y-12'>

          {/* Section 1 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>1. Acceptance of Terms</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                By accessing and using the SoleMate website and services, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                These Terms of Service apply to all users of the site, including without limitation users who are merchants, customers, browsers, and/or contributors of content.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>2. Use License</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                Permission is granted to temporarily download one copy of the materials on SoleMate's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className='list-disc list-inside space-y-2 ml-4'>
                <li>modify or copy the materials</li>
                <li>use the materials for any commercial purpose or for any public display</li>
                <li>attempt to reverse engineer any software contained on the website</li>
                <li>remove any copyright or other proprietary notations from the materials</li>
              </ul>
              <p>
                This license shall automatically terminate if you violate any of these restrictions and may be terminated by SoleMate at any time.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>3. Product Information</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                We strive to provide accurate product descriptions, images, and pricing information. However, we do not warrant that product descriptions or other content is accurate, complete, reliable, current, or error-free.
              </p>
              <p>
                All products are subject to availability. We reserve the right to discontinue any product at any time. Colors of products may appear different on your monitor due to computer settings.
              </p>
            </div>
          </section>

          {/* Section 4 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>4. Pricing and Payment</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                All prices are listed in USD and are subject to change without notice. We reserve the right to modify or discontinue promotions at any time.
              </p>
              <p>
                Payment must be received before products are shipped. We accept major credit cards, PayPal, and other payment methods as displayed during checkout.
              </p>
              <p>
                In the event of a pricing error, we reserve the right to cancel orders and refund any payments made.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>5. Shipping and Returns</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                Shipping times and costs vary by location and shipping method selected. We are not responsible for delays caused by shipping carriers or customs processing.
              </p>
              <p>
                Returns are accepted within 30 days of purchase for unworn items in original packaging. Return shipping costs are the responsibility of the customer unless the item is defective or incorrect.
              </p>
              <div className='bg-stone-50 rounded-lg p-4 border border-stone-200'>
                <h4 className='font-semibold text-stone-800 mb-2'>Return Process:</h4>
                <ul className='list-disc list-inside space-y-1 text-sm'>
                  <li>Contact customer service to initiate a return</li>
                  <li>Package items securely in original packaging</li>
                  <li>Include return authorization number</li>
                  <li>Refunds processed within 5-7 business days</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>6. User Accounts</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.
              </p>
              <p>
                You agree not to disclose your password to any third party and to take sole responsibility for any activities or actions under your account.
              </p>
            </div>
          </section>

          {/* Section 7 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>7. Limitation of Liability</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                In no event shall SoleMate or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on SoleMate's website.
              </p>
              <p>
                Our total liability for any claims shall not exceed the amount you paid for the product or service that gave rise to the claim.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>8. Governing Law</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                These terms and conditions are governed by and construed in accordance with the laws of [Your Jurisdiction] and you irrevocably submit to the exclusive jurisdiction of the courts in that state or location.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>9. Changes to Terms</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                SoleMate reserves the right to revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service.
              </p>
              <p>
                We recommend that you review these terms periodically to stay informed of any updates.
              </p>
            </div>
          </section>

        </div>

        {/* Contact Section */}
        <div className='bg-gradient-to-r from-amber-700 to-amber-800 rounded-3xl p-8 text-white mt-16 text-center'>
          <h3 className='text-2xl font-bold mb-4'>Questions About Our Terms?</h3>
          <p className='text-amber-100 mb-6'>
            If you have any questions about these Terms & Conditions, please don't hesitate to contact us.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a 
              href="mailto:legal@solemate.com" 
              className='bg-white text-amber-700 font-semibold py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors duration-200'
            >
              Contact Legal Team
            </a>
            <button 
              onClick={handleShopNowClick}
              className='bg-amber-600 hover:bg-amber-500 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200'
            >
              Continue Shopping
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Terms;