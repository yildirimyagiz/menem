import type { DateRange } from "~/types/date";

const convertSelectedDateToString = ([startDate, endDate]: DateRange) => {
  const dateString =
    (startDate?.toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
    }) ?? "") +
    (endDate
      ? " - " +
        endDate.toLocaleDateString("en-US", {
          month: "short",
          day: "2-digit",
        })
      : "");
  return dateString;
};

export default convertSelectedDateToString;
