import React from "react";
import "./SearchBar.css"; // CSS kommt gleich

const SearchBar = ({ value, onChange }) => {
    return (
        <div id="poda">
            <div className="glow"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>
            <div className="darkBorderBg"></div>

            <div className="white"></div>
            <div className="border"></div>

            <div id="main">
                <input
                    placeholder="Search..."
                    type="text"
                    className="input"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
                <div id="input-mask"></div>
                <div id="pink-mask"></div>
                <div className="filterBorder"></div>

                <div id="filter-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-filter"
                    >
                        <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon>
                    </svg>
                </div>

                <div id="search-icon">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="22"
                        height="22"
                        viewBox="0 0 24 24"
                        fill="none"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="feather feather-search"
                    >
                        <circle cx="11" cy="11" r="8"></circle>
                        <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                    </svg>
                </div>

            </div>
        </div>
    );
};

export default SearchBar;
