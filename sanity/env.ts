export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-02-07'

export const dataset = assertValue(
  process.env.NEXT_PUBLIC_SANITY_DATASET,
  'Missing environment variable: NEXT_PUBLIC_SANITY_DATASET'
)

export const token = assertValue(
  "skOoqRh8A4vvgpYj4E2Gjryo1pVjhlG8jaMVGjg3k1dWu2Jg5FCRddyouibmqPYIHYZtqqCui9Kl6qqUaqWse7T5DUKKIqGAjcr7uzV2BOhZgGetIweGBUUwkp6LgXLe6IbvXvIfwBDZ7yNs31jZhapE2f0JFyhKDzkOqZESwQbXsJU71v0F",
  'Missing environment variable: NEXT_API_TOKEN'
)
export const projectId = assertValue(
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  'Missing environment variable: NEXT_PUBLIC_SANITY_PROJECT_ID'
)
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage)
  }

  return v
}
