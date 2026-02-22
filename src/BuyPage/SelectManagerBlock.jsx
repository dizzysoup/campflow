import { 
  Stack, HStack, Text, Checkbox, Select, SelectTrigger, 
  SelectContent, SelectValueText, Portal, SelectItem, 
  Input, Button, IconButton, Box, createListCollection , Flex, Spacer
} from "@chakra-ui/react";
import { LuPlus, LuTrash2 } from "react-icons/lu"; 
import { useState, useEffect } from "react";

export const SelectManagerBlock = ({ manager, setManager, assignees, setAssignees, userCollection , price , totalPrice }) => {    
  const isIndividual = manager === "平均分擔";  
   // 當選擇人員或修改分攤數量時，更新對應的 assignees 資料
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
      {/* 標題與勾選框 */}
      <HStack justify="space-between">
        <Text color="#4A3728" fontWeight="bold">分攤人分配</Text>
        <Checkbox.Root
          checked={isIndividual}
          onCheckedChange={(e) => {
            const checked = !!e.checked;
            setManager(checked ? "平均分擔" : "多數指派");
            setAssignees(checked ? [] : [{ user: "", count: 1 }]);
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control border="1px solid #4A3728">
            <Checkbox.Indicator />
          </Checkbox.Control>
          <Checkbox.Label color="#4A3728" fontWeight="bold" fontSize="sm" cursor="pointer">
            平均分擔
          </Checkbox.Label>
        </Checkbox.Root>
      </HStack>

      {isIndividual ? (
          <Stack gap={2}>
    {/* 計算平均金額 */}
    {(() => {
      const userCount = userCollection.items.filter((u) => u.label !== "全部顯示" && u.label !== "從缺");
      const avgPrice = Math.round((Number(totalPrice) || 0) / (userCount.length || 1));

      return userCount.map((u) => (
        <Box key={u.value} p={1} border="1px solid #DCDCDC" borderRadius="15px" bg="rgba(220, 220, 220, 0.3)">
            <Flex >
              {/* 人員名稱 (唯讀) */}               
                <Box 
                  bg="#E2E8F0" 
                   
                  borderRadius="10px" 
                  display="flex" 
                  alignItems="center" 
                  px={3}
                  border="1px solid #CBD5E0"
                >
                  <Text size="sm" color="#4A3728">{u.label}</Text>
                </Box>

              <Spacer />             
                {/* 平均價格顯示 */}
              <Stack justify="flex-end" gap={2}>
                <Text fontWeight="black" color="#4A3728" fontSize="md">
                  ${avgPrice.toLocaleString()}
                </Text>
              </Stack>
            </Flex>            
        </Box>
      ));
    })()}
    
    <Box p={2} bg="#FFF9ED" borderRadius="10px" border="1px dashed #D4A373" textAlign="center">
      <Text fontSize="xs" color="#8B735B">💡 自動模式：系統將由所有成員平均分攤總支出</Text>
    </Box>
  </Stack>
      ) : (
        <Stack gap={2}>
         {assignees?.map((item, index) => {
            // 即時計算該人應付金額
            const individualTotal = (item.count || 0) * price;

            return (
              <Box key={index} p={3} border="1px solid #E2E8F0" borderRadius="15px" bg="whiteAlpha.500">
                <Stack gap={3}>
                  <HStack gap={2}>
                    {/* 選擇人員 */}
                    <Stack flex={2} gap={1}>
                      <Text fontSize="xs" color="#666">指派人員</Text>
                      <Select.Root
                        collection={userCollection}
                        value={[item.user || ""]} 
                        onValueChange={(e) => {
                          if (e.value[0]) {
                            updateAssignment(index, "user", e.value[0]);
                          }
                        }}
                      >
                        <Select.Control>
                          <SelectTrigger bg="#FFF9ED" color="black" borderRadius="10px" border="2px solid #5B6D5B">
                            <SelectValueText placeholder="選擇成員" />
                          </SelectTrigger>
                        </Select.Control>
                        <Select.Positioner zIndex={2100}>
                          <SelectContent bg="white">
                            {userCollection.items.filter((u) => u.label !== "全部顯示").map((u) => (
                              <SelectItem item={u} key={u.value} color="black">
                                <Text fontSize="sm">{u.label}</Text>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select.Positioner>
                      </Select.Root>
                    </Stack>

                     {/* 數量輸入 */}
                    <Stack flex={1} gap={1}>
                      <Text fontSize="xs" color="#666">認領數量</Text>
                      <Input
                        type="number"
                        value={item.count}
                        onChange={(e) => updateAssignment(index, "count", e.target.value)}
                        bg="#FFF9ED"
                        border="2px solid #5B6D5B"
                        borderRadius="10px"
                        color="black"
                        textAlign="center"
                        h="36px"
                      />
                    </Stack>

                    {/* 金額顯示 (自動計算) */}
                    <Stack flex={1} gap={1}>
                      <Text fontSize="xs" color="#666">應付金額</Text>
                      <Box 
                        bg="#5B6D5B" 
                        color="white" 
                        h="36px" 
                        borderRadius="10px" 
                        display="flex" 
                        alignItems="center" 
                        justifyContent="center"
                        fontWeight="bold"
                        fontSize="sm"
                      >
                        ${individualTotal.toLocaleString()}
                      </Box>
                    </Stack>

                    {/* 刪除按鈕 */}
                    {assignees.length > 1 && (
                      <IconButton
                        aria-label="Remove"
                        variant="ghost"
                        colorPalette="red"
                        size="sm"
                        onClick={() => removeAssignment(index)}
                        alignSelf="flex-end"
                        mb="2px"
                      >
                        <LuTrash2 />
                      </IconButton>
                    )}
                  </HStack>                  
                </Stack>
              </Box>
            );
          })}

          <Button
            size="sm"
            variant="surface"
            colorScheme="teal"
            onClick={addAssignment}
            mt={1}
            borderRadius="10px"
            w="full"
          >
            <LuPlus /> 增加指派成員
          </Button>
        </Stack>
      )}
    </Stack>
  );
};