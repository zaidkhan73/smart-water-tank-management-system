// src/modules/registry.jsx — the list of apps in the society dashboard.
// Add or replace a module by editing ONE entry here.
import WaterTab from "./water/WaterTab";
import WaterCard from "./water/WaterCard";
import { PlaceholderTab, PlaceholderCard } from "./Placeholder";
import { DropIcon, ParkingIcon, BinIcon } from "../icons";

export const MODULES = [
  {
    id: "water",
    name: "Water",
    Icon: DropIcon,
    blurb: "Tank level, pump control, fill and empty log",
    Tab: WaterTab,
    Card: WaterCard,
  },
  {
    id: "parking",
    name: "Parking",
    Icon: ParkingIcon,
    blurb: "Slot availability and entry log",
    Tab: () => (
      <PlaceholderTab
        name="Parking"
        expects={[
          "Total slots and which slots are free or taken",
          "Entry and exit events with time",
          "Any controls residents or admins need (e.g. gate open)",
          "A heartbeat so the dashboard can show the device as online",
        ]}
      />
    ),
    Card: PlaceholderCard,
  },
  {
    id: "waste",
    name: "Waste",
    Icon: BinIcon,
    blurb: "Bin fill levels and collection log",
    Tab: () => (
      <PlaceholderTab
        name="Waste"
        expects={[
          "Each bin's name/location and fill level in %",
          "Event when a bin is full and when it is emptied",
          "Any controls needed (e.g. mark as collected)",
          "A heartbeat so the dashboard can show the device as online",
        ]}
      />
    ),
    Card: PlaceholderCard,
  },
];
