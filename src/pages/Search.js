import React from 'react';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import '../styles/search.css';

const Search = () => {
  return (
    <Container className="search-container">
      <h1>Find Nearby Resources</h1>
      <InputGroup className="mb-3">
        <FormControl
          className="zip-input"
          placeholder="Enter ZIP code"
          aria-label="ZIP code"
        />
        <Button className="filter-btn">Food Shelter</Button>
        <Button className="filter-btn">Shelter</Button>
        <Button className="filter-btn">Hospital</Button>
      </InputGroup>
      <Button className="filter-btn">Generate Locations</Button>
      <div className="results-container">
        {/* Placeholder for search results */}
      </div>
    </Container>
  );
};

export default Search;