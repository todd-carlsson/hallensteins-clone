import { useEffect, useState } from "react";
import { makeRequest } from "../utils/makeRequest";

const useFetch = (url) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const [totalAmountItems, setTotalAmountItems] = useState(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const res = await makeRequest.get(url);
                setData(res.data.data)
                setTotalAmountItems(res.data.meta.pagination.total)
            } catch (err) {
                // console.log(err)
                setError(true);
            }
            setLoading(false);
        };
        fetchData();
    }, [url]);

    return { data, loading, error, totalAmountItems }
};

export default useFetch;