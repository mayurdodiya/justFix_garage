const { CategoriesModel } = require("../models");

module.exports = categoriesSeeder = async () => {
  try {
    const categoriesData = [
      {
        name: "Car Repair",
        description: "Professional car repair and maintenance services.",
        image_url: "https://cdn-icons-png.flaticon.com/512/10874/10874252.png",
        is_active: true,
      },
      {
        name: "Oil Change",
        description: "Quick and efficient engine oil change services.",
        image_url: "https://cdn-icons-png.flaticon.com/512/3456/3456437.png",
        is_active: true,
      },
      {
        name: "Tire Services",
        description: "Tire replacement, alignment, and balancing services.",
        image_url: "https://cdn-icons-png.flaticon.com/512/2809/2809762.png",
        is_active: true,
      },
      {
        name: "Car Wash",
        description: "Exterior and interior car cleaning and detailing.",
        image_url: "https://cdn-icons-png.flaticon.com/512/7425/7425724.png",
        is_active: true,
      },
      {
        name: "Battery Replacement",
        description: "Car battery diagnostics and replacement services.",
        image_url: "https://cdn-icons-png.flaticon.com/512/2207/2207696.png",
        is_active: true,
      },
      {
        name: "Brake Repair",
        description: "Brake pad replacement and brake system checkups.",
        image_url: "https://cdn-icons-png.flaticon.com/512/6165/6165620.png",
        is_active: true,
      },
      {
        name: "AC Repair",
        description: "Air conditioning diagnostics and gas refilling.",
        image_url: "https://cdn-icons-png.flaticon.com/512/4699/4699352.png",
        is_active: true,
      },
    ];
    
    for (let category of categoriesData) {
      const exist = await CategoriesModel.findOne({ name: category.name });
      if (!exist) {
        await CategoriesModel.create(category);
      }
    }

    console.log("✅ Category seeder run successfully...");
  } catch (error) {
    console.log("❌ Error from Category seeder :", error);
  }
};
