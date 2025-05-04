import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from './api';
import axios from 'axios';
const RepPage = () => {
  const ratings = [5, 4, 4, 3, 5, 2, 5, 4];
  const avg = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
  const comments = [
    { name: "Alex P.", rating: 5, text: "Always supports strong policy!" },
    { name: "Jordan M.", rating: 4, text: "Generally good rep, some missed votes." },
    { name: "Taylor S.", rating: 2, text: "Not responsive to constituent concerns." },
    { name: "Morgan K.", rating: 5, text: "Excellent communication with the community." },
    { name: "Chris R.", rating: 3, text: "Mixed record on environmental issues." },
    { name: "Riley T.", rating: 4, text: "Good on healthcare, not great on tech." },
    { name: "Casey L.", rating: 1, text: "Does not represent our district well." },
    { name: "Devon W.", rating: 5, text: "Always votes in our best interest!" },
    { name: "Jesse B.", rating: 4, text: "Solid voting record and transparency." },
    { name: "Dana S.", rating: 2, text: "Seems out of touch with local concerns." },
    { name: "Skyler V.", rating: 3, text: "Average performance, could improve." },
    { name: "Sam G.", rating: 5, text: "Top-notch representative!" },
    { name: "Jamie N.", rating: 4, text: "Supportive of progressive policy." },
    { name: "Robin Z.", rating: 1, text: "Never replies to emails or calls." },
    { name: "Quinn D.", rating: 2, text: "Votes against majority interest." },
  ];
  
  const { bioguideId } = useParams();
  const [sponsorBills, setSponsorBills] = useState([]);
  const [cosponsorBills, setCosponsorBills] = useState([]);
  const [memberDetails, setMemberDetails] = useState(null);
  const [bioHeight, setBioHeight] = useState(null);
  const [activeTab, setActiveTab] = useState('comments');
  const [showRatingForm, setShowRatingForm] = useState(false);
  const [newRating, setNewRating] = useState(5);
  const [newName, setNewName] = useState('');
  const [newText, setNewText] = useState('');

  const bioRef = useRef(null);
  const apiKey = import.meta.env.VITE_REACT_APP_CONGRESS_API_KEY;

  const partyColor = (memberDetails) => {
    return memberDetails?.partyHistory?.[0]?.partyName.includes('Republican')
      ? 'rgb(179, 25, 25)'
      : memberDetails?.partyHistory?.[0]?.partyName.includes('Democrat')
      ? 'rgb(25, 79, 179)'
      : 'rgb(25, 179, 25)';
  };

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const res = await api.get(`/member/${bioguideId}`)
        setMemberDetails(res.data.member);
      } catch (error) {
        console.error('Error fetching member details:', error);
      }
    };

    const fetchSponsorBills = async () => {
      try {
        const res = await api.get(`/sponsorbills/${bioguideId}`)
        setSponsorBills(res.data.sponsoredLegislation || []);
      } catch (error) {
        console.error('Error fetching sponsor bills:', error);
      }
    };

    const fetchCosponsorBills = async () => {
      try {
        const res = await api.get(`/cosponsorbills/${bioguideId}`)
        setCosponsorBills(res.data.cosponsoredLegislation || []);
      } catch (error) {
        console.error('Error fetching cosponsor bills:', error);
      }
    };

    fetchMemberDetails();
    fetchSponsorBills();
    fetchCosponsorBills();
  }, [bioguideId]);

  useEffect(() => {
    if (!bioRef.current) return;

    const observer = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setBioHeight(entry.contentRect.height);
      }
    });

    observer.observe(bioRef.current);
    return () => observer.disconnect();
  }, [memberDetails]);

  return (
    <div style={{ width: '100%', backgroundColor: '#f9f9f9' }}>
      {/* Logo Header */}
      <div style={{ display: 'flex' }}>
        <a href="/" style={{ marginRight: 'auto' }}>
          <img
            src="/RMRlogo.png"
            alt="RateMyRep Logo"
            style={{ width: '150px', paddingLeft: '32px', paddingTop: '24px' }}
          />
        </a>
      </div>

      {/* Main Content Area */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          padding: '24px',
          gap: '24px',
          justifyContent: 'center',
        }}
      >
        {/* Bio Card */}
        <div style={{ flex: '1 1 300px', maxWidth: '350px', margin: '0 auto' }}>
          {memberDetails && (
            <div
              ref={bioRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                boxShadow: '0 0 8px rgba(0,0,0,0.05)',
                backgroundColor: memberDetails.partyHistory?.[0]?.partyName.includes('Republic')
                  ? '#fff0f0'
                  : memberDetails.partyHistory?.[0]?.partyName.includes('Democrat')
                  ? '#f0f0ff'
                  : '#f0fff0',
                borderRadius: '8px',
              }}
            >
              {/* Tab Selector */}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  borderBottom: '1px solid #ccc',
                  backgroundColor: '#fafafa',
                  borderRadius: '8px 8px 0 0',
                }}
              >
                {['bills', 'comments'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      cursor: 'pointer',
                      backgroundColor: activeTab === tab ? '#fff' : 'transparent',
                      border: 'none',
                      borderBottom:
                        activeTab === tab ? `3px solid ${partyColor(memberDetails)}` : '3px solid transparent',
                      fontWeight: activeTab === tab ? 'bold' : 'normal',
                      transition: 'all 0.2s ease-in-out',
                    }}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </div>

              {/* Bio Content */}
              <img
                src={memberDetails.depiction?.imageUrl}
                alt={memberDetails.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  objectFit: 'cover',
                }}
              />
              <h2 style={{ paddingLeft: '16px' }}>{memberDetails.directOrderName}</h2>
              <div style={{ textAlign: 'left', paddingLeft: '16px', paddingBottom: '16px' }}>
                <p><strong>Party:</strong> {memberDetails.partyHistory?.[0]?.partyName}</p>
                <p><strong>Chamber:</strong> {memberDetails.terms?.[0]?.chamber}</p>
                <p><strong>District:</strong> {memberDetails.district}</p>
                <p>
                  <strong>Website:</strong>{' '}
                  <a href={memberDetails.officialWebsiteUrl} target="_blank" rel="noopener noreferrer">
                    {memberDetails.officialWebsiteUrl}
                  </a>
                </p>
                <p><strong>Phone:</strong> {memberDetails.addressInformation?.phoneNumber}</p>
                <p><strong>Office:</strong> {memberDetails.addressInformation?.officeAddress}, {memberDetails.addressInformation?.city} {memberDetails.addressInformation?.zipCode}</p>
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div style={{ flex: '2 1 600px' }}>
          {activeTab === 'bills' && (
            <div
              style={{
                display: 'flex',
                gap: '24px',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}
            >
              {/* Sponsored Bills */}
              <div style={{ flex: '1 1 300px', minWidth: '280px', margin: '0 auto' }}>
                <h2>Sponsored Bills</h2>
                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: bioHeight ? `${bioHeight - 70}px` : 'unset',
                    transition: 'max-height 0.4s ease-in-out',
                  }}
                >
                  <ul style={{ listStyle: 'none', textAlign: 'left', paddingLeft: '16px' }}>
                    {sponsorBills.map((bill, index) => (
                      <li
                        key={index}
                        style={{
                          marginBottom: '8px',
                          padding: '12px',
                          backgroundColor: '#e0e0e0',
                          borderRadius: '8px',
                          transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                          cursor: "pointer", // Change cursor to pointer on hover
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.querySelector('.bill-title').style.color = 'rgb(255, 255, 255)';
                          e.currentTarget.style.backgroundColor = partyColor(memberDetails);
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(-10px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.querySelector('.bill-title').style.color = partyColor(memberDetails);
                          e.currentTarget.style.backgroundColor = '#e0e0e0';
                          e.currentTarget.style.color = 'black';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <p
                          style={{ fontWeight: 'bold', color: partyColor(memberDetails) }}
                          className="bill-title"
                        >
                          {bill.title} ({bill.congress}th Congress)
                        </p>
                        <p><strong>Policy Area:</strong> {bill.policyArea?.name || 'N/A'}</p>
                        <p><strong>Latest Action:</strong> {bill.latestAction?.text || 'N/A'}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Cosponsored Bills */}
              <div style={{ flex: '1 1 300px', minWidth: '280px', margin: '0 auto' }}>
                <h2>Cosponsored Bills</h2>
                <div
                  style={{
                    overflowY: 'auto',
                    maxHeight: bioHeight ? `${bioHeight - 70}px` : 'unset',
                    transition: 'max-height 0.4s ease-in-out',
                  }}
                >
                  <ul style={{ listStyle: 'none', textAlign: 'left', paddingLeft: '16px' }}>
                    {cosponsorBills.map((bill, index) => (
                      <li
                        key={index}
                        onClick={() => {
                          console.log(bill);
                          try {
                            axios.get(bill.url, {
                              params: { api_key: apiKey },
                            }).then((response) => {
                              console.log('Bill Details:', response.data);
                            });
                          } catch (error) {
                            console.error('Err:', error);
                          }
                        }}
                        style={{
                          marginBottom: '8px',
                          padding: '12px',
                          backgroundColor: '#e0e0e0',
                          borderRadius: '8px',
                          transition: 'transform 0.3s ease, background-color 0.3s ease, color 0.3s ease',
                          cursor: "pointer", // Change cursor to pointer on hover
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.querySelector('.bill-title').style.color = 'rgb(255, 255, 255)';
                          e.currentTarget.style.backgroundColor = partyColor(memberDetails);
                          e.currentTarget.style.color = 'white';
                          e.currentTarget.style.transform = 'translateX(-10px)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.querySelector('.bill-title').style.color = partyColor(memberDetails);
                          e.currentTarget.style.backgroundColor = '#e0e0e0';
                          e.currentTarget.style.color = 'black';
                          e.currentTarget.style.transform = 'translateX(0)';
                        }}
                      >
                        <p
                          style={{ fontWeight: 'bold', color: partyColor(memberDetails) }}
                          className="bill-title"
                        >
                          {bill.title} ({bill.congress}th Congress)
                        </p>
                        <p><strong>Policy Area:</strong> {bill.policyArea?.name || 'N/A'}</p>
                        <p><strong>Latest Action:</strong> {bill.latestAction?.text || 'N/A'}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
              {(() => {

                const distribution = [1, 2, 3, 4, 5].map((star) => ({
                  star,
                  count: ratings.filter((r) => r === star).length,
                }));


                return (
                  <>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                      <h2 style={{ marginBottom: '8px' }}>Rating: {avg}/5</h2>
                      <div style={{ fontSize: '24px', color: '#f1c40f' }}>
                        {'★'.repeat(Math.round(avg))}{'☆'.repeat(5 - Math.round(avg))}
                      </div>
                      <p style={{ color: '#666' }}>{ratings.length} ratings submitted</p>
                    </div>

                    <div style={{ marginBottom: '32px' }}>
                      {distribution.reverse().map(({ star, count }) => (
                        <div key={star} style={{ display: 'flex', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ width: '40px' }}>{star}★</span>
                          <div style={{
                            flex: 1,
                            background: '#ddd',
                            borderRadius: '4px',
                            height: '12px',
                            margin: '0 8px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              width: `${(count / ratings.length) * 100}%`,
                              background: '#4CAF50',
                              height: '100%'
                            }} />
                          </div>
                          <span style={{ width: '24px' }}>{count}</span>
                        </div>
                      ))}
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
                              backgroundColor: partyColor(memberDetails),
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
                          backgroundColor: partyColor(memberDetails),
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


                    <div style={{ overflowY: 'auto', marginBottom: '32px', maxHeight: bioHeight ? `${bioHeight - 70}px` : 'unset'}}>
                      <h3>Reviews</h3>
                      {comments.map((comment, i) => (
                        <div key={i} style={{
                          backgroundColor: '#f4f4f4',
                          padding: '12px 16px',
                          borderRadius: '8px',
                          marginBottom: '12px'
                        }}>
                          <strong>{comment.name}</strong> – {Array(comment.rating).fill('★').join('')}
                          <p style={{ marginTop: '6px' }}>{comment.text}</p>
                        </div>
                      ))}
                    </div>


                  </>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RepPage;
