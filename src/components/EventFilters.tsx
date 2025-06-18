
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Filter, X } from 'lucide-react'

interface FilterOptions {
  search: string
  category: string
  city: string
  dateRange: string
}

interface EventFiltersProps {
  filters: FilterOptions
  onFiltersChange: (filters: FilterOptions) => void
  onClearFilters: () => void
}

const categories = [
  'Music',
  'Sports',
  'Arts & Theatre',
  'Comedy',
  'Family',
  'Film',
  'Miscellaneous'
]

const cities = [
  'London',
  'Manchester',
  'Birmingham',
  'Leeds',
  'Glasgow',
  'Liverpool',
  'Bristol',
  'Sheffield',
  'Edinburgh',
  'Newcastle'
]

const dateRanges = [
  { value: 'today', label: 'Today' },
  { value: 'tomorrow', label: 'Tomorrow' },
  { value: 'this-week', label: 'This Week' },
  { value: 'this-weekend', label: 'This Weekend' },
  { value: 'next-week', label: 'Next Week' },
  { value: 'this-month', label: 'This Month' },
  { value: 'next-month', label: 'Next Month' }
]

export const EventFilters = ({ filters, onFiltersChange, onClearFilters }: EventFiltersProps) => {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: keyof FilterOptions, value: string) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  const hasActiveFilters = filters.category || filters.city || filters.dateRange

  return (
    <Card className="mb-6">
      <CardContent className="p-4">
        <div className="flex flex-col space-y-4">
          {/* Search Bar */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search events..."
                value={filters.search}
                onChange={(e) => updateFilter('search', e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => setIsExpanded(!isExpanded)}
              className="px-3"
            >
              <Filter className="w-4 h-4" />
            </Button>
            {hasActiveFilters && (
              <Button
                variant="outline"
                onClick={onClearFilters}
                className="px-3"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Active Filters */}
          {hasActiveFilters && (
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <Badge variant="secondary" className="gap-1">
                  {filters.category}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilter('category', '')}
                  />
                </Badge>
              )}
              {filters.city && (
                <Badge variant="secondary" className="gap-1">
                  {filters.city}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilter('city', '')}
                  />
                </Badge>
              )}
              {filters.dateRange && (
                <Badge variant="secondary" className="gap-1">
                  {dateRanges.find(d => d.value === filters.dateRange)?.label}
                  <X
                    className="w-3 h-3 cursor-pointer"
                    onClick={() => updateFilter('dateRange', '')}
                  />
                </Badge>
              )}
            </div>
          )}

          {/* Expanded Filters */}
          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t">
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select
                  value={filters.category}
                  onValueChange={(value) => updateFilter('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Select
                  value={filters.city}
                  onValueChange={(value) => updateFilter('city', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All cities" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Date Range</label>
                <Select
                  value={filters.dateRange}
                  onValueChange={(value) => updateFilter('dateRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All dates" />
                  </SelectTrigger>
                  <SelectContent>
                    {dateRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
