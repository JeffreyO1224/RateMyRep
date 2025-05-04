import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const BillPage = () => {
  const { billNumber } = useParams();
  const [billDetails, setBillDetails] = useState(null);
  const [cosponsors, setCosponsors] = useState([]);
  const [activeTab, setActiveTab] = useState('comments');
  const [bioHeight, setBioHeight] = useState(null);
  const bioRef = useRef(null);

  const ratings = [5, 4, 4, 3, 5, 2, 5, 4];
  const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const comments = [
    { name: "Cameron H.", rating: 5, text: "Much-needed protection for seniors." },
    { name: "Leslie R.", rating: 3, text: "Decent intent but needs improvement." },
    { name: "Jamie L.", rating: 4, text: "Glad to see bipartisan support." },
    { name: "Reese M.", rating: 2, text: "Not comprehensive enough." },
    { name: "Robin A.", rating: 5, text: "Finally a bill that addresses real needs." },
  ];

  const apiKey = import.meta.env.VITE_REACT_APP_CONGRESS_API_KEY;

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await axios.get(`https://api.congress.gov/v3/bill/119/hr/${billNumber}`, {
          params: { api_key: apiKey },
        });
        setBillDetails(res.data.bill);
      } catch (err) {
        console.error('Failed to fetch bill:', err);
      }
    };

    const fetchCosponsors = async () => {
      try {
        const res = await axios.get(`https://api.congress.gov/v3/bill/119/hr/${billNumber}/cosponsors`, {
          params: { api_key: apiKey },
        });
        setCosponsors(res.data.cosponsors || []);
      } catch (err) {
        console.error('Failed to fetch cosponsors:', err);
      }
    };

    fetchBill();
    fetchCosponsors();
  }, [billNumber]);

  useEffect(() => {
    if (!bioRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setBioHeight(entry.contentRect.height);
      }
    });
    observer.observe(bioRef.current);
    return () => observer.disconnect();
  }, [billDetails]);

  return (
    <div style={{ width: '100%', backgroundColor: '#f9f9f9' }}>
      <div style={{ display: 'flex' }}>
        <a href="/" style={{ marginRight: 'auto' }}>
          <img
            src="/RMRlogo.png"
            alt="RateMyRep Logo"
            style={{ width: '150px', paddingLeft: '32px', paddingTop: '24px' }}
          />
        </a>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', padding: '24px', gap: '24px', justifyContent: 'center' }}>
        <div style={{ flex: '1 1 300px', maxWidth: '350px', margin: '0 auto' }}>
          {billDetails && (
            <div
              ref={bioRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                boxShadow: '0 0 8px rgba(0,0,0,0.05)',
                backgroundColor: '#fff',
                borderRadius: '8px',
              }}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                borderBottom: '1px solid #ccc',
                backgroundColor: '#fafafa',
                borderRadius: '8px 8px 0 0',
              }}>
                {['sponsors', 'comments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      cursor: 'pointer',
                      backgroundColor: activeTab === tab ? '#fff' : 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab ? '3px solid #444' : '3px solid transparent',
                      fontWeight: activeTab === tab ? 'bold' : 'normal',
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              <div style={{ padding: '16px' }}>
                <h2>{billDetails.title}</h2>
                <p><strong>Bill Number:</strong> {billDetails.number}</p>
                <p><strong>Introduced:</strong> {billDetails.introducedDate}</p>
                <p><strong>Latest Action:</strong> {billDetails.latestAction?.text}</p>
                <p><strong>Chamber:</strong> {billDetails.originChamber}</p>
                <p><strong>Congress:</strong> {billDetails.congress}</p>
              </div>
            </div>
          )}
        </div>

        <div style={{ flex: '2 1 600px' }}>
          {activeTab === 'sponsors' && (
            <div style={{ padding: '16px' }}>
              <h2>Sponsors</h2>
              <ul>
                {billDetails?.sponsors.map((s, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <strong>{s.fullName}</strong> ({s.party}-{s.state}) - District {s.district}
                  </li>
                ))}
              </ul>

              <h2>Cosponsors</h2>
              <ul>
                {cosponsors.map((c, i) => (
                  <li key={i} style={{ marginBottom: '8px' }}>
                    <strong>{c.fullName}</strong> ({c.party}-{c.state})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'comments' && (
            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <h2>Rating: {avg}/5</h2>
                <div style={{ fontSize: '24px', color: '#f1c40f' }}>
                  {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
                </div>
                <p style={{ color: '#666' }}>{ratings.length} ratings submitted</p>
              </div>

              <div style={{ marginBottom: '32px' }}>
                {[5, 4, 3, 2, 1].map(star => {
                  const count = ratings.filter(r => r === star).length;
                  return (
                    <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                      <span style={{ width: '40px' }}>{star}★</span>
                      <div style={{ flex: 1, background: '#ddd', borderRadius: '4px', height: '12px', margin: '0 8px' }}>
                        <div style={{ width: `${(count / ratings.length) * 100}%`, background: '#4CAF50', height: '100%' }} />
                      </div>
                      <span style={{ width: '24px' }}>{count}</span>
                    </div>
                  );
                })}
              </div>

              <div style={{ overflowY: 'auto', marginBottom: '32px', maxHeight: bioHeight ? `${bioHeight - 70}px` : 'unset' }}>
                <h3>Reviews</h3>
                {comments.map((comment, i) => (
                  <div key={i} style={{ backgroundColor: '#f4f4f4', padding: '12px 16px', borderRadius: '8px', marginBottom: '12px' }}>
                    <strong>{comment.name}</strong> – {Array(comment.rating).fill('★').join('')}
                    <p style={{ marginTop: '6px' }}>{comment.text}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BillPage;
