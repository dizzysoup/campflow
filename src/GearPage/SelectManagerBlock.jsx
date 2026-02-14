import { 
  Stack, HStack, Text, Checkbox, Select, SelectTrigger, 
  SelectContent, SelectValueText, Portal, SelectItem, 
  Input, Button, IconButton, Box, createListCollection 
} from "@chakra-ui/react";
import { LuPlus, LuTrash2 } from "react-icons/lu"; 
import { useState, useEffect } from "react";

export const SelectManagerBlock = ({ manager, setManager, assignees, setAssignees, userCollection }) => {    
    const isIndividual = manager === "各自準備";
   
  // 更新特定索引的分配資料
  const updateAssignment = (index, field, value) => {
   
    const newAssignments = [...(assignees || [])];
    newAssignments[index] = { 
      ...newAssignments[index], 
      [field]: field === "count" ? parseInt(value) : value
    };
    
    setAssignees(newAssignments);
    setManager("多數指派"); 
  };

  // 新增一組負責人
  const addAssignment = () => {    
    setAssignees(prev => [...prev, { user: "", count: 1 }]);
  };

  // 移除一組負責人
  const removeAssignment = (index) => {
    setAssignees(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <Stack gap={3}>
      {/* 標題與「各自準備」勾選框 */}
      <HStack justify="space-between">
        <Text color="#4A3728" fontWeight="bold">負責人分配</Text>
        <Checkbox.Root
          checked={isIndividual}
          onCheckedChange={(e) => {
            const checked = !!e.checked;
            setManager(checked ? "各自準備" : "多數指派");
            setAssignees(checked ? [] : [{ user: "", count: 1 }]);
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control border="1px solid #4A3728">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label color="#4A3728" fontWeight="bold" fontSize="sm" cursor="pointer">
            各自準備
          </Checkbox.Label>
        </Checkbox.Root>
      </HStack>

      {isIndividual ? (
        <Box p={3} bg="#DCDCDC" borderRadius="15px" textAlign="center">
          <Text fontSize="sm" color="#4A3728">✨ 模式：每個人各準備一份</Text>
        </Box>
      ) : (
        <Stack gap={2}>
          {assignees?.map((item, index) => (
            <HStack key={index} gap={2} align="flex-end">
              {/* 選擇人員 */}
              <Stack flex={2} gap={1}>
               <Select.Root
  collection={userCollection}
  // 確保 value 永遠是一個 [string]，不可以是 [undefined]
  value={[item.user || ""]} 
  onValueChange={(e) => {
    // 檢查 e.value 是否存在再更新
    if (e.value[0]) {
      updateAssignment(index, "user", e.value[0]);
    }
  }}
>
  <Select.Control>
    <SelectTrigger bg="#FFF9ED" color="black" borderRadius="12px" border="2px solid #5B6D5B">
      <SelectValueText placeholder="指派人員" />
    </SelectTrigger>
  </Select.Control>
 
    <Select.Positioner zIndex={2100}> {/* 確保 zIndex 夠高 */}
      <SelectContent bg="white">
        {userCollection.items.map((u) => (
          <SelectItem 
            item={u} 
            key={u.value} 
            color="black" 
            _hover={{ bg: "gray.100" }}
            cursor="pointer"
          >
            {/* 建議包裹在 Text 或直接放置，並加上 Indicator */}
            <Text fontSize="sm">{u.label}</Text>
          </SelectItem>
        ))}
      </SelectContent>
    </Select.Positioner>

</Select.Root>
              </Stack>

              {/* 分攤數量 */}
              <Stack flex={1} gap={1}>
                <Input
                  type="number"
                  placeholder="數量"
                  value={item.count}
                  onChange={(e) => updateAssignment(index, "count", e.target.value)}
                  bg="#FFF9ED"
                  border="2px solid #5B6D5B"
                  borderRadius="12px"
                  color="black"
                  textAlign="center"
                />
              </Stack>

              {/* 刪除按鈕 (至少保留一列) */}
              {assignees.length > 1 && (
                <IconButton
                  aria-label="Remove assignment"
                  variant="ghost"
                  colorPalette="red"
                  onClick={() => removeAssignment(index)}
                >
                  <LuTrash2 />
                </IconButton>
              )}
            </HStack>
          ))}

          <Button
            size="sm"
            variant="outline"
            borderColor="#5B6D5B"
            color="#4A3728"
            onClick={addAssignment}
            mt={1}
            borderRadius="10px"
          >
            <LuPlus /> 新增負責人
          </Button>
        </Stack>
      )}
    </Stack>
  );
};