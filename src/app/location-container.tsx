"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface LocationData {
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  postalCode?: string;
}

export default function Component() {
  const [consentGiven, setConsentGiven] = useState(false);
  const [geoIPData, setGeoIPData] = useState<LocationData | null>(null);
  const [browserLocationData, setBrowserLocationData] =
    useState<LocationData | null>(null);
  const [distance, setDistance] = useState<number | null>(null);

  const getGeoIPLocation = async () => {
    const response = await fetch("/api/location", {
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();

    setGeoIPData(data);
  };

  const getBrowserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setBrowserLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting browser location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;
    return distance;
  };

  const handleStartProcess = async () => {
    await getGeoIPLocation();
    getBrowserLocation();
  };

  const updateDistance = () => {
    if (geoIPData && browserLocationData) {
      const dist = calculateDistance(
        geoIPData.latitude,
        geoIPData.longitude,
        browserLocationData.latitude,
        browserLocationData.longitude
      );
      setDistance(dist);
    }
  };

  // Update distance when both locations are available
  if (geoIPData && browserLocationData && distance === null) {
    updateDistance();
  }

  return (
    <>
      <div className="space-y-4">
        <h1 className="text-xl font-semibold">Location Comparison Tool</h1>
        <p>
          This tool compares your location obtained via geo IP and your
          browser&lsquo;s location API.
        </p>
        <p>
          This tool demonstrates the difference between location data obtained
          through geo IP (based on your network) and the browser&lsquo;s
          built-in geolocation API (which can use GPS, Wi-Fi, or cellular data
          for more accurate results).
        </p>
        <h2 className="text-lg font-semibold">Potential Privacy Issues:</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>Your IP address and approximate location will be processed.</li>
          <li>
            The browser&lsquo;s geolocation API may provide more accurate
            location data.
          </li>
          <li>Location data can be sensitive information.</li>
        </ul>
        <h2 className="text-lg font-semibold">Why We Need Access:</h2>
        <p>
          We need access to your location to demonstrate the differences between
          geo IP and browser-based geolocation methods. This is for educational
          purposes only.
        </p>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="consent"
            checked={consentGiven}
            onCheckedChange={(checked) => setConsentGiven(checked as boolean)}
          />
          <label htmlFor="consent">
            I understand and give consent to access my location data
          </label>
        </div>
        <Button onClick={handleStartProcess} disabled={!consentGiven}>
          Start Process
        </Button>
      </div>

      {(geoIPData || browserLocationData) && (
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Data</TableHead>
              <TableHead>Geo IP</TableHead>
              <TableHead>Browser Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>Latitude</TableCell>
              <TableCell>{geoIPData?.latitude}</TableCell>
              <TableCell>{browserLocationData?.latitude}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Longitude</TableCell>
              <TableCell>{geoIPData?.longitude}</TableCell>
              <TableCell>{browserLocationData?.longitude}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>City</TableCell>
              <TableCell>{geoIPData?.city || "N/A"}</TableCell>
              <TableCell>N/A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Region</TableCell>
              <TableCell>{geoIPData?.region || "N/A"}</TableCell>
              <TableCell>N/A</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Postal Code</TableCell>
              <TableCell>{geoIPData?.postalCode || "N/A"}</TableCell>
              <TableCell>N/A</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      )}

      {distance !== null && (
        <p className="mt-4">
          Distance between the two locations: {distance.toFixed(2)} km
        </p>
      )}
    </>
  );
}
