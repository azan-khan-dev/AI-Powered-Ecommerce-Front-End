import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  orderCount: 0,
  cancelledOrders: [],
  cancelledCount: 0,
  loading: false,
  error: null,
};

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload;
      state.orderCount = action.payload.length;
    },

    setCancelledOrders: (state, action) => {
      state.cancelledOrders = action.payload;
      state.cancelledCount = action.payload.length;
    },

    addOrder: (state, action) => {
      state.orders.unshift(action.payload);
      state.orderCount += 1;
    },

    removeOrder: (state, action) => {
      const orderId = action.payload;
      state.orders = state.orders.filter(order => order._id !== orderId);
      state.orderCount = Math.max(0, state.orderCount - 1);
    },

    cancelOrder: (state, action) => {
      const orderId = action.payload;
      const orderIndex = state.orders.findIndex(order => order._id === orderId);

      if (orderIndex !== -1) {
        const cancelledOrder = { ...state.orders[orderIndex], status: 'cancelled', cancelledBy: 'client' };
        state.cancelledOrders.unshift(cancelledOrder);
        state.orders.splice(orderIndex, 1);
        state.orderCount = Math.max(0, state.orderCount - 1);
        state.cancelledCount += 1;
      }
    },

    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find(order => order._id === orderId);
      if (order) {
        order.status = status;
      }
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },

    clearOrders: (state) => {
      state.orders = [];
      state.orderCount = 0;
      state.cancelledOrders = [];
      state.cancelledCount = 0;
    },
  },
});

export const {
  setOrders,
  setCancelledOrders,
  addOrder,
  removeOrder,
  cancelOrder,
  updateOrderStatus,
  setLoading,
  setError,
  clearOrders,
} = ordersSlice.actions;

// Selectors
export const selectOrders = (state) => state.orders.orders;
export const selectOrderCount = (state) => state.orders.orderCount;
export const selectCancelledOrders = (state) => state.orders.cancelledOrders;
export const selectCancelledCount = (state) => state.orders.cancelledCount;
export const selectOrdersLoading = (state) => state.orders.loading;
export const selectOrdersError = (state) => state.orders.error;

export default ordersSlice.reducer;