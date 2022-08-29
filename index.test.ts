import {
  calculateDaysAgo,
  createFullName,
  getShipmentByShipmentNum,
  addComputedFields,
  getComputedShipmentByShipmentNum,
  getAllShipmentsWCompByOrderNum,
  sortShipmentsByDaysAgo,
  sortShipmentsByDaysAgoToggle,
  sortShipmentsByParam,
  getParentShipment,
} from "./index";

import {
  shipment,
  ordersFirst,
  ascShipments,
  descShipments,
  descShippingNumber,
  parentShipment,
  noParentShipment,
} from "./data";

const computedShipment = {
  ...shipment,
  "Days Ago Shipped": "1356",
  "Full Name": "John Reynolds",
};

test("calculates days ago", () => {
  expect(calculateDaysAgo(shipment["Shipped"])).toBe("1356");
});

test("creates full name", () => {
  expect(createFullName(shipment)).toBe("John Reynolds");
});

test("add computed fields", () => {
  expect(addComputedFields(shipment)).toStrictEqual(computedShipment);
});

describe("single shipment tests", () => {
  test("get shipment by shipment number", () => {
    expect(getShipmentByShipmentNum("SH465980")).toStrictEqual(shipment);
  });

  test("throws no shipment existing error with N/A", () => {
    expect(() => getShipmentByShipmentNum("N/A")).toThrow();
  });

  test("throws no shipment existing error with that number", () => {
    expect(() => getShipmentByShipmentNum("12345")).toThrow();
  });

  test("get computed shipment by shipment number", () => {
    expect(getComputedShipmentByShipmentNum("SH465980")).toStrictEqual(
      computedShipment
    );
  });

  test("throws no computed shipment existing error with that number", () => {
    expect(() => getComputedShipmentByShipmentNum("12345")).toThrow();
  });

  test("throws no computed shipment existing error with N/A", () => {
    expect(() => getComputedShipmentByShipmentNum("N/A")).toThrow();
  });
});

describe("order tests", () => {
  test("get all shipments by order number, including computed fields", () => {
    expect(getAllShipmentsWCompByOrderNum("O936726")).toStrictEqual(
      ordersFirst
    );
  });

  test("throws no order existing with that number", () => {
    expect(() => {
      getAllShipmentsWCompByOrderNum("12345");
    }).toThrow();
  });

  test("throws no order existing with that number with N/A", () => {
    expect(() => {
      getAllShipmentsWCompByOrderNum("N/A");
    }).toThrow();
  });
});

describe("sort tests", () => {
  test("sort shipments by days ago", () => {
    expect(sortShipmentsByDaysAgo()).toStrictEqual(ascShipments);
  });

  test("sort shipments by days ago - toggle, descending", () => {
    expect(sortShipmentsByDaysAgoToggle(true)).toStrictEqual(descShipments);
  });

  test("sort shipments by days ago - toggle, ascending", () => {
    expect(sortShipmentsByDaysAgoToggle(false)).toStrictEqual(ascShipments);
  });

  test("sort shipments by shipping number - toggle, descending", () => {
    expect(sortShipmentsByParam(true, "Number")).toStrictEqual(
      descShippingNumber
    );
  });
});

describe("parent shipment tests", () => {
  test("get parent shipment with recusion", () => {
    expect(getParentShipment("SH927813")).toStrictEqual(parentShipment);
  });

  test("get parent shipment without recursion", () => {
    expect(getParentShipment("SH465994")).toStrictEqual(noParentShipment);
  });

  test("throws no shipment existing with that number error due to N/A", () => {
    expect(() => {
      getParentShipment("N/A");
    }).toThrow();
  });

  test("throws no shipment existing error with that number", () => {
    expect(() => {
      getParentShipment("12345");
    }).toThrow();
  });
});
