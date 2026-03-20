import Groq from "groq-sdk";
import axios from "axios";
import Trip from "../../models/trip.models.js";
import { buildTravelPrompt } from "../../utils/aiPromptBuilder.js";
import ChatGroup from "../../models/chatGroup.models.js";


const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const UNSPLASH_KEY = process.env.UNSPLASH_KEY;


/*
---------------------------------------
Fetch Images from Unsplash
---------------------------------------
*/


async function fetchImages(query) {
  try {

    const response = await axios.get(
      "https://api.unsplash.com/search/photos",
      {
        params: {
          query,
          per_page: 5,
          orientation: "landscape",
          client_id: UNSPLASH_KEY
        },
        timeout: 8000
      }
    );

    return response.data.results.map(img => img.urls.regular);

  } catch (error) {
    console.error("Unsplash API Error:", error.message);
    return [];
  }
}



/*
---------------------------------------
Generate AI Travel Plan (Preview Only)
---------------------------------------
*/
export const generateTravelPlan = async (req, res) => {

  try {

    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized user"
      });
    }

    const { budget, days, travelStyle, groupType, currentCity } = req.body;

    if (!budget || !days || !travelStyle || !currentCity) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields"
      });
    }


    /*
    ---------------------------
    Build Prompt
    ---------------------------
    */
    const prompt = buildTravelPrompt({
      budget,
      days,
      travelStyle,
      groupType,
      currentCity
    });


    /*
    ---------------------------
    Call AI
    ---------------------------
    */
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7
    });

    let aiResponse = completion.choices[0].message.content;

    aiResponse = aiResponse
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();


    /*
    ---------------------------
    Parse AI JSON
    ---------------------------
    */
    let parsed;

    try {
      parsed = JSON.parse(aiResponse);
    } catch (error) {

      console.error("AI JSON Parse Error:", aiResponse);

      return res.status(500).json({
        success: false,
        message: "AI returned invalid JSON"
      });
    }


    /*
    ---------------------------
    Fetch Images
    ---------------------------
    */
    const images = await fetchImages(parsed.destination);
    const coverImage = images?.[0] || null;


    /*
    ---------------------------
    Convert itinerary safely
    ---------------------------
    */
    const itinerary = (parsed.itinerary || []).map(day => {

      let plan = "";

      if (day.plan) {
        plan = day.plan;
      } else {

        const morning = day.morning ? `Morning: ${day.morning}. ` : "";
        const afternoon = day.afternoon ? `Afternoon: ${day.afternoon}. ` : "";
        const evening = day.evening ? `Evening: ${day.evening}. ` : "";

        plan = morning + afternoon + evening;
      }

      return {
        day: day.day || 1,
        plan: plan || "Explore the destination"
      };
    });


    /*
    ---------------------------
    Safe Fallbacks
    ---------------------------
    */
    const destination = parsed.destination || "Unknown Destination";

    const latitude = parsed.latitude || null;
    const longitude = parsed.longitude || null;

    const hotels = parsed.hotels || [];
    const restaurants = parsed.restaurants || [];

    const travelTips = parsed.travelTips || [];

    const bestTimeToVisit = parsed.bestTimeToVisit || "";

    const recommendedTransport = parsed.recommendedTransport || "";


    /*
    ---------------------------
    Return Preview (NOT saved)
    ---------------------------
    */

    return res.status(200).json({

      success: true,
      message: "AI trip generated successfully",

      data: {
        title: `${destination} ${days} Day Trip`,
        description: parsed.reason || "AI Generated Trip",

        destination,
        latitude,
        longitude,

        budget,
        days,
        travelStyle,
        groupType,

        coverImage,
        images,

        itinerary,

        hotels,
        restaurants,

        budgetBreakdown: parsed.budgetBreakdown || {},

        travelTips,

        bestTimeToVisit,

        recommendedTransport
      }

    });

  } catch (error) {

    console.error("AI Travel Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI travel plan generation failed"
    });

  }

};



/*
---------------------------------------
Accept AI Trip (Save to DB)
---------------------------------------
*/
export const acceptAiTrip = async (req, res) => {

  try {

    const userId = req.user._id;

    const { data } = req.body;

    if (!data) {
      return res.status(400).json({
        success: false,
        message: "Trip data missing"
      });
    }


    const savedTrip = await Trip.create({

      title: data.title,

      description: data.description,

      destination: data.destination,

      latitude: data.latitude,

      longitude: data.longitude,

      plannerType: "ai",

      tripType: data.groupType,

      travelStyle: data.travelStyle,

      budget: data.budget,

      coverImage: data.coverImage,

      images: data.images,

      itinerary: data.itinerary,

      hotels: data.hotels,

      restaurants: data.restaurants,

      budgetBreakdown: data.budgetBreakdown,

      travelTips: data.travelTips,

      bestTimeToVisit: data.bestTimeToVisit,

      recommendedTransport: data.recommendedTransport,

      createdBy: userId,

      members: [
        {
          user: userId,
          role: "admin"
        }
      ]

    });


    return res.json({
      success: true,
      message: "Trip saved successfully",
      data: savedTrip
    });

  } catch (error) {

    console.error("Accept AI Trip Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to save trip"
    });

  }

};


export const addMembersToTrip=async(req,res)=>{
  try {
    const userId = req.user._id
    const { tripId } = req.params
    const { memberIds } = req.body

    if (!memberIds || memberIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No members provided"
      })
    }

    const trip = await Trip.findById(tripId)

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      })
    }

    // Check if user is already part of trip
    const isMember = trip.members.some(
      m => m.user.toString() === userId
    )

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to add members"
      })
    }

    // Existing members
    const existingMembers =
      trip.members.map(m => m.user.toString())

    // Filter new members
    const newMembers = memberIds
      .filter(id => !existingMembers.includes(id))
      .map(id => ({
        user: id,
        role: "member"
      }))

    trip.members.push(...newMembers)

    await trip.save()

    let chatGroup=await ChatGroup.findOne({
      trip:tripId
    })

    if(!chatGroup){
      chatGroup=await ChatGroup.create({
        trip:trip._id,
        name:trip.title,
        createdBy:trip.createdBy,
        members:trip.members.map(m=>({
          user:m.user,
        }))
      })
    }

    

    return res.json({
      success: true,
      message: "Members added successfully and chat group created",
      data:{
        tripId:trip._id,
        chatGroupId:chatGroup._id
      }
    })


  } catch (error) {
    console.error("Add Members Error:", error)

    return res.status(500).json({
      success: false,
      message: "Failed to add members"
    })
  }
}


export const deleteTrip = async (req, res) => {
  try {

    const userId = req.user._id;
    const { tripId } = req.params;

    const trip = await Trip.findById(tripId);

    if (!trip) {
      return res.status(404).json({
        success: false,
        message: "Trip not found"
      });
    }

    // Only creator can delete
    if (trip.createdBy.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: "You are not allowed to delete this trip"
      });
    }

    // delete trip
    await Trip.findByIdAndDelete(tripId);

    // delete chat group linked to trip
    await ChatGroup.deleteOne({ trip: tripId });

    return res.json({
      success: true,
      message: "Chat group and Trip deleted successfully"
    });

  } catch (error) {

    console.error("Delete Trip Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to delete trip"
    });

  }
};