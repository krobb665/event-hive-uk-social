
import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Calendar, MapPin, Clock, Heart, ExternalLink, Users, MessageCircle, Share2, ArrowLeft } from 'lucide-react'
import { getEventById, TicketmasterEvent } from '@/lib/ticketmaster'
import { useAuth } from '@/hooks/useAuth'
import { toast } from '@/hooks/use-toast'

export const EventDetail = () => {
  const { eventId } = useParams<{ eventId: string }>()
  const [event, setEvent] = useState<TicketmasterEvent | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSaved, setIsSaved] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (eventId) {
      loadEvent()
    }
  }, [eventId])

  const loadEvent = async () => {
    if (!eventId) return
    
    try {
      setLoading(true)
      const eventData = await getEventById(eventId)
      setEvent(eventData)
    } catch (error) {
      console.error('Error loading event:', error)
      toast({
        title: "Error",
        description: "Failed to load event details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
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
    if (!event?.images?.length) return '/placeholder.svg'
    const mainImage = event.images.find(img => img.ratio === '16_9' && img.width >= 1024) || 
                     event.images.find(img => img.ratio === '16_9') ||
                     event.images[0]
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

  const handleShare = () => {
    if (navigator.share && event) {
      navigator.share({
        title: event.name,
        text: `Check out this event: ${event.name}`,
        url: window.location.href
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Link copied!",
        description: "Event link copied to clipboard"
      })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-96 bg-gray-200 rounded-lg mb-6"></div>
            <div className="h-8 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 flex items-center justify-center">
        <Card className="p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Event Not Found</h2>
          <p className="text-gray-600 mb-4">The event you're looking for doesn't exist.</p>
          <Button asChild>
            <Link to="/">Back to Events</Link>
          </Button>
        </Card>
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
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="relative mb-6">
              <img
                src={getMainImage()}
                alt={event.name}
                className="w-full h-96 object-cover rounded-lg"
              />
              <div className="absolute top-4 left-4">
                <Badge className="bg-teal-600 text-white">
                  {event.classifications?.[0]?.genre?.name || 'Event'}
                </Badge>
              </div>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button size="sm" variant="secondary" onClick={handleShare}>
                  <Share2 className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="secondary">
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
                </Button>
              </div>
            </div>

            {/* Event Info */}
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-4">{event.name}</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center">
                  <Calendar className="w-5 h-5 mr-3 text-teal-600" />
                  <div>
                    <p className="font-semibold">{formatDate(event.dates.start.localDate)}</p>
                    <p className="text-sm text-gray-600">{formatTime(event.dates.start.localTime)}</p>
                  </div>
                </div>

                {venue && (
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-3 text-teal-600" />
                    <div>
                      <p className="font-semibold">{venue.name}</p>
                      <p className="text-sm text-gray-600">{venue.city?.name}</p>
                    </div>
                  </div>
                )}

                {getPriceRange() && (
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-teal-600">{getPriceRange()}</span>
                  </div>
                )}

                <div className="flex items-center">
                  <Users className="w-5 h-5 mr-3 text-teal-600" />
                  <span className="text-sm text-gray-600">42 people interested</span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button className="bg-teal-600 hover:bg-teal-700" asChild>
                  <a href={event.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Buy Tickets
                  </a>
                </Button>
                <Button variant="outline">
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Join Discussion
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="details" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="discussion">Discussion</TabsTrigger>
                <TabsTrigger value="attendees">Attendees</TabsTrigger>
              </TabsList>
              
              <TabsContent value="details" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold mb-2">About this event</h3>
                      <p className="text-gray-600">
                        Join us for an amazing {event.classifications?.[0]?.genre?.name?.toLowerCase()} experience. 
                        This event promises to be unforgettable with great entertainment and atmosphere.
                      </p>
                    </div>
                    
                    {venue && (
                      <div>
                        <h3 className="font-semibold mb-2">Venue Information</h3>
                        <p className="text-gray-600">{venue.name}</p>
                        <p className="text-gray-600">{venue.address?.line1}</p>
                        <p className="text-gray-600">{venue.city?.name}, {venue.country?.name}</p>
                      </div>
                    )}

                    <div>
                      <h3 className="font-semibold mb-2">Important Information</h3>
                      <ul className="text-gray-600 space-y-1">
                        <li>• Please arrive 30 minutes before the event</li>
                        <li>• Valid ID required for entry</li>
                        <li>• No outside food or beverages allowed</li>
                        <li>• Parking available on-site</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="discussion" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Discussion</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>JD</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">John Doe</p>
                          <p className="text-gray-600">Really excited for this event! Anyone else going?</p>
                          <p className="text-xs text-gray-400">2 hours ago</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarFallback>SM</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="font-semibold">Sarah Miller</p>
                          <p className="text-gray-600">Count me in! This is going to be amazing 🎉</p>
                          <p className="text-xs text-gray-400">1 hour ago</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="attendees" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendees (42)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarFallback>{`U${i + 1}`}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm">User {i + 1}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full bg-teal-600 hover:bg-teal-700" asChild>
                    <a href={event.url} target="_blank" rel="noopener noreferrer">
                      Buy Tickets
                    </a>
                  </Button>
                  <Button variant="outline" className="w-full">
                    Save Event
                  </Button>
                  <Button variant="outline" className="w-full">
                    Share Event
                  </Button>
                </CardContent>
              </Card>

              {/* Similar Events */}
              <Card>
                <CardHeader>
                  <CardTitle>Similar Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center space-x-3">
                        <img
                          src="/placeholder.svg"
                          alt="Event"
                          className="w-16 h-16 object-cover rounded"
                        />
                        <div>
                          <p className="font-semibold text-sm">Similar Event {i + 1}</p>
                          <p className="text-xs text-gray-600">Tomorrow • London</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
