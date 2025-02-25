// Step 1: Parse the date in DD/MM/YYYY format
let dateString = "26/10/2024";
let [day, month, year] = dateString.split('/');

// Note: JavaScript's Date constructor uses 0-based month indexing (January is 0, December is 11)
let date = new Date(Date.UTC(year, month - 1, day));

// Step 2: Output the date in UTC
console.log(date);
console.log(date.toISOString());  // This will give you the date in UTC in ISO format