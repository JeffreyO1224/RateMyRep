import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
const BillsPage = () => {
  const { bioguideId } = useParams();
  const [bills, setBills] = useState([]);
  const apiKey = import.meta.env.VITE_REACT_APP_CONGRESS_API_KEY;
  useEffect(() => {
    const fetchBills = async () => {
      try {
        const res = await axios.get(
          `https://api.congress.gov/v3/member/${bioguideId}/sponsored-legislation`,
          {
            params: {
              api_key: apiKey,
            },
          }
        );
        setBills(res.data.sponsoredLegislation || []);
      } catch (error) {
        console.error('Error fetching bills:', error);
      }
    };

    fetchBills();
  }, [bioguideId]);

  return (
    <div>
      <h2>Sponsored Bills</h2>
      <ul>
        {bills.map((bill, index) => (
          <li key={index}>
            <a href={bill.url} target="_blank" rel="noopener noreferrer">
              {bill.title} ({bill.congress}th Congress)
            </a>
            <p><strong>Policy Area:</strong> {bill.policyArea?.name}</p>
            <p><strong>Latest Action:</strong> {bill.latestAction?.text}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillsPage;
