import { Input } from "@pallas-ui/components/src/ui/input";
import { SearchIcon } from "lucide-react";
import Tooltip from "@pallas-ui/components/src/ui/tooltip/tooltip";
import { memo } from "react";
import { css } from "@styled-system/css";

interface SearchBarProps {
  search: string;
  onSearchChange: (value: string) => void;
}

function SearchBar({ search, onSearchChange }: SearchBarProps) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Input>
            <Input.Text
              placeholder="Search"
              value={search}
              onChange={(e) => onSearchChange(e.target.value)}
              className={css({ width: "full" })}
            />
            <Input.Postfix>
              <SearchIcon size={16} />
            </Input.Postfix>
          </Input>
        </Tooltip.Trigger>
        <Tooltip.Content align="start">
          Enter at least 2 characters to search
        </Tooltip.Content>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}

export default memo(SearchBar);
