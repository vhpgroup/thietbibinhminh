import { createBrowserRouter } from "react-router";
import HomePage from "./pages/HomePage";
import ProductDetailPage from "./pages/ProductDetailPage";
import ProductsPage from "./pages/ProductsPage";

export const router = createBrowserRouter([
  { path: "/", Component: HomePage },
  { path: "/san-pham", Component: ProductsPage },
  { path: "/san-pham/:slug", Component: ProductDetailPage },
  { path: "*", Component: ProductsPage },
]);
