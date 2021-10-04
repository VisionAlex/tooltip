import styled from "styled-components";
import Tooltip from "./components/Tooltip";

export default function Home() {
  return (
    <>
      <Title>Page with tooltip example</Title>
      <Tooltip content="This an example tooltip">
        <Button>Hover me</Button>
      </Tooltip>
    </>
  );
}
const Title = styled.h1`
  text-align: center;
  color: dark;
  font-size: 45px;
`;
const Button = styled.div`
  margin: 500px 1000px;
  cursor: pointer;
  width: 100px;
  height: 40px;
  color: white;
  background-color: teal;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 12px;

  &:hover {
    opacity: 0.7;
  }
`;
