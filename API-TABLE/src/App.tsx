import { useEffect, useState } from 'react';
import axios from 'axios';
import PAGINATION from './components/pagination';
import Datatable from './components/dataTable';

interface ArticleData {
  // Define the structure of article data based on the API response
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
}

const App: React.FC = () => {
  const [articledata, setarticledata] = useState<ArticleData[]>([]);
  const [first, setFirst] = useState<number>(0);
  const [rows, setRows] = useState<number>(12);
  const page: number = first / rows + 1;

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const response = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}`);
        setarticledata(response.data.data);
      } catch (err) {
        console.log("There is an error in fetching:", err);
      }
    };
    fetchdata();
  }, [first, rows]);

  const onPageChange = (event: { first: number; rows: number }) => {
    setFirst(event.first);
    setRows(event.rows);
  };

  return (
    <>
      <Datatable
        articledata={articledata}
        currentPage={page}
      />
      <PAGINATION first={first} rows={rows} onPageChange={onPageChange} />
    </>
  );
}

export default App;


