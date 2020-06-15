import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import FlightList from './flight-list';
import PriceFilter from './price-filter';
import TransferFilter from './transfer-filter';
import mainLogoSrc from './main-logo.png';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 768px;
  margin: 0px auto 0px auto;
  color: #4A4A4A;
`;

const Content = styled.div`
  display: flex;
  flex-grow: 1;
  flex-direction: column;
`;

const MainLogoWrapper = styled.div`
  margin: 30px auto 30px auto;
  text-align: center;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-basis: 100%;
`;

const defaultFilterCheckboxes = {
  all: { isChecked: true, title: 'Все', checkboxType: 'all' },
  noTransfer: { isChecked: true, title: 'Без пересадок', checkboxType: 'noTransfer' },
  oneTransfer: { isChecked: true, title: '1 пересадка', checkboxType: 'oneTransfer' },
  twoTransfer: { isChecked: true, title: '2 пересадки', checkboxType: 'twoTransfer' },
  threeTransfer: { isChecked: true, title: '3 пересадки', checkboxType: 'threeTransfer' },
};

const defaultTicketsList = {
  noTransfer: [],
  oneTransfer: [],
  twoTransfer: [],
  threeTransfer: [],
  show: [],
};

const fetchServerData = async (url, maxRequestsNumber = 5) => {
  const searchIdRequest = async () => (
    axios.get(url)
  );

  try {
    return await searchIdRequest();
  } catch (error) {
    if (maxRequestsNumber === 0) throw new Error(error, 'AttemptsLimitExceeded');
    return fetchServerData(url, maxRequestsNumber - 1);
  }
};

const App = () => {
  const [checkboxes, changeCheckboxes] = useState(defaultFilterCheckboxes);
  const [priceFilter, changePriceFilter] = useState('cheapest'); // cheapest, fastest
  const [tickets, setTickets] = useState(defaultTicketsList);

  const [dataLoader, setDataLoader] = useState(true);


  const setVisibleTickets = () => {
    const visibleTickets = (currentTickets) => {
      let show = [];
      Object.entries(checkboxes).forEach((el) => {
        const key = el[0];
        const { isChecked } = el[1];
        if (key === 'all') return;
        if (isChecked === true) show = [...show, ...currentTickets[key]];
      });
      return [...show];
    };

    setTickets((currentTickets) => ({
      ...currentTickets,
      show: visibleTickets(currentTickets),
    }));
  };

  const sortByPrice = () => {
    const sortedFunc = (arr) => sortBy(arr, (ticket) => ticket.price);
    setTickets((currentTickets) => ({
      ...currentTickets,
      noTransfer: sortedFunc(currentTickets.noTransfer),
      oneTransfer: sortedFunc(currentTickets.oneTransfer),
      twoTransfer: sortedFunc(currentTickets.twoTransfer),
      threeTransfer: sortedFunc(currentTickets.threeTransfer),
    }));
    setVisibleTickets();
  };

  const sortByDuration = () => {
    const sortedFunc = (arr) => sortBy(arr, (ticket) => ticket.segments[0].duration);
    setTickets((currentTickets) => ({
      ...currentTickets,
      noTransfer: sortedFunc(currentTickets.noTransfer),
      oneTransfer: sortedFunc(currentTickets.oneTransfer),
      twoTransfer: sortedFunc(currentTickets.twoTransfer),
      threeTransfer: sortedFunc(currentTickets.threeTransfer),
    }));
    setVisibleTickets();
  };

  const getTickets = async () => {
    const fetchSearchId = await fetchServerData('https://front-test.beta.aviasales.ru/search');
    const { searchId } = fetchSearchId.data;
    const fetchData = async () => {
      const response = await fetchServerData(`https://front-test.beta.aviasales.ru/tickets?searchId=${searchId}`);
      const newTickets = response.data.tickets;
      setTickets((currentTickets) => ({
        ...currentTickets,
        noTransfer: [
          ...currentTickets.noTransfer,
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 0),
        ],
        oneTransfer: [
          ...currentTickets.oneTransfer,
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 1),
        ],
        twoTransfer: [
          ...currentTickets.twoTransfer,
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 2),
        ],
        threeTransfer: [
          ...currentTickets.threeTransfer,
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 3),
        ],
      }));
      if (response.data.stop === true) {
        sortByPrice();
        setDataLoader(false);
      }
      if (response.data.stop === false) {
        await fetchData();
      }
    };

    await fetchData();
  };

  useEffect(() => {
    getTickets();
  }, []);

  useEffect(() => {
    setVisibleTickets();
  }, [checkboxes]);

  const renderFlightList = () => {
    if (dataLoader === true) {
      return (
        <LoaderWrapper>
          <Loader type="Bars" color="#2196F3" height={100} width={100} />
        </LoaderWrapper>
      );
    }
    return <FlightList tickets={tickets.show} />;
  };
  return (
    <div className="main-wrapper">
      <MainLogoWrapper className="main-logo-wrapper">
        <img src={mainLogoSrc} alt="Логотип aviasales" />
      </MainLogoWrapper>

      <ContentWrapper>
        <TransferFilter
          checkboxes={checkboxes}
          changeCheckboxes={changeCheckboxes}
          setVisibleTickets={setVisibleTickets}
        />

        <Content>
          <PriceFilter
            priceFilter={priceFilter}
            changePriceFilter={changePriceFilter}
            sortByDuration={sortByDuration}
            sortByPrice={sortByPrice}
          />
          {renderFlightList()}
        </Content>
      </ContentWrapper>
    </div>
  );
};

export default App;
