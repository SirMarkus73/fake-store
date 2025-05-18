import { tsr } from "../reactQuery"

export const useQueryProducts = () => {
  const data = tsr.products.getAll.useQuery({
    queryKey: ["products"],
    refetchOnWindowFocus: false,
  })

  return data
}
