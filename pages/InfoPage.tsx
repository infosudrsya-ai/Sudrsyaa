
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const FLOWERS = ['🌸', '🌺', '🌻', '🌼', '🌷', '🥀'];

const InfoPage: React.FC = () => {
  const { type } = useParams();
  const [content, setContent] = useState<any>(null);

  useEffect(() => {
    // Generate flowers
    const container = document.body;
    for (let i = 0; i < 40; i++) {
      const flower = document.createElement('div');
      flower.className = 'flower';
      flower.innerText = FLOWERS[Math.floor(Math.random() * FLOWERS.length)];
      flower.style.left = Math.random() * 100 + 'vw';
      flower.style.fontSize = Math.random() * 20 + 20 + 'px';
      flower.style.animationDuration = Math.random() * 3 + 4 + 's';
      flower.style.animationDelay = Math.random() * 5 + 's';
      container.appendChild(flower);
      
      setTimeout(() => {
        flower.remove();
      }, 10000);
    }

    // Set detailed content
    switch (type) {
      case 'terms':
        setContent({
          title: '📜 TERMS AND CONDITIONS',
          sections: [
            { h: '1. Introduction', p: 'Welcome to Sudrsya (“we”, “our”, “us”). By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions. If you do not agree, you must not use this website.' },
            { p: 'This website is operated as a product showcase platform, and orders are finalized via WhatsApp communication.' },
            { h: '2. Nature of Business', p: 'We do not provide online payment checkout on the website. Products displayed are for catalog and marketing purposes only. Placing products in the cart and clicking “Proceed” redirects the customer to WhatsApp to complete the order.' },
            { h: '3. Product Information', p: 'All product descriptions, images, prices, availability, and offers are provided to the best of our knowledge. Slight variations in color, design, or appearance may occur due to lighting, photography, or screen resolution. Jewellery and sarees are handcrafted/traditional items, and minor variations are not considered defects.' },
            { h: '4. Pricing & Offers', p: 'Prices are displayed in Indian Rupees (INR). Promotional offers such as Buy 2 Get 1 Free apply only to eligible categories and same-category products. Offers are subject to availability and may be modified or withdrawn without prior notice.' },
            { h: '5. Order Confirmation', p: 'Orders are considered confirmed only after WhatsApp confirmation from our team. We reserve the right to accept or reject any order at our discretion.' },
            { h: '6. Intellectual Property', p: 'All content on this website, including images, text, logos, and designs, is the exclusive property of Sudrsya and may not be copied, reproduced, or misused without written permission.' },
            { h: '7. Limitation of Liability', p: 'We shall not be liable for: Delays caused by courier partners, Incorrect information provided by customers, or Any indirect or consequential loss.' },
            { h: '8. Governing Law', p: 'These Terms shall be governed and interpreted in accordance with the laws of India, and courts located in our jurisdiction shall have exclusive jurisdiction.' }
          ]
        });
        break;
      case 'privacy':
        setContent({
          title: '🔐 PRIVACY POLICY',
          sections: [
            { h: '1. Information We Collect', p: 'We may collect: Name, Phone number, WhatsApp contact details, Delivery address, Order-related communication. We do not collect or store payment details.' },
            { h: '2. Use of Information', p: 'Your information is used solely to: Process and confirm orders, Communicate order updates, Improve customer experience, and Maintain internal analytics.' },
            { h: '3. Data Storage', p: 'Product and analytics data are stored securely using cloud infrastructure. Customer communication is handled via WhatsApp and is not shared with third parties.' },
            { h: '4. Data Protection', p: 'We implement reasonable security practices to safeguard your personal information. However, no digital transmission is 100% secure.' },
            { h: '5. Third-Party Services', p: 'We may use third-party services for Image hosting, Analytics, and Communication. These services have their own privacy policies.' }
          ]
        });
        break;
      case 'shipping':
        setContent({
          title: '🚚 SHIPPING & DELIVERY POLICY',
          sections: [
            { h: '1. Shipping Coverage', p: 'We currently ship across India.' },
            { h: '2. Shipping Charges', p: 'Orders ₹399 and above: FREE SHIPPING. Orders below ₹399: ₹60 per order.' },
            { h: '3. Delivery Timeline', p: 'Orders are usually delivered within 5–7 working days. Delivery timelines may vary based on location, courier delays, or unforeseen circumstances.' },
            { h: '4. Dispatch', p: 'Orders are dispatched only after confirmation via WhatsApp.' },
            { h: '5. Delivery Responsibility', p: 'Once the order is handed over to the courier partner, delivery timelines are subject to their operations.' }
          ]
        });
        break;
      case 'returns':
        setContent({
          title: '🔄 RETURNS & EXCHANGE POLICY',
          sections: [
            { h: '1. No Returns on Jewellery', p: 'Due to the personal and hygienic nature of jewellery, we do not accept returns unless the product is damaged or incorrect.' },
            { h: '2. Saree Returns', p: 'Returns/exchanges for sarees are allowed only if the product is damaged or an incorrect item is delivered.' },
            { h: '3. Reporting an Issue', p: 'Issues must be reported within 24 hours of delivery. An unboxing video is mandatory for verification.' },
            { h: '4. Conditions for Exchange', p: 'Product must be unused, and original packaging and tags must be intact. Exchange approval is subject to inspection.' },
            { h: '5. Non-Returnable Items', p: 'Customized items, Products bought during clearance or special sale, and Free items received under offers.' }
          ]
        });
        break;
      case 'faq':
        setContent({
          title: '❓ FREQUENTLY ASKED QUESTIONS (FAQ)',
          faqs: [
            { q: 'Q1. How do I place an order?', a: 'Add products to your cart and click Proceed. You will be redirected to WhatsApp with a pre-filled message.' },
            { q: 'Q2. Is online payment available?', a: 'No. Payments are handled directly via WhatsApp after order confirmation.' },
            { q: 'Q3. How long does delivery take?', a: 'Delivery usually takes 5–7 working days after dispatch.' },
            { q: 'Q4. Is Buy 2 Get 1 Free available on all products?', a: 'No. The offer applies only to selected jewellery categories and same-category items. Sarees are excluded.' },
            { q: 'Q5. Can I cancel my order?', a: 'Orders can be cancelled only before dispatch. Once shipped, cancellation is not possible.' },
            { q: 'Q6. How can I contact support?', a: 'You can reach us via WhatsApp: +91 6264747608' }
          ]
        });
        break;
      case 'about':
        setContent({
          title: 'About Sudrsya',
          sections: [{ p: 'Sudrsya is a luxury heritage atelier dedicated to preserving the ancient arts of Indian craftsmanship. From handwoven silk sarees to meticulously handcrafted temple jewellery, every piece in our collection is a testament to timeless elegance and cultural depth. Founded on the principles of authenticity and grace, we bridge the gap between ancestral tradition and contemporary lifestyle.' }]
        });
        break;
      case 'contact':
        setContent({
          title: 'Contact Us',
          sections: [
            { h: 'Connect with the Sudrsya Atelier', p: 'Our personal consultants are available Monday to Saturday, 10:30 AM to 6:30 PM. For immediate inquiries regarding order status or bespoke design consultations, reach out to us at +91 6264747608 or email support@alankara.co.in.' }
          ]
        });
        break;
      default:
        setContent({ title: 'Information Page', sections: [{ p: 'This page is currently being curated.' }] });
    }
  }, [type]);

  if (!content) return null;

  return (
    <div className="min-h-screen bg-white py-24 px-6 md:px-12 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <h1 className="text-4xl md:text-5xl font-serif text-maroon font-bold mb-10 text-center animate-fadeIn">
          {content.title}
        </h1>
        <div className="w-24 h-1 bg-gold mx-auto mb-16 rounded-full"></div>
        
        <div className="space-y-12 animate-fadeIn delay-300">
          {content.sections && content.sections.map((s: any, i: number) => (
            <div key={i} className="space-y-4">
              {s.h && <h2 className="text-2xl font-serif font-bold text-gray-900">{s.h}</h2>}
              <p className="text-lg text-gray-700 leading-relaxed font-serif italic">{s.p}</p>
            </div>
          ))}

          {content.faqs && content.faqs.map((f: any, i: number) => (
            <div key={i} className="bg-gray-50 p-8 rounded-[2rem] border border-gray-100 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900 mb-4">{f.q}</h3>
              <p className="text-lg text-gray-600 font-serif italic">{f.a}</p>
            </div>
          ))}
        </div>
      </div>
      
      <style>{`
        .delay-300 { animation-delay: 0.3s; }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default InfoPage;
