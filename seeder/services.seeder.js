const { ServicesModel } = require("../models");

module.exports = categoriesSeeder = async () => {
  try {
    const servicesData = [
      // 🚗 Car Repair
      {
        category_id: "67af294bc4541111fb5e938f", // Car Repair
        service_name: "Engine Repair",
        image_url: "https://cdn-icons-png.flaticon.com/512/3209/3209284.png",
        is_active: true,
        is_delete: false,
      },
      {
        category_id: "67af294bc4541111fb5e938f", // Car Repair
        service_name: "Transmission Repair",
        image_url: "https://cdn-icons-png.flaticon.com/512/3208/3208804.png",
        is_active: true,
        is_delete: false,
      },
    
      // 🛢️ Oil Change
      {
        category_id: "67af294bc4541111fb5e9392", // Oil Change
        service_name: "Full Synthetic Oil Change",
        image_url: "https://cdn-icons-png.flaticon.com/512/3456/3456437.png",
        is_active: true,
        is_delete: false,
      },
      {
        category_id: "67af294bc4541111fb5e9392", // Oil Change
        service_name: "Conventional Oil Change",
        image_url: "https://cdn-icons-png.flaticon.com/512/3456/3456440.png",
        is_active: true,
        is_delete: false,
      },
    
      // 🛞 Tire Services
      {
        category_id: "67af294bc4541111fb5e9395", // Tire Services
        service_name: "Tire Replacement",
        image_url: "https://cdn-icons-png.flaticon.com/512/2809/2809762.png",
        is_active: true,
        is_delete: false,
      },
      {
        category_id: "67af294bc4541111fb5e9395", // Tire Services
        service_name: "Tire Balancing & Alignment",
        image_url: "https://cdn-icons-png.flaticon.com/512/3089/3089804.png",
        is_active: true,
        is_delete: false,
      },
    
      // 🚿 Car Wash
      {
        category_id: "67af294bc4541111fb5e9398", // Car Wash
        service_name: "Interior Cleaning",
        image_url: "https://cdn-icons-png.flaticon.com/512/7425/7425724.png",
        is_active: true,
        is_delete: false,
      },
      {
        category_id: "67af294bc4541111fb5e9398", // Car Wash
        service_name: "Exterior Wax & Polish",
        image_url: "https://cdn-icons-png.flaticon.com/512/7425/7425729.png",
        is_active: true,
        is_delete: false,
      },
    
      // 🔋 Battery Replacement
      {
        category_id: "67af294bc4541111fb5e939b", // Battery Replacement
        service_name: "Battery Testing & Diagnostics",
        image_url: "https://cdn-icons-png.flaticon.com/512/2207/2207696.png",
        is_active: true,
        is_delete: false,
      },
      {
        category_id: "67af294bc4541111fb5e939b", // Battery Replacement
        service_name: "Battery Replacement",
        image_url: "https://cdn-icons-png.flaticon.com/512/2207/2207703.png",
        is_active: true,
        is_delete: false,
      },
    
      // 🛑 Brake Repair
      {
        category_id: "67af294bc4541111fb5e939e", // Brake Repair
        service_name: "Brake Pad Replacement",
        image_url: "https://cdn-icons-png.flaticon.com/512/6165/6165620.png",
        is_active: true,
        is_delete: false,
      },
      {
        category_id: "67af294bc4541111fb5e939e", // Brake Repair
        service_name: "Brake Fluid Change",
        image_url: "https://cdn-icons-png.flaticon.com/512/6165/6165631.png",
        is_active: true,
        is_delete: false,
      },
    
      // ❄️ AC Repair
      {
        category_id: "67af294bc4541111fb5e93a1", // AC Repair
        service_name: "AC Gas Refill",
        image_url: "https://cdn-icons-png.flaticon.com/512/4699/4699352.png",
        is_active: true,
        is_delete: false,
      },
      {
        category_id: "67af294bc4541111fb5e93a1", // AC Repair
        service_name: "AC Filter Replacement",
        image_url: "https://cdn-icons-png.flaticon.com/512/4699/4699391.png",
        is_active: true,
        is_delete: false,
      },
    ];
    
    
    
    for (let service of servicesData) {
      const exist = await ServicesModel.findOne({ service_name: service.service_name });
      if (!exist) {
        await ServicesModel.create(service);
      }
    }

    console.log("✅ Service seeder run successfully...");
  } catch (error) {
    console.log("❌ Error from Service seeder :", error);
  }
};
