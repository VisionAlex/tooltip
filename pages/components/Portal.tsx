import { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
interface Props {
  selector: string;
}
const Portal: React.FC<Props> = ({ children, selector }) => {
  const ref: any = useRef();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setMounted(true);
  }, [selector]);

  return mounted ? createPortal(children, ref.current) : null;
};

export default Portal;
