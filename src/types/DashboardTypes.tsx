export interface OpenMeteoResponse {
  latitude: number
  longitude: number
  timezone: string
  elevation: number
  current_units: CurrentUnits
  current: Current
  hourly_units: HourlyUnits
  hourly: Hourly
  daily_units: DailyUnits
  daily: Daily
}

export interface CurrentUnits {
  time: string
  interval: string
  temperature_2m: string
  relative_humidity_2m: string
  wind_speed_10m: string
  apparent_temperature: string
}

export interface Current {
  time: string
  interval: number
  temperature_2m: number
  relative_humidity_2m: number
  wind_speed_10m: number
  apparent_temperature: number
  weather_code: number
  is_day: number
}

export interface HourlyUnits {
  time: string
  temperature_2m: string
  relative_humidity_2m: string
  wind_speed_10m: string
  wind_gusts_10m: string 
}

export interface Hourly {
  time: string[]
  temperature_2m: number[]
  relative_humidity_2m: number[]
  apparent_temperature: number[]
  wind_speed_10m: number[]
  weather_code: number[]
  wind_gusts_10m: number[]
}

export interface DailyUnits {
  time: string
  uv_index_max: string
  precipitation_probability_max: string
  wind_gusts_10m_max: string
}

export interface Daily {
  time: string[]
  uv_index_max: number[]
  precipitation_probability_max: number[]
  wind_gusts_10m_max: number[] 
}

export interface CityLocation {
  name: string;
  local_names?: Record<string, string>;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}