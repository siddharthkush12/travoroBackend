import Trip from "../../models/trip.models.js";

const createTrip = async (req, res) => {
  try {

    const userId = req.user.id;

    const {
      title,
      description,
      destination,
      startDate,
      endDate,
      tripType,
      travelStyle,
      budget,
      members = []
    } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Trip title is required"
      });
    }

    // Prevent duplicate trip titles per user
    const existingTrip = await Trip.findOne({
      title: title.trim(),
      createdBy: userId
    });

    if (existingTrip) {
      return res.status(400).json({
        success: false,
        message: "Trip with this title already exists"
      });
    }

    // Remove duplicate members
    const uniqueMembers = [...new Set(members)];

    const tripMembers = [
      {
        user: userId,
        role: "admin"
      }
    ];

    uniqueMembers.forEach(memberId => {

      if (memberId !== userId) {
        tripMembers.push({
          user: memberId,
          role: "member"
        });
      }

    });

    const trip = await Trip.create({

      title: title.trim(),

      description,
      destination,

      startDate: startDate ? new Date(startDate) : null,
      endDate: endDate ? new Date(endDate) : null,

      plannerType: "manual",

      tripType,
      travelStyle,

      createdBy: userId,

      members: tripMembers

    });

    res.status(201).json({
      success: true,
      message: "Trip created successfully",
      data: trip
    });

  } catch (error) {

    console.log("Create Trip Error:", error);

    res.status(500).json({
      success: false,
      message: "Trip creation failed"
    });

  }
};


const getMyTrips = async (req, res) => {

  try {

    const userId = req.user.id;

    const trips = await Trip.find({
      "members.user": userId
    })
    .sort({ createdAt: -1 })
    .populate("members.user", "fullname email profilePic");

    res.status(200).json({
      success: true,
      message: "Trips fetched successfully",
      data: trips
    });

  } catch (error) {

    console.error("Fetch Trips Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch trips"
    });

  }

};

export { createTrip, getMyTrips };