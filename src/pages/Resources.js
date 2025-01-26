import React from 'react';
import '../styles/resources.css';

const Resources = () => {
  return (
    <div className="resources-container">
      <div className="resources-content">
        <h2>Resources</h2>
        <p>Explore various resources regarding the current California fires:</p>
        
        {/* List of resources as links */}
        <ul className="resources-list">
          <li>
            <a href="https://wildfirerecovery.caloes.ca.gov/" target="_blank" rel="noopener noreferrer">
              California Office of Emergency Services
            </a>
          </li>
          <li>
            <a href="https://www.fire.ca.gov/about/resources" target="_blank" rel="noopener noreferrer">
              Cal Fire
            </a>
          </li>
          <li>
            <a href="https://namica.org/wildfires/" target="_blank" rel="noopener noreferrer">
              NAMI Cal
            </a>
          </li>
          <li>
            <a href="https://www.cafirefoundation.org/what-we-do/for-communities/disaster-relief" target="_blank" rel="noopener noreferrer">
                California Fire Foundation
            </a>
          </li>
          {/* Add more links as needed */}
        </ul>
      </div>
    </div>
  );
};

export default Resources;
