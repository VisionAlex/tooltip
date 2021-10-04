import React, { useState, useRef } from "react";
import styled from "styled-components";
import Portal from "./Portal";

type Placement = "top" | "right" | "bottom" | "left";
interface Props {
  content: string;
  placement?: Placement;
  space?: number;
}

interface Point {
  x: number;
  y: number;
}
interface Boundaries {
  top: number;
  left: number;
  right: number;
  bottom: number;
}

const restrictPoint = (point: Point, boundaries: Boundaries) => {
  const newPoint = { ...point };

  if (point.x < boundaries.left) newPoint.x = boundaries.left;
  else if (point.x > boundaries.right) newPoint.x = boundaries.right;

  if (point.y < boundaries.top) newPoint.y = boundaries.top;
  else if (point.y > boundaries.bottom) newPoint.y = boundaries.bottom;
  return newPoint;
};

const setPosition = (placement: Placement) => ({
  current: placement,
  flip() {
    if (placement === "left") return "right";
    else if (placement === "right") return "left";
    else if (placement === "top") return "bottom";
    else return "top";
  },
  isHorizontal() {
    return this.current === "left" || this.current === "right";
  },
  isVertical() {
    return this.current === "top" || this.current === "bottom";
  },
});

type Position = ReturnType<typeof setPosition>;

const isPointValid = (
  point: Point,
  position: Position,
  boundaries: Boundaries
) => {
  if (
    (position.isHorizontal() &&
      (point.x < boundaries.left || point.x > boundaries.right)) ||
    (position.isVertical() &&
      (point.y < boundaries.top || point.y > boundaries.bottom))
  ) {
    return false;
  }

  return true;
};

const getPoint = (
  element: Element,
  tooltip: HTMLSpanElement,
  placement: Placement,
  space: number
) => {
  let point = { x: 0, y: 0 };
  const position = setPosition(placement);

  const elementBox = element.getBoundingClientRect();

  switch (position.current) {
    case "left":
      point.x = elementBox.left - tooltip.offsetWidth - space;
      point.y = elementBox.top + (elementBox.height - tooltip.offsetHeight) / 2;
      break;
    case "right":
      point.x = elementBox.right + space;
      point.y = elementBox.top + (elementBox.height - tooltip.offsetHeight) / 2;
      break;
    case "top":
      point.x = elementBox.left + (elementBox.width - tooltip.offsetWidth) / 2;
      point.y = elementBox.top - space - tooltip.offsetHeight;
      break;

    default:
      point.x = elementBox.left + (elementBox.width - tooltip.offsetWidth) / 2;
      point.y = elementBox.bottom + space;
  }

  return point;
};

const Tooltip: React.FC<Props> = ({
  content,
  children,
  placement = "bottom",
  space = 15,
}) => {
  const [show, setShow] = useState(false);
  const positionRef = useRef({ x: 0, y: 0 });
  const tooltipRef = useRef<HTMLSpanElement>(null);

  const handleMouseOver = (e: React.MouseEvent) => {
    setShow(true);

    if (tooltipRef.current) {
      const boundaries = {
        left: space,
        top: space,
        right:
          document.body.clientWidth - (tooltipRef.current.offsetWidth + space),
        bottom: window.innerHeight - (tooltipRef.current.offsetHeight + space),
      };
      const initialPoint = getPoint(
        e.currentTarget,
        tooltipRef.current,
        placement,
        space
      );
      const position = setPosition(placement);
      if (isPointValid(initialPoint, position, boundaries)) {
        positionRef.current = restrictPoint(initialPoint, boundaries);
      } else {
        const point = getPoint(
          e.currentTarget,
          tooltipRef.current,
          position.flip(),
          space
        );
        if (isPointValid(point, position, boundaries)) {
          positionRef.current = restrictPoint(point, boundaries);
        } else {
          positionRef.current = restrictPoint(initialPoint, boundaries);
        }
      }
    }
  };
  const handleMouseOut = () => setShow(false);
  return (
    <>
      {React.isValidElement(children) &&
        React.cloneElement(children, {
          onMouseOver: handleMouseOver,
          onMouseOut: handleMouseOut,
        })}
      <Portal selector="#tooltip">
        <Content ref={tooltipRef} position={positionRef.current} show={show}>
          {content}
        </Content>
      </Portal>
    </>
  );
};

export default Tooltip;

const Content = styled.span<{
  show?: boolean;
  position: { x: number; y: number };
}>`
  display: inline-block;
  position: fixed;
  top: ${({ position }) => position.y}px;
  left: ${({ position }) => position.x}px;
  font-weight: 400;
  background-color: black;
  color: white;
  z-index: 1000;
  padding: 7px 10px;
  border-radius: 4px;
  white-space: nowrap;
  opacity: ${({ show }) => (show ? 1 : 0)};
  transition: opacity 0.25s ease-in-out;
`;
