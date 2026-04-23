import '../styles/Offers.css';

interface OfferData {
  id: number;
  icon: string;
  title: string;
  description: string;
  discount: string;
  code: string;
  validity: string;
}

const OFFERS: OfferData[] = [
  {
    id: 1,
    icon: '🎉',
    title: 'Super Offer',
    description: 'Get up to 30% OFF on your first booking',
    discount: '30%',
    code: 'FIRST30',
    validity: 'Valid till 31 Dec 2026'
  },
  {
    id: 2,
    icon: '💰',
    description: 'not Earn $500 Cashback on bookings above $2000',
    title: 'Cashback Offer',
    discount: '$500',
    code: 'CASHBACK500',
    validity: 'Valid till 30 Dec 2026'
  },
  {
    id: 3,
    icon: '🎁',
    title: 'Free Upgrade',
    description: 'Free AC seat upgrade on selected buses',
    discount: 'FREE',
    code: 'FREEAC',
    validity: 'Valid till 15 Dec 2026'
  },
  {
    id: 4,
    icon: '👥',
    title: 'Group Discount',
    description: 'Get 20% OFF when booking for 5+ people',
    discount: '20%',
    code: 'GROUP20',
    validity: 'Valid till 31 Dec 2026'
  },
  {
    id: 5,
    icon: '🎓',
    title: 'Student Special',
    description: 'Exclusive 25% discount for students with valid ID',
    discount: '25%',
    code: 'STUDENT25',
    validity: 'Valid till 31 Jan 2027'
  },
  {
    id: 6,
    icon: '🚌',
    title: 'Weekend Bonanza',
    description: 'Extra 15% OFF on weekend bookings',
    discount: '15%',
    code: 'WEEKEND15',
    validity: 'Valid till 25 Dec 2026'
  }
];

export default function Offers() {
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert(`Coupon code "${code}" copied to clipboard!`);
  };

  return (
    <div className="offers-page">
      <div className="offers-header">
        <h1>🎊 Amazing Offers & Deals</h1>
        <p>Discover the best discounts on bus tickets</p>
      </div>

      <div className="offers-grid">
        {OFFERS.map(offer => (
          <div key={offer.id} className="offer-item">
            <div className="offer-icon">{offer.icon}</div>
            <h3>{offer.title}</h3>
            <p className="offer-description">{offer.description}</p>
            <div className="offer-details">
              <span className="discount-badge">{offer.discount}</span>
              <div className="offer-code">
                <input 
                  type="text" 
                  value={offer.code} 
                  readOnly 
                  className="code-input"
                />
                <button 
                  className="copy-btn"
                  onClick={() => copyCode(offer.code)}
                >
                  Copy
                </button>
              </div>
            </div>
            <p className="validity">{offer.validity}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
