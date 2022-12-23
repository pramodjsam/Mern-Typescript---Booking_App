import axios from "axios";
import { useEffect, useState } from "react";

interface UseFetchResult<T> {
  error: any;
  data: T[];
  loading: boolean;
  reFetchData: () => Promise<void>;
}

type UseFetchMethod = <T>(url: string) => UseFetchResult<T>;

const useFetch: UseFetchMethod = (url: string) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await axios.get(url);
        setData(res.data);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
    fetchData();
  }, [url]);

  const reFetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(url);
      setData(res.data);
    } catch (error) {
      setError(error);
    }
    setLoading(false);
  };

  return { error, data, loading, reFetchData };
};

export default useFetch;
