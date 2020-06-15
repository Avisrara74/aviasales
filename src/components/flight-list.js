import React from 'react';
import styled from 'styled-components';
import propTypes from 'prop-types';
import { uniqueId } from 'lodash';
import SegmentInfo from './flight-list-segment';


const FlightListWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
`;

const ListItem = styled.div`
  height: 142px;
  display: flex;
  flex-direction: column;
  flex-basis: 100%;
  background-color: white;
  margin: 20px 0px 0px 0px;
  padding: 20px 20px 20px 20px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  align-content: space-between;
`;

const Price = styled.div`
  color: #2196F3;
  font-size: 24px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr;
  margin-bottom: 10px;
`;

const AeroLogoWrap = styled.div`
  display: grid;
  grid-column: -1 / -2;
`;

const FlightList = (props) => {
  const { tickets } = props;
  const renderTickets = () => {
    if (tickets.length === 0) return null;
    return tickets.map((ticket, index) => {
      if (index >= 5) return false;
      const { price, carrier, segments } = ticket;
      const aeroLogoUrl = `https://pics.avs.io/99/36/${carrier}.png`;

      return (
        <ListItem key={uniqueId()}>
          <Price>
            <span>{price}</span>
            <AeroLogoWrap>
              <img src={aeroLogoUrl} alt="aero-brand" />
            </AeroLogoWrap>
          </Price>


          <SegmentInfo segments={segments} />
        </ListItem>
      );
    });
  };
  return (
    <FlightListWrapper>
      {renderTickets()}
    </FlightListWrapper>
  );
};

FlightList.propTypes = {
  tickets: propTypes.arrayOf(propTypes.object),
};

FlightList.defaultProps = {
  tickets: [],
};

export default FlightList;
