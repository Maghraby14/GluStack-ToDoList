import { Select, SelectTrigger, SelectInput, SelectIcon, SelectPortal, SelectBackdrop, SelectContent, SelectDragIndicator, SelectDragIndicatorWrapper, SelectItem } from "@/components/ui/select";
import { ChevronDownIcon } from "@/components/ui/icon";
import { useAuthStore } from "@/store/authCtx";
	
export default function SelectItemGlu() {
  const {taskLists} = useAuthStore();
  return (
    <Select>
          <SelectTrigger variant="outline" size="lg" style={{justifyContent:'space-between'}} >
            <SelectInput placeholder="List Name" />
            <SelectIcon className="mr-3" as={ChevronDownIcon} />
          </SelectTrigger>
          <SelectPortal>
            <SelectBackdrop/>
            <SelectContent>
              <SelectDragIndicatorWrapper>
                <SelectDragIndicator />
              </SelectDragIndicatorWrapper>
{
                taskLists.map((list) => (
                  <SelectItem key={list.id} label={list.name} value={list.id} />
                ))
}
              
              
            </SelectContent>
          </SelectPortal>
        </Select>
  );
}