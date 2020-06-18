import React from 'react';
import propTypes from 'prop-types';
import styled from 'styled-components';
import checkboxUrl from '../../images/checkbox.png';

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
  
  @media (max-width: 600px) {
    flex-direction: column;
    max-height: 100px;
    max-width: 100vw;
    margin: 0px 0px 20px 0px;
    height: auto;
    flex-basis: 100%;
    
    & > span {
      display: flex;
      flex-direction: column;
      text-align: center;
      padding-left: 0px;
      padding-bottom: 0px;
    }
    
    & > div {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;
      grid-gap: 10px;
      margin-top: 10px;
      padding: 0px 0px 0px 40px;
    }
    & > div > div {
      padding: 0;
    }
  }
  
  @media (max-width: 470px) {
    max-height: 200px;
    & > div {
      grid-template-columns: 1fr 1fr;
      padding: 0px 0px 0px 30px;
    }
  }
  
  @media (max-width: 360px) {
    & > div {
      grid-template-columns: 1fr;
      padding: 0px 0px 0px 20px;
    }
  }
`;

const Title = styled.span`
  padding-left: 20px;
  padding-bottom: 5px;
`;

const CheckboxesWrap = styled.div`
  
  @media (max-width: 600px) {
    display: flex;
    flex-direction: row;
  }
`;

const Checkbox = styled.div`
  padding: 10px 20px;
  cursor: pointer;
  background-color: #ffffff;
  
  &:hover {
    background-color: #f1fcff;
  }
  
  & > input[type='checkbox'] {
    display: none;
  }
  
  & > input[type='checkbox'] + label span {
    display: inline-block;
    width: 20px;
    height: 20px;
    margin: -1px 10px 0 0;
    vertical-align: middle;
    cursor: pointer;
    border-radius: 2px;
    border: 1px solid #9abbce;
  }
  & > label {
    cursor: pointer;
  }
  & > input[type='checkbox']:checked + label span {
    background: url(${checkboxUrl}) center center no-repeat;
    border: 1px solid #2196f3;
  }
`;

const Index = (props) => {
  const { changeCheckboxes, checkboxes } = props;

  const handleOnChangeCheckboxes = (event) => {
    const { checked } = event.target;
    const transferType = event.target.name;
    // если клик по "все", то актив/деактив состояние всех чекбоксов
    if (transferType === 'all') {
      const newCheckboxes = checkboxes.map((el) => ({ ...el, isChecked: checked }));
      changeCheckboxes(() => (newCheckboxes));
      return;
    }

    // либо изменить состояние только одного
    const newCheckboxes = checkboxes.map((el) => {
      if (el.checkboxType === transferType) return { ...el, isChecked: checked };
      return el;
    });
    changeCheckboxes(() => (newCheckboxes));
  };

  return (
    <TransferFilterWrap>
      <Title>КОЛИЧЕСТВО ПЕРЕСАДОК</Title>
      <CheckboxesWrap>
        {checkboxes.map((checkbox) => (
          <Checkbox key={checkbox.id} className="checkbox-wrap">
            <input
              checked={checkbox.isChecked}
              type="checkbox"
              className="filter-checkbox"
              id={checkbox.checkboxType}
              name={checkbox.checkboxType}
              onChange={handleOnChangeCheckboxes}
            />
            <label htmlFor={checkbox.checkboxType}>
              <span />
              {checkbox.title}
            </label>
          </Checkbox>
        ))}
      </CheckboxesWrap>
    </TransferFilterWrap>
  );
};

Index.propTypes = {
  changeCheckboxes: propTypes.func,
  checkboxes: propTypes.arrayOf(propTypes.object),
};

Index.defaultProps = {
  changeCheckboxes: null,
  checkboxes: [],
};

export default Index;
