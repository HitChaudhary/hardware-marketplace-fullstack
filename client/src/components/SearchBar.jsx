import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SearchBar({ initialValue = '', placeholder = 'Search laptops, GPUs, RAM, SSD…' }) {
  const [value, setValue] = useState(initialValue);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate(`/search?q=${encodeURIComponent(value.trim())}`);
  };

  return (
    <form className="page-search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
      />
      <button type="submit">Search</button>
    </form>
  );
}
