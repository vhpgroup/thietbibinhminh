import { createBrowserRouter } from "react-router";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import HomePage from "./pages/HomePage";
import NewsPage from "./pages/NewsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/san-pham", Component: ProductsPage },
  { path: "/san-pham/:slug", Component: ProductDetailPage },
  { path: "/tin-tuc", Component: NewsPage },
  { path: "/gioi-thieu", Component: AboutPage },
  { path: "/lien-he", Component: ContactPage },
  { path: "*", Component: ProductsPage },
]);
