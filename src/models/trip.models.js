import mongoose from "mongoose";

const tripSchema = new mongoose.Schema({

  // BASIC TRIP INFO
  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  destination: {
    type: String
  },

  latitude: Number,
  longitude: Number,

  startDate: Date,
  endDate: Date,

  plannerType: {
    type: String,
    enum: ["manual", "ai"],
    default: "manual"
  },

  tripType: {
    type: String,
    enum: ["solo", "couple", "friends", "family", "group"],
    default: "solo"
  },

  travelStyle: {
    type: String,
    enum: [
      "adventure",
      "relax",
      "budget",
      "luxury",
      "cultural",
      "nature",
      "party"
    ]
  },

  budget: Number,

  status: {
    type: String,
    enum: ["upcoming", "active", "completed"],
    default: "upcoming"
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  // MEMBERS
  members: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      role: {
        type: String,
        enum: ["admin", "member"],
        default: "member"
      }
    }
  ],

  // EXPENSE TRACKING
  balances: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      amount: {
        type: Number,
        default: 0
      }
    }
  ],

  totalExpense: {
    type: Number,
    default: 0
  },

  // MEDIA
  coverImage: String,
  images: [String],

  // TRIP PLAN
  itinerary: [
    {
      day: Number,
      plan: String
    }
  ],

  // AI GENERATED DETAILS (optional)
  hotels: [
    {
      name: String,
      priceRange: String,
      description: String
    }
  ],

  restaurants: [
    {
      name: String,
      specialty: String,
      location: String
    }
  ],

  budgetBreakdown: {
    transport: String,
    accommodation: String,
    food: String,
    activities: String
  },

  travelTips: [String],

  bestTimeToVisit: String,

  recommendedTransport: String

}, { timestamps: true });

export default mongoose.model("Trip", tripSchema);