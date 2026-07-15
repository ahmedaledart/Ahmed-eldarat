import { useGlobal } from '../context';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { useMemo } from 'react';

// Fix leafet default icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const getShipIcon = (status: string) => {
  let color = 'blue';
  if (status === 'Delayed') color = 'red';
  else if (status === 'Expected') color = 'orange';
  else if (status === 'In Port') color = 'green';
  
  return L.divIcon({
    className: 'custom-div-icon',
    html: `<div style="background-color: ${color}; width: 12px; height: 12px; border-radius: 50%; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4);"></div>`,
    iconSize: [12, 12],
    iconAnchor: [6, 6]
  });
};

const portIcon = L.divIcon({
  className: 'custom-port-icon',
  html: `<div style="background-color: #0ea5e9; width: 16px; height: 16px; border-radius: 4px; border: 2px solid white; box-shadow: 0 0 4px rgba(0,0,0,0.4); transform: rotate(45deg);"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8]
});

export function MapView() {
  const { data, language, selectedPort, selectedVesselType, selectedShippingLine } = useGlobal();

  const filteredShips = useMemo(() => {
    if (!data) return [];
    return data.ships.filter(s => {
      if (selectedPort && s.libyan_port !== selectedPort) return false;
      if (selectedVesselType && s.vessel_type !== selectedVesselType) return false;
      if (selectedShippingLine && s.shipping_line !== selectedShippingLine) return false;
      return true;
    });
  }, [data, selectedPort, selectedVesselType, selectedShippingLine]);

  if (!data) return null;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
          {language === 'ar' ? 'الخريطة التفاعلية' : 'Interactive Map'}
        </h2>
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>{language === 'ar' ? 'بالميناء' : 'In Port'}</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-orange-500"></div>{language === 'ar' ? 'متوقعة' : 'Expected'}</div>
          <div className="flex items-center gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>{language === 'ar' ? 'متأخرة' : 'Delayed'}</div>
          <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded bg-sky-500 rotate-45"></div>{language === 'ar' ? 'ميناء' : 'Port'}</div>
        </div>
      </div>
      <div className="flex-1 relative z-0">
        <MapContainer 
          center={[32.5, 17.5]} 
          zoom={6} 
          style={{ height: '100%', width: '100%', zIndex: 0 }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
          />
          
          {data.libyanPorts.map((port, idx) => (
            <Marker key={`port-${idx}`} position={[port.lat, port.lng]} icon={portIcon}>
              <Popup className="custom-popup">
                <div className="font-sans text-sm">
                  <div className="font-bold text-base mb-1">{language === 'ar' ? port.name_ar : port.name_en}</div>
                  <div className="text-slate-500 mb-2">{port.city} ({port.un_locode})</div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                    <div>{language === 'ar' ? 'سفن بالميناء:' : 'In Port:'} {port.current_ships}</div>
                    <div>{language === 'ar' ? 'سفن متوقعة:' : 'Expected:'} {port.incoming_ships}</div>
                    <div>{language === 'ar' ? 'تأخير:' : 'Delayed:'} {port.delayed_ships}</div>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {filteredShips.map(ship => (
            <Marker 
              key={ship.id} 
              position={[ship.latitude, ship.longitude]} 
              icon={getShipIcon(ship.vessel_status)}
            >
              <Popup>
                <div className="font-sans text-sm p-1">
                  <div className="font-bold text-base text-blue-600 dark:text-blue-400 border-b pb-1 mb-2">
                    {ship.vessel_name}
                  </div>
                  <table className="w-full text-xs">
                    <tbody>
                      <tr><td className="py-0.5 text-slate-500 pr-4">IMO:</td><td className="font-mono">{ship.imo}</td></tr>
                      <tr><td className="py-0.5 text-slate-500 pr-4">{language === 'ar' ? 'النوع:' : 'Type:'}</td><td>{language === 'ar' ? ship.vessel_type_ar : ship.vessel_type}</td></tr>
                      <tr><td className="py-0.5 text-slate-500 pr-4">{language === 'ar' ? 'الخط:' : 'Line:'}</td><td>{ship.shipping_line}</td></tr>
                      <tr><td className="py-0.5 text-slate-500 pr-4">{language === 'ar' ? 'الوجهة:' : 'Dest:'}</td><td>{ship.libyan_port}</td></tr>
                      <tr><td className="py-0.5 text-slate-500 pr-4">{language === 'ar' ? 'الحالة:' : 'Status:'}</td>
                          <td className={`font-medium ${ship.vessel_status === 'Delayed' ? 'text-red-500' : 'text-green-500'}`}>
                            {ship.vessel_status}
                          </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
