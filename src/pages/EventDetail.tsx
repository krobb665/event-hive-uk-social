import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MapPin, Clock, Heart, ExternalLink, MessageCircle, Star, Share2, Users, ArrowLeft } from 'lucide-react'
import { TicketmasterEvent, searchEvents } from '@/lib/ticketmaster'
import { useAuth } from '@/hooks/useAuth'
import { EventCard } from '@/components/EventCard'

export const EventDetail = () => {
  const { eventId } = useParams()
  const [event, setEvent] = useState<TicketmasterEvent | null>(null)
  const [similarEvents, setSimilarEvents] = useState<TicketmasterEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [comment, setComment] = useState('')
  const { user } = useAuth()

  useEffect(() => {
    if (eventId) {
      loadEventDetails()
      loadSimilarEvents()
    }
  }, [eventId])

  const loadEventDetails = async () => {
    try {
      const response = await searchEvents()
      const foundEvent = response._embedded?.events?.find(e => e.id === eventId)
      setEvent(foundEvent || null)
    } catch (error) {
      console.error('Error loading event details:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSimilarEvents = async () => {
    try {
      const response = await searchEvents()
      const events = response._embedded?.events || []
      const filtered = events.filter(e => e.id !== eventId).slice(0, 3)
      setSimilarEvents(filtered)
    } catch (error) {
      console.error('Error loading similar events:', error)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Time TBA'
    const time = new Date(`2000-01-01T${timeString}`)
    return time.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const getMainImage = () => {
    if (!event?.images) return '/placeholder.svg'
    const images = event.images
    const mainImage = images.find(img => img.ratio === '16_9' && img.width >= 1024) || 
                     images.find(img => img.ratio === '16_9') ||
                     images[0]
    return mainImage?.url || '/placeholder.svg'
  }

  const getVenue = () => {
    return event?._embedded?.venues?.[0]
  }

  const getPriceRange = () => {
    if (!event?.priceRanges?.length) return null
    const price = event.priceRanges[0]
    if (price.min === price.max) {
      return `£${price.min}`
    }
    return `£${price.min} - £${price.max}`
  }

  const getGenre = () => {
    return event?.classifications?.[0]?.genre?.name || 'Event'
  }

  const handleAddComment = () => {
    if (comment.trim()) {
      console.log('Adding comment:', comment)
      setComment('')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading event details...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Event not found</h1>
          <Button asChild>
            <Link to="/">Back to events</Link>
          </Button>
        </div>
      </div>
    )
  }

  const venue = getVenue()

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button variant="ghost" className="mb-6" asChild>
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Link>
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card className="overflow-hidden">
              <div className="relative">
                <img
                  src={getMainImage()}
                  alt={event.name}
                  className="w-full h-64 md:h-80 object-cover"
                />
                <div className="absolute top-4 left-4">
                  <Badge className="bg-teal-600 text-white">
                    {getGenre()}
                  </Badge>
                </div>
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Button size="sm" variant="secondary" className="bg-black/60 hover:bg-black/80 text-white">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-black/60 hover:bg-black/80 text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              <CardContent className="p-6">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  {event.name}
                </h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-3 text-teal-600" />
                    <div>
                      <p className="font-medium">{formatDate(event.dates.start.localDate)}</p>
                      {event.dates.start.localTime && (
                        <p className="text-sm text-gray-600">{formatTime(event.dates.start.localTime)}</p>
                      )}
                    </div>
                  </div>
                  
                  {venue && (
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-3 text-teal-600" />
                      <div>
                        <p className="font-medium">{venue.name}</p>
                        <p className="text-sm text-gray-600">{venue.city?.name}</p>
                      </div>
                    </div>
                  )}
                  
                  {getPriceRange() && (
                    <div className="flex items-center">
                      <span className="text-2xl font-bold text-green-600">{getPriceRange()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-3 text-teal-600" />
                    <span className="text-sm text-gray-600">234 people interested</span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button className="flex-1 bg-teal-600 hover:bg-teal-700" asChild>
                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Buy Tickets
                    </a>
                  </Button>
                  <Button variant="outline" className="border-teal-600 text-teal-600 hover:bg-teal-50">
                    <Heart className="w-4 h-4 mr-2" />
                    Save Event
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Event Description */}
            <Card>
              <CardHeader>
                <CardTitle>About This Event</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  Join us for an incredible experience! This event promises to be unforgettable with amazing entertainment and great atmosphere. Don't miss out on this fantastic opportunity to be part of something special.
                </p>
              </CardContent>
            </Card>

            {/* Discussion Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Discussion
                </CardTitle>
              </CardHeader>
              <CardContent>
                {user ? (
                  <div className="space-y-4">
                    <div className="flex space-x-3">
                      <Avatar>
                        <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <Textarea
                          placeholder="Share your thoughts about this event..."
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                        />
                        <Button 
                          className="mt-2 bg-teal-600 hover:bg-teal-700"
                          onClick={handleAddComment}
                          disabled={!comment.trim()}
                        >
                          Post Comment
                        </Button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Sign in to join the discussion</p>
                    <Button asChild>
                      <Link to="/login">Sign In</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Event Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Event Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Interested</span>
                  <span className="font-semibold">234 people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Going</span>
                  <span className="font-semibold">89 people</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Rating</span>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current text-yellow-400" />
                    ))}
                    <span className="ml-1 text-sm text-gray-600">(4.8)</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Similar Events */}
            {similarEvents.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Similar Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {similarEvents.map((similarEvent) => (
                      <EventCard key={similarEvent.id} event={similarEvent} />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
