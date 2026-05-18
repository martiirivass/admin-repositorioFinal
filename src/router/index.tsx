import { createBrowserRouter } from "react-router-dom";
import ProductsPage from "../features/products/pages/ProductsPage";

export const router = createBrowserRouter([
{
    path: "/",
    element: <ProductsPage />,
},
]);