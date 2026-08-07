import { useEffect } from "react";
import {MapContainer, TileLayer, Marker, Popup, Polyline, useMap,} from "react-leaflet";
import L from "../../../utils/leafletIcon";
import "leaflet/dist/leaflet.css";

import { useAuth } from "../../../context/AuthContext";

const pickupIcon = new L.Icon({
  iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ parcels, officeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    if (!parcels.length) return;

    const bounds = [];

    if (officeCoordinates) {
      bounds.push([officeCoordinates.lat, officeCoordinates.lng]);
    }

    parcels.forEach((parcel) => {
      const point = parcel.status === "out_for_pickup" ? parcel.pickup : parcel.delivery;

      if (!point?.coordinates) return;

      bounds.push([point.coordinates.lat, point.coordinates.lng]);
    });
    map.fitBounds(bounds, {padding: [70, 70],maxZoom: 13,});

  }, [parcels, officeCoordinates, map]);

  return null;
}

export default function RouteMap({parcels, optimizedRoute = [], routeGeometry = [],}) {

  const route = optimizedRoute.length > 0 ? optimizedRoute : parcels;
  // OSRM returns [lng, lat] but Leaflet requires [lat, lng]
  const polyline = routeGeometry.map((point) => [point.lat, point.lng]);

  const { user } = useAuth();
  const officeCoordinates = user?.office?.coordinates;

  return (
    <MapContainer
      center={officeCoordinates? [officeCoordinates.lat, officeCoordinates.lng]: [22.6915, 72.8633]}
      zoom={12}
      className="h-[430px] w-full rounded-xl z-0"
      scrollWheelZoom
    >
      <TileLayer attribution="© OpenStreetMap contributors" url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>

      <FitBounds parcels={route} officeCoordinates={officeCoordinates} />

      {officeCoordinates && (
        <Marker position={[officeCoordinates.lat, officeCoordinates.lng]}>
          <Popup>
            <div className="space-y-1">
              <h3 className="font-bold">CargoConnect Office</h3>
              <p>Starting Point</p>
            </div>
          </Popup>
        </Marker>
      )}

      {route.map((parcel, index) => {
        const isPickup = parcel.status === "out_for_pickup";
        const point = isPickup ? parcel.pickup : parcel.delivery;

        if (!point?.coordinates) return null;

        return (
          <Marker
            key={parcel._id}
            position={[point.coordinates.lat, point.coordinates.lng]}
            icon={isPickup ? pickupIcon : deliveryIcon}
          >
            <Popup>
              <div className="space-y-2 min-w-[220px]">
                <h3 className="font-bold text-lg">Stop {index + 1}</h3>
                <p>
                  <strong>Name :</strong> {point.name}
                </p>
                <p>
                  <strong>Mobile :</strong> {point.mobile}
                </p>
                <p>
                  <strong>Address :</strong> {point.address}, {point.city} - {point.pincode}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {polyline.length > 1 && (
        <Polyline
          positions={polyline}
          pathOptions={{
            color: "#E8734A",
            weight: 6,
            opacity: 0.9,
          }}
        />
      )}
    </MapContainer>
  );
}
