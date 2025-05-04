import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from './api';

const BillPage = () => {
  const { billNumber } = useParams();
  const [billDetails, setBillDetails] = useState(null);
  const [cosponsors, setCosponsors] = useState([]);
  const [sponsors, setSponsors] = useState([]);

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
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');
  const partyColor = () => {
    return "#0f0f0f"; // Default color
  };

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const res = await api.get(`/bill/${billNumber}`)
        setBillDetails(res.data.bill);
      } catch (err) {
        console.error('Failed to fetch bill:', err);
      }
    };


    fetchBill();
  }, [billNumber]);

  useEffect(() => {
    
    const fetchSponsors = async () => {
      try {
        const res = await api.get(`/cosponsors/${billNumber}`)
        const cosponsorIDs = res.data.cosponsors.map((cosponsor) => cosponsor.bioguideId);

        const params = new URLSearchParams();
        cosponsorIDs.forEach(id => params.append("bioguideList", id));
        
        const resBulk = await api.get(`bulk/member?${params.toString()}`);
        console.log(resBulk.data.members);
        setCosponsors(resBulk.data.members);
        const sponsorIDs = [];
        console.log(billDetails?.sponsors);
        billDetails?.sponsors.map((sponsor) => {
          sponsorIDs.push(sponsor.bioguideId);
        });
        console.log(sponsorIDs);
        const params2 = new URLSearchParams();
        sponsorIDs.forEach(id => params2.append("bioguideList", id));
        const resBulk2 = await api.get(`bulk/member?${params2.toString()}`);
        console.log(resBulk2.data.members);
        setSponsors(resBulk2.data.members);

      } catch (err) {
        console.error('Failed to fetch cosponsors:', err);
      }
    };
    fetchSponsors();

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
        <div style={{ flex: '1 1 300px', margin: '0 auto' }}>
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
  <div style={{ padding: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
    <div
      style={{
        flex: 1,
        minWidth: '300px',
        maxHeight: bioHeight ? `${bioHeight - 70}px` : 'unset',
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#fff',
      }}
    >
      <h2>Sponsors</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sponsors.map((cardInf) => {
          const member = cardInf.member;
          const name = member.invertedOrdername;
          const phone = member?.addressInformation?.phoneNumber || "N/A";
          member.partyName = member.partyHistory[0].partyName;
          const partyColor = member.partyName.includes("Republican")
            ? "rgb(179, 25, 25)"
            : member.partyName.includes("Democrat")
            ? "rgb(25, 79, 179)"
            : "rgb(25, 179, 25)";

          return (
            <a href={`/members/${member.bioguideId}/reps`} key={member.bioguideId}>
              <li
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  color: "black",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = partyColor;
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateX(-10px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "black";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <img
                  src={member.depiction?.imageUrl}
                  alt={name}
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3>{name}</h3>
                  <p><strong>Party:</strong> {member.partyName}</p>
                  {member.district && <p><strong>District:</strong> {member.district}</p>}
                  <p><strong>Chamber:</strong> {member.terms?.item?.[0]?.chamber}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                </div>
              </li>
            </a>
          );
        })}
      </ul>
    </div>

    <div
      style={{
        flex: 1,
        minWidth: '300px',
        maxHeight: bioHeight ? `${bioHeight - 70}px` : 'unset',
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '16px',
        backgroundColor: '#fff',
      }}
    >
      <h2>Cosponsors</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {cosponsors.map((cardInf) => {
          const member = cardInf.member;
          const name = member.invertedOrdername;
          const phone = member?.addressInformation?.phoneNumber || "N/A";
          member.partyName = member.partyHistory[0].partyName;
          const partyColor = member.partyName.includes("Republican")
            ? "rgb(179, 25, 25)"
            : member.partyName.includes("Democrat")
            ? "rgb(25, 79, 179)"
            : "rgb(25, 179, 25)";

          return (
            <a href={`/members/${member.bioguideId}/reps`} key={member.bioguideId}>
              <li
                style={{
                  marginBottom: "16px",
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "12px",
                  padding: "16px",
                  borderRadius: "8px",
                  color: "black",
                  position: "relative",
                  overflow: "hidden",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = partyColor;
                  e.currentTarget.style.color = "white";
                  e.currentTarget.style.transform = "translateX(-10px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "black";
                  e.currentTarget.style.transform = "translateX(0)";
                }}
              >
                <img
                  src={member.depiction?.imageUrl}
                  alt={name}
                  style={{
                    width: "100%",
                    maxWidth: "200px",
                    height: "auto",
                    objectFit: "cover",
                    borderRadius: "8px",
                  }}
                />
                <div style={{ flex: "1", minWidth: "200px" }}>
                  <h3>{name}</h3>
                  <p><strong>Party:</strong> {member.partyName}</p>
                  {member.district && <p><strong>District:</strong> {member.district}</p>}
                  <p><strong>Chamber:</strong> {member.terms?.item?.[0]?.chamber}</p>
                  <p><strong>Phone:</strong> {phone}</p>
                </div>
              </li>
            </a>
          );
        })}
      </ul>
    </div>
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
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    {showRatingForm ? (
                      <div style={{
                        backgroundColor: '#f4f4f4',
                        padding: '16px',
                        borderRadius: '8px',
                        margin: '0 auto',
                        textAlign: 'left'
                      }}>
                        <div style={{ marginBottom: '12px' }}>
                          <label>Name:<br />
                            <input
                              type="text"
                              value={newName}
                              onChange={(e) => setNewName(e.target.value)}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                          </label>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <label>Review:<br />
                            <textarea
                              value={newText}
                              onChange={(e) => setNewText(e.target.value)}
                              rows={3}
                              style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                            />
                          </label>
                        </div>
                        <div style={{ marginBottom: '12px' }}>
                          <label>Rating:
                            <select
                              value={newRating}
                              onChange={(e) => setNewRating(parseInt(e.target.value))}
                              style={{ marginLeft: '12px', padding: '4px', borderRadius: '4px' }}
                            >
                              {[5, 4, 3, 2, 1].map((star) => (
                                <option key={star} value={star}>{star} ★</option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <button
                            onClick={() => {
                              setShowRatingForm(false);
                              setNewName('');
                              setNewText('');
                              setNewRating(5);
                            }}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: '#ccc',
                              color: 'black',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              if (newName && newText) {
                                comments.unshift({
                                  name: newName,
                                  rating: newRating,
                                  text: newText
                                });
                                ratings.push(newRating);
                                setNewName('');
                                setNewText('');
                                setNewRating(5);
                                setShowRatingForm(false);
                              } else {
                                alert('Please fill out all fields');
                              }
                            }}
                            style={{
                              padding: '8px 16px',
                              backgroundColor: partyColor(),
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            Submit
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowRatingForm(true)}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: partyColor(),
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          fontWeight: 'bold',
                          cursor: 'pointer'
                        }}
                      >
                        Add Your Rating
                      </button>
                    )}
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
