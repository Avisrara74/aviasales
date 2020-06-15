import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import { uniqueId } from 'lodash';
import './transfer-filter-checkbox.css';

const TransferFilterWrap = styled.div`
  max-width: 190px;
  max-height: 212px;
  height: 200px;
  flex-grow: 1;
  height: 252px;
  margin-right: 20px;
  background-color: white;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
  padding: 20px 0px 20px 0px;
  display: flex;
  flex-direction: column;
`;

const Title = styled.span`
  padding-left: 20px;
  padding-bottom: 5px;
`;

const checkboxActiveStyle = (event) => {
  event.target.style.background = '#F1FCFF';
};

const checkboxNonActiveStyle = (event) => {
  event.target.style.background = '#FFFFFF';
};

const TransferFilter = (props) => {
  const { changeCheckboxes, checkboxes } = props;

  const handleOnChangeCheckboxes = (event) => {
    const { checked } = event.target;
    const transferType = event.target.name;
    if (transferType === 'all') {
      changeCheckboxes((current) => ({
        all: { ...current.all, isChecked: checked },
        noTransfer: { ...current.noTransfer, isChecked: checked },
        oneTransfer: { ...current.oneTransfer, isChecked: checked },
        twoTransfer: { ...current.twoTransfer, isChecked: checked },
        threeTransfer: { ...current.threeTransfer, isChecked: checked },
      }));
      return;
    }
    changeCheckboxes((currentCheckboxes) => ({
      ...currentCheckboxes,
      [transferType]: { ...currentCheckboxes[transferType], isChecked: checked },
    }));
  };

  return (
    <TransferFilterWrap>
      <Title>КОЛИЧЕСТВО ПЕРЕСАДОК</Title>
      {Object.values(checkboxes).map((checkbox) => (
        <div
          onMouseEnter={checkboxActiveStyle}
          onMouseLeave={checkboxNonActiveStyle}
          key={uniqueId()}
          className="checkbox-wrap"
        >
          <input
            checked={checkbox.isChecked}
            type="checkbox"
            className="filter-checkbox"
            id={checkbox.checkboxType}
            name={checkbox.checkboxType}
            onChange={handleOnChangeCheckboxes}
          />
          <label
            htmlFor={checkbox.checkboxType}
          >
            <span />
            {checkbox.title}
          </label>
        </div>
      ))}
    </TransferFilterWrap>
  );
};

TransferFilter.propTypes = {
  changeCheckboxes: propTypes.func,
  checkboxes: propTypes.objectOf(propTypes.object),
};

TransferFilter.defaultProps = {
  changeCheckboxes: null,
  checkboxes: {},
};


export default TransferFilter;
