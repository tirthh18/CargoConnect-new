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

const createNumberedIcon = (number) =>
  L.divIcon({
    className: "",
    html: `
      <div style="
        width: 34px;
        height: 34px;
        background: #E8734A;
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 15px;
        font-weight: 700;
        box-shadow: 0 2px 6px rgba(0,0,0,0.35);
      ">
        ${number}
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -17],
  });

function FitBounds({ parcels, officeCoordinates }) {
  const map = useMap();

  useEffect(() => {
    const bounds = [];

    if (
      officeCoordinates &&
      officeCoordinates.lat != null &&
      officeCoordinates.lng != null
    ) {
      bounds.push([
        Number(officeCoordinates.lat),
        Number(officeCoordinates.lng),
      ]);
    }

    parcels.forEach((parcel) => {
      const point =
        parcel.status === "out_for_pickup"
          ? parcel.pickup
          : parcel.delivery;

      if (
        point?.coordinates &&
        point.coordinates.lat != null &&
        point.coordinates.lng != null
      ) {
        bounds.push([
          Number(point.coordinates.lat),
          Number(point.coordinates.lng),
        ]);
      }
    });

    if (bounds.length > 0) {
      map.fitBounds(bounds, {
        padding: [70, 70],
        maxZoom: 13,
      });
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
      ? optimizedRoute
      : parcels;

  const polyline = (routeGeometry || [])
    .filter(
      (point) =>
        point &&
        point.lat != null &&
        point.lng != null
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
        validOffice
          ? [validOffice.lat, validOffice.lng]
          : [22.6915, 72.8633]
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
            icon={createNumberedIcon(index + 1)}
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