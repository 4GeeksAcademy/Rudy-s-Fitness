export const initialStore = () => {
  // Try to restore authentication from localStorage
  const savedUser = localStorage.getItem("user");
  const savedAuth = localStorage.getItem("isAuthenticated");

  return {
    message: null,
    user: savedUser ? JSON.parse(savedUser) : null,
    isAuthenticated: savedAuth === "true",
    todos: [
      {
        id: 1,
        title: "Make the bed",
        background: null,
      },
      {
        id: 2,
        title: "Do my homework",
        background: null,
      },
    ],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_hello":
      return {
        ...store,
        message: action.payload,
      };

    case "add_task": {
      const { id, color } = action.payload;
      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo
        ),
      };
    }

    case "login":
      // Save to localStorage for persistence
      localStorage.setItem("user", JSON.stringify(action.payload));
      localStorage.setItem("isAuthenticated", "true");
      return {
        ...store,
        user: action.payload,
        isAuthenticated: true,
      };

    case "logout":
      // Clear localStorage on logout
      localStorage.removeItem("user");
      localStorage.removeItem("isAuthenticated");
      return {
        ...store,
        user: null,
        isAuthenticated: false,
      };

    case "update_membership":
      return {
        ...store,
        user: {
          ...store.user,
          membershipLevel: action.payload,
        },
      };

    default:
      throw Error("Unknown action.");
  }
}
