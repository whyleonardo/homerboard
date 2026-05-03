import { type FormEvent, type KeyboardEvent, useMemo, useState } from "react";
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
  {
    getSearchUrl: (query: string) =>
      `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`,
    icon: ProviderIcon.youtube,
    label: "Youtube",
    value: "youtube",
  },
  {
    getSearchUrl: (query: string) =>
      `https://www.google.com/search?q=${encodeURIComponent(query)}`,
    icon: ProviderIcon.google,
    label: "Google",
    value: "google",
  },
] as const;

export type SearchProvider = (typeof protocols)[number]["value"];

const urlProtocolPattern = /^[a-z][a-z\d+.-]*:\/\//i;
const domainLikePattern = /^[^\s/]+\.[^\s]+(?:\/[^\s]*)?$/i;

interface ProviderSearchInputProps {
  onNavigate?: (url: string) => void;
  onSelectedProviderChange?: (selectedProvider: SearchProvider) => void;
  selectedProvider?: SearchProvider;
}

const navigateTo = (url: string) => {
  window.location.assign(url);
};

const getNavigationUrl = (
  query: string,
  selectedProtocol: (typeof protocols)[number]
) => {
  if (urlProtocolPattern.test(query)) {
    return query;
  }

  if (domainLikePattern.test(query)) {
    return `https://${query}`;
  }

  return selectedProtocol.getSearchUrl(query);
};

export const ProviderSearchInput = ({
  onNavigate = navigateTo,
  onSelectedProviderChange,
  selectedProvider: persistedSelectedProvider = protocols[0].value,
}: ProviderSearchInputProps) => {
  const [query, setQuery] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(
    persistedSelectedProvider
  );
  const handleProviderChange = (value: string | null) => {
    if (value) {
      const nextSelectedProvider = value as SearchProvider;

      setSelectedProvider(nextSelectedProvider);
      onSelectedProviderChange?.(nextSelectedProvider);
    }
  };
  const selectedProtocol = useMemo(
    () =>
      protocols.find((protocol) => protocol.value === selectedProvider) ??
      protocols[0],
    [selectedProvider]
  );
  const SelectedIcon = selectedProtocol.icon;

  const submitQuery = (rawQuery: string) => {
    const trimmedQuery = rawQuery.trim();

    if (!trimmedQuery) {
      return;
    }

    onNavigate(getNavigationUrl(trimmedQuery, selectedProtocol));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    submitQuery(query);
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    submitQuery(event.currentTarget.value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Group>
        <Select onValueChange={handleProviderChange} value={selectedProvider}>
          <SelectTrigger
            aria-label="Search provider"
            className="w-fit min-w-fit"
          >
            <span className="flex min-w-0 items-center gap-2">
              <SelectedIcon aria-hidden="true" className="size-4" />
            </span>
          </SelectTrigger>
          <SelectPopup alignItemWithTrigger={false}>
            {protocols.map((protocol) => (
              <SelectItem
                className="flex min-w-fit items-center gap-2"
                key={protocol.value}
                onClick={() => handleProviderChange(protocol.value)}
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
        <Input
          aria-label="Search query"
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={handleInputKeyDown}
          placeholder={`Search ${selectedProtocol.label}...`}
          size="lg"
          value={query}
        />
      </Group>
    </form>
  );
};
