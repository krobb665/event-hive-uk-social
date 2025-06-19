const TICKETMASTER_API_KEY = 'tFa5oK55QXJZxuDukSDeGZUqPUrCKTyw'
const TICKETMASTER_BASE_URL = 'https://app.ticketmaster.com/discovery/v2'

export interface TicketmasterEvent {
  id: string
  name: string
  type: string
  url: string
  locale: string
  images: Array<{
    ratio: string
    url: string
    width: number
    height: number
    fallback: boolean
  }>
  sales: {
    public: {
      startDateTime: string
      startTBD: boolean
      startTBA: boolean
      endDateTime: string
    }
  }
  dates: {
    start: {
      localDate: string
      localTime: string
      dateTime: string
      dateTBD: boolean
      dateTBA: boolean
      timeTBA: boolean
      noSpecificTime: boolean
    }
    timezone: string
    status: {
      code: string
    }
  }
  classifications: Array<{
    primary: boolean
    segment: {
      id: string
      name: string
    }
    genre: {
      id: string
      name: string
    }
    subGenre: {
      id: string
      name: string
    }
  }>
  priceRanges?: Array<{
    type: string
    currency: string
    min: number
    max: number
  }>
  _embedded?: {
    venues: Array<{
      name: string
      type: string
      id: string
      test: boolean
      url: string
      locale: string
      timezone: string
      city: {
        name: string
      }
      country: {
        name: string
        countryCode: string
      }
      address: {
        line1: string
      }
      location: {
        longitude: string
        latitude: string
      }
    }>
  }
}

export interface TicketmasterResponse {
  _embedded?: {
    events: TicketmasterEvent[]
  }
  _links: {
    self: {
      href: string
    }
    next?: {
      href: string
    }
  }
  page: {
    size: number
    totalElements: number
    totalPages: number
    number: number
  }
}

export const searchEvents = async (
  keyword?: string,
  category?: string,
  city?: string,
  startDate?: string,
  endDate?: string,
  page = 0,
  size = 20
): Promise<TicketmasterResponse> => {
  const params = new URLSearchParams({
    apikey: TICKETMASTER_API_KEY,
    countryCode: 'GB',
    page: page.toString(),
    size: size.toString(),
    sort: 'date,asc'
  })

  // Use fixed start date of June 1st, 2025 if no start date is provided
  const defaultStartDate = startDate || '2025-06-01T00:00:00Z'
  params.append('startDateTime', defaultStartDate)

  if (keyword) params.append('keyword', keyword)
  if (category) params.append('classificationName', category)
  if (city) params.append('city', city)
  if (endDate) params.append('endDateTime', endDate)

  console.log('Searching events with startDateTime:', defaultStartDate)

  const response = await fetch(`${TICKETMASTER_BASE_URL}/events.json?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch events')
  }

  return response.json()
}

export const getEventById = async (eventId: string): Promise<TicketmasterEvent> => {
  const params = new URLSearchParams({
    apikey: TICKETMASTER_API_KEY
  })

  const response = await fetch(`${TICKETMASTER_BASE_URL}/events/${eventId}.json?${params}`)
  if (!response.ok) {
    throw new Error('Failed to fetch event')
  }

  return response.json()
}

export const getTodayEvents = async (): Promise<TicketmasterResponse> => {
  const startDate = '2025-06-01T00:00:00Z'
  const endDate = '2025-06-02T00:00:00Z'
  
  return searchEvents(undefined, undefined, undefined, startDate, endDate)
}

export const getFeaturedEvents = async (): Promise<TicketmasterResponse> => {
  // Get events from June 1st, 2025 onwards, sorted by date
  return searchEvents(undefined, undefined, undefined, '2025-06-01T00:00:00Z', undefined, 0, 6)
}
