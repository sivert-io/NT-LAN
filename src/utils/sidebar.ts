import { RegisterFieldsType } from "@/components/register/types";
import { LAN_DATES } from "@/server/config";

export function formatRegisteredDates(registeredDates: string[]) {
  // Create a map to convert date strings to day names
  const dayMap = {
    [LAN_DATES[0]]: 'Fredag',
    [LAN_DATES[1]]: 'Lørdag',
    [LAN_DATES[2]]: 'Søndag',
    // Add more date-to-day mappings as needed
  };

  // Sort the registeredDates in chronological order
  registeredDates.sort();

  // Initialize variables to track the start and end of date ranges
  let rangeStart = registeredDates[0];
  let rangeEnd = registeredDates[0];

  // Initialize an array to store the formatted day ranges
  const formattedRanges = [];

  // Iterate through the sorted registeredDates to identify date ranges
  for (let i = 1; i < registeredDates.length; i++) {
    const currentDate = registeredDates[i];
    const currentDateObj = new Date(currentDate);
    const prevDateObj = new Date(rangeEnd);

    // Check if the current date is adjacent to the previous date
    if (
      currentDateObj.setDate(currentDateObj.getDate() - 1) ===
      prevDateObj.getTime()
    ) {
      rangeEnd = currentDate;
    } else {
      // If not adjacent, add the date range to the formattedRanges array
      if (rangeStart === rangeEnd) {
        formattedRanges.push(dayMap[rangeStart]);
      } else {
        formattedRanges.push(`${dayMap[rangeStart]}-${dayMap[rangeEnd]}`);
      }
      // Reset the rangeStart and rangeEnd for the next range
      rangeStart = currentDate;
      rangeEnd = currentDate;
    }
  }

  // Add the last date range to the formattedRanges array
  if (rangeStart === rangeEnd) {
    formattedRanges.push(dayMap[rangeStart]);
  } else {
    formattedRanges.push(`${dayMap[rangeStart]}-${dayMap[rangeEnd]}`);
  }

  // Define the desired sorting order for titles (day ranges)
  const sortingOrder = [
    'Fredag',
    'Fredag-Lørdag',
    'Fredag-Søndag',
    'Fredag og Søndag',
    'Lørdag',
    'Lørdag-Søndag',
    'Søndag',
  ];

  // Sort the formattedRanges based on the sortingOrder
  formattedRanges.sort((a, b) => sortingOrder.indexOf(a) - sortingOrder.indexOf(b));

  // Join the formattedRanges array with " og " to create the desired format
  return formattedRanges.join(' og ');
}

export function generateUniqueTitles(sidebarPeople: (RegisterFieldsType & { registeredDates: string[] })[]): string[] {
  const uniqueTitles: string[] = [];

  sidebarPeople.forEach((person) => {
    const title = formatRegisteredDates(person.registeredDates);
    if (!uniqueTitles.includes(title)) {
      uniqueTitles.push(title);
    }
  });

  // Define the desired sorting order for titles (day ranges)
  const sortingOrder = [
    'Fredag',
    'Fredag-Lørdag',
    'Fredag-Søndag',
    'Fredag og Søndag',
    'Lørdag',
    'Lørdag-Søndag',
    'Søndag',
  ];

  // Sort the uniqueTitles based on the sortingOrder
  uniqueTitles.sort((a, b) => sortingOrder.indexOf(a) - sortingOrder.indexOf(b));

  return uniqueTitles;
}
