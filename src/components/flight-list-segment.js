import React from 'react';
import { addMinutes, format } from 'date-fns';
import styled from 'styled-components';
import { uniqueId } from 'lodash';

const InfoWrap = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  align-content: space-between;
  margin: 10px 0px 0px 0px;
`;

const Placeholder = styled.p`
  color: #A0B0B9;
  font-size: 12px;
  margin: 0;
  text-transform: uppercase;
`;

const DurationInfo = styled.p`
  color: #4A4A4A;
  font-size: 14px;
  margin: 0;
  text-transform: uppercase;
`;

const SegmentInfo = (props) => {
  const { segments } = props;

  return segments.map((info) => {
    const {
      date, destination, duration, origin, stops,
    } = info;
    const fromTo = `${origin} - ${destination}`;

    const originDate = new Date(date);
    const formatOriginDate = format(originDate, 'HH:mm');
    const destinationDate = addMinutes(originDate, duration);
    const formatDestinationDate = format(destinationDate, 'HH:mm');
    const timeInfo = `${formatOriginDate} - ${formatDestinationDate}`;

    const hours = Math.floor(duration / 60);
    const minutes = duration % 60;

    const durationInfo = `${hours}ч ${minutes}м`;
    const transferLength = () => {
      if (stops.length === 0) return 'Без пересадок';
      if (stops.length === 1) return '1 пересадка';
      return `${stops.length} пересадки`;
    };

    return (
      <InfoWrap key={uniqueId()}>
        <div className="info-element">
          <Placeholder>{fromTo}</Placeholder>
          <DurationInfo>{timeInfo}</DurationInfo>
        </div>
        <div className="info-element">
          <Placeholder>в пути</Placeholder>
          <DurationInfo>{durationInfo}</DurationInfo>
        </div>
        <div className="info-element">
          <Placeholder>{transferLength()}</Placeholder>
          <DurationInfo>{stops.join(', ')}</DurationInfo>
        </div>
      </InfoWrap>
    );
  });
};

export default SegmentInfo;
