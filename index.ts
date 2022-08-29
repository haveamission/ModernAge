/*
 * Used a functional approach as this is pretty popular with React
 * I used Typescript as the language
 * I probably would have renamed the keys for the object in a normal situation to camelCase, but I felt that added additional complexity that
 * wasn't necessary for the exercise
 */

interface IProcessedData {
  Number: string;
  "Order Number": string;
  Shipped: string;
  "First Name": string;
  "Last Name": string;
  "Parent Shipment"?: string;
  "Days Ago Shipped"?: string;
  "Full Name"?: string;
}

const shipmentErrMsg = "No shipments with that shipment number exist";
const orderErrMsg = "No shipments with that order number exist";

// Task: Use the following example string while working through all of the requirements:

const rawData: string = `SH348503,O567843,2018-12-10 15:08:58 -0000,Jane,Smith,
SH465980,O936726,2018-12-11 06:08:14 -0000,John,Reynolds,
SH465994,O936726,2018-12-11 06:12:37 -0000,John,Reynolds,
SH867263,O234934,2018-12-11 18:28:51 -0000,Rebecca,Jones,
SH907346,,2018-12-12 21:12:28 -0000,Rebecca,Jones,SH867263
SH927813,,2018-12-15 09:49:35 -0000,Rebecca,Jones,SH907346`;

const orderMapping: Array<string> = [
  "Number",
  "Order Number",
  "Shipped",
  "First Name",
  "Last Name",
  "Parent Shipment",
];

export const DateUTC = (date: Date) => {
  return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
};

/*
 * Calculates number of days ago by normalizing to UTC (accounts for timezone changes, though the data set already seems normalized, it may not be true
 * for broader use cases), subtracting timestamps from one another and then multiplying to get number of days. In actual code I'd probably use
 * a library to do this like Luxon
 */
export const calculateDaysAgo = (date: string) => {
  const pastDate = new Date(Date.parse(date));
  const currentDate = new Date();
  const pastDateUTC = DateUTC(pastDate);
  const currentDateUTC = DateUTC(currentDate);
  return String(
    Math.floor((currentDateUTC - pastDateUTC) / (1000 * 3600 * 24))
  );
};

export const createFullName = (shipment: Partial<IProcessedData>) => {
  return `${shipment["First Name"]} ${shipment["Last Name"]}`;
};

/*
 * Converts rawData string into first an array of strings based on newlines. At that point, splits each shipment into a set of values and gives it
 * a key based on the mapping set above. This technically makes it unordered, which, in a more complex use-case could pose a problem for correct
 * print order in Task #1, and I suspect you may have wanted me to access each value via the array index, but I felt this way was more elegant.
 * I am happy to write up the alternative way, accessing via the array key, if desired
 */
const partialProcessedData: Array<Partial<IProcessedData>> = rawData
  .split(/\r?\n/)
  .map((shipment) => {
    const valuesArray = shipment.split(",");
    const obj = valuesArray.reduce(
      (combined: Partial<IProcessedData>, rawValue: string, index: number) => {
        const value = rawValue ? rawValue : "N/A";
        return { ...combined, [orderMapping[index]]: value };
      },
      {}
    );
    return obj;
  });

// Once process is finished, casting to IProcessedData rather than just leaving it partial
export const processedData = partialProcessedData as Array<IProcessedData>;

// Task: Write a function that prints out all of the shipments to the standard output.
// The expected output should look like the following:

// The question asks for a direct print to output, so unless I want to write some sort of return to test beforehand, not really a good place to write
// tests here
const ShipmentToOutput = () => {
  processedData.forEach((order: IProcessedData, index: number) => {
    const shipmentTitle = `Shipment #${index}:`;
    const formatted = Object.entries(order)
      .map((value) => `${value[0]}: ${value[1]}`)
      .join(", ");
    console.log(shipmentTitle);
    console.log(formatted);
  });
};

// Task: Write a function that takes a shipment number as an argument and returns all of the shipment's properties.
// How the shipment information is returned is up to you.

export const getShipmentByShipmentNum = (shipmentNumber: string) => {
  if (shipmentNumber === "N/A") {
    throw shipmentErrMsg;
  }
  const shipment = processedData.find((obj) => {
    return obj["Number"] === shipmentNumber;
  });
  if (!shipment) {
    throw shipmentErrMsg;
  }
  return shipment;
};

// Task: Write a function that takes a shipment number as an argument and returns all of the
// shipment's properties and two additional computed properties:

// Full name: The format for the customer's full name is first name, a space
// followed by the last name (e.g. Jane Smith)

// Days ago shipped: Number of days between when the shipment was shipped
// and the current date

export const addComputedFields = (shipment: IProcessedData) => {
  const fullName = createFullName(shipment);
  const daysAgoShipped = calculateDaysAgo(shipment["Shipped"]!);
  return {
    ...shipment,
    "Days Ago Shipped": daysAgoShipped,
    "Full Name": fullName,
  };
};

export const getComputedShipmentByShipmentNum = (shipmentNumber: string) => {
  if (shipmentNumber === "N/A") {
    throw shipmentErrMsg;
  }
  const shipment = processedData.find((obj) => {
    return obj["Number"] === shipmentNumber;
  });
  if (!shipment) {
    throw shipmentErrMsg;
  }

  return addComputedFields(shipment);
};

// Task: Write a function that takes an order number as an argument and returns the
// properties for all of the associated shipments. The return value should include all of
// the properties from requirement 3.

// Note: It is unclear whether you want the child shipments (i.e. 5 & 6 being children of 4, which has an order number, whereas 5 & 6 do not)
// so I didn't include it here. However, if you did want that, you could get it similarly to how I did the answer to #8, with recursion

// Technically this will not fail if you pass in N/A
export const getAllShipmentsWCompByOrderNum = (orderNumber: string) => {
  if (orderNumber === "N/A") {
    throw orderErrMsg;
  }
  const shipments = processedData.filter((obj) => {
    return obj["Order Number"] === orderNumber;
  });
  if (!shipments || shipments.length === 0) {
    throw orderErrMsg;
  }
  return shipments.map((shipment) => addComputedFields(shipment));
};

// Task: Write a function that returns all of the shipments, sorted by "Days Ago Shipped"
// (from requirement 3). The return value should include all of the properties from
// requirement 3.

export const sortShipmentsByDaysAgo = () => {
  const sortProp = "Days Ago Shipped";
  const computedShipments = processedData.map((shipment) =>
    addComputedFields(shipment)
  );

  const sortedShipments = computedShipments.sort(
    (a, b) => parseInt(a[sortProp]) - parseInt(b[sortProp])
  );

  return sortedShipments;
};

// Sorting the shipments is re-usable so I seperated it out
const sortShipments = (
  a: IProcessedData,
  b: IProcessedData,
  sortDesc: boolean,
  sortProp: keyof IProcessedData
) => {
  const valueA = a[sortProp]!;
  const valueB = b[sortProp]!;
  if (sortDesc) {
    return valueB.localeCompare(valueA);
  } else if (!sortDesc) {
    return valueA.localeCompare(valueB);
  }
  return 0;
};

// Update the function from requirement 5 to take an argument that toggles the return
// value's sort order between ascending and descending. The return value should
// continue to include all of the properties from requirement 3.

export const sortShipmentsByDaysAgoToggle = (sortDesc = false) => {
  const sortProp = "Days Ago Shipped";
  const computedShipments = processedData.map((shipment) =>
    addComputedFields(shipment)
  );

  const sortedShipments = computedShipments.sort((a, b) =>
    sortShipments(a, b, sortDesc, sortProp)
  );

  return sortedShipments;
};

// Update the function from requirement 5 and 6 to take an additional argument that
// represents the shipment property (e.g., order number, first name) that the return
// value will be sorted by. The return value should continue to include all of the
// properties from requirement 3.

export const sortShipmentsByParam = (
  sortDesc = false,
  sortProp = "Days Ago Shipped" as keyof IProcessedData
) => {
  const computedShipments = processedData.map((shipment) =>
    addComputedFields(shipment)
  );

  const sortedShipments = computedShipments.sort((a, b) =>
    sortShipments(a, b, sortDesc, sortProp)
  );

  return sortedShipments;
};

// Write a function that takes a shipment number and returns the original shipment i.e.
// the top most parent shipment. If there is no parent shipment (the shipment number
// passed in is the parent), then return that shipment. The return value should continue
// to include all of the properties from requirement 3.

export const getParentShipment = (shipmentNumber: string) => {
  if (shipmentNumber === "N/A") {
    throw shipmentErrMsg;
  }
  const shipment = processedData.find((obj) => {
    return obj["Number"] === shipmentNumber;
  });
  if (!shipment) {
    throw shipmentErrMsg;
  }

  const topShipment: IProcessedData =
    shipment["Parent Shipment"] === "N/A"
      ? shipment
      : getParentShipment(shipment["Parent Shipment"]!);

  return topShipment;
};

const loggingToStdOut = () => {
  console.log("SHIPMENT TO OUTPUT");
  console.log(ShipmentToOutput());
  console.log("GET SHIPMENT BY SHIPMENT NUMBER");
  console.log(getShipmentByShipmentNum("SH465980"));
  console.log("GET COMPUTED SHIPMENT BY SHIPMENT NUMBER");
  console.log(getComputedShipmentByShipmentNum("SH465980"));
  console.log("GET ALL SHIPMENTS WITH COMPUTED FIELDS BY ORDER NUMBER");
  console.log(getAllShipmentsWCompByOrderNum("O936726"));
  console.log("GET ALL SHIPMENTS SORTED BY DAYS AGO ASCENDING");
  console.log(sortShipmentsByDaysAgo());
  console.log("GET ALL SHIPMENTS SORTED BY DAYS AGO DESCENDING");
  console.log(sortShipmentsByDaysAgoToggle(true));
  console.log("GET ALL SHIPMENTS SORTED BY SHIPPING NUMBER DESCENDING");
  console.log(sortShipmentsByParam(true, "Number"));
  console.log("GET ALL SHIPMENTS SORTED BY SHIPPING NUMBER ASCENDING");
  console.log(sortShipmentsByParam(false, "Number"));
  console.log("GET TOP SHIPMENT WITH RECUSION");
  console.log(getParentShipment("SH927813"));
  console.log("GET TOP SHIPMENT NO RECUSION");
  console.log(getParentShipment("SH465994"));
};

loggingToStdOut();
