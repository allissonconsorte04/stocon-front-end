import Login from "../pages/login/Login";
import Users from "../pages/users/Users";
import Suppliers from "../pages/suppliers/Suppliers";
import Categories from "../pages/categories/Categories";
import Roles from "../pages/roles/Roles";
import Products from "../pages/products/Products";

export const nav = [
  { path: "/", name: "Inicio", element: null, isMenu: true, isPrivate: false },
  {
    path: "/login",
    name: "Login",
    element: <Login />,
    isMenu: false,
    isPrivate: false,
  },
  {
    path: "/users",
    name: "Users",
    element: <Users />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/suppliers",
    name: "Fornecedores",
    element: <Suppliers />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/categories",
    name: "Categorias",
    element: <Categories />,
    isMenu: true,
    isPrivate: true,
  },
  {
    path: "/roles",
    name: "Permissões",
    element: <Roles />,
    isMenu: true,
    isPrivate: true,
  },
  {
     path: "/products",
     name: "Produtos",
     element: <Products />,
     isMenu: true,
     isPrivate: true,
   }

  // { path:     "/private",  name: "Private",     element: <Login />,    isMenu: true,     isPrivate: false  },
  // { path:     "/account",  name: "Account",     element: <Login />,    isMenu: true,     isPrivate: false  },
];
