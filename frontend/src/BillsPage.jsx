import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from './api';
const BillsPage = () => {
  const { bioguideId } = useParams();
  const [sponsorBills, setSponsorBills] = useState([]);
  const [cosponsorBills, setCosponsorBills] = useState([]);
  useEffect(() => {
    const fetchSponsorBills = async () => {
      try {
        const response = await api.get(`sponsorbills/${bioguideId}`)
        setSponsorBills(response.data.sponsoredLegislation || []);
      } catch (error) {
        console.error('Error fetching sponsor bills:', error);
      }
    };

    fetchSponsorBills();
  }, [bioguideId]);

  useEffect(() => {
    const fetchCosponsorBills = async () => {
      try {
        const response = await api.get(`cosponsorbills/${bioguideId}`)
        setCosponsorBills(response.data.cosponsoredLegislation || []);
      } catch (error) {
        console.error('Error fetching cosponsor bills:', error);
      }
    };

    fetchCosponsorBills();
  }, [bioguideId]);



  return (
    <div>
      <h2>Sponsored Bills</h2>
      <ul>
        {sponsorBills.map((bill, index) => (
          <li key={index}>
            <a href={bill.url} target="_blank" rel="noopener noreferrer">
              {bill.title} ({bill.congress}th Congress)
            </a>
            <p><strong>Policy Area:</strong> {bill.policyArea?.name}</p>
            <p><strong>Latest Action:</strong> {bill.latestAction?.text}</p>
          </li>
        ))}
      </ul>
      <h2>Cosponsored Bills</h2>
      <ul>
        {cosponsorBills.map((bill, index) => (
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
