import React, { useState } from 'react';
import './style.css';
import axios from 'axios';
import SearchBox from './SearchBox';

function SearchBar(props) {
    const [searchText, setSearchText] = useState("Lafayette, IN, USA");

    const handleSubmit = async () => {
        try {
            const res = await axios.get('http://localhost:5000');
            props.setLOIResponse(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className='search-bar'>
            <SearchBox searchText={searchText} setSearchText={setSearchText} handleSubmit={handleSubmit}/>
        </div>
    );
}

export default SearchBar;