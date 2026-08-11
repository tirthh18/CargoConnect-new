import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap,
} from "react-leaflet";

import L from "../../../utils/leafletIcon";
import "leaflet/dist/leaflet.css";

const pickupIcon = new L.Icon({
  iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const deliveryIcon = new L.Icon({
  iconUrl:"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl:"https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function FitBounds({ parcels, officeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    const bounds = [];

    if ( officeCoordinates && officeCoordinates.lat != null &&officeCoordinates.lng != null) {
      bounds.push([
        Number(officeCoordinates.lat),
        Number(officeCoordinates.lng),
      ]);
    }

    parcels.forEach((parcel) => {
      const point =
        parcel.status === "out_for_pickup"? parcel.pickup: parcel.delivery;

      if (point?.coordinates && point.coordinates.lat != null && point.coordinates.lng != null ) {
        bounds.push([ Number(point.coordinates.lat), Number(point.coordinates.lng),]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, { padding: [70, 70], maxZoom: 13, });
    }
  }, [parcels, officeCoordinates, map]);

  return null;
}

export default function RouteMap({
  parcels,
  optimizedRoute = [],
  routeGeometry = [],
  officeCoordinates = null,
}) {
  const route =
    optimizedRoute && optimizedRoute.length > 0
      ? optimizedRoute : parcels;

  const polyline = (routeGeometry || [])
    .filter(
      (point) => point && point.lat != null && point.lng != null
    )
    .map((point) => [
      Number(point.lat),
      Number(point.lng),
    ]);

  const validOffice =
    officeCoordinates &&
    officeCoordinates.lat != null &&
    officeCoordinates.lng != null
      ? {
          lat: Number(officeCoordinates.lat),
          lng: Number(officeCoordinates.lng),
        }
      : null;

  return (
    <MapContainer
      center={
        validOffice ? [validOffice.lat, validOffice.lng] : [22.6915, 72.8633]
      }
      zoom={12}
      className="h-[700px] w-full rounded-xl z-0"
      scrollWheelZoom={true}
    >
      <TileLayer
        attribution="© OpenStreetMap contributors"
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <FitBounds
        parcels={route}
        officeCoordinates={validOffice}
      />

      {/* ================= OFFICE MARKER ================= */}

      {validOffice && (
        <Marker
          position={[
            validOffice.lat,
            validOffice.lng,
          ]}
        >
          <Popup>
            <div className="space-y-1">
              <h3 className="font-bold">
                CargoConnect Office
              </h3>

              <p>Starting Point</p>
            </div>
          </Popup>
        </Marker>
      )}

      {/* ================= PARCEL MARKERS ================= */}

      {route.map((parcel, index) => {
        const isPickup =
          parcel.status === "out_for_pickup";

        const point = isPickup
          ? parcel.pickup
          : parcel.delivery;

        if (
          !point?.coordinates ||
          point.coordinates.lat == null ||
          point.coordinates.lng == null
        ) {
          return null;
        }

        return (
          <Marker
            key={parcel._id}
            position={[
              Number(point.coordinates.lat),
              Number(point.coordinates.lng),
            ]}
            icon={
              isPickup
                ? pickupIcon
                : deliveryIcon
            }
          >
            <Popup>
              <div className="space-y-2 min-w-[220px]">
                <h3 className="font-bold text-lg">
                  Stop {index + 1}
                </h3>

                <p>
                  <strong>Name:</strong>{" "}
                  {point.name}
                </p>

                <p>
                  <strong>Mobile:</strong>{" "}
                  {point.mobile}
                </p>

                <p>
                  <strong>Address:</strong>{" "}
                  {point.address}, {point.city} -{" "}
                  {point.pincode}
                </p>
              </div>
            </Popup>
          </Marker>
        );
      })}

      {/* ================= OPTIMIZED ROUTE ================= */}

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