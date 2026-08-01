import {getRequestConfig} from "next-intl/server";

export default getRequestConfig(async () => {
  return {
    locale: "sl",
    messages: (await import("../messages/sl.json")).default
  };
});