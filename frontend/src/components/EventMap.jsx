import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import './EventMap.css';

function EventMap({ position }) {
  return (
    <MapContainer center={position} zoom={13} className="event-map-container">
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <Marker position={position}>
        <Popup>Ubicación del Evento</Popup>
      </Marker>
    </MapContainer>
  );
}

export default EventMap;