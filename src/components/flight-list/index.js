import React from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import SegmentInfo from './segment';

const FlightListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
`;

const ListItem = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 142px;
  background-color: white;
  margin: 20px 0px 0px 0px;
  padding: 20px 20px 20px 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  align-content: space-between;
  
  @media (max-width: 375px) {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  
`;

const Price = styled.div`
  color: #2196f3;
  font-size: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  margin-bottom: 10px;
  
  @media (max-width: 375px) {
    grid-template-columns: 1fr 1fr;
    grid-column: 1 / 3;
  }
`;

const AeroLogoWrap = styled.div`
  display: grid;
  grid-column: -1 / -2;
`;

const Index = (props) => {
  const { tickets } = props;

  const renderTickets = () => {
    if (tickets.length === 0) return null;
    return tickets.map((ticket, index) => {
      if (index >= 5) return false;
      const {
        id, price, carrier, segments,
      } = ticket;
      const aeroLogoUrl = `https://pics.avs.io/99/36/${carrier}.png`;

      const formatedPrice = price.toLocaleString().split(',').join(' ');

      return (
        <ListItem key={id}>
          <Price>
            <span>{`${formatedPrice} Р`}</span>
            <AeroLogoWrap>
              <img src={aeroLogoUrl} alt="aero-brand" />
            </AeroLogoWrap>
          </Price>

          <SegmentInfo segments={segments} />
        </ListItem>
      );
    });
  };
  return <FlightListWrapper>{renderTickets()}</FlightListWrapper>;
};

Index.propTypes = {
  tickets: propTypes.arrayOf(propTypes.object),
};

Index.defaultProps = {
  tickets: [],
};

export default Index;
