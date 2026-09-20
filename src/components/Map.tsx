import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const Map = () => {
  const position: [number, number] = [34.0522, -118.2437];

  return (
    <MapContainer
      center={position}
      zoom={13}
      scrollWheelZoom={false}
      style={{
        height: "450px",
        width: "100%",
      }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>Los Angeles, California, USA</Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;