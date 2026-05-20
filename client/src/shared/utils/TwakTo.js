import { useEffect } from "react";

const TawkTo = () => {
    useEffect(() => {
        var Tawk_API = window.Tawk_API || {};
        var Tawk_LoadStart = new Date();

        const script = document.createElement("script");
        script.src = "https://tawk.to/chat/6860ebe60fa35a190e03de33/1iut9ivrc";
        script.async = true;
        script.charset = "UTF-8";
        script.setAttribute("crossorigin", "*");

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script); // cleanup
        };
    }, []);

    return null;
};

export default TawkTo;