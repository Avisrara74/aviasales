import React, { useState, useEffect } from 'react';
import { sortBy, uniqueId } from 'lodash';
import styled from 'styled-components';
import Loader from 'react-loader-spinner';
import { fetchServerData } from '../API/aviasales';
import FlightList from './flight-list';
import PriceFilter from './price-filter';
import TransferFilter from './transfer-filter';
import mainLogoSrc from '../images/main-logo.png';

const ContentWrapper = styled.div`
  display: flex;
  flex-direction: row;
  max-width: 768px;
  margin: 0px auto 0px auto;
  color: #4a4a4a;
  
  @media (max-width: 600px) {
    flex-direction: column;
  }
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

const defaultFilterCheckboxes = [
  {
    isChecked: true, title: 'Все', checkboxType: 'all', id: uniqueId(),
  },
  {
    isChecked: true, title: 'Без пересадок', checkboxType: 'noTransfer', id: uniqueId(),
  },
  {
    isChecked: true, title: '1 пересадка', checkboxType: 'oneTransfer', id: uniqueId(),
  },
  {
    isChecked: true, title: '2 пересадки', checkboxType: 'twoTransfer', id: uniqueId(),
  },
  {
    isChecked: true, title: '3 пересадки', checkboxType: 'threeTransfer', id: uniqueId(),
  },
];

const defaultTicketsList = {
  noTransfer: [],
  oneTransfer: [],
  twoTransfer: [],
  threeTransfer: [],
};

const App = () => {
  const [checkboxes, changeCheckboxes] = useState(defaultFilterCheckboxes);
  const [priceFilter, changePriceFilter] = useState('cheapest'); // cheapest, fastest

  // все билеты
  const [tickets, setTickets] = useState(defaultTicketsList);

  // видимые на странице билеты
  const [visibleTickets, setVisibleTickets] = useState([]);

  const [dataLoader, setDataLoader] = useState(true);

  // вспомогательная функция для уменьшения дублирования при setTickets
  const getTicketsKeys = () => Object.keys(defaultTicketsList);

  const sortVisibleTicketsBy = (sortType) => {
    let sortedFunc;
    switch (sortType) {
      case 'cheapest': {
        sortedFunc = (arr) => sortBy(arr, ['price']);
        break;
      }
      case 'fastest': {
        sortedFunc = (arr) => sortBy(arr, ['segments[0].duration']);
        break;
      }
      default: sortedFunc = (arr) => sortBy(arr, (ticket) => ticket.price);
    }

    setVisibleTickets((currentTickets) => ([
      ...sortedFunc(currentTickets),
    ]));
  };

  const getVisibleTickets = () => {
    const getVisibleTicketsByCheckboxes = () => {
      let show = [];
      // заполняем массив видимых билетов в зависимости от активных чекбоксов
      checkboxes.forEach((el) => {
        const { isChecked, checkboxType } = el;
        if (checkboxType === 'all') return;
        if (isChecked === true) {
          show = [...show, ...tickets[checkboxType]];
        }
      });
      return [...show];
    };
    setVisibleTickets(() => [...getVisibleTicketsByCheckboxes()]);
    sortVisibleTicketsBy(priceFilter);
  };

  const getTickets = async () => {
    const ticketsKeys = getTicketsKeys();
    const aviasalesUrl = 'https://front-test.beta.aviasales.ru/';
    const fetchSearchId = await fetchServerData(`${aviasalesUrl}search`);
    const { searchId } = fetchSearchId.data;
    const fetchData = async () => {
      const response = await fetchServerData(
        `${aviasalesUrl}tickets?searchId=${searchId}`,
      );

      // уникальный id для билетов
      const newTickets = response.data.tickets.map((el) => ({ ...el, id: uniqueId() }));

      // сортировка каждой новой пачки билетов
      setTickets((currentTickets) => ({
        [ticketsKeys[0]]: [
          ...currentTickets[ticketsKeys[0]],
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 0),
        ],
        [ticketsKeys[1]]: [
          ...currentTickets[ticketsKeys[1]],
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 1),
        ],
        [ticketsKeys[2]]: [
          ...currentTickets[ticketsKeys[2]],
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 2),
        ],
        [ticketsKeys[3]]: [
          ...currentTickets[ticketsKeys[3]],
          ...newTickets.filter((ticket) => ticket.segments[0].stops.length === 3),
        ],
      }));
      if (response.data.stop === true) {
        setDataLoader(false);
      }
      if (response.data.stop === false) {
        await fetchData();
      }
    };

    await fetchData();
  };

  useEffect(() => {
    // грузим билеты пока отдаёт сервер
    if (dataLoader === true) getTickets();
    // показываем после загрузки
    if (dataLoader === false) getVisibleTickets();
  }, [dataLoader, checkboxes, priceFilter]);

  const renderFlightList = () => {
    if (dataLoader === true) {
      return (
        <LoaderWrapper>
          <Loader type="Bars" color="#2196F3" height={100} width={100} />
        </LoaderWrapper>
      );
    }
    return <FlightList tickets={visibleTickets} />;
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
        />

        <Content>
          <PriceFilter
            priceFilter={priceFilter}
            changePriceFilter={changePriceFilter}
            sortVisibleTicketsBy={sortVisibleTicketsBy}
          />
          {renderFlightList()}
        </Content>
      </ContentWrapper>
    </div>
  );
};

export default App;
