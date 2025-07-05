import React from 'react';
import { useNavigate } from 'react-router-dom';

const Privacy = () => {
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
            Privacy Policy
          </h1>
          <p className='text-lg md:text-xl text-amber-100 max-w-2xl mx-auto leading-relaxed'>
            Your privacy is important to us. Learn how we protect and use your information.
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
            This privacy policy describes how SoleMate collects, uses, and protects your personal information.
          </p>
        </div>

        {/* Privacy Sections */}
        <div className='space-y-12'>

          {/* Section 1 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>1. Information We Collect</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.
              </p>
              
              <div className='bg-stone-50 rounded-lg p-6 border border-stone-200'>
                <h4 className='font-semibold text-stone-800 mb-3'>Personal Information:</h4>
                <ul className='list-disc list-inside space-y-2'>
                  <li>Name, email address, and phone number</li>
                  <li>Billing and shipping addresses</li>
                  <li>Payment information (processed securely by third parties)</li>
                  <li>Account preferences and purchase history</li>
                </ul>
              </div>

              <div className='bg-stone-50 rounded-lg p-6 border border-stone-200'>
                <h4 className='font-semibold text-stone-800 mb-3'>Automatically Collected Information:</h4>
                <ul className='list-disc list-inside space-y-2'>
                  <li>IP address and device information</li>
                  <li>Browser type and operating system</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website information</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Section 2 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>2. How We Use Your Information</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                We use the information we collect to provide, maintain, and improve our services, process transactions, and communicate with you.
              </p>
              
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='bg-amber-50 rounded-lg p-4 border border-amber-200'>
                  <h4 className='font-semibold text-amber-800 mb-2'>Service Provision:</h4>
                  <ul className='list-disc list-inside space-y-1 text-sm text-amber-700'>
                    <li>Process and fulfill orders</li>
                    <li>Manage your account</li>
                    <li>Provide customer support</li>
                    <li>Send order confirmations</li>
                  </ul>
                </div>
                
                <div className='bg-amber-50 rounded-lg p-4 border border-amber-200'>
                  <h4 className='font-semibold text-amber-800 mb-2'>Improvements:</h4>
                  <ul className='list-disc list-inside space-y-1 text-sm text-amber-700'>
                    <li>Analyze usage patterns</li>
                    <li>Personalize your experience</li>
                    <li>Improve our website and services</li>
                    <li>Develop new features</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>3. Information Sharing</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                We do not sell, trade, or otherwise transfer your personal information to third parties except as described in this policy.
              </p>
              
              <div className='space-y-4'>
                <div className='border-l-4 border-amber-500 pl-4'>
                  <h4 className='font-semibold text-stone-800 mb-2'>Service Providers:</h4>
                  <p className='text-sm'>
                    We may share information with trusted third parties who assist us in operating our website, conducting business, or serving you (payment processors, shipping companies, etc.).
                  </p>
                </div>
                
                <div className='border-l-4 border-amber-500 pl-4'>
                  <h4 className='font-semibold text-stone-800 mb-2'>Legal Requirements:</h4>
                  <p className='text-sm'>
                    We may disclose information when required by law, to protect our rights, or to comply with legal processes.
                  </p>
                </div>
                
                <div className='border-l-4 border-amber-500 pl-4'>
                  <h4 className='font-semibold text-stone-800 mb-2'>Business Transfers:</h4>
                  <p className='text-sm'>
                    In the event of a merger, acquisition, or sale of assets, customer information may be transferred as part of the transaction.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>4. Cookies and Tracking</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience and analyze site traffic.
              </p>
              
              <div className='bg-stone-50 rounded-lg p-6 border border-stone-200'>
                <h4 className='font-semibold text-stone-800 mb-3'>Types of Cookies We Use:</h4>
                <div className='space-y-3'>
                  <div>
                    <span className='font-medium text-stone-700'>Essential Cookies:</span>
                    <span className='text-sm ml-2'>Required for website functionality</span>
                  </div>
                  <div>
                    <span className='font-medium text-stone-700'>Analytics Cookies:</span>
                    <span className='text-sm ml-2'>Help us understand how visitors use our site</span>
                  </div>
                  <div>
                    <span className='font-medium text-stone-700'>Marketing Cookies:</span>
                    <span className='text-sm ml-2'>Used to show relevant advertisements</span>
                  </div>
                </div>
              </div>
              
              <p className='text-sm'>
                You can control cookies through your browser settings. However, disabling certain cookies may limit your ability to use some features of our website.
              </p>
            </div>
          </section>

          {/* Section 5 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>5. Data Security</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.
              </p>
              
              <div className='grid md:grid-cols-2 gap-6'>
                <div className='space-y-3'>
                  <h4 className='font-semibold text-stone-800'>Technical Safeguards:</h4>
                  <ul className='list-disc list-inside space-y-1 text-sm'>
                    <li>SSL encryption for data transmission</li>
                    <li>Secure server infrastructure</li>
                    <li>Regular security audits</li>
                    <li>Access controls and authentication</li>
                  </ul>
                </div>
                
                <div className='space-y-3'>
                  <h4 className='font-semibold text-stone-800'>Operational Safeguards:</h4>
                  <ul className='list-disc list-inside space-y-1 text-sm'>
                    <li>Employee training on data protection</li>
                    <li>Limited access to personal information</li>
                    <li>Regular backup procedures</li>
                    <li>Incident response protocols</li>
                  </ul>
                </div>
              </div>
              
              <div className='bg-amber-50 rounded-lg p-4 border border-amber-200'>
                <p className='text-amber-800 text-sm'>
                  <strong>Note:</strong> While we strive to protect your information, no method of transmission over the internet is 100% secure. We cannot guarantee absolute security but are committed to protecting your data using industry-standard practices.
                </p>
              </div>
            </div>
          </section>

          {/* Section 6 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>6. Your Rights and Choices</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                You have certain rights regarding your personal information. Here's how you can exercise these rights:
              </p>
              
              <div className='space-y-4'>
                <div className='bg-stone-50 rounded-lg p-4 border border-stone-200'>
                  <h4 className='font-semibold text-stone-800 mb-2'>Access and Update:</h4>
                  <p className='text-sm'>
                    You can access and update your account information by logging into your account or contacting us directly.
                  </p>
                </div>
                
                <div className='bg-stone-50 rounded-lg p-4 border border-stone-200'>
                  <h4 className='font-semibold text-stone-800 mb-2'>Email Communications:</h4>
                  <p className='text-sm'>
                    You can opt out of marketing emails by using the unsubscribe link in our emails or updating your account preferences.
                  </p>
                </div>
                
                <div className='bg-stone-50 rounded-lg p-4 border border-stone-200'>
                  <h4 className='font-semibold text-stone-800 mb-2'>Data Deletion:</h4>
                  <p className='text-sm'>
                    You can request deletion of your personal information, subject to certain legal and operational requirements.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 7 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>7. Children's Privacy</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
              <p>
                If we become aware that we have collected personal information from a child under 13, we will take steps to delete such information from our records.
              </p>
            </div>
          </section>

          {/* Section 8 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>8. International Users</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                If you are accessing our services from outside [Your Country], please note that your information may be transferred to, stored, and processed in [Your Country] where our servers are located.
              </p>
              <p>
                By using our services, you consent to the transfer of your information to our facilities and those third parties with whom we share it as described in this policy.
              </p>
            </div>
          </section>

          {/* Section 9 */}
          <section className='bg-white rounded-2xl p-8 shadow-lg border border-stone-200'>
            <h2 className='text-3xl font-bold text-stone-800 mb-6'>9. Changes to This Policy</h2>
            <div className='space-y-4 text-stone-600 leading-relaxed'>
              <p>
                We may update this privacy policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date.
              </p>
              <p>
                We encourage you to review this policy periodically to stay informed about how we are protecting your information.
              </p>
            </div>
          </section>

        </div>

        {/* Contact Section */}
        <div className='bg-gradient-to-r from-amber-700 to-amber-800 rounded-3xl p-8 text-white mt-16 text-center'>
          <h3 className='text-2xl font-bold mb-4'>Questions About Your Privacy?</h3>
          <p className='text-amber-100 mb-6'>
            If you have any questions about this Privacy Policy or our data practices, please contact us.
          </p>
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <a 
              href="mailto:privacy@solemate.com" 
              className='bg-white text-amber-700 font-semibold py-3 px-6 rounded-lg hover:bg-amber-50 transition-colors duration-200'
            >
              Contact Privacy Team
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

export default Privacy;