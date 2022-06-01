const products = [
  {
    id: "1",
    name: "El Matadero",
    price: 200,
    category: "literaturaArgentina",
    img: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYRbHwZxVQ5bHNvrZRBz5SoM13B-eSYAa04w&usqp=CAU",
    stock: 20,
    description: "Literatura Argentina",
  },
  {
    id: "2",
    name: "El Aleph",
    price: 400,
    category: "literaturaArgentina",
    img: "http://lectorvoraz.com/wp-content/uploads/2020/09/df00421c0ea7c302959f6b24fd7742fd.jpg",
    stock: 18,
    description: "Literatura Argentina",
  },
  {
    id: "3",
    name: "Rayuela",
    price: 700,
    category: "literaturaArgentina",
    img: "https://d3ugyf2ht6aenh.cloudfront.net/stores/526/507/products/97898772525381-b9794455c354cbb38d15843725976161-480-0.png",
    stock: 10,
    description: "Literatura Argentina",
  },
  {
    id: "4",
    name: "La Celestina",
    price: 900,
    category: "litetaturaEspañola",
    img: "https://images.cdn1.buscalibre.com/fit-in/360x360/80/c2/80c2be032222bce3c9cad323777d8343.jpg",
    stock: 5,
    description: "Literatura Española",
  },
];

export const getProducts = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products);
    }, 2000);
  });
};

export const getItem = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.find((prod) => prod.id === id));
    }, 2000);
  });
};
export const getProductsByCategory = (categoryId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(products.filter((prod) => prod.category === categoryId));
    }, 2000);
  });
};
