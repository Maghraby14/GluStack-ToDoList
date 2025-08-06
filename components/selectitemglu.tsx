import { ChevronDownIcon } from "@/components/ui/icon";
import {
  Select,
  SelectBackdrop,
  SelectContent,
  SelectDragIndicator,
  SelectDragIndicatorWrapper,
  SelectIcon,
  SelectInput,
  SelectItem,
  SelectPortal,
  SelectTrigger
} from "@/components/ui/select";
import { useAuthStore } from "@/store/authCtx";

export default function SelectItemGlu({
  isValid = true,
  onChange,
  value,
  onBlur
}: {
  isValid?: boolean;
  onChange?: (value: string) => void;
  value?: string;
  onBlur?: () => void;
}) {
  const { taskLists } = useAuthStore();

  return (
    <Select
      selectedValue={value}
      onValueChange={(val) => onChange?.(val)}
      onClose={onBlur}
    >
      <SelectTrigger
        variant="outline"
        size="lg"
        style={{
          justifyContent: "space-between",
          borderColor: isValid ? undefined : "red"
        }}
      >
        <SelectInput placeholder="List Name" />
        <SelectIcon className="mr-3" as={ChevronDownIcon} />
      </SelectTrigger>

      <SelectPortal>
        <SelectBackdrop />
        <SelectContent>
          <SelectDragIndicatorWrapper>
            <SelectDragIndicator />
          </SelectDragIndicatorWrapper>

          {taskLists.map((list) => (
            <SelectItem key={list.id} label={list.name} value={list.name} />
          ))}
        </SelectContent>
      </SelectPortal>
    </Select>
  );
}
