
import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EventCard } from '@/components/EventCard'
import { EventFilters } from '@/components/EventFilters'
import { Calendar, TrendingUp, MapPin, Clock, ArrowRight } from 'lucide-react'
import { searchEvents, getTodayEvents, TicketmasterEvent } from '@/lib/ticketmaster'
import { useAuth } from '@/hooks/useAuth'
import { Link } from 'react-router-dom'

export const Home = () => {
  const [events, setEvents] = useState<TicketmasterEvent[]>([])
  const [todayEvents, setTodayEvents] = useState<TicketmasterEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    city: '',
    dateRange: ''
  })
  const { user } = useAuth()

  useEffect(() => {
    loadEvents()
    loadTodayEvents()
  }, [])

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (filters.search || filters.category || filters.city || filters.dateRange) {
        handleSearch()
      } else {
        loadEvents()
      }
    }, 500)

    return () => clearTimeout(delayedSearch)
  }, [filters])

  const loadEvents = async () => {
    try {
      setLoading(true)
      const response = await searchEvents()
      setEvents(response._embedded?.events || [])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadTodayEvents = async () => {
    try {
      const response = await getTodayEvents()
      setTodayEvents(response._embedded?.events?.slice(0, 6) || [])
    } catch (error) {
      console.error('Error loading today events:', error)
    }
  }

  const handleSearch = async () => {
    try {
      setLoading(true)
      const response = await searchEvents(
        filters.search || undefined,
        filters.category || undefined,
        filters.city || undefined
      )
      setEvents(response._embedded?.events || [])
    } catch (error) {
      console.error('Error searching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      city: '',
      dateRange: ''
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Amazing Events
              <span className="block text-yellow-300">Across the UK</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-purple-100 max-w-3xl mx-auto">
              Find, discuss, and attend the best music, sports, and cultural events happening near you
            </p>
            {!user && (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100" asChild>
                  <Link to="/signup">Join the Community</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10" asChild>
                  <Link to="/events">Browse Events</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Today's Events */}
        {todayEvents.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">Happening Today</h2>
                  <p className="text-gray-600">Don't miss out on tonight's events</p>
                </div>
              </div>
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                {todayEvents.length} events
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {todayEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </section>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="w-5 h-5" />
                <span>Live Events</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{events.length}+</div>
              <p className="text-purple-100">Events this month</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>Trending</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Music</div>
              <p className="text-blue-100">Most popular category</p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-pink-600 to-red-600 text-white">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Top City</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">London</div>
              <p className="text-pink-100">Most active location</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <EventFilters
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={clearFilters}
        />

        {/* All Events */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-3xl font-bold text-gray-900">All Events</h2>
            <Button variant="outline" asChild>
              <Link to="/events">
                View all <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  <CardContent className="p-4">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {events.slice(0, 9).map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No events found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria</p>
              <Button onClick={clearFilters}>Clear filters</Button>
            </Card>
          )}
        </section>
      </div>
    </div>
  )
}
