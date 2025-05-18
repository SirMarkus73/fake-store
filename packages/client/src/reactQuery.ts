import { initTsrReactQuery } from "@ts-rest/react-query/v5"
import { allContract } from "../../common/contracts/all"

export const tsr = initTsrReactQuery(allContract, {
  baseUrl: "http://localhost:5173",
  baseHeaders: {
    "x-app-source": "ts-rest",
  },
  validateResponse: true,
})
