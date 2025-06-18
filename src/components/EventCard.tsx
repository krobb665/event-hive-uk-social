
import { useState } from 'react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, MapPin, Clock, Heart, ExternalLink, MessageCircle } from 'lucide-react'
import { TicketmasterEvent } from '@/lib/ticketmaster'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { toast } from '@/hooks/use-toast'
import { Link } from 'react-router-dom'

interface EventCardProps {
  event: TicketmasterEvent
}

export const EventCard = ({ event }: EventCardProps) => {
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuth()

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
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
    const images = event.images || []
    const mainImage = images.find(img => img.ratio === '16_9' && img.width >= 1024) || 
                     images.find(img => img.ratio === '16_9') ||
                     images[0]
    return mainImage?.url || '/placeholder.svg'
  }

  const getVenue = () => {
    return event._embedded?.venues?.[0]
  }

  const getPriceRange = () => {
    if (!event.priceRanges?.length) return null
    const price = event.priceRanges[0]
    if (price.min === price.max) {
      return `£${price.min}`
    }
    return `£${price.min} - £${price.max}`
  }

  const getGenre = () => {
    return event.classifications?.[0]?.genre?.name || 'Event'
  }

  const handleSaveEvent = async () => {
    if (!user) {
      toast({
        title: "Sign in required",
        description: "Please sign in to save events",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    try {
      if (isSaved) {
        const { error } = await supabase
          .from('saved_events')
          .delete()
          .eq('user_id', user.id)
          .eq('event_id', event.id)

        if (error) throw error
        setIsSaved(false)
        toast({
          title: "Event removed",
          description: "Event removed from your saved list"
        })
      } else {
        const venue = getVenue()
        const { error } = await supabase
          .from('saved_events')
          .insert({
            user_id: user.id,
            event_id: event.id,
            event_name: event.name,
            event_date: event.dates.start.localDate,
            venue_name: venue?.name
          })

        if (error) throw error
        setIsSaved(true)
        toast({
          title: "Event saved!",
          description: "Added to your saved events"
        })
      }
    } catch (error) {
      console.error('Error saving event:', error)
      toast({
        title: "Error",
        description: "Failed to save event",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const venue = getVenue()

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden">
      <Link to={`/event/${event.id}`} className="block">
        <div className="relative">
          <img
            src={getMainImage()}
            alt={event.name}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3">
            <Badge variant="secondary" className="bg-black/60 text-white">
              {getGenre()}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <Button
              size="sm"
              variant="secondary"
              onClick={(e) => {
                e.preventDefault()
                handleSaveEvent()
              }}
              disabled={isLoading}
              className="bg-black/60 hover:bg-black/80 text-white border-none"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current text-red-500' : ''}`} />
            </Button>
          </div>
        </div>

        <CardContent className="p-4">
          <h3 className="font-bold text-lg mb-2 line-clamp-2 group-hover:text-teal-600 transition-colors">
            {event.name}
          </h3>

          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-2 text-teal-500" />
              <span>{formatDate(event.dates.start.localDate)}</span>
              {event.dates.start.localTime && (
                <>
                  <Clock className="w-4 h-4 ml-4 mr-2 text-teal-500" />
                  <span>{formatTime(event.dates.start.localTime)}</span>
                </>
              )}
            </div>

            {venue && (
              <div className="flex items-center">
                <MapPin className="w-4 h-4 mr-2 text-teal-500" />
                <span className="line-clamp-1">{venue.name}, {venue.city?.name}</span>
              </div>
            )}

            {getPriceRange() && (
              <div className="flex items-center">
                <span className="font-semibold text-green-600">{getPriceRange()}</span>
              </div>
            )}
          </div>
        </CardContent>
      </Link>

      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button asChild className="flex-1 bg-teal-600 hover:bg-teal-700">
          <a href={event.url} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4 mr-2" />
            Buy Tickets
          </a>
        </Button>
        <Button variant="outline" asChild>
          <Link to={`/event/${event.id}`}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Discuss
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
