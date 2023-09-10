import { useEffect } from "react";
import { createPortal } from "react-dom";

function ProductPortal({ children }) {
    const mount = document.getElementById("portal-root");
    const el = document.createElement("div");

    useEffect(() => {
        mount.appendChild(el);
        //Clean up component unmount
        return () => mount.removeChild(el);
    }, [el, mount]);

    return createPortal(children, el)
}

export default ProductPortal