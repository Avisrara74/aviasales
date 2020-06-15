import React from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';

const PriceFilterWrap = styled.div`
  display: flex;
  flex-direction: row;
  text-align: center;
  line-height: 50px;
  flex-basis: 50px;
  text-transform: uppercase;
  font-size: 12px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
`;
const defaultFilterStyles = `
    color: #4A4A4A;
    background-color: #FFFFFF;
    height: inherit;
    flex-grow: 1;
  `;
const isActiveFilterStyles = `
    color: #FFFFFF;
    background-color: #2196F3;
    height: inherit;
    flex-grow: 1;
  `;

const PriceFilter = (props) => {
  const {
    priceFilter, changePriceFilter, sortByDuration, sortByPrice,
  } = props;
  const FilterOption1 = styled.div`
    ${(priceFilter === 'cheapest') ? isActiveFilterStyles : defaultFilterStyles}
    border-radius: 5px 0px 0px 5px;
  `;
  const FilterOption2 = styled.div`
    ${(priceFilter === 'fastest') ? isActiveFilterStyles : defaultFilterStyles}
    border-radius: 0px 5px 5px 0px;
  `;

  const handleOnChangeFilter = (event) => {
    switch (event.target.getAttribute('name')) {
      case 'cheapest': {
        changePriceFilter('cheapest');
        sortByPrice();
        break;
      }
      case 'fastest': {
        changePriceFilter('fastest');
        sortByDuration();
        break;
      }
      default: {
        changePriceFilter('cheapest');
      }
    }
  };


  return (
    <PriceFilterWrap>
      <FilterOption1 name="cheapest" onClick={handleOnChangeFilter}>Самый дешевый</FilterOption1>
      <FilterOption2 name="fastest" onClick={handleOnChangeFilter}>Самый быстрый</FilterOption2>
    </PriceFilterWrap>
  );
};

PriceFilter.propTypes = {
  priceFilter: propTypes.string,
  changePriceFilter: propTypes.func,
  sortByDuration: propTypes.func,
  sortByPrice: propTypes.func,

};

PriceFilter.defaultProps = {
  priceFilter: 'cheapest',
  changePriceFilter: null,
  sortByDuration: null,
  sortByPrice: null,
};

export default PriceFilter;
