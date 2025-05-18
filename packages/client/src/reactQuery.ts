import { allContract } from "@shared/contracts/all"
import { initTsrReactQuery } from "@ts-rest/react-query/v5"

export const tsr = initTsrReactQuery(allContract, {
  baseUrl: window.location.origin,
  baseHeaders: {
    "x-app-source": "ts-rest",
  },
  validateResponse: true,
})
