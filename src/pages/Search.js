import React from 'react';
import { Container, InputGroup, FormControl, Button } from 'react-bootstrap';
import '../styles/globals.css';
import '../components/Filters'
import MultiFilters from '../components/Filters';
import ZIPSearch from '../components/ZIPSearch';

const Search = () => {
  return (
    <div>
        <ZIPSearch />
        <MultiFilters /> 
    </div>
  );
};

export default Search;