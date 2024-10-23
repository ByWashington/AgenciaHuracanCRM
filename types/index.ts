export type PlaceDTO = {
  id?: string
  storeId: string
  code: string
  kidFriendly: boolean
  hours: string
  otherUnits: boolean
  address: string
  startDate: Date | undefined
  endDate: Date | undefined
  images: { url?: string }[] | undefined
  language: string
  label: string
  description: string
  tip: string
}
