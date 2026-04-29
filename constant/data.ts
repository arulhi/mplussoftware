export const menus = [
  {
    group_name: "Application",
    items: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "material-symbols:dashboard",
        isHide: false,
        child: [],
      },
      {
        title: "Data Page",
        url: "/data",
        icon: "mdi:database",
        isHide: false,
        child: [],
      },
      {
        title: "Calendar",
        url: "/calendar",
        icon: "ph:calendar",
        isHide: false,
        child: [],
      },
      
      {
        title: "User Management",
        url: "#",
        icon: "la:users-cog",
        isHide: false,
        child: [
          {
            title: "Users",
            url: "/users",
            isHide: false,
          },
          {
            title: "Role",
            url: "/roles",
            isHide: false,
          },
        ],
      },
    ],
  },
];

export const payments = [
  {
    id: 1,
    name: "Horizon Pro 1",
    progress: 7,
    quantity: 428,
    date: "2025-01-02",
  },
  {
    id: 2,
    name: "Horizon Pro 2",
    progress: 98,
    quantity: 42,
    date: "2025-01-03",
  },
  {
    id: 3,
    name: "Horizon Pro 3",
    progress: 9,
    quantity: 214,
    date: "2025-01-04",
  },
  {
    id: 4,
    name: "Horizon Pro 4",
    progress: 32,
    quantity: 321,
    date: "2025-01-05",
  },
  {
    id: 5,
    name: "Horizon Pro 5",
    progress: 10,
    quantity: 260,
    date: "2025-01-06",
  },
  // {"id": 6, "name": "Horizon Pro 6", "progress": 43, "quantity": 104, "date": "2025-01-07"},
  // {"id": 7, "name": "Horizon Pro 7", "progress": 48, "quantity": 229, "date": "2025-01-08"},
  // {"id": 8, "name": "Horizon Pro 8", "progress": 26, "quantity": 469, "date": "2025-01-09"},
  // {"id": 9, "name": "Horizon Pro 9", "progress": 74, "quantity": 486, "date": "2025-01-10"},
  // {"id": 10, "name": "Horizon Pro 10", "progress": 87, "quantity": 346, "date": "2025-01-11"},
];

export const complex = [
  {
    id: 1,
    name: "Horizon Pro 1",
    status: "Approved",
    date: "2025-01-02",
    progress: 7,
    quantity: 428,
  },
  {
    id: 2,
    name: "Horizon UI Free",
    status: "Reject",
    date: "2025-02-10",
    progress: 15,
    quantity: 312,
  },
  {
    id: 3,
    name: "Marketplace",
    status: "Reject",
    date: "2025-03-05",
    progress: 45,
    quantity: 512,
  },
  {
    id: 4,
    name: "Weekly Updates",
    status: "Approved",
    date: "2025-04-15",
    progress: 25,
    quantity: 120,
  },
  {
    id: 5,
    name: "Dashboard UX",
    status: "Pending",
    date: "2025-05-20",
    progress: 60,
    quantity: 300,
  },
];
