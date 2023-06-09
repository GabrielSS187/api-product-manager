type TUser = {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: "admin" | "normal";
  __v: number;
};

type TCategory = {
  _id: string;
  name: string;
  parent: string;
  __v?: number;
};

type TProduct = {
  _id: string;
  categories: TCategory[];
  name: string;
  qty: number;
  price: number;
  created_at?: Date;
  createdAt: Date;
  __v: number;
};

export const userList: TUser[] = [
  {
    _id: "41260479347907930",
    name: "Fulano Santos",
    email: "fulano_santos@gmail.com",
    password: "12345678",
    role: "admin",
    __v: 1,
  },
  {
    _id: "57976934750000115",
    name: "Senhor Zé",
    email: "senhor_ze@gmail.com",
    password: "45112853",
    role: "normal",
    __v: 2,
  }
];

export const productList: TProduct[] = [
  {
    _id: "188288293903",
    categories: [{
      _id: "58302",
      name: "game",
      parent: "188288293903"
    },
    {
      _id: "55438",
      name: "electronic",
      parent: "188288293903"
    }
  ],
    name: "Xbox one S",
    qty: 535,
    price: 1900.99,
    __v: 5,
    createdAt: new Date(),
  },
  {
    _id: "68838882997777",
    categories: [{
      _id: "75999",
      name: "game",
      parent: "68838882997777"
    },
  ],
    name: "GTA 5",
    qty: 3,
    price: 50,
    __v: 3,
    createdAt: new Date(),
  },
  {
    _id: "55757957544444",
    categories: [{
      _id: "75999",
      name: "game",
      parent: "55757957544444"
    },
  ],
    name: "Nintendo I",
    qty: 3,
    price: 505,
    __v: 1,
    createdAt: new Date(),
  }
];

export const categories: TCategory[] = [{
  _id: "173947934844343032",
  name: "monitor",
  parent: "null",
}]; 