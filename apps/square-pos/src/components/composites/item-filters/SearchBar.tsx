import { Input } from "@/components/primitives/input";
import { SearchIcon } from "lucide-react";
import Tooltip from "@/components/primitives/tooltip/tooltip";
import { memo } from "react";
import type { ItemFiltersProps } from ".";

type SearchBarProps = Pick<ItemFiltersProps, "handleFilterChange"> & {
  search: string;
};

function SearchBar({ search, handleFilterChange }: SearchBarProps) {
  return (
    <Tooltip.Provider delayDuration={100}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <Input>
            <Input.Text
              placeholder="Search"
              value={search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              // className={css({ width: "full" })}
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
