import { useParams } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';

const BillsPage = () => {
  const { bioguideId } = useParams();
  const [sponsorBills, setSponsorBills] = useState([]);
  const [cosponsorBills, setCosponsorBills] = useState([]);
  const [memberDetails, setMemberDetails] = useState(null);
  const [bioHeight, setBioHeight] = useState(null);
  const bioRef = useRef(null);
  const apiKey = import.meta.env.VITE_REACT_APP_CONGRESS_API_KEY;
  
  const partyColor = (memberDetails) =>{
    return memberDetails.partyHistory?.[0]?.partyName.includes("Republican") 
                      ? "rgb(179, 25, 25)" 
                      : (memberDetails.partyHistory?.[0]?.partyName.includes("Democrat") 
                      ? "rgb(25, 79, 179)" 
                      : "rgb(25, 179, 25)");
  };

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        const res = await axios.get(`https://api.congress.gov/v3/member/${bioguideId}`, {
          params: { api_key: apiKey },
        });
        setMemberDetails(res.data.member);
      } catch (error) {
        console.error('Error fetching member details:', error);
      }
    };

    const fetchSponsorBills = async () => {
      try {
        const res = await axios.get(
          `https://api.congress.gov/v3/member/${bioguideId}/sponsored-legislation`,
          { params: { api_key: apiKey } }
        );
        setSponsorBills(res.data.sponsoredLegislation || []);
      } catch (error) {
        console.error('Error fetching sponsor bills:', error);
      }
    };

    const fetchCosponsorBills = async () => {
      try {
        const res = await axios.get(
          `https://api.congress.gov/v3/member/${bioguideId}/cosponsored-legislation`,
          { params: { api_key: apiKey } }
        );
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
        <div style={{ flex: '1 1 300px', maxWidth: '350px', margin: '0 auto' }} >
          {memberDetails && (
            <div
            ref={bioRef}
              style={{
                display: 'flex',
                flexDirection: 'column',
                border: '1px solid #ccc',
                borderRadius: '8px 8px 0 0',
                boxShadow: '0 0 8px rgba(0,0,0,0.05)',
                backgroundColor: memberDetails.partyHistory?.[0]?.partyName.includes("Republic") ? '#fff0f0' : (memberDetails.partyHistory?.[0]?.partyName.includes("Democrat") ? '#f0f0ff' : '#f0fff0'),
                borderRadius: '8px',
              }}
            >
              <img
                src={memberDetails.depiction?.imageUrl}
                alt={memberDetails.name}
                style={{
                  width: '100%',
                  height: 'auto',
                  borderRadius: '8px 8px 0 0',
                  objectFit: 'cover',
                }}
              />
              <h2 style={{ paddingLeft: '16px' }}>{memberDetails.directOrderName}</h2>
              <div style={{ textAlign: 'left', paddingLeft: '16px', paddingBottom: '16px' }} >
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

        {/* Bill Columns */}
        <div
          style={{
            flex: '2 1 600px',
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
                  <li key={index} style={{ marginBottom: '8px', padding: '12px', backgroundColor: "#e0e0e0", borderRadius: '8px', transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.bill-title').style.color = "rgb(255, 255, 255)";
                    e.currentTarget.style.backgroundColor = partyColor(memberDetails);
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateX(-10px)";
                    }}
                    onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.bill-title').style.color = partyColor(memberDetails);
                    e.currentTarget.style.backgroundColor = "#e0e0e0";
                    e.currentTarget.style.color = "black";
                    e.currentTarget.style.transform = "translateX(0)";
                    }}
                  >
                    <p style={{ fontWeight: 'bold', color: partyColor(memberDetails) }} className='bill-title'>
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
                  <li key={index} style={{ marginBottom: '8px', padding: '12px', backgroundColor: "#e0e0e0", borderRadius: '8px', transition: "transform 0.3s ease, background-color 0.3s ease, color 0.3s ease" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.querySelector('.bill-title').style.color = "rgb(255, 255, 255)";
                    e.currentTarget.style.backgroundColor = partyColor(memberDetails);
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.transform = "translateX(-10px)";
                    }}
                    onMouseLeave={(e) => {
                    e.currentTarget.querySelector('.bill-title').style.color = partyColor(memberDetails);
                    e.currentTarget.style.backgroundColor = "#e0e0e0";
                    e.currentTarget.style.color = "black";
                    e.currentTarget.style.transform = "translateX(0)";
                    }}

                  >
                    <p style={{ fontWeight: 'bold', color: partyColor(memberDetails) }} className='bill-title'>
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
      </div>
    </div>
  );
};

export default BillsPage;
