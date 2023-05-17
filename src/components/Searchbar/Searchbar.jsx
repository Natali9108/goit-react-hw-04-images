import { useState } from 'react';
import { toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {
  SearchbarBox,
  SearchForm,
  SearchFormBtn,
  SearchFormBtnLabel,
  SearchFormInput,
} from './Searchbar.styled';

export const Searchbar = ({ onSubmit }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleNameChange = evt => {
    setSearchQuery(evt.currentTarget.value.toLowerCase());
  };

  const handleSearch = evt => {
    evt.preventDefault();
    if (searchQuery.trim() === '') {
      toast.error('Please enter a value to search for images', {
        theme: 'colored',
        autoClose: 2000,
      });
      return;
    }
    onSubmit(searchQuery);
    setSearchQuery('');
  };

  return (
    <SearchbarBox>
      <SearchForm onSubmit={handleSearch}>
        <SearchFormBtn type="submit">
          <SearchFormBtnLabel>Search</SearchFormBtnLabel>
        </SearchFormBtn>

        <SearchFormInput
          type="text"
          autoComplete="off"
          autoFocus
          placeholder="Search images and photos"
          value={searchQuery}
          onChange={handleNameChange}
        />
      </SearchForm>
    </SearchbarBox>
  );
};

Searchbar.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
};
