import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import StatusGrid from "../components/StatusGrid";
import api from "../services/api"; 
import InfiniteScroll from "react-infinite-scroll-component";
import "../styles/Home.css";

export default function Home() {
  const [apis, setApis] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [monthLabel, setMonthLabel] = useState("");

  // Fetch data for a specific page (month block)
  const fetchPageData = async (pageNum) => {
    try {
      const configRes = await api.get("/configs");
      const configs = configRes.data;

      const apiData = await Promise.all(
        configs.map(async (conf) => {
          const logRes = await api.get("/tracer/logs", {
            params: {
              apiName: conf.endpointName,
              page: pageNum,
              pageSize: 50 
            }
          });

          const logs = logRes.data.data || [];

          let latestStatus = "green";
          if (logs.length > 0) {
            const lastCode = logs[0].statusCode;
            if (lastCode >= 200 && lastCode < 300) latestStatus = "green";
            else if (lastCode >= 300 && lastCode < 400) latestStatus = "orange";
            else if (lastCode >= 400 && lastCode < 600) latestStatus = "red";
            else if (lastCode >= 100 && lastCode < 200) latestStatus = "yellow";
          }

          return {
            endpointName: conf.endpointName,
            logs,
            latestStatus,
            totalPages: logRes.data.pagination.totalPages
          };
        })
      );

      return apiData;
    } catch (err) {
      console.error("Error fetching API data", err);
      return [];
    }
  };

  // Initial load
  useEffect(() => {
    const loadInitial = async () => {
      const data = await fetchPageData(1);

      // Set month label from latest log
      let latestLogDate = null;
      data.forEach((api) => {
        if (api.logs.length > 0) {
          const ts = new Date(api.logs[0].timestamp);
          if (!latestLogDate || ts > latestLogDate) latestLogDate = ts;
        }
      });
      if (latestLogDate) {
        const options = { year: "numeric", month: "long" };
        setMonthLabel(latestLogDate.toLocaleDateString(undefined, options));
      }

      setApis(data);
      setHasMore(data.some((api) => page < api.totalPages));
    };
    loadInitial();
  });

  // Load next page
  const fetchMore = async () => {
    const nextPage = page + 1;
    const moreData = await fetchPageData(nextPage);

    // Append logs to existing APIs
    setApis((prev) =>
      prev.map((oldApi) => {
        const newApi = moreData.find((a) => a.endpointName === oldApi.endpointName);
        return {
          ...oldApi,
          logs: [...oldApi.logs, ...(newApi ? newApi.logs : [])],
          totalPages: newApi?.totalPages || oldApi.totalPages
        };
      })
    );

    setPage(nextPage);
    setHasMore(
      moreData.some((api) => nextPage < (api.totalPages || 1))
    );
  };

  return (
    <div className="home-container">
      <Sidebar />
      <main className="home-main">
        <h1>Home</h1>
        <div className="system-status">
          <h2>
            System Status <span>{monthLabel}</span>
          </h2>

          <InfiniteScroll
            dataLength={apis.reduce((sum, api) => sum + api.logs.length, 0)}
            next={fetchMore}
            hasMore={hasMore}
            loader={<h4 style={{ textAlign: "center" }}>Loading more...</h4>}
            endMessage={
              <p style={{ textAlign: "center", marginTop: "20px" }}>
                <b>No more data</b>
              </p>
            }
          >
            <StatusGrid apis={apis} />
          </InfiniteScroll>
        </div>
      </main>
    </div>
  );
}
