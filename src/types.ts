export interface LibyanPort {
  name_en: string;
  name_ar: string;
  city: string;
  un_locode: string;
  type: string;
  current_ships: number;
  incoming_ships: number;
  departed_ships: number;
  waiting_ships: number;
  delayed_ships: number;
  top_vessel_type: string;
  top_cargo: string;
  top_line: string;
  avg_wait_time: string;
  avg_dock_time: string;
  avg_cost: string;
  last_activity: string;
  lat: number;
  lng: number;
}

export interface VesselType {
  type_en: string;
  type_ar: string;
  count: number;
  percentage: number;
  top_port: string;
  top_cargo: string;
  avg_transit: string;
  avg_cost: string;
  last_recorded: string;
}

export interface ShippingLine {
  name: string;
  ships: number;
  trips: number;
  libyan_ports: string[];
  origin_ports: string[];
  vessel_types: string[];
  avg_transit: string;
  avg_cost: string;
  last_trip: string;
  status: string;
}

export interface Ship {
  id: string;
  vessel_name: string;
  imo: number;
  mmsi: number;
  vessel_type: string;
  vessel_type_ar: string;
  flag: string;
  operator: string;
  shipping_line: string;
  origin_port: string;
  origin_country: string;
  destination_port: string;
  destination_country: string;
  libyan_port: string;
  latitude: number;
  longitude: number;
  speed: number;
  cargo_type: string;
  cargo_description: string;
  cargo_weight: number;
  container_count: number;
  container_type: string;
  departure_date: string;
  eta: string;
  actual_arrival: string | null;
  transit_days: number;
  vessel_status: string;
  delay_hours: number;
  freight_price: number;
  total_transport_cost: number;
  currency: string;
  vessel_source: string;
  freight_source: string;
  last_updated: string;
}

export interface FreightRate {
  id: string;
  origin_port: string;
  origin_country: string;
  destination_port: string;
  destination_country: string;
  shipping_line: string;
  carrier: string;
  vessel_type: string;
  cargo_type: string;
  container_type: string;
  container_size: string;
  weight: string;
  base_rate: number;
  bunker_surcharge: number;
  port_fees: number;
  handling_fees: number;
  documentation_fees: number;
  insurance_cost: number;
  inland_transport_cost: number;
  total_cost: number;
  currency: string;
  transit_days: number;
  free_days: number;
  quotation_date: string;
  valid_until: string;
  source: string;
  price_status: string;
  is_estimated: boolean;
  last_updated: string;
}

export interface DashboardData {
  ships: Ship[];
  libyanPorts: LibyanPort[];
  vesselTypes: VesselType[];
  shippingLines: ShippingLine[];
  freightRates: FreightRate[];
  last_updated?: string;
  is_live?: boolean;
}
