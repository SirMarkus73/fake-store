import type Preact from "preact"
import { tsr } from "../reactQuery"
import { Button } from "./button"

export function CreateProductForm() {
  const queryClient = tsr.useQueryClient()

  const { mutate } = tsr.products.post.useMutation({
    onMutate: (newPost) => {
      const lastGood = queryClient.products.getAll.getQueryData(["products"])

      queryClient.products.getAll.setQueryData(["products"], (old) => {
        if (old) {
          return {
            ...old,
            body: {
              ...old.body,
              products: [
                ...old.body.products,
                {
                  ...newPost.body,
                  id: -1,
                  categories: [],
                },
              ],
            },
          }
        }

        // If old is undefined, return a new object with the expected shape
        return {
          status: 200,
          body: {
            products: [
              {
                ...newPost.body,
                id: -1,
                categories: [],
              },
            ],
          },
          headers: new Headers(),
        }
      })

      return { lastGood }
    },

    onError: (_error, _newPost, context) => {
      queryClient.products.getAll.setQueryData(["products"], context?.lastGood)
    },
    onSettled: () => {
      // trigger a refetch regardless if the mutation was successful or not
      queryClient.invalidateQueries({ queryKey: ["products"] })
      //                 ^ QueryClient functions that do not consume or provide typed data are not wrapped by ts-rest
      // and are provided at the root level only
    },
  })

  const handleForm = (e: Preact.JSX.TargetedSubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = Object.fromEntries(new FormData(e.currentTarget))

    const { name, price } = formData

    mutate({ body: { name: name as string, price: Number(price) } })
  }

  return (
    <form className="flex flex-col gap-2" onSubmit={handleForm}>
      <fieldset className="flex flex-wrap gap-4 border border-gray-400 p-3">
        <legend className="ml-4 px-2 text-xl">Create a product</legend>
        <label className="flex cursor-text flex-wrap gap-2">
          Name:
          <input
            name="name"
            className="p-0.5 outline outline-gray-400"
            required
          />
        </label>

        <label className="flex cursor-text flex-wrap gap-2">
          Price:
          <input
            name="price"
            className="p-0.5 outline outline-gray-400"
            required
          />
        </label>
      </fieldset>
      <Button type="submit" className="w-full">
        Submit
      </Button>
    </form>
  )
}
