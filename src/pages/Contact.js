import React from 'react';
import '../styles/contact.css';

const Contacts = () => {
  return (
    <div className="contacts-container">
      <div className="contacts-info">
        <h2>Contributors</h2>
        <ul>
          <li>
            <strong>Herman Hundsberger</strong>
            <br />
            hh727w@gmail.com
          </li>
          <li>
            <strong>Ryan Younan</strong>
            <br />
            ryanyounan@gmail.com
          </li>
          <li>
            <strong>Brandon Khor</strong>
            <br />
            bkhor@gmail.com
          </li>
          <li>
            <strong>Nathan Tam</strong>
            <br />
            nctam2@uci.edu
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Contacts;