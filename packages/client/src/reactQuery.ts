import { initTsrReactQuery } from "@ts-rest/react-query/v5"
import { allContract } from "../../common/contracts/all"

export const tsr = initTsrReactQuery(allContract, {
  baseUrl: window.location.origin,
  baseHeaders: {
    "x-app-source": "ts-rest",
  },
  validateResponse: true,
})
