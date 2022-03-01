import styled from "styled-components";
export const Container = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const Content = styled.div`
  width: 100%;
  max-width: 680px;
  margin: 30px;
  background-color: #fff;
  border-radius: 4px;
  padding: 20px;
`;

export const ButtonUpload = styled.button`
  width: 90%;
  border: none;
  margin: 10px auto;
  background-color: #7159c1;
  border-radius: 5px;
  height: 40px;

  font-size: 15px;
  color: #fff;

  transition: 800ms;

  cursor: pointer;
  &:hover {
    filter: brightness(80%);
  }
`;
