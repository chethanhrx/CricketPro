import { create } from 'zustand';

export const useAuctionStore = create((set, get) => ({
  // Connection state
  isConnected: false,
  setConnected: (val) => set({ isConnected: val }),

  // Auction state
  auctionStatus: 'SETUP',        // SETUP | READY | ACTIVE | PAUSED | COMPLETED
  currentPlayer: null,
  currentHighestBid: 0,
  currentHighestTeam: null,
  timerSeconds: 15,
  totalAuctionPot: 0,

  // Data
  teamBudgets: [],
  soldPlayers: [],
  upcomingPlayers: [],
  recentBids: [],
  reactions: [],

  // SOLD overlay
  showSoldOverlay: false,
  soldData: null,

  // Initialize from War Room API response
  initWarRoom: (data) => set({
    auctionStatus: data.auctionStatus,
    currentPlayer: data.currentPlayer,
    currentHighestBid: data.currentHighestBid || 0,
    currentHighestTeam: data.currentHighestTeam,
    timerSeconds: data.timerSeconds || 15,
    totalAuctionPot: data.totalAuctionPot || 0,
    teamBudgets: data.teamBudgets || [],
    soldPlayers: data.soldPlayers || [],
    upcomingPlayers: data.upcomingPlayers || [],
    recentBids: data.recentBids || [],
  }),

  // Add new bid to feed
  addBid: (bid) => set((state) => ({
    recentBids: [bid, ...state.recentBids].slice(0, 20),
    currentHighestBid: bid.amount,
    currentHighestTeam: bid.teamName,
  })),

  // Update timer
  updateTimer: (update) => set({
    timerSeconds: update.secondsRemaining,
    currentHighestBid: update.currentBid || get().currentHighestBid,
    currentHighestTeam: update.currentTeam || get().currentHighestTeam,
  }),

  // Player intro
  setPlayerIntro: (player) => set({
    currentPlayer: player,
    currentHighestBid: 0,
    currentHighestTeam: null,
    recentBids: [],
  }),

  // SOLD
  processSold: (data) => set((state) => ({
    showSoldOverlay: true,
    soldData: data,
    soldPlayers: [...state.soldPlayers, data],
    currentPlayer: null,
    teamBudgets: state.teamBudgets.map((t) =>
      t.teamId === data.teamId
        ? { ...t, budgetRemaining: t.budgetRemaining - data.soldPrice, playersBought: t.playersBought + 1 }
        : t
    ),
    totalAuctionPot: state.totalAuctionPot + data.soldPrice,
  })),

  hideSoldOverlay: () => set({ showSoldOverlay: false, soldData: null }),

  // Reactions (float up and auto-remove)
  addReaction: (emoji) => {
    const id = Date.now() + Math.random();
    const x = 20 + Math.random() * 60; // random horizontal position
    set((state) => ({
      reactions: [...state.reactions, { id, emoji, x }],
    }));
    // Auto-remove after 2 seconds
    setTimeout(() => {
      set((state) => ({
        reactions: state.reactions.filter((r) => r.id !== id),
      }));
    }, 2000);
  },

  // Reset
  reset: () => set({
    auctionStatus: 'SETUP',
    currentPlayer: null,
    currentHighestBid: 0,
    currentHighestTeam: null,
    timerSeconds: 15,
    totalAuctionPot: 0,
    teamBudgets: [],
    soldPlayers: [],
    upcomingPlayers: [],
    recentBids: [],
    reactions: [],
    showSoldOverlay: false,
    soldData: null,
  }),
}));
