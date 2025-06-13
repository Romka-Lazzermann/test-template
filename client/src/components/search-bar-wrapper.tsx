'use client';

import dynamic from 'next/dynamic';

const SearchBar = dynamic(() => import('./search-bar'), { ssr: false });

export default SearchBar;