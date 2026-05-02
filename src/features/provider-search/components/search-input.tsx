import { useMemo, useState } from "react";
import { Group, GroupSeparator } from "@/components/ui/group";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectItem,
  SelectPopup,
  SelectTrigger,
} from "@/components/ui/select";
import { ProviderIcon } from "./provider-icon";

const protocols = [
  { icon: ProviderIcon.youtube, label: "Youtube", value: "youtube" },
  { icon: ProviderIcon.google, label: "Google", value: "google" },
];

export const ProviderSearchInput = () => {
  const [selectedProvider, setSelectedProvider] = useState(protocols[0].value);
  const handleProviderChange = (value: string | null) => {
    if (value) {
      setSelectedProvider(value);
    }
  };
  const selectedProtocol = useMemo(
    () =>
      protocols.find((protocol) => protocol.value === selectedProvider) ??
      protocols[0],
    [selectedProvider]
  );
  const SelectedIcon = selectedProtocol.icon;

  return (
    <Group>
      <Select onValueChange={handleProviderChange} value={selectedProvider}>
        <SelectTrigger className="w-fit min-w-fit">
          <span className="flex min-w-0 items-center gap-2">
            <SelectedIcon aria-hidden="true" className="size-4" />
          </span>
        </SelectTrigger>
        <SelectPopup alignItemWithTrigger={false}>
          {protocols.map((protocol) => (
            <SelectItem
              className="flex min-w-fit items-center gap-2"
              key={protocol.value}
              value={protocol.value}
            >
              <div className="flex items-center gap-2">
                <protocol.icon aria-hidden="true" className="size-4" />
                {protocol.label}
              </div>
            </SelectItem>
          ))}
        </SelectPopup>
      </Select>
      <GroupSeparator />
      <Input placeholder={`Search ${selectedProtocol.label}...`} size="lg" />
    </Group>
  );
};
