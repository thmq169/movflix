import { useSelector } from "react-redux"
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { ToastContainer } from "react-toastify";
import { themeModeSelector } from "./redux/selector";
import themeConfigs from "./configs/themeConfigs";
import "react-toastify/dist/ReactToastify.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import PageWrapper from "./components/common/PageWrapper";
import routes from "./routers/router";
import MainLayout from "./components/layout/MainLayout";

function App() {
  const { themeMode } = useSelector(themeModeSelector);
  return (
    <ThemeProvider theme={themeConfigs.custom({ mode: themeMode })}>
      <ToastContainer
        position="bottom-left"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        pauseOnFocusLoss
        pauseOnHover
        theme={themeMode}
      />
      <CssBaseline />

      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            {
              routes.map((route, index) => (
                route.index ? (
                  <Route
                    index
                    key={index}
                    element={route.state ? (
                      <PageWrapper state={route.state}>
                        {route.element}
                      </PageWrapper>
                    ) : route.element}
                  />
                ) : (
                  <Route
                    path={route.path}
                    key={index}
                    element={route.state ? (
                      <PageWrapper state={route.state}>
                        {route.element}
                      </PageWrapper>
                    ) : route.element}
                  />
                )
              ))
            }
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
